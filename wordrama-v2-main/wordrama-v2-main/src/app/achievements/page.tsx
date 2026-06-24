"use client";

import Link from "next/link";

import PublicNav from "@/components/navbar/public-nav";
import NavBar from "@/components/navbar/h-nav";
import Footer from "@/sections/footer";
import Achievements from "@/sections/achievements";
import GoogleAd from "@/components/GoogleAd";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export default function AchievementsPage() {
  const { user, session } = useAuth();

  if (user || session) {
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

        <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <div className="mx-auto w-container max-w-full px-5 text-center">
            <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
              Achievements
            </h1>
          </div>
        </header>

        <Achievements />

        <Footer />
      </div>
    );
  }

  return (
    <>
      <PublicNav
        links={[
          { href: "/free-play", text: "Quick Play" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up / In" },
        ]}
      />

      <main className="min-h-screen w-full bg-darkBg text-white">
        <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <div className="mx-auto w-container max-w-full px-5 text-center">
            <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
              Achievements
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-lg">
              Earn achievements as you play Wordrama, build streaks, solve words in fewer guesses, connect with friends, and climb the leaderboard.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Create a Free Account</Button>
              </Link>

              <Link href="/free-play">
                <Button size="lg" variant="neutral">
                  Quick Play
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-5 py-12">
          <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
            <h2 className="text-2xl font-bold">
              What are Wordrama achievements?
            </h2>

            <p className="mt-4">
              Wordrama achievements are milestones players unlock through real activity in the game. They recognize progress such as playing your first game, winning Wordle-style puzzles, solving words in fewer guesses, building streaks, linking your Discord, adding friends, and climbing the leaderboard.
            </p>

            <p className="mt-4">
              Achievements are designed to make Wordrama feel more rewarding over time. Instead of only tracking whether you won or lost a single puzzle, achievements help capture the bigger story of your player journey.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Earn XP</h2>
              <p className="mt-3">
                Some achievements award XP, which helps represent your player progression. XP rewards can come from account milestones, gameplay accomplishments, streaks, and other progress-based actions.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Collect coins</h2>
              <p className="mt-3">
                Some achievements award coins, Wordrama&apos;s in-game currency. Coins can be used in the Marketplace to unlock eligible cosmetics, themes, word packs, and other rewards as new content becomes available.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Track real progress</h2>
              <p className="mt-3">
                Wordrama achievements are connected to gameplay and account activity, including wins, losses, solve counts, streaks, leaderboard rankings, friend connections, and profile milestones.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Build your player identity</h2>
              <p className="mt-3">
                Achievements work alongside stats, streaks, marketplace rewards, friends, teams, and public player profiles to make Wordrama more personal and social.
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
            <h2 className="text-2xl font-bold">Types of achievements</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">Gameplay achievements</h3>
                <p className="mt-3">
                  Gameplay achievements reward actions like winning in one, two, three, four, five, or six guesses, losing a game, playing your first game, and finding special words.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold">Progress achievements</h3>
                <p className="mt-3">
                  Progress achievements reward longer-term accomplishments like building a 100-game streak, reaching the top of the leaderboard, linking your Discord, choosing a username, or connecting with friends.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-10">
            <GoogleAd
              client="ca-pub-8970369628667981"
              slot="8219203779"
              minHeight={280}
            />
          </div>

          <section className="mt-10 rounded-lg border border-darkBorder bg-darkBg/80 p-6 text-center shadow-dark">
            <h2 className="text-2xl font-bold">
              Ready to unlock achievements?
            </h2>

            <p className="mx-auto mt-4 max-w-3xl">
              Create a free Wordrama account to save your stats, earn achievements, collect XP, build your player profile, and use coins in the Marketplace as rewards become available.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Create a Free Account</Button>
              </Link>

              <Link href="/marketplace">
                <Button size="lg" variant="neutral">
                  Visit Marketplace
                </Button>
              </Link>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
