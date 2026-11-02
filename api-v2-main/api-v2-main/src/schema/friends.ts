import { z } from "zod";

// Add
export const newFriendRequest = z.object({
  friendId: z.string().uuid().transform((id) => id.toLowerCase()),
});
export type NewFriendRequest = z.infer<typeof newFriendRequest>;
