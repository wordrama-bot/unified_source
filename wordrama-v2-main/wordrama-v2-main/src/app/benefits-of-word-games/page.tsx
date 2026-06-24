import Link from "next/link";
import PublicNav from '@/components/navbar/public-nav';
import Footer from '@/sections/footer';
import GoogleAd from "@/components/GoogleAd";

export default function BenefitsOfWordGamesPage() {
  return (
    <main className="min-h-screen bg-darkBg text-white">
      <PublicNav
        links={[
          { href: "/", text: "Home" },
          { href: "/free-play", text: "Quick Play" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up / In" },
        ]}
      />

      <section className="container mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Word Game Learning Guide
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          The Educational Benefits of Word Games
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Last updated: May 14, 2026
        </p>

        <p className="mt-6 text-lg text-gray-300">
          Word games are more than quick entertainment. They encourage pattern
          recognition, vocabulary growth, spelling practice, memory recall, and
          careful reasoning. Games like Wordrama give players a daily opportunity
          to think critically while having fun.
        </p>

        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">
              Word games build vocabulary through repeated exposure
            </h2>
            <p className="mt-3 text-gray-300">
              Each puzzle gives players a chance to encounter familiar words in
              new ways and discover less common letter patterns. Over time,
              repeated play can help strengthen word recognition and make
              unusual combinations easier to spot.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              Puzzle solving strengthens deductive reasoning
            </h2>
            <p className="mt-3 text-gray-300">
              Wordrama-style puzzles require players to interpret feedback,
              eliminate impossible answers, and adjust their guesses based on
              new information. This makes each round a small exercise in logic,
              probability, and decision-making.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              Daily play encourages consistency and focus
            </h2>
            <p className="mt-3 text-gray-300">
              A short daily puzzle can create a simple habit of focused thinking.
              Players practice slowing down, comparing possibilities, and making
              intentional choices rather than guessing randomly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              Longer word lengths create deeper challenges
            </h2>
            <p className="mt-3 text-gray-300">
              Wordrama supports a wide range of word lengths, which lets players
              move beyond standard five-letter puzzles. Longer puzzles can
              challenge players to recognize prefixes, suffixes, repeated
              letters, and more complex word structures.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              Word games can be social and motivating
            </h2>
            <p className="mt-3 text-gray-300">
              Leaderboards, streaks, friends, and community features can make
              practice more engaging. Friendly competition gives players another
              reason to return, improve, and compare strategies.
            </p>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">
            Keep Learning with Wordrama
          </h2>

          <p className="mt-3 text-gray-300">
            Explore more guides to improve your puzzle strategy and learn how
            Wordrama works.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/how-to-play"
              className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
            >
              How to Play
            </Link>

            <Link
              href="/wordle-strategy"
              className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
            >
              Strategy Guide
            </Link>

            <Link
              href="/best-starting-words"
              className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
            >
              Best Starting Words
            </Link>

            <Link
              href="/wordle-tips"
              className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
            >
              Wordle Tips
            </Link>

            <Link
              href="/benefits-of-word-games"
              className="rounded-lg bg-white px-4 py-2 font-semibold text-darkBg"
            >
              Benefits of Word Games
            </Link>
          </div>

          <div className="mt-10">
            <GoogleAd
              client="ca-pub-8970369628667981"
              slot="8219203779"
              minHeight={280}
            />
          </div>

        </section>
      </section>
      <Footer />
    </main>
  );
}