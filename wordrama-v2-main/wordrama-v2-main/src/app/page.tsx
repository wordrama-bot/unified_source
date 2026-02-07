"use client"
import { useAuth } from '@/providers/auth-provider';
import Features from '@/sections/features';
import { ThemeSwitcher } from '@/components/theme-switcher';
import NavBar from '@/components/navbar/h-nav';
import PublicNav from '@/components/navbar/public-nav';
import { Wordle, SpellBee, More as MoreGames } from '@/components/assets';
import Header from '@/sections/header';
import { ChristmasHeader } from '@/sections/header';
//import { HalloweenHeader } from '@/sections/header';
import Community from '@/sections/community';
import Games from '@/sections/games';
import Faq from '@/sections/faq';
import Pricing from '@/sections/pricing';
import Loading from '@/sections/loading';
import SetupProfile from '@/sections/first-login';
import MigrationCard from '@/sections/migration';
import HomeLeaderboard from '@/sections/leaderboards';
import Footer from '@/sections/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
//import { getAppInsights } from '@/utils/appInsights';
import WordleGame from '@/components/freePlay';
import Image from 'next/image';
import { useEffect } from "react";

import { useGetMyAccountQuery, useGetPublicPlayerQuery } from '@/redux/api/wordrama';
import { useGetReadinessQuery } from '@/redux/api/system';
import { User } from 'lucide-react';
import { showChristmas } from '@/lib/config';
import Snowfall from '@/components/Snowflake';

// function PublicHome() {
//   getAppInsights().trackPageView({ name: 'Public Homepage' });
//   return (
//     <>
//       { showChristmas && <Snowfall /> }
//       <Header
//         ctaLink='/free-play'
//         ctaText='Play Now! 🎮'
//         heroText='Play 🕹️ Challenge 🏆 Level Up 📈'
//         showSocialIcons={true}
//       />
//       <Features />
//       <Community />
//       <Faq items={[
//         { title: 'What is Wordrama?', content: 'Wordrama brings a new twist to the word game community by rebuilding well loved games with a modern style and adding competition. Made by the players for the players.' },
//         { title: 'How do I play Wordrama?', content: 'Sign up. Select a game to play. WIN!' },
//         { title: 'How do I level up?', content: 'Complete games to earn XP. The more XP you earn, the higher your level.' },
//         { title: 'What are beta features and releases?', content: 'Beta features and releases are new features and games that are still in development. Pro/Streamer subscribers can access these features and games before they are released to the wider community.' },
//         { title: 'What are word packs?', content: 'Word packs are collections of words that you can use to in games. Word packs are categorised e.g. Place names, football teams, foods etc. Pro/Streamer subscribers can access premium packs for free.'},
//         { title: 'What is streamer mode?', content: 'Streamer mode is a set of features to provide you more control over your Wordrama experience. For example adding your socials to your profile.' }
//       ]}/>
//       {/* <Pricing /> */}
//       <Footer />
//       <ThemeSwitcher />
//       <Link href="/login">
//         <Button
//           size="icon"
//           className="fixed left-10 top-10 z-50"
//         >
//           <User className="stroke-text h-6 w-6 w500:h-4 w500:w-4" />
//         </Button>
//       </Link>
//     </>
//   )
// }

