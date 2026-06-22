"use client"
import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from "react-redux";

import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import AuthProvider from '@/providers/auth-provider';
import { store } from '@/redux/config/store';
import { usePathname } from "next/navigation";
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import GoogleAdsense from '@/components/adsense';
import { ErrorBoundary } from '@/components/error-boundary';
import CookieConsentBanner from '@/components/cookie-consent';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  usePathname();

  const [isCookiesVisible, setIsCookiesVisible] = useState(true);
  const [cookieBannerKey, setCookieBannerKey] = useState(0);

  useEffect(() => {
    const openPreferences = () => {
      setIsCookiesVisible(false);

      window.setTimeout(() => {
        setCookieBannerKey((prev) => prev + 1);
        setIsCookiesVisible(true);
      }, 0);
    };

    window.addEventListener("open-cookie-preferences", openPreferences);

    return () => {
      window.removeEventListener("open-cookie-preferences", openPreferences);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Wordrama | Free Daily Word Game & Wordle Alternative</title>

        <meta
          name="description"
          content="Play Wordrama, a free daily word game and Wordle alternative with classic 5-letter puzzles, longer word challenges, free play, achievements, teams, custom themes, and word packs."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Wordrama.io" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="google-adsense-account" content="ca-pub-8970369628667981" />

        <meta
          property="og:title"
          content="Wordrama | Free Daily Word Game & Wordle Alternative"
        />
        <meta
          property="og:description"
          content="Play Wordrama, a free daily word game and Wordle alternative with classic 5-letter puzzles, longer word challenges, free play, achievements, teams, custom themes, and word packs."
        />
        <meta
          property="og:image"
          content="https://wordrama.io/images/wordrama-logo-letter-large.png"
        />
        <meta property="og:url" content="https://wordrama.io" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wordrama" />
        <meta property="og:locale" content="en_US" />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Wordrama | Free Daily Word Game & Wordle Alternative"
        />
        <meta
          name="twitter:description"
          content="Play Wordrama, a free daily word game and Wordle alternative with classic 5-letter puzzles, longer word challenges, free play, achievements, teams, custom themes, and word packs."
        />
        <meta
          name="twitter:image"
          content="https://wordrama.io/images/wordrama-logo-letter-large.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Wordrama",
              url: "https://wordrama.io",
              logo: "https://wordrama.io/images/wordrama-logo-letter-small.png",
              description:
                "Wordrama is an online word puzzle and vocabulary game platform featuring daily puzzles, multiplayer gameplay, leaderboards, statistics, and educational word game content."
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Wordrama",
              url: "https://wordrama.io",
              description:
                "Play Wordrama online and explore daily word puzzles, strategy guides, multiplayer word games, and vocabulary-building gameplay."
            }),
          }}
        />

        <link
          rel="icon"
          type="image/png"
          href="/images/wordrama-logo-letter-small.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/images/wordrama-logo-letter-large.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/wordrama-logo-letter-small.png"
        />
        <meta name="apple-mobile-web-app-title" content="Wordrama" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="canonical" href="https://wordrama.io" />

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
                  {isCookiesVisible && (
                    <CookieConsentBanner
                      key={cookieBannerKey}
                      forceOpen={cookieBannerKey > 0}
                    />
                  )}
                  {children}
                </TooltipProvider>
                <Toaster />
              </ReduxProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}