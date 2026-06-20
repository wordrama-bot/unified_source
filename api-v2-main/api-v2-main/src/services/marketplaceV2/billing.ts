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

export async function handleStripeWebhook() {
  throw new Error('Not implemented');
}

export async function fulfillOrder() {
  throw new Error('Not implemented');
}
