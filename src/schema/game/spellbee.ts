import { z } from "zod";

// Add
export const addGameResult = z.object({
  gameResultType: z.string(),
  middleLetters: z.string(),
  score: z.number(),
  correctWords: z.array(z.string()),
  potentialWords: z.array(z.string()),
});
export type AddGameResult = z.infer<typeof addGameResult>;
