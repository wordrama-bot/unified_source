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

export default function LandingPage() {
  const { user } = useAuth();
  // getAppInsights().trackPageView({ name: 'Landing Page' });

  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      { showChristmas && <Snowfall /> }
      <Header
        ctaLink='/free-play'
        ctaText='Play Now! 🎮'
        heroText='Play 🕹️ Challenge 🏆 Level Up 📈'
        showSocialIcons={true}
      />
      <Features />
      <Community />
      <Faq items={[
        { title: 'What is Wordrama?', content: 'Wordrama brings a new twist to the word game community by rebuilding well loved games with a modern style and adding competition. Made by the players for the players.' },
        { title: 'How do I play Wordrama?', content: 'Sign up. Select a game to play. WIN!' },
        { title: 'How do I level up?', content: 'Complete games to earn XP. The more XP you earn, the higher your level.' },
        { title: 'What are beta features and releases?', content: 'Beta features and releases are new features and games that are still in development. Pro/Streamer subscribers may be granted early access these features and games before they are released to the wider community.' },
        { title: 'What are word packs?', content: 'Word packs are collections of additional words that you can use to enrich your experience.'},
        { title: 'What is streamer mode?', content: 'Streamer mode is a set of features we are working on to provide you with more control over your Wordrama experience. For example optimizing your stats display for live streaming.' }
      ]}/>
      <Footer />
      <ThemeSwitcher />
      <Link href="/login">
        <Button
          size="icon"
          className="fixed left-10 top-10 z-50"
        >
          <User className="stroke-text h-6 w-6 w500:h-4 w500:w-4" />
        </Button>
      </Link>
    </div>
  )
}
