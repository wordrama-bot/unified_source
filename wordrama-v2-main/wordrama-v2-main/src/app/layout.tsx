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
        <meta name="google-adsense-account" content="ca-pub-8970369628667981" />

        <meta
          property="og:title"
          content="Wordrama | The ultimate wordle website!"
        />
        <meta
          property="og:description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta
          property="og:image"
          content="https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW"
        />
        <meta property="og:url" content="https://wordrama.io" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Wordrama" />
        <meta property="og:locale" content="en_GB" />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Wordrama | The ultimate wordle website!"
        />
        <meta
          name="twitter:description"
          content="Play Wordrama, the ultimate Wordle game. Join 2.2K+ players and explore 24 unique word packs. With Co-Wordle multiplayer mode coming soon and popular TikTok Live streamers joining the fun, there's always something exciting happening. Test your word skills today!"
        />
        <meta
          name="twitter:image"
          content="https://utfs.io/f/vieUBZcrouNZecqr9f6GFUI7HjZNEsYv0gwLPp1f8ory5MSW"
        />

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