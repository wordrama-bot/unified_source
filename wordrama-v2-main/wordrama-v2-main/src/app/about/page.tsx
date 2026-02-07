"use client"
import Header from '@/sections/header';
import NavBar from "@/components/navbar/public-nav";
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
        quantity: "2.3K+",
        description: "Players",
      },
      {
        quantity: "60K+",
        description: "Games Played",
      },
      {
        quantity: "176K+",
        description: "In game coins earned",
      },
      {
        quantity: "100+",
        description: "Customs created",
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
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      { showChristmas && <Snowfall /> }
      <NavBar
        links={user ? [
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          //{ href: "/teams", text: "Teams" },
        ] : [
            { href: "/about", text: "About" },
            { href: "/free-play", text: "Wordle" },
            { href: "/signup", text: "SignUp" },
          ]
        }
      />
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
      <Features />
      <Community />
      <Faq items={[
        { title: 'What is Wordrama?', content: 'Wordrama brings a new twist to the word game community by rebuilding well loved games with a modern style and adding competition. Made by the players for the players.' },
        { title: 'How do I play Wordrama?', content: 'Sign up. Select a game to play. WIN!' },
        { title: 'How do I level up?', content: 'Complete games to earn XP. The more XP you earn, the higher your level.' },
        { title: 'What are beta features and releases?', content: 'Beta features and releases are new features and games that are still in development. Pro/Streamer subscribers can access these features and games before they are released to the wider community.' },
        { title: 'What are word packs?', content: 'Word packs are collections of words that you can use to in games. Word packs are categorised e.g. Place names, football teams, foods etc. Pro/Streamer subscribers can access premium packs for free.'},
        { title: 'What is streamer mode?', content: 'Streamer mode is a set of features to provide you more control over your Wordrama experience. For example adding your socials to your profile.' }
      ]}/>
      <Footer />
    </div>
  )
}
