import { z } from 'zod';

// Bound legacy input even while result submission is suspended.
const word = z.string().regex(/^[a-zA-Z]{4,64}$/);
export const addGameResult = z.object({
  gameResultType: z.enum(['DAILY', 'INFINITE']),
  middleLetters: z.string().regex(/^[a-zA-Z]{1,7}$/),
  score: z.number().finite().int().nonnegative().max(1000000),
  correctWords: z.array(word).max(10000),
  potentialWords: z.array(word).min(1).max(10000),
}).strict();
export type AddGameResult = z.infer<typeof addGameResult>;
