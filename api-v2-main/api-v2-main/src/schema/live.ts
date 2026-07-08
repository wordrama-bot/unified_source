import { z } from 'zod';

const liveJsonObject = z.record(z.unknown());

export const createLiveTournament = z.object({
  name: z.string().trim().min(1),
  visibility: z.enum(['PRIVATE', 'PUBLIC', 'UNLISTED']).optional(),
  bestOf: z.union([z.literal(1), z.literal(3), z.literal(5)]).optional(),
  config: liveJsonObject.optional(),
  metadata: liveJsonObject.optional(),
});
export type CreateLiveTournament = z.infer<typeof createLiveTournament>;

export const joinLiveTournament = z.object({
  metadata: liveJsonObject.optional(),
});
export type JoinLiveTournament = z.infer<typeof joinLiveTournament>;

export const readyLivePlayer = z.object({}).passthrough();
export type ReadyLivePlayer = z.infer<typeof readyLivePlayer>;

export const startLiveMatch = z.object({}).passthrough();
export type StartLiveMatch = z.infer<typeof startLiveMatch>;

export const submitLiveGuess = z.object({
  guess: z.string().trim().min(1),
}).strict();
export type SubmitLiveGuess = z.infer<typeof submitLiveGuess>;
