import { z } from 'zod';

// Add
export const addPlayer = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImage: z.string().optional(),
  username: z.string(),
  referralCode: z.string().optional(),
});
export type AddPlayer = z.infer<typeof addPlayer>;

// Update
export const updatePlayer = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImage: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
});
export type UpdatePlayer = z.infer<typeof updatePlayer>;

export const updateSettings = z.object({
  isColourBlind: z.boolean().optional(),
  isHardMode: z.boolean().optional(),
  isDarkMode: z.boolean().optional(),
  wordleWordLength: z.number().int().positive().min(5).max(11).optional(),
  isConfettiEnabled: z.boolean().optional(),
});
export type UpdateSettings = z.infer<typeof updateSettings>;
