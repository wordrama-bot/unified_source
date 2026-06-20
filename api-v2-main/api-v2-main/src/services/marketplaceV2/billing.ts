import Stripe from 'stripe';

import { STRIPE_PRODUCTS } from '../../config/stripeProducts';
import { SUBSCRIPTIONS } from '../../config/subscriptions';

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

  return { received: true, eventType: event.type };
}

export async function fulfillOrder() {
  throw new Error('Not implemented');
}
