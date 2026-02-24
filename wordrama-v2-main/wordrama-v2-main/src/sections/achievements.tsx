"use client";

import { useMemo, useState } from "react";
import { FilterIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loading from "@/sections/loading";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useGetMyAccountQuery, useGetMyChallengesQuery } from "@/redux/api/wordrama";

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

export default function Achievements() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // ✅ Get logged-in player info so we can use playerId
  const {
    data: myAccountResp,
    isLoading: accountLoading,
    isFetching: accountFetching,
  } = useGetMyAccountQuery();

  const playerId = myAccountResp?.data?.id; // <-- assumes your /player/me returns { data: { id: ... } }

  // ✅ Now fetch challenges using playerId + statusFilter
  const {
    data: challengesResp,
    error: challengesError,
    isLoading: challengesLoading,
    isFetching: challengesFetching,
  } = useGetMyChallengesQuery(
    { playerId, statusFilter },
    { skip: !playerId }
  );

  const challenges = useMemo(() => {
    const list = Array.isArray(challengesResp?.data) ? challengesResp!.data : [];
    return list;
  }, [challengesResp?.data]);

  const loading =
    accountLoading || accountFetching || challengesLoading || challengesFetching;

  if (loading) return <Loading />;

  return (
    <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[50px]">
      <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Filter Sheet */}
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
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
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

              {/* Helpful message if API errors */}
              {challengesError && (
                <div className="text-sm">
                  <p className="font-semibold">Couldn’t load achievements.</p>
                  <p className="opacity-80">
                    The API returned an error for this filter. (This should no longer crash the page.)
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Empty state */}
        {!challengesError && challenges.length === 0 && (
          <div className="border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5 sm:col-span-2 lg:col-span-3">
            <p>No achievements found for this filter.</p>
          </div>
        )}

        {/* Cards */}
        {challenges.map((challenge: any, challengeIdx: number) => {
          const { name, description, coinReward, xpReward, progress, status } =
            challenge ?? {};

          const reward = getRewardText(coinReward, xpReward);
          const statusLabel = getStatusLabel(status);
          const numericProgress = Number(progress ?? 0);

          return (
            <div
              key={challengeIdx}
              className={`${
                status === "LOCKED" ? "grayscale" : ""
              } border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark dark:bg-darkBg flex flex-col gap-3 rounded-base bg-bg p-5`}
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
                {description} to earn {reward}
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
  );
}