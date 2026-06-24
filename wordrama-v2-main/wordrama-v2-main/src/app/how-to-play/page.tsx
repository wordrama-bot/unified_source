"use client"
import Link from "next/link";
import PublicNav from '@/components/navbar/public-nav';
import Footer from '@/sections/footer';
import GoogleAd from "@/components/GoogleAd";

export default function HowToPlayPage() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      
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

      <div className="container mx-auto p-4">

        <h1 className="text-4xl font-bold mb-6">How to Play Wordrama</h1>

        <p className="mt-2 text-sm text-gray-400">
          Last updated: May 14, 2026
        </p>

        <p className="mt-4">
          Wordrama is a word puzzle game inspired by the classic Wordle format.
          Your goal is to guess the hidden word in as few attempts as possible.
        </p>

        <h2 className="text-2xl font-semibold mt-8">Basic Rules</h2>

        <ul className="list-disc ml-8 mt-4">
          <li>You have a limited number of guesses.</li>
          <li>Each guess must be a valid word.</li>
          <li>Letters will change color to show how close your guess is.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Tile Colors Explained</h2>

        <ul className="list-disc ml-8 mt-4">
          <li><strong>Green</strong> — correct letter in the correct position</li>
          <li><strong>Yellow</strong> — correct letter in the wrong position</li>
          <li><strong>Gray</strong> — letter is not in the word</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8">Wordrama Features</h2>

        <ul className="list-disc ml-8 mt-4">
          <li>Multiple word lengths (4–23 letters)</li>
          <li>Unlimited practice mode</li>
          <li>Daily challenges</li>
          <li>Leaderboards and achievements</li>
        </ul>

        <p className="mt-6">
          Ready to test your vocabulary? Start playing now and see how many puzzles
          you can solve.
        </p>

      </div>

      <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold">
          Continue Learning
        </h2>

        <p className="mt-3 text-gray-300">
          Build your Wordrama skills with more strategy guides and helpful word puzzle resources.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/how-to-play"
            className="rounded-lg bg-white px-4 py-2 font-semibold text-darkBg"
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
            href="/benefits-of-word-games"
            className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
          >
            Benefits of Word Games
          </Link>

          <Link
            href="/wordle-tips"
            className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white"
          >
            Wordle Tips
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

      <Footer />
    </div>
  );
}