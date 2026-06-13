"use client";

import PublicNav from "@/components/navbar/public-nav";
import Footer from "@/sections/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import NavBar from "@/components/navbar/h-nav";
import MarketplaceCategories from "@/sections/marketplace-categories";
import GoogleAd from "@/components/GoogleAd";
//import { getAppInsights } from '@/utils/appInsights';

export default function MarketplacePage() {
  //getAppInsights().trackPageView({ name: 'Marketplace' });

  const { user, session } = useAuth();

  if (user || session) {
    return (  
      <div className="flex min-h-screen w-full flex-col border:border bg-bg text-text dark:border-darkBorder dark:bg-darkBg dark:text-darkText">
        <NavBar
          links={[
            { href: "/games", text: "Games" },
            { href: "/leaderboard", text: "Leaderboard" },
            { href: "/marketplace", text: "Marketplace" },
            { href: "/achievements", text: "Achievements" },
            { href: "/teams", text: "Teams" },
          ]}
        />
        <header className="dark:bg-darkBg inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <div className="mx-auto w-container max-w-full px-5 text-center">
            <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
              Wordrama Marketplace
            </h1>
          </div>
          <div className="mx-auto w-container max-w-full px-5 text-center">
            <p className="mx-auto mt-4 max-w-3xl text-lg">
              Customize your Wordrama experience with unlockable cosmetics,
              themes, word packs, and player rewards.
            </p>
            <p className="mt-4">
              The Wordrama Marketplace is where players personalize their account
              and unlock new ways to enjoy the game. As Wordrama grows, the
              marketplace will support cosmetic items, custom avatars, appearance
              themes, keyboard styles, new word packs, and seasonal rewards.
            </p>
          </div>
        </header>
        <MarketplaceCategories categories={[]} />
        <Footer />
      </div>
    );
  }

  return (
    <>
      <PublicNav
        links={[
          { href: "/", text: "Home" },
          { href: "/free-play", text: "Quick Play" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
          { href: "/about", text: "About" },
          { href: "/signup", text: "Sign Up / In" },
        ]}
      />

      <main className="min-h-screen w-full bg-darkBg text-white">
        <header className="inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center bg-darkBg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
          <div className="mx-auto w-container max-w-full px-5 text-center">
            <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
              Wordrama Marketplace
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg">
              Customize your Wordrama experience with unlockable cosmetics,
              themes, word packs, and player rewards.
            </p>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-5 py-12">
          <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
            <h2 className="text-2xl font-bold">
              What is the Wordrama Marketplace?
            </h2>
            <p className="mt-4">
              The Wordrama Marketplace is where players personalize their account
              and unlock new ways to enjoy the game. As Wordrama grows, the
              marketplace will support cosmetic items, custom avatars, appearance
              themes, keyboard styles, new word packs, and seasonal rewards.
            </p>
            <p className="mt-4">
              Marketplace items are designed to enhance the player experience
              without changing the core fairness of the game. Wordrama is still
              built around word skill, strategy, streaks, and friendly competition.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Unlock cosmetics</h2>
              <p className="mt-3">
                Personalize your Wordrama profile with avatars, visual styles,
                and other cosmetic rewards that help your account feel like your
                own.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Explore word packs</h2>
              <p className="mt-3">
                Wordrama supports multiple word lengths and specialty packs, giving
                players more ways to practice, compete, and challenge themselves.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Earn and spend coins</h2>
              <p className="mt-3">
                Coins are part of Wordrama&apos;s rewards system. Players can use
                coins to unlock eligible marketplace items as new content becomes
                available.
              </p>
            </div>

            <div className="rounded-lg border border-darkBorder bg-darkBg/80 p-6 shadow-dark">
              <h2 className="text-xl font-semibold">Build your player identity</h2>
              <p className="mt-3">
                Marketplace rewards work alongside stats, streaks, leaderboards,
                friends, and teams to make Wordrama feel more personal and social.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <GoogleAd
              client="ca-pub-8970369628667981"
              slot="8219203779"
              minHeight={280}
            />
          </div>

          <section className="mt-10 rounded-lg border border-darkBorder bg-darkBg/80 p-6 text-center shadow-dark">
            <h2 className="text-2xl font-bold">Want to access the marketplace?</h2>
            <p className="mx-auto mt-4 max-w-3xl">
              Create a free Wordrama account to save your progress, track your
              stats, join the community, and access marketplace features as they
              become available.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Create a Free Account</Button>
              </Link>
              <Link href="/free-play">
                <Button size="lg" variant="neutral">
                  Quick Play
                </Button>
              </Link>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
}
