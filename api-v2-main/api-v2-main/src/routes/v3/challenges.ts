import express from "express";

import { validateToken, validateUserRole } from "../../middleware/tokenValidation";
import challengeController from "../../controllers/challenge";

export const router = express.Router();

const authedPlayer = [
  validateToken,
  validateUserRole(["PLAYER", "STREAMER", "SERVICE_TOKEN"]),
] as const;

/* Get routes */
// ✅ "my challenges" (uses req.userId inside controller)
router.get("/me", ...authedPlayer, challengeController.getAllMyChallenges);

// ✅ public lookup by explicit playerId (still requires auth based on your v3 index.ts protection)
router.get("/:playerId", ...authedPlayer, challengeController.getAllMyChallenges);

/* Patch routes */
// ✅ update progress for a challenge (requires auth)
router.patch(
  "/:challengeId/progress",
  ...authedPlayer,
  challengeController.updateChallengeProgress,
);