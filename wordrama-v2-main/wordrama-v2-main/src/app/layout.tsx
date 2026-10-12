import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";

import AppProviders from "@/providers/app-providers";
import GoogleAdsense from "@/components/adsense";

const dmSans = DM_Sans({ subsets: ["latin"] });

const siteUrl = "https://wordrama.io";

const siteTitle =
  "Wordrama | Free Daily Word Game & Wordle Alternative";

const siteDescription =
  "Play Wordrama, a free daily word game and Wordle alternative with classic 5-letter puzzles, longer word challenges, free play, achievements, teams, custom themes, and word packs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: siteTitle,

  description: siteDescription,

  applicationName: "Wordrama",
  authors: [{ name: "Wordrama.io" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Wordrama",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/wordrama-logo-letter-large.png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      "/images/wordrama-logo-letter-large.png",
    ],
  },

  icons: {
    icon: [
      {
        url: "/images/wordrama-logo-letter-small.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/images/wordrama-logo-letter-large.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/images/wordrama-logo-letter-small.png",
        sizes: "180x180",
      },
    ],
  },

  manifest: "/site.webmanifest",

  appleWebApp: {
    title: "Wordrama",
  },

  other: {
    "google-adsense-account": "ca-pub-8970369628667981",
    "msapplication-TileColor": "#ffffff",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Wordrama",
  url: siteUrl,
  logo:
    "https://wordrama.io/images/wordrama-logo-letter-small.png",
  description:
    "Wordrama is an online word puzzle and vocabulary game platform featuring daily puzzles, multiplayer gameplay, leaderboards, statistics, and educational word game content.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Wordrama",
  url: siteUrl,
  description:
    "Play Wordrama online and explore daily word puzzles, strategy guides, multiplayer word games, and vocabulary-building gameplay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <link
          rel="preconnect"
          href="https://api.wordrama.io"
        />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
        <link
          rel="preconnect"
          href="https://js.monitor.azure.com"
        />
        <link
          rel="preconnect"
          href="https://fundingchoicesmessages.google.com"
        />
        <link
          rel="preconnect"
          href="https://qflfxxbnhwaxkxsygjqu.supabase.co"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TZGVP6PMBC"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TZGVP6PMBC');
          `}
        </Script>
      </head>

      <body className={dmSans.className}>
        <AppProviders>{children}</AppProviders>
        <GoogleAdsense pId="8970369628667981" />
      </body>
    </html>
  );
}
