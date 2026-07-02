"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/navbar/h-nav";
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
    <div className="flex min-h-screen w-full flex-col border:border bg-bg text-text dark:border-darkBorder dark:bg-darkBg dark:text-darkText">
      <NavBar
        links={[
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
        ]}
      />

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-4 pt-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              How XP, Levels, and Prestige Work
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Wordrama rewards consistent play, strong performance, and long-term
              progression with XP, levels, prestige, and coins. Here’s how XP and
              Coins for solves works today and how your profile level and prestige
              are calculated.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>XP and Coin Rewards for Wordle Solves</CardTitle>
              <CardDescription>
                Fewer guesses earn more XP and more coins.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-sm md:text-base">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">1000 XP</div>
                  <div className="text-lg font-semibold">25 coins</div>
                  <div className="text-muted-foreground">Solves in 1 guess</div>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">150 XP</div>
                  <div className="text-lg font-semibold">15 coins</div>
                  <div className="text-muted-foreground">Solves in 2 guesses</div>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">100 XP</div>
                  <div className="text-lg font-semibold">5 coins</div>
                  <div className="text-muted-foreground">Solves in 3 guesses</div>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">50 XP</div>
                  <div className="text-lg font-semibold">4 coins</div>
                  <div className="text-muted-foreground">Solves in 4 guesses</div>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">30 XP</div>
                  <div className="text-lg font-semibold">3 coins</div>
                  <div className="text-muted-foreground">Solves in 5 guesses</div>
                </div>

                <div className="rounded-xl border p-4 text-center">
                  <div className="text-2xl font-bold">20 XP</div>
                  <div className="text-lg font-semibold">2 coins</div>
                  <div className="text-muted-foreground">Solves in 6 guesses</div>
                </div>
              </div>

              <p>
                In general, the better your solve, the more XP and coins you earn. A
                one-guess solve gives a huge XP reward, while later solves still move
                your progression forward and add coins to your balance.
              </p>

              <p>
                Coins can be used in the Wordrama marketplace, while XP contributes to
                your profile level and long-term prestige progression.
              </p>

              <p>
                Some other game systems, such as{" "}
                <Link
                  href="/achievements"
                  className="underline hover:text-primary"
                >
                  achievements and challenges
                </Link>
                , can also contribute XP or coins on top of your normal gameplay earnings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Levels</CardTitle>
              <CardDescription>
                Levels track your progress inside your current prestige tier.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Every time you earn enough XP, you level up. The amount of XP
                needed for the next level increases as you climb higher.
              </p>
              <p>
                The XP bar on your profile shows how much XP you currently have
                toward the next level and how much remains before you level up
                again.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prestige</CardTitle>
              <CardDescription>
                Prestige shows your long-term progression beyond a single 100-level cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Prestige increases every 100 total levels.
              </p>
              <p>
                For example, if your total level is 197, your profile will show:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prestige 1</li>
                <li>Level 97</li>
              </ul>
              <p>
                That means you completed one full 100-level prestige cycle and
                are now 97 levels into the next one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Progression Matters</CardTitle>
              <CardDescription>
                Progression gives players visible goals and long-term recognition.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Your level and prestige help show your experience, consistency,
                and long-term commitment to Wordrama.
              </p>
              <p>
                In future updates, progression may connect to badges, cosmetics,
                unlocks, and premium features.
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