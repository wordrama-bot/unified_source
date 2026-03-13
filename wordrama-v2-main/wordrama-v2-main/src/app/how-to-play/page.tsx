"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function HowToPlayPage() {
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

        <h1 className="text-4xl font-bold mb-6">How to Play Wordrama</h1>

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

      <Footer />
    </div>
  );
}