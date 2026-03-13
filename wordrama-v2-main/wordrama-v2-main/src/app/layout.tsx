"use client"
import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from "react-redux";

//import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import AuthProvider from '@/providers/auth-provider';
import { store } from '@/redux/config/store';
import { usePathname } from "next/navigation";
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip';
import GoogleAdsense from '@/components/adsense';
import { ErrorBoundary } from '@/components/error-boundary';
import CookieConsentBanner from '@/components/cookie-consent';

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
  usePathname(); // keeps this layout reactive to route changes if needed later

  const [isCookiesVisible, setIsCookiesVisible] = useState(true);

  useEffect(() => {
    const openPreferences = () => {
      setIsCookiesVisible(true);
    };

    window.addEventListener("open-cookie-preferences", openPreferences);

    return () => {
      window.removeEventListener("open-cookie-preferences", openPreferences);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Wordrama | The ultimate wordle website!</title>

        <meta
          name="description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Wordrama.io" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />

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
        <meta
          property="twitter:image"
          content="https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW"
        />
        <meta
          property="twitter:card"
          content="https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW"
        />
        <meta
          property="twitter:title"
          content="Wordrama | The ultimate wordle website!"
        />
        <meta
          property="twitter:description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta name="og:url" content="https://wordrama.io" />
        <meta name="og:type" content="website" />
        <meta name="og:site_name" content="Wordrama" />
        <meta name="og:locale" content="en_GB" />

        <link
          rel="icon"
          type="image/png"
          href="https://utfs.io/f/vieUBZcrouNZrmip0kaZeu5pTQIN4qBcCkAntERPya0X3zbF"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://utfs.io/f/vieUBZcrouNZc25QPDxBaLH6F1bimkIMgCOGuS2Y7D9TlqQh"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://utfs.io/f/vieUBZcrouNZAQlt9XNmP3TuOXi7nZhtDBRLWH94oYU0IaCq"
        />
        <meta name="apple-mobile-web-app-title" content="Wordrama" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="preconnect" href="https://api.wordrama.io" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://js.monitor.azure.com" />
        <link rel="preconnect" href="https://fundingchoicesmessages.google.com" />
        <link rel="preconnect" href="https://qflfxxbnhwaxkxsygjqu.supabase.co" />

        <GoogleAdsense pId="8970369628667981" />
      </head>

      <body className={dmSans.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" disableTransitionOnChange>
            <AuthProvider>
              <ReduxProvider store={store}>
                <TooltipProvider>
                  {isCookiesVisible && <CookieConsentBanner />}
                  {children}
                </TooltipProvider>
                <Toaster />
              </ReduxProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}