import Stripe from 'stripe';
import { db } from '../../models';
import storeService from '../store';
import { STRIPE_PRODUCTS } from '../../config/stripeProducts';
import { SUBSCRIPTIONS } from '../../config/subscriptions';
import { SUBSCRIPTION_ENTITLEMENTS } from '../../config/subscriptionEntitlements';
import { CATALOG } from './catalog';

export interface CreateCheckoutSessionRequest {
  playerId: string;
  subscriptionKey: string;
}

export interface GetCurrentSubscriptionRequest {
  playerId: string;
}

export interface CreateBillingPortalSessionRequest {
  playerId: string;
}

async function processStripePurchase({
  playerId,
  itemId,
}: {
  playerId: string;
  itemId: string;
}) {
  // Stripe MUST NOT touch coin system
  return await storeService.grantEntitlementsFromItem(playerId, itemId);
}

export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest,
) {
  const { playerId, subscriptionKey } = request;

  if (!Object.values(SUBSCRIPTIONS).includes(subscriptionKey as any)) {
    return { error: 'Invalid subscription key' };
  }

  const stripeSecretKey = process.env.STRIPE_SK;
  if (!stripeSecretKey) {
    return { error: 'Missing Stripe secret key' };
  }

  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    return { error: 'Missing SITE_URL environment variable' };
  }

  const stripeProduct =
    STRIPE_PRODUCTS[subscriptionKey as keyof typeof STRIPE_PRODUCTS];

  const stripePriceId = process.env[stripeProduct.envVar];

  if (!stripePriceId) {
    return {
      error: `Missing Stripe price environment variable: ${stripeProduct.envVar}`,
    };
  }

  const stripe = new Stripe(stripeSecretKey);

  let session;

  try {
    session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      metadata: {
        playerId,
        subscriptionKey,
      },
      subscription_data: {
        metadata: {
          playerId,
          subscriptionKey,
        },
      },
    });
    } catch (error: any) {
    console.error('Stripe checkout session creation failed', error);

    return {
      error: error?.message || 'Failed to create Stripe checkout session',
    };
  }

  return {
    checkoutSessionId: session.id,
    checkoutUrl: session.url,
    subscriptionKey,
  };
}

export interface HandleStripeWebhookRequest {
  rawBody: Buffer;
  signature: string | string[] | undefined;
}

function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'active':
      return 'ACTIVE';
    case 'trialing':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELLED';
    case 'unpaid':
      return 'EXPIRED';
    case 'incomplete':
      return 'PAUSED';
    case 'incomplete_expired':
      return 'EXPIRED';
    default:
      return status.toUpperCase();
  }
}

function stripeTimestampToIso(timestamp?: number | null) {
  if (!timestamp) return null;

  return new Date(timestamp * 1000).toISOString();
}

function getStripeSubscriptionPeriod(subscription: Stripe.Subscription) {
  const firstItem = subscription.items?.data?.[0];

  return {
    currentPeriodStart: stripeTimestampToIso(firstItem?.current_period_start),
    currentPeriodEnd: stripeTimestampToIso(firstItem?.current_period_end),
  };
}

async function syncStripeSubscription(subscription: Stripe.Subscription) {
  const providerSubscriptionId = subscription.id;
  const providerCustomerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id;

  const status = mapStripeSubscriptionStatus(subscription.status);
  const now = new Date().toISOString();

  const {
    currentPeriodStart,
    currentPeriodEnd,
  } = getStripeSubscriptionPeriod(subscription);

  const { data: existingSubscription, error: lookupError } = await db
    .from('_player_subscriptions')
    .select('*')
    .eq('provider', 'STRIPE')
    .eq('provider_subscription_id', providerSubscriptionId)
    .maybeSingle();

  if (lookupError) {
    console.error('Failed to look up Stripe subscription', lookupError);
    return { error: 'Failed to look up Stripe subscription' };
  }

  if (!existingSubscription) {
    console.warn('Stripe subscription lifecycle event received before checkout fulfillment', {
      providerSubscriptionId,
      status,
    });

    return {
      received: true,
      ignored: true,
      reason: 'Subscription not found',
      providerSubscriptionId,
      status,
    };
  }

  const { data: updatedSubscription, error: updateError } = await db
    .from('_player_subscriptions')
    .update({
      provider_customer_id: providerCustomerId,
      status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancelled_at: stripeTimestampToIso(subscription.canceled_at),
      metadata: {
        ...(existingSubscription.metadata || {}),
        stripeStatus: subscription.status,
        latestInvoice:
          typeof subscription.latest_invoice === 'string'
            ? subscription.latest_invoice
            : subscription.latest_invoice?.id,
      },
      updated_at: now,
    })
    .eq('id', existingSubscription.id)
    .select('*')
    .maybeSingle();

  if (updateError || !updatedSubscription) {
    console.error('Failed to update Stripe subscription', updateError);
    return { error: 'Failed to update Stripe subscription' };
  }

  return syncSubscriptionEntitlements(updatedSubscription);
}

