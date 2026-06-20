export const SUBSCRIPTIONS = {
  PLUS: 'PLUS',
  CREATOR: 'CREATOR',
} as const;

export type SubscriptionKey =
  typeof SUBSCRIPTIONS[keyof typeof SUBSCRIPTIONS];
