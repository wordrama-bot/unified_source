import type { Response } from "express";
import type { ApiRequest } from "../types";
import { backfillChallenges } from "../services/migrate/backfillChallenges";

async function backfillChallengesHandler(req: ApiRequest, res: Response) {
  try {
    const dryRun = String(req.query.dryRun) === "true";
    const limit = Number(req.query.limit || 250);
    const offset = Number(req.query.offset || 0);

    const singlePage = String(req.query.singlePage) === "true";

    // NEW: allow targeting one specific player (debug / repair)
    const targetPlayerId = (req.query.playerId as string) || "";

    const result = await backfillChallenges({
      dryRun,
      limit,
      offset,
      ...(singlePage ? { singlePage: true } : {}),
      ...(targetPlayerId ? { targetPlayerId } : {}),
    } as any);

    return res.status(200).json({
      data: result,
      count: 1,
      status: 200,
      message: "Challenge backfill complete",
    });
  } catch (e: any) {
    console.error("[migrate.backfillChallenges] ERROR", e);
    return res.status(500).json({
      data: {},
      count: 0,
      status: 500,
      message: e?.message || "Backfill failed",
    });
  }
}

export default {
  backfillChallenges: backfillChallengesHandler,
};