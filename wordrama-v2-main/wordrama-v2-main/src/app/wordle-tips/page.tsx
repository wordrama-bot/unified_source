"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function WordleTipsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={[
          { href: "/about", text: "About" },
          { href: "/free-play", text: "Wordle" },
          { href: "/signup", text: "SignUp" },
        ]}
      />

      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Wordle Tips for Better Scores</h1>
        <p className="text-sm text-gray-500">Last updated March 13, 2026</p>

        <p className="mt-4">
          Looking for a few easy ways to improve your game? These Wordle tips can help you solve puzzles
          faster, avoid common mistakes, and become more consistent. Whether you are new to Wordrama or
          already play daily, small adjustments can make a big difference.
        </p>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 1: Do not waste your first guess</h2>
          <p className="mt-4">
            Your first guess sets the tone for the entire puzzle. Choose a word that includes common letters
            and avoids duplicates. A strong opener gives you information you can use immediately.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 2: Use elimination as a strategy</h2>
          <p className="mt-4">
            Even if a guess is not close to the answer, it can still be very valuable if it rules out multiple
            letters. Good players understand that every guess should either confirm something or eliminate something.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 3: Think in patterns</h2>
          <p className="mt-4">
            Once you know a few letters, start thinking about likely word shapes and endings. Common endings like
            <strong> -ER</strong>, <strong> -LY</strong>, <strong> -ED</strong>, and <strong> -ING</strong> can help
            you narrow down the answer quickly. Pattern recognition is one of the fastest ways to improve.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 4: Be careful with repeated letters</h2>
          <p className="mt-4">
            Repeated letters are a classic trap. Just because you found one copy of a letter does not mean the
            word only contains it once. If your clues seem confusing, consider whether the answer may repeat a vowel
            or consonant.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 5: Slow down on the last two guesses</h2>
          <p className="mt-4">
            The easiest way to lose a streak is to rush at the end. When you only have one or two guesses left,
            stop and review everything you know. Look at confirmed letters, blocked positions, and letters you
            already ruled out. A calm final guess is usually better than a fast one.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 6: Practice in unlimited mode</h2>
          <p className="mt-4">
            Daily puzzles are fun, but unlimited play is where improvement really happens. Free play lets you try
            different opening words, experiment with strategy, and learn how to solve unusual patterns without
            risking your daily result.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 7: Learn from your losses</h2>
          <p className="mt-4">
            Every missed puzzle teaches you something. Maybe you ignored a repeated letter. Maybe you got stuck
            choosing between too many similar endings. Reviewing lost games can help you identify patterns in your
            mistakes and improve faster.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Tip 8: Find a system and stick to it</h2>
          <p className="mt-4">
            Consistency matters. Many strong players use a repeatable process: one reliable starting word, one
            information-focused second guess, and then logical narrowing based on tile feedback. A dependable system
            helps you stay focused under pressure.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Final thoughts</h2>
          <p className="mt-4">
            The best Wordle tips are simple: make deliberate guesses, use elimination wisely, watch for repeated
            letters, and stay patient. The more you practice, the more natural these habits become. Wordrama gives
            you plenty of ways to sharpen your skills, so keep playing and keep improving.
          </p>
          <p className="mt-4">
            Ready for another puzzle? Visit <a href="/free-play" className="text-blue-500 hover:underline">free play</a> and start testing your strategy.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}