function shouldGrantSubscriptionEntitlements(subscription: any) {
  return subscription.status === 'ACTIVE' && !subscription.cancelled_at;
}

async function syncSubscriptionEntitlements(subscription: any) {
  const now = new Date().toISOString();

  const { error: expireError } = await db
    .from('_player_entitlements')
    .update({
      status: 'EXPIRED',
      expires_at: now,
      updated_at: now,
    })
    .eq('subscription_id', subscription.id)
    .eq('source_type', 'SUBSCRIPTION')
    .eq('status', 'ACTIVE');

  if (expireError) {
    console.error('Failed to expire subscription entitlements', expireError);
    return { error: 'Failed to expire subscription entitlements' };
  }

  if (!shouldGrantSubscriptionEntitlements(subscription)) {
    return { received: true, subscription };
  }

  const featureEntitlementKeys =
    SUBSCRIPTION_ENTITLEMENTS[
      subscription.subscription_key as keyof typeof SUBSCRIPTION_ENTITLEMENTS
    ] ?? [];

  const catalogEntitlements =
    subscription.subscription_key === 'CREATOR'
      ? CATALOG.map((item) => ({
          entitlementKey: item.entitlementKey,
          entitlementType: item.entitlementType,
          catalogItemId: item.catalogItemId,
        }))
      : [];

  const entitlementRows = [
    ...featureEntitlementKeys.map((entitlementKey) => ({
      player_id: subscription.player_id,
      entitlement_key: entitlementKey,
      entitlement_type: 'FEATURE',
      source_type: 'SUBSCRIPTION',
      subscription_id: subscription.id,
      status: 'ACTIVE',
      starts_at: now,
      expires_at: subscription.current_period_end ?? null,
      metadata: {
        subscriptionKey: subscription.subscription_key,
        provider: subscription.provider,
        providerSubscriptionId: subscription.provider_subscription_id,
      },
    })),
    ...catalogEntitlements.map((item) => ({
      player_id: subscription.player_id,
      entitlement_key: item.entitlementKey,
      entitlement_type: item.entitlementType,
      source_type: 'SUBSCRIPTION',
      subscription_id: subscription.id,
      status: 'ACTIVE',
      starts_at: now,
      expires_at: subscription.current_period_end ?? null,
      metadata: {
        catalogItemId: item.catalogItemId,
        subscriptionKey: subscription.subscription_key,
        provider: subscription.provider,
        providerSubscriptionId: subscription.provider_subscription_id,
      },
    })),
  ];

  if (!entitlementRows.length) {
    return { error: 'No entitlements configured for subscription' };
  }

  const entitlementKeysToGrant = entitlementRows.map(
    (row) => row.entitlement_key,
  );

  const { data: existingEntitlements, error: existingEntitlementsError } =
    await db
      .from('_player_entitlements')
      .select('entitlement_key')
      .eq('player_id', subscription.player_id)
      .eq('status', 'ACTIVE')
      .in('entitlement_key', entitlementKeysToGrant);

  if (existingEntitlementsError) {
    console.error(
      'Failed to check existing subscription entitlements',
      existingEntitlementsError,
    );
    return { error: 'Failed to check existing subscription entitlements' };
  }

  const existingEntitlementKeys = new Set(
    (existingEntitlements ?? []).map((row: any) => row.entitlement_key),
  );

  const newEntitlementRows = entitlementRows.filter(
    (row) => !existingEntitlementKeys.has(row.entitlement_key),
  );

  if (!newEntitlementRows.length) {
    return {
      received: true,
      subscription,
    };
  }

  const { error: entitlementError } = await db
    .from('_player_entitlements')
    .insert(newEntitlementRows);

  if (entitlementError) {
    console.error('Failed to sync subscription entitlements', entitlementError);
    return { error: 'Failed to sync subscription entitlements' };
  }

  return {
    received: true,
    subscription,
  };
}

export async function getCurrentSubscription(
  request: GetCurrentSubscriptionRequest,
) {
  const { playerId } = request;

  const { data: subscription, error } = await db
    .from('_player_subscriptions')
    .select('*')
    .eq('player_id', playerId)
    .in('status', ['TRIALING', 'ACTIVE', 'PAST_DUE'])
    .is('cancelled_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestSubscription, error: latestSubscriptionError } = await db
    .from('_player_subscriptions')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestSubscriptionError) {
    console.error('Failed to load latest subscription', latestSubscriptionError);
    return { error: 'Failed to load latest subscription' };
  }

  if (error) {
    console.error('Failed to load current subscription', error);
    return { error: 'Failed to load current subscription' };
  }

  const mapSubscription = (row: any) =>
    row
      ? {
          id: row.id,
          playerId: row.player_id,
          subscriptionKey: row.subscription_key,
          status: row.status,
          provider: row.provider,
          providerCustomerId: row.provider_customer_id,
          providerSubscriptionId: row.provider_subscription_id,
          currentPeriodStart: row.current_period_start,
          currentPeriodEnd: row.current_period_end,
          cancelAtPeriodEnd: row.cancel_at_period_end,
          cancelledAt: row.cancelled_at,
        }
      : null;

  return {
    subscription: mapSubscription(subscription),
    latestSubscription: mapSubscription(latestSubscription),
  };
}

