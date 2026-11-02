import { z } from 'zod';

export const coinPurchase = z.object({
  items: z.array(z.string().uuid().transform((id) => id.toLowerCase()))
    .min(1).max(50).refine((items) => new Set(items).size === items.length, 'Duplicate items'),
}).strict();
