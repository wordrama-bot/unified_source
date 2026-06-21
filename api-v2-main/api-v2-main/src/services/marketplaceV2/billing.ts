import Stripe from 'stripe';
import { db } from '../../models';
import { STRIPE_PRODUCTS } from '../../config/stripeProducts';
import { SUBSCRIPTIONS } from '../../config/subscriptions';
import { SUBSCRIPTION_ENTITLEMENTS } from '../../config/subscriptionEntitlements';

export interface CreateCheckoutSessionRequest {
  playerId: string;
  subscriptionKey: string;
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

    console.log('Stripe subscription lifecycle event:', {
      eventType: event.type,
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    return {
      received: true,
      eventType: event.type,
      subscriptionId: subscription.id,
      status: subscription.status,
    };
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
    console.error('Failed to insert subscription entitlements', entitlementError);
    return { error: 'Failed to save player subscription' };
  }

  const entitlementKeys =
    SUBSCRIPTION_ENTITLEMENTS[
      subscriptionKey as keyof typeof SUBSCRIPTION_ENTITLEMENTS
    ];

  if (!entitlementKeys?.length) {
    return { error: 'No entitlements configured for subscription' };
  }

  const entitlementRows = entitlementKeys.map((entitlementKey) => ({
    player_id: playerId,
    entitlement_key: entitlementKey,
    entitlement_type: 'FEATURE',
    source_type: 'SUBSCRIPTION',
    subscription_id: data.id,
    status: 'ACTIVE',
    starts_at: new Date().toISOString(),
    expires_at: null,
    metadata: {
      subscriptionKey,
      provider: 'STRIPE',
      providerSubscriptionId,
    },
  }));

  const { error: entitlementError } = await db
    .from('_player_entitlements')
    .insert(entitlementRows);

  if (entitlementError) {
    console.error('Failed to upsert subscription entitlements', entitlementError);
    return { error: 'Failed to grant subscription entitlements' };
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
