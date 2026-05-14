"use client"
import PublicNav from '@/components/navbar/public-nav';
import Footer from '@/sections/footer';

export default function WordleStrategyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <PublicNav
        links={[
          { href: "/", text: "Home" },
          { href: "/free-play", text: "Free Play" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up" },
        ]}
      />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Wordle Strategy Guide</h1>
        <p className="text-sm text-gray-500">Last updated March 13, 2026</p>

        <p className="mt-4">
          If you want to improve at Wordle-style games, the best place to start is with strategy.
          Wordrama rewards players who use smart guesses, learn from letter patterns, and avoid
          wasting turns on random words. Whether you are trying to solve the daily puzzle, improve
          your streak, or climb the leaderboard, a few simple habits can dramatically improve your results.
        </p>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">1. Start with a strong opener</h2>
          <p className="mt-4">
            Your first guess should help you learn as much as possible. Good opening words usually
            include common vowels and frequently used consonants. Words like <strong>STARE</strong>,
            <strong> CRANE</strong>, <strong> SLATE</strong>, and <strong> TRACE</strong> are popular because
            they test useful letters early and reveal information quickly.
          </p>
          <p className="mt-4">
            A weak starting word might still get lucky, but a strong opening word gives you a better
            average outcome over time. The goal is not to guess the answer immediately. The goal is to
            gather useful clues.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">2. Use your second guess to eliminate possibilities</h2>
          <p className="mt-4">
            After your first guess, do not rush into repeating too many letters unless you have a good reason.
            The second guess is often most valuable when it introduces new letters and tests new positions.
            This helps you narrow the solution space much faster.
          </p>
          <p className="mt-4">
            For example, if your first guess confirms one vowel and one consonant, your second guess can
            test additional common letters like R, N, L, T, S, or another vowel. Skilled players think of
            their second guess as an information play rather than a desperation guess.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">3. Pay attention to letter position, not just letter presence</h2>
          <p className="mt-4">
            Many players focus only on whether a letter is in the word. The more important clue is often
            where that letter does or does not belong. Green tiles confirm exact placement. Yellow tiles
            confirm the letter belongs in the answer, but not in that position. This positional information
            is what helps you move from a broad list of possibilities to one likely answer.
          </p>
          <p className="mt-4">
            When you play Wordrama, take a moment after each guess to think about letter arrangement.
            Ask yourself which patterns are still possible and which are no longer valid.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">4. Watch out for repeated letters</h2>
          <p className="mt-4">
            One of the hardest parts of Wordle-style games is handling repeated letters. A guess might show
            that a letter is present, but that does not always tell you whether it appears once or twice.
            Words with repeated vowels or repeated consonants can trip up even experienced players.
          </p>
          <p className="mt-4">
            If your clues are not fitting a normal pattern, pause and consider whether the answer may include
            a repeated letter. This is especially useful when only a few possibilities remain.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">5. Avoid panic guesses late in the puzzle</h2>
          <p className="mt-4">
            Many losses happen because players get impatient on the fourth or fifth guess. Instead of slowing
            down and testing the pattern logically, they throw in a word that “feels right.” The best way to
            protect your streak is to stay methodical all the way through.
          </p>
          <p className="mt-4">
            If you are down to a few options, it can sometimes be smarter to play a scouting word that tests
            multiple possibilities rather than guessing one candidate at random.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">6. Practice improves pattern recognition</h2>
          <p className="mt-4">
            The more you play, the more familiar you become with common endings, frequent consonant clusters,
            and vowel patterns. That is why unlimited modes like Wordrama’s free play can be so helpful.
            Practice teaches you how to recognize traps, avoid bad guesses, and solve puzzles more efficiently.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Final thoughts</h2>
          <p className="mt-4">
            The best Wordle strategy is a mix of logic, consistency, and patience. Use strong starting words,
            gather information efficiently, think about letter position, and do not ignore repeated letters.
            Over time, these habits will improve your win rate and help you become a more confident player on Wordrama.
          </p>
          <p className="mt-4">
            Ready to put these tips into practice? Head back to <a href="/free-play" className="text-blue-500 hover:underline">free play</a> and test your strategy.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}