"use client"
import Header from '@/sections/header';
import NavBar from "@/components/navbar/h-nav";
import PublicNav from "@/components/navbar/public-nav";
import { cn } from '@/lib/utils';
import aboutImg from './about.png';
import { useAuth } from '@/providers/auth-provider';
import Features from '@/sections/features';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Community from '@/sections/community';
import Games from '@/sections/games';
import Faq from '@/sections/faq';
import Footer from '@/sections/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
//import { getAppInsights } from '@/utils/appInsights';

import { useGetMyAccountQuery, useGetPublicPlayerQuery } from '@/redux/api/wordrama';
import { useGetReadinessQuery } from '@/redux/api/system';
import { User } from 'lucide-react';
import { showChristmas } from '@/lib/config';
import Snowfall from '@/components/Snowflake';

export default function AboutPage() {
  const { user } = useAuth();
  //getAppInsights().trackPageView({ name: 'About Page' });

  const Statistics = () => {
    interface statsProps {
      quantity: string;
      description: string;
    }

    const stats: statsProps[] = [
      {
        quantity: "2,500+",
        description: "Registered Players",
      },
      {
        quantity: "1.2M+",
        description: "Games Played",
      },
      {
        quantity: "17M+",
        description: "Coins Earned",
      },
      {
        quantity: "340+",
        description: "Customs Created",
      },
    ];

    return (
      <section id="statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ quantity, description }: statsProps) => (
            <div
              key={description}
              className="space-y-2 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold ">{quantity}</h2>
              <p className="text-xl text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      { showChristmas && <Snowfall /> }
      {user ? (
        <NavBar
          links={[
            { href: "/games", text: "Games" },
            { href: "/leaderboard", text: "Leaderboard" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/achievements", text: "Achievements" },
          ]}
        />
      ) : (
        <PublicNav
          links={[
            { href: "/", text: "Home" },
            { href: "/free-play", text: "Free Play" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/about", text: "About" },
            { href: "/signup", text: "Sign Up" },
          ]}
        />
      )}
      <section
        id="about"
        className="py-24 sm:py-32 mx-10"
      >
        <div className="border rounded-lg py-12 w-full">
          <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
            <img
              src={aboutImg.src}
              alt="Wordle"
              className="w-[300px] object-contain rounded-lg"
            />
            <div className="bg-green-0 flex flex-col justify-between">
              <div className="pb-6">
                <h2 className="text-center text-3xl md:text-4xl font-bold">
                  <span className="bg-clip-text">
                    About{" "}
                  </span>
                </h2>
                <p className="text-center text-xl text-muted-foreground mt-4">
                  Wordrama is a fun and fresh take on Wordle, and the only place where you can play with word packs from 4 to 23 letters! Whether you're just getting into word games or already a pro, Wordrama’s got challenges for everyone. With over 2.2K players, 60K+ games played, and 176K+ in-game coins earned, it’s quickly becoming a favorite among word puzzle fans. It’s also been streamed by a number of popular TikTok Live creators, adding to the buzz. With 24 unique word packs and Co-Wordle (a multiplayer mode) coming soon, there’s always something new and exciting to play!
                </p>
              </div>

              <Statistics />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-10 mb-16">
        <div className="border rounded-lg py-12 px-8">
          <h2 className="text-3xl font-bold mb-6">
            Why Wordrama Is Different
          </h2>

          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              Wordrama was built for players who wanted more from word games than a
              single five-letter puzzle each day. While classic Wordle inspired the
              experience, Wordrama expands the formula with multiple game modes,
              competitive features, community interaction, and customizable gameplay.
            </p>

            <p>
              One of the biggest differences is variety. Players can explore word
              packs ranging from 4-letter puzzles all the way up to 23-letter
              challenges. This creates a much wider range of difficulty levels and
              strategies compared to traditional daily word games.
            </p>

            <p>
              Wordrama also includes progression systems, achievements, leaderboards,
              in-game currency, and profile customization. The goal is to create a
              long-term social and competitive experience around word puzzles instead
              of a single quick daily activity.
            </p>

            <p>
              The platform has become especially popular among livestreamers and TikTok
              creators because of its interactive gameplay and community-driven
              competition. Players can compare scores, challenge friends, and compete
              for leaderboard rankings while improving vocabulary and pattern
              recognition skills.
            </p>

            <p>
              In addition to gameplay features, Wordrama also includes educational and
              skill-building benefits. Word puzzle games encourage logical reasoning,
              spelling recognition, vocabulary development, and strategic thinking.
              Many players use Wordrama as a daily mental exercise or as a way to stay
              mentally active while having fun.
            </p>

            <p>
              New features continue to be added regularly, including upcoming
              multiplayer experiences like Co-Wordle, expanded word packs, seasonal
              events, accessibility improvements, and premium customization options.
            </p>

            <p>
              Players looking to improve their skills can also explore our growing set
              of strategy resources and guides:
            </p>

            <ul className="list-disc ml-8">
              <li>
                <Link href="/how-to-play" className="text-blue-500 hover:underline">
                  How to Play Wordrama
                </Link>
              </li>
              <li>
                <Link href="/wordle-strategy" className="text-blue-500 hover:underline">
                  Wordle Strategy Guide
                </Link>
              </li>
              <li>
                <Link href="/best-starting-words" className="text-blue-500 hover:underline">
                  Best Starting Words
                </Link>
              </li>
              <li>
                <Link href="/wordle-tips" className="text-blue-500 hover:underline">
                  Wordle Tips
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Community />
      <Faq items={[
        { title: 'What is Wordrama?', content: 'Wordrama brings a new twist to the word game community by rebuilding well loved games with a modern style and adding competition. Made by the players for the players.' },
        { title: 'How do I play Wordrama?', content: 'Sign up with your email or Discord. Select a game to play. WIN!' },
        { title: 'How do I level up?', content: 'Complete games to earn XP. The more XP you earn, the higher your level.' },
        { title: 'What are beta features and releases?', content: 'Beta features and releases are new features and games that are still in development. Pro/Streamer subscribers can access these features and games before they are released to the wider community.' },
        { title: 'What are word packs?', content: 'Word packs are collections of words that you can use to win games. Word packs for words with 5-11 letters are free, with 4 letter, and 12-23 letter packs available for purchase.' },
        { title: 'What is streamer mode?', content: 'Streamer mode displays your stats in a more visually improved way for streaming on TikTok or other live platforms.' }
      ]}/>
      <Footer />
    </div>
  )
}