function PublicHome() {
  return (
    <>
      <PublicNav links={[
        { href: '/about', text: 'About' },
        { href: '/login', text: 'Login' },
        { href: '/signup', text: 'Sign Up' },
      ]}/>
      <WordleGame />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6">Wordrama: The Best Wordle Site (in our humble opinion)</h1>
          <p className="text-sm text-gray-500">Not affiliated with the original Wordle website.</p>

          <section className="my-8  flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold">Wordrama is the ultimate word-guessing site?!</h2>
            <p className="mt-2 text-center">While we’re not affiliated with the original Wordle, we bring a fresh take by implementing exciting features like cross-device stats, streaks, 4-23 letter word packs, leaderboards, a friends system, a leveling system, and even streamer teams. With many TikTok streamers already on our platform, Wordrama offers a unique and social twist on the classic game you know and love.</p>
            <p className="mt-4 text-center">Playing Wordrama is easy to start but endlessly rewarding. For each game, you’ll see a word of a chosen length, and your goal is to guess it. With each attempt, feedback is provided such as, letters that are in the correct position light up in green, letters that are part of the word but in the wrong position turn yellow, and incorrect letters are greyed out. This hint-based system helps you narrow down the word with each guess.</p>
          </section>

          <section className="my-8  flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold">How is Wordrama different from all the other Wordle website?</h2>
            <p className="mt-2 text-center">With Wordrama’s tracking features, each game won builds your streak and boosts your level. You can monitor your stats across devices, climb up the leaderboard, and compare your skills with friends and the global community. Our friends system lets you play alongside others, whilst streamer teams give you a chance to connect with and compete alongside your favorite TikTok creators. From daily challenges to custom games, Wordrama has a mode for every player.</p>
            <p className="mt-2 text-center">Ready to dive in? Whether you’re looking to improve your skills, challenge friends, or explore unique word packs, Wordrama brings you a fun, social experience that reimagines the classic word game.</p>
          </section>

          <section className="my-8  flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold">How to Play Wordrama?</h2>
              <p className="mt-2 text-center">Playing Wordrama is simple and intuitive, making it accessible for players of all levels. Each game presents you with a word of a specific length, determined by the pack you've selected (ranging from 4 to 23 letters). Your goal is to guess the word by entering other words of the same length.</p>

              <p className="mt-2 text-center">With each attempt, you receive valuable feedback through a color-coding system:</p>
              <ul className="mt-2 list-disc list-inside text-center">
                  <li className="mt-2"><strong className='text-green-400'>Green:</strong> Letters that are in the correct position are highlighted in green. This indicates that you’ve guessed that letter correctly and placed it in the right spot.</li>
                  <li className="mt-2"><strong className='text-yellow-300'>Yellow:</strong> Letters that are part of the word but in the wrong position are marked in yellow. This tells you that the letter is in the word, but you need to find its correct placement.</li>
                  <li className="mt-2"><strong className='text-slate-500'>Grey:</strong> Incorrect letters are greyed out, meaning they are not part of the word at all. Use this information to eliminate possibilities and refine your guesses.</li>
              </ul>

              <Image src="https://utfs.io/f/vieUBZcrouNZl1Z6dPEXuxhLbEmnAdrKYfCloM98G04ykiPz" alt="Wordrama gameplay" width={600} height={200} className="mt-4 border-hidden" />

              <p className="mt-2">Utilize these hints strategically to narrow down your guesses and identify the word before you run out of attempts!</p>

              <p className="mt-2 text-center">In daily mode, all players tackle the same word each day, creating an environment of friendly competition. If you’re looking to practice, you can also explore unlimited mode to hone your skills or try custom word packs for a tailored challenge.</p>
          </section>

          <section className="my-8 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-center">Tips for Success in Wordrama</h2>
              <p className="mt-2 text-center">Your initial guess is crucial; Select a strong starting word that ideally contains at least three vowels to maximise your options.</p>

              <h3 className="mt-4 font-semibold">Suggested Words:</h3>
              <ul className="mt-2 list-disc list-inside">
                  <li className="mt-2">PINKY</li>
                  <li className="mt-2">LASER</li>
                  <li className="mt-2">COUTH</li>
                  <li className="mt-2">ABODE</li>
                  <li className="mt-2">AUDIO</li>
                  <li className="mt-2">HOKEY</li>
              </ul>

              <p className="mt-4">Analyse your guesses; Commonly used letters can provide useful clues.</p>

              <h3 className="mt-4 font-semibold">Potential Word Combinations:</h3>
              <ul className="mt-2 list-disc list-inside">
                  <li className="mt-2">CAUSE</li>
                  <li className="mt-2">CREEP</li>
                  <li className="mt-2">GRILL</li>
                  <li className="mt-2">HAPPY</li>
                  <li className="mt-2">GREEN</li>
              </ul>

              <p className="mt-4 text-center">Utilise the colour coding: Create a list of possible words using letters marked in green and yellow with a focus on vowels and consonants that commonly go together.</p>
          </section>


          <section className="my-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold">Join the Wordrama Community</h2>
            <p className="mt-2 text-center">Wordrama isn’t just a game; it’s a growing community of word lovers and puzzle enthusiasts. Compete with friends, form or join streamer teams, and meet new people through your shared passion for wordplay. With a dedicated leaderboard, you can see how you rank against others, push your skills, and enjoy friendly rivalries. Our unique leveling system keeps track of your achievements and rewards you as you improve, adding a sense of accomplishment and growth to each win.</p>
            <p className="mt-2 text-center">Whether you’re a casual player or a seasoned word puzzle enthusiast, Wordrama is here to provide hours of challenging, engaging, and social gameplay that’s fun for all ages. Start playing today, and see how Wordrama redefines the word puzzle experience!</p>
          </section>
      </div>
      <Footer />
      <Link href="/login">
        <Button
          size="icon"
          className="fixed left-4 top-20 z-50"
        >
          <User className="stroke-text h-6 w-6 w500:h-4 w500:w-4" />
        </Button>
      </Link>
    </>
  );
}

