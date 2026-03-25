"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/sections/header";
import Footer from "@/sections/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProgressionPage() {
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId");

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <Header />

      <main className="flex-1 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              How XP, Levels, and Prestige Work
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Wordrama rewards consistent play, strong performance, and long-term
              progression. Here’s how the system works.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>XP</CardTitle>
              <CardDescription>
                XP is the experience you earn while playing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                XP is awarded based on your gameplay results. Winning efficiently,
                completing challenges, and continuing to play all contribute to
                your progress.
              </p>
              <p>
                As your XP increases, you move through levels. The amount of XP
                required for each new level increases as you climb higher.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Levels</CardTitle>
              <CardDescription>
                Levels represent your progress within your current prestige tier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Your visible level is the level you are currently working through
                right now.
              </p>
              <p>
                The progress bar on your profile shows how much XP you have toward
                your next level and how much remains before you level up again.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prestige</CardTitle>
              <CardDescription>
                Prestige reflects your long-term progression beyond a single level cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Every 100 total levels, your prestige tier increases.
              </p>
              <p>
                For example, if your total level is 197, your profile shows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prestige 1</li>
                <li>Level 97</li>
              </ul>
              <p>
                This means you’ve already completed one full 100-level prestige
                cycle and are 97 levels into the next one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why it matters</CardTitle>
              <CardDescription>
                Progression gives players visible goals and long-term recognition.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Levels and prestige help show experience, consistency, and status
                within the Wordrama community.
              </p>
              <p>
                In future updates, progression may also connect to unlocks,
                badges, cosmetics, and premium features.
              </p>
            </CardContent>
          </Card>

          <div className="rounded-2xl border p-6 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Ready to keep climbing?</h2>
            <p className="text-muted-foreground">
              Head back to your profile and keep stacking wins.
            </p>

            {playerId ? (
              <Link href={`/player/${playerId}`}>
                <Button size="lg">Back to Your Profile</Button>
              </Link>
            ) : (
              <Link href="/">
                <Button size="lg">Back to Wordrama</Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}