import { z } from "zod";

// Add
export const addGameResult = z.object({
  solution: z.string(),
  guesses: z.array(z.string()),
  gameWasHardMode: z.boolean(),
  type: z.string(),
  shareCode: z.string().optional()
});
export type AddGameResult = z.infer<typeof addGameResult>;

export const createCustom = z.object({
  customWord: z.string(),
  hint: z.string().optional()
});
export type CreateCustom = z.infer<typeof createCustom>;