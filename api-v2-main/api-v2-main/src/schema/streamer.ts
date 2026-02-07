import { z } from "zod";

// Update
export const updateStreamerSettings = z.object({
  hideName: z.boolean().optional(),
  hideAccountsPage: z.boolean().optional(),
  hideFromLeaderboard: z.boolean().optional(),
  showStreamerView: z.boolean().optional(),
  tiktokUsername: z.string().optional(),
  twitchUsername: z.string().optional(),
  youtubeUsername: z.string().optional(),
});
export type UpdateStreamerSettings = z.infer<typeof updateStreamerSettings>;
