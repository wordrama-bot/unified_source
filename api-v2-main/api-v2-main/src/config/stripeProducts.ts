import { SUBSCRIPTIONS } from './subscriptions';

export const STRIPE_PRODUCTS = {
  [SUBSCRIPTIONS.PLUS]: {
    envVar: 'STRIPE_PRICE_PLUS_MONTHLY',
  },

  [SUBSCRIPTIONS.CREATOR]: {
    envVar: 'STRIPE_PRICE_CREATOR_MONTHLY',
  },
} as const;
