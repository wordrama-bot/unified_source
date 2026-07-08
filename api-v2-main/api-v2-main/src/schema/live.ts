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

export const grantLiveDevEntitlement = z.object({
  playerId: z.string().trim().min(1).optional(),
}).strict();
export type GrantLiveDevEntitlement = z.infer<typeof grantLiveDevEntitlement>;

export const openLiveDevRegistration = z.object({}).strict();
export type OpenLiveDevRegistration = z.infer<typeof openLiveDevRegistration>;

export const startLiveDevTournament = z.object({}).strict();
export type StartLiveDevTournament = z.infer<typeof startLiveDevTournament>;

export const createLiveDevMatch = z.object({
  tournamentId: z.string().trim().min(1),
  playerIds: z.array(z.string().trim().min(1)).length(2),
  roundNumber: z.number().int().positive(),
  matchNumber: z.number().int().positive(),
  solution: z.string().trim().min(1),
  wordPack: z.string().trim().min(1).optional(),
  wordLength: z.number().int().positive().optional(),
  maxAttempts: z.number().int().positive().optional(),
  solutionHash: z.string().trim().min(1).nullable().optional(),
  solutionSaltId: z.string().trim().min(1).nullable().optional(),
  scheduledAt: z.string().trim().min(1).nullable().optional(),
  config: liveJsonObject.optional(),
  metadata: liveJsonObject.optional(),
}).strict();
export type CreateLiveDevMatch = z.infer<typeof createLiveDevMatch>;