function AuthenticatedHome() {
  //getAppInsights().trackPageView({ name: 'Signed In Homepage' });
  const { role, user } = useAuth();
  const { data: myAccount, isLoading, error } = useGetMyAccountQuery();

  if (isLoading) return (
    <>
      <Loading />
      <Footer />
    </>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      { showChristmas && <Snowfall /> }
      <NavBar
        links={[
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams"}
        ]}
      />
      { !showChristmas && (
        <Header
          heroText={`Welcome back${myAccount?.data?.displayName ? `, ${myAccount?.data?.displayName}` : ''}`}
          showLogo={false}
          className='min-h-[20dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
        />
      )}
      { showChristmas && (
        <ChristmasHeader
          heroText={`${myAccount?.data?.displayName ? `, ${myAccount?.data?.displayName}` : ''}`}
          showLogo={true}
          logo="https://utfs.io/f/vieUBZcrouNZHgZwgWPc5QTiy9PYrsMqS3jRhEFC148IZDw0"
          className='min-h-[20dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
        />
      )}
      <HomeLeaderboard />
      <Games
        games={role != 'PLAYER' ? [{
          title: 'Wordrama',
          link: '/games/wordrama',
          Icon: Wordle,
          text: '4-23 letter Daily, Infinite & Custom modes.',
        }
        /*,{
          title: 'Guess the word',
          link: '/games/guess-the-word',
          Icon: SpellBee,
          text: 'Guess the word from the clues given.',
          } */,{
          title: 'More Games',
          link: '/games',
          Icon: MoreGames,
          text: 'View our full library.',
        }] : [{
          title: 'Wordrama',
          link: '/games/wordrama',
          Icon: Wordle,
          text: '4-23 letter Daily, Infinite & Custom modes.',
        }/*,{
          title: 'Spell Bee',
          link: '/games/spellbee',
          Icon: SpellBee,
          text: 'Spell Bee Daily & Infinite.',
        },{
          title: 'Subscribe to access more games',
          link: '/',
          Icon: MoreGames,
          text: 'Upgrade to Casual or Pro/Streamer',
          } */]}
      />
      <Footer />
    </div>
  )
}

function FirstSetup() {
  //getAppInsights().trackPageView({ name: 'First Login Homepage' });
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar isFirstLogin={true} />
      <SetupProfile />
      <Footer />
    </div>
  )
}

function Migrate() {
  //getAppInsights().trackPageView({ name: 'Migration' });
  return (
    <div className="flex min-h-screen w-full flex-col">
      <NavBar isFirstLogin={true} />
      <MigrationCard />
      <Footer />
    </div>
  )
}

function Authenticated() {
  const { user } = useAuth();
  const { data: readiness } = useGetReadinessQuery();
  const { data: myAccount, isLoading, refetch } = useGetPublicPlayerQuery(user?.id);

  if (readiness?.status !== 'ok') return (
    <>
      <Header
        heroText="Oops... Something went wrong"
        ctaText="Try again"
        ctaLink="/login"
      />
      <Footer />
    </>
  );

  if (myAccount?.data?.hasMigrated === false) return <Migrate />
    else if (myAccount?.status === 200) return <AuthenticatedHome />
    else if (myAccount?.status !== 200 && user) return <FirstSetup />
    else if (myAccount?.status !== 200 && !user) return <PublicHome />

  return (
    <>
      <Loading />
      <Footer />
    </>
  );
}

export default function Home() {
  const { user } = useAuth();
  if (user) return <Authenticated />

  return <PublicHome />
}
