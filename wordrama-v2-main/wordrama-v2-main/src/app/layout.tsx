"use client"
import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from "react-redux";

//import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import AuthProvider from '@/providers/auth-provider';
import AppInsightsProvider from '@/providers/ai-provider';
import { store } from '@/redux/config/store';
import { usePathname } from "next/navigation";
import SplashScreen from "@/components/splash";
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip';
import GoogleAdsense from '@/components/adsense';
import { ErrorBoundary } from '@/components/error-boundary';
import CookieConsentBanner from '@/components/cookie-consent';
import { showChristmas } from '@/lib/config';
//import Snowfall from '@/components/snowfall';
const dmSans = DM_Sans({ subsets: ['latin'] })

/* const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Wordrama",
  description: "",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const isPolicyPage = pathname === "/cookies" || pathname === "/terms-of-use" || pathname === "/privacy-policy";
  //const [isLoading, setIsLoading] = useState(isHome);

  const [isCookiesVisible, setIsCookiesVisible] = useState(true);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     // Change 300 to the scroll position where you want to show the element
  //     if (scrollTop > 300) {
  //       setIsCookiesVisible(true);
  //     } else {
  //       setIsCookiesVisible(false);
  //     }
  //   };

  //   // Add scroll event listener
  //   window.addEventListener('scroll', handleScroll);

  //   // Clean up event listener on unmount
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  //

  return (
    <html lang="en">
      <head>
        <title>Wordrama | The ultimate wordle website!</title>
        <meta
          name="description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta
          name='robots'
          content='index, follow'
        />
        <meta
          name="keywords"
          content="nyt games unlimited, myt gameplay, wordle sites, word of the day game, best wordle games, wordle vs friends, wordle uk, wordle uk app, safari wordle, is wordle, wordle sites, where can I play wordle for free, is wordle free, wordle leaderboards, wordle leaderboard, wordle game with leaderboard, wordle challenge, wordle unlimited unblocked 77, wordle io game, daily wordle games, online unlimited games, daily wordle today free, continuous wordle, wordle any time, wordle a word game, new york times wordle unlimited, unlimited wordle unblocked, unlimited wordle free, wordle puzzles unlimited, online wordle unlimited, easy wordle unlimited, wordle for free unlimited, wordle unlimited downloadable content, unlimited wordle app, wordle today unlimited, play wordle unlimited, free wordle unlimited, wordle free unlimited, endless wordle, wordle game unlimited, daily sequence online free, 5 letter word guessing game, unblocked wordle, wordle practice online, free wordle games online,	wordle unblocked unlimited, wordle unlimited unblocked google sites, wordle unlimited app, wordle forever, go to wordle, play wordle with friends, where can I play unlimited wordle, unlimited wordle games, wordle game online, wordle free, unblocked games, educational games, letter box game free, letter box game, grid, cell, 4 letters, 4 letter wordle, 5 letters, 5 letter wordle, 6 letter, 6 letter wordle, 7 letter, 7 letter wordle, 8 letter, 8 letter wordle, 9 letter, 9 letter wordle, 10 letter, 10 letter wordle, 11 letter, 11 letter wordle, 12 letter, 12 letter wordle, 13 letter, 13 letter wordle, 14 letter, 14 letter wordle, 15 letter, 15 letter wordle, 16 letter, 16 letter wordle, 17 letter, 17 letter wordle, 18 letter, 18 letter wordle, 19 letter, 19 letter wordle, 20 letter, 20 letter wordle, 21 letter, 21 letter wordle, 22 letter, 22 letter wordle, 23 letter, 23 letter wordle, 4 letter words, 5 letter words, 6 letter words, 7 letter words, 8 letter words, 9 letter words, 10 letter words, 11 letter words, 12 letter words, 13 letter words, 14 letter words, 15 letter words, 16 letter words, 17 letter words, 18 letter words, 19 letter words, 20 letter words, 21 letter words, 22 letter words, 23 letter words, wordlee, wordrama, wordrama.io, wordrama io, cowordle, co wordle, wordle unlimted, wordle, custom wordle, where can i create custom wordles, game spelling bee, free games, online word games, daily word puzzle, word challenge, brain games, free online puzzles, multiplayer word games, word guessing games, puzzle games, educational games, wordplay, word games for kids, word games for adults, fun word games, word search, anagrams, crossword puzzles"
        />
        <meta
          name="author"
          content="Wordrama.io"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="theme-color"
          content="#ffffff"
        />
        <meta
          name="msapplication-TileColor"
          content="#ffffff"
        />
        <meta
          name="og:title"
          content="Wordrama | The ultimate wordle website!"
        />
        <meta
          name="og:description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta
          name="og:image"
          content="https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW"
        />
        <meta property="twitter:image" content='https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW' />
        <meta property="twitter:card" content='https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW' />
        <meta property="twitter:title" content='Wordrama | The ultimate wordle website!' />
        <meta property="twitter:description" content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!" />
        <meta
          name="og:url"
          content="https://wordrama.io"
        />
        <meta
          name="og:type"
          content="website"
        />
        <meta
          name="og:site_name"
          content="Wordrama"
        />
        <meta
          name="og:locale"
          content="en_GB"
        />
        <link rel="icon" type="image/png" href="https://utfs.io/f/vieUBZcrouNZrmip0kaZeu5pTQIN4qBcCkAntERPya0X3zbF" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="https://utfs.io/f/vieUBZcrouNZc25QPDxBaLH6F1bimkIMgCOGuS2Y7D9TlqQh" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://utfs.io/f/vieUBZcrouNZAQlt9XNmP3TuOXi7nZhtDBRLWH94oYU0IaCq" />
        <meta name="apple-mobile-web-app-title" content="Wordrama" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://api.wordrama.io" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://js.monitor.azure.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />
        <link rel="preconnect" href="https://qflfxxbnhwaxkxsygjqu.supabase.co" />
        <GoogleAdsense pId='2296158652555597'/>
      </head>
      <body className={dmSans.className}>
        {/* <AppInsightsProvider> */}
          <ErrorBoundary>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              <AuthProvider>
                <ReduxProvider store={store}>
                  {/* {isLoading && isHome ? (
                    <SplashScreen finishLoading={() => setIsLoading(false)} />
                  ) : ( */}
                    <>
                      <TooltipProvider>
                        {!isPolicyPage && isCookiesVisible &&
                          <CookieConsentBanner />
                        }
                        { children }
                      </TooltipProvider>
                    </>
                  {/* )} */}
                  <Toaster />
                </ReduxProvider>
              </AuthProvider>
            </ThemeProvider>
          </ErrorBoundary>
        {/* </AppInsightsProvider> */}
      </body>
    </html>
  )
}
