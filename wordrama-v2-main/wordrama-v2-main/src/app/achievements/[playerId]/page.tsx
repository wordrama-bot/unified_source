"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FilterIcon, UserIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import {
  useGetChallengesByUserIdQuery,
  useGetPublicPlayerQuery,
} from "@/redux/api/wordrama";

type StatusFilter = "ALL" | "LOCKED" | "IN_PROGRESS" | "COMPLETED";
type ChallengeStatus = "LOCKED" | "UNLOCKED" | "IN_PROGRESS" | "COMPLETE" | string;

function getRewardText(coinReward?: number, xpReward?: number) {
  const coins = Number(coinReward || 0);
  const xp = Number(xpReward || 0);
  if (coins > 0 && xp > 0) return `${coins} coins and ${xp} XP`;
  if (coins > 0) return `${coins} coins`;
  if (xp > 0) return `${xp} XP`;
  return "no reward";
}

function getStatusLabel(status?: ChallengeStatus) {
  switch (status) {
    case "COMPLETED":
      return "Complete";
    case "IN_PROGRESS":
      return "In Progress";
    case "UNLOCKED":
      return "Unlocked";
    case "LOCKED":
      return "Locked";
    default:
      return null;
  }
}

export default function ChallengesPage() {
  const params = useParams();
  const playerIdRaw = (params as any)?.playerId;
  const playerId = Array.isArray(playerIdRaw) ? playerIdRaw[0] : playerIdRaw;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const {
    data: challengesResp,
    error: challengesError,
    isLoading: challengesLoading,
    isFetching: challengesFetching,
  } = useGetChallengesByUserIdQuery(
  { playerId, filter: statusFilter },
  { skip: !playerId }
);

  const { data: playerResp } = useGetPublicPlayerQuery(playerId, {
    skip: !playerId,
  });

  const challenges = useMemo(() => {
    // Prefer API-filtered results when they exist
    const apiList = challengesResp?.data ?? [];
    // If the API call is failing (404 right now), you can optionally keep showing
    // the last cached list. RTK Query usually does that automatically.
    return apiList;
  }, [challengesResp?.data]);

  const playerName = playerResp?.data?.displayName ?? "Player";
  const playerLevel = playerResp?.data?.levels?.level;

  const hasChallengeError = Boolean(challengesError);

  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
            {playerName}&apos;s Achievements
          </h2>

          {typeof playerLevel !== "undefined" && (
            <Badge className="mt-5">Level {playerLevel}</Badge>
          )}

          <br />

          {playerId && (
            <Link href={`/player/${playerId}`}>
              <Button size="icon" className={"mt-5 w-32"}>
                <UserIcon className="stroke-text h-6 w-6 w500:h-4 w500:w-4" />
                Player profile
              </Button>
            </Link>
          )}
        </div>
      </header>

      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[50px]">
        <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filter sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="fixed top-20 right-5" variant="default">
                <FilterIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-bg">
              <SheetHeader>
                <SheetTitle>Filter</SheetTitle>
                <SheetDescription />
              </SheetHeader>

              <div className="grid gap-4 py-4">
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>

                  <RadioGroup
                    defaultValue="ALL"
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ALL" id="ALL" />
                      <Label htmlFor="ALL">All</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LOCKED" id="LOCKED" />
                      <Label htmlFor="LOCKED">Locked</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="IN_PROGRESS" id="IN_PROGRESS" />
                      <Label htmlFor="IN_PROGRESS">In Progress</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="COMPLETED" id="COMPLETED" />
                      <Label htmlFor="COMPLETED">Complete</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />

                {/* Helpful, visible debug state for now */}
                {hasChallengeError && (
                  <div className="text-sm">
                    <p className="font-semibold">
                      Couldn&apos;t load achievements for this filter.
                    </p>
                    <p className="opacity-80">
                      Your API request is returning 404 for the current endpoint.
                      The UI is working, but the backend route needs to exist.
                    </p>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Loading state */}
          {(challengesLoading || challengesFetching) && (
            <div className="border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5 sm:col-span-2 lg:col-span-3">
              <p>Loading achievements…</p>
            </div>
          )}

          {/* Empty state */}
          {!challengesLoading && !challengesFetching && challenges.length === 0 && (
            <div className="border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5 sm:col-span-2 lg:col-span-3">
              <p>No achievements found for this filter.</p>
            </div>
          )}

          {/* Cards */}
          {challenges.map((challenge: any, challengeIdx: number) => {
            const {
              id,
              challengeId,
              name,
              description,
              coinReward,
              xpReward,
              progress,
              status,
            } = challenge ?? {};

            const rewardText = getRewardText(coinReward, xpReward);
            const statusLabel = getStatusLabel(status);
            const numericProgress = Number(progress ?? 0);

            // If you add an achievement details page later, replace this with:
            // const href = `/achievements/${id ?? challengeId}`;
            // and wrap the card with <Link href={href}>...</Link>
            const key = id ?? challengeId ?? challengeIdx;

            return (
              <div
                key={key}
                className={`${
                  status === "LOCKED" ? "grayscale" : ""
                } border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5`}
                role="article"
                aria-label={name ? `${name} achievement` : "Achievement"}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="mt-2 text-xl font-heading">{name}</h4>

                  {statusLabel && (
                    <span className="border-border text-text dark:border-darkBorder rounded-base border-2 bg-main px-2 py-0.5 text-sm whitespace-nowrap">
                      {statusLabel}
                    </span>
                  )}
                </div>

                <p>
                  {description} to earn {rewardText}
                </p>

                {status === "IN_PROGRESS" && numericProgress < 100 ? (
                  <>
                    <Separator className="mt-4 mb-4" />
                    <Progress value={numericProgress} className="w-[100%]" />
                  </>
                ) : status === "COMPLETED" ? (
                  <p className="text-center text-6xl">🏆</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}