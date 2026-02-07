import { z } from "zod";

// Add
export const newFriendRequest = z.object({
  friendId: z.string(),
});
export type NewFriendRequest = z.infer<typeof newFriendRequest>;