export async function createBillingPortalSession(
  request: CreateBillingPortalSessionRequest,
) {
  const { playerId } = request;

  const stripeSecretKey = process.env.STRIPE_SK;
  if (!stripeSecretKey) {
    return { error: 'Missing Stripe secret key' };
  }

  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    return { error: 'Missing SITE_URL environment variable' };
  }

  const { data: subscription, error: subscriptionError } = await db
    .from('_player_subscriptions')
    .select('*')
    .eq('player_id', playerId)
    .eq('provider', 'STRIPE')
    .in('status', ['TRIALING', 'ACTIVE', 'PAST_DUE', 'PAUSED'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscriptionError) {
    console.error('Failed to find Stripe subscription for billing portal', subscriptionError);
    return { error: 'Failed to find Stripe subscription' };
  }

  if (!subscription?.provider_customer_id) {
    return { error: 'No active Stripe subscription found' };
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.provider_customer_id,
      return_url: `${siteUrl}/settings/subscription`,
    });

    return {
      portalUrl: portalSession.url,
    };
  } catch (error: any) {
    console.error('Stripe billing portal session creation failed', error);

    return {
      error: error?.message || 'Failed to create billing portal session',
    };
  }
}

export async function handleStripeWebhook(
  request: HandleStripeWebhookRequest,
) {
  const stripeSecretKey = process.env.STRIPE_SK;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) return { error: 'Missing Stripe secret key' };
  if (!webhookSecret) return { error: 'Missing Stripe webhook secret' };
  if (!request.signature || Array.isArray(request.signature)) {
    return { error: 'Missing Stripe signature' };
  }

  const stripe = new Stripe(stripeSecretKey);

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      request.rawBody,
      request.signature,
      webhookSecret,
    );
  } catch (error: any) {
    console.error('Stripe webhook signature verification failed', error);
    return { error: error?.message || 'Invalid Stripe webhook signature' };
  }

  console.log('Stripe webhook received:', event.type);

  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'customer.subscription.updated' &&
    event.type !== 'customer.subscription.deleted'
  ) {
    return { received: true, ignored: true, eventType: event.type };
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription;

    return syncStripeSubscription(subscription);
  }
  
  const session = event.data.object as Stripe.Checkout.Session;

  if (session.mode !== 'subscription') {
    return { received: true, ignored: true, reason: 'Not subscription mode' };
  }

  if (session.payment_status !== 'paid') {
    return { received: true, ignored: true, reason: 'Payment not paid' };
  }

  const playerId = session.metadata?.playerId;
  const subscriptionKey = session.metadata?.subscriptionKey;
  const providerCustomerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id;
  const providerSubscriptionId =
    typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;

  if (!playerId || !subscriptionKey || !providerCustomerId || !providerSubscriptionId) {
    return { error: 'Missing required subscription metadata from Stripe session' };
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    providerSubscriptionId,
  );

  const {
    currentPeriodStart,
    currentPeriodEnd,
  } = getStripeSubscriptionPeriod(stripeSubscription);

  console.log('Retrieved Stripe subscription period fields', {
    providerSubscriptionId,
    currentPeriodStart: stripeSubscription.current_period_start,
    currentPeriodEnd: stripeSubscription.current_period_end,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    canceledAt: stripeSubscription.canceled_at,
  });

  const { data, error } = await db
    .from('_player_subscriptions')
    .upsert(
      {
        player_id: playerId,
        subscription_key: subscriptionKey,
        provider: 'STRIPE',
        provider_customer_id: providerCustomerId,
        provider_subscription_id: providerSubscriptionId,
        status: 'ACTIVE',
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
        cancelled_at: stripeTimestampToIso(stripeSubscription.canceled_at),
        metadata: {
          checkoutSessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'provider,provider_subscription_id' },
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to save player subscription', error);
    return { error: 'Failed to save player subscription' };
  }

  const entitlementSyncResult = await syncSubscriptionEntitlements(data);

  if ('error' in entitlementSyncResult) {
    return entitlementSyncResult;
  }

  return {
    received: true,
    eventType: event.type,
    subscription: data,
  };
}

export async function fulfillOrder() {
  throw new Error('Not implemented');
}
