import {
  CircleUser, Menu, Coins, Trophy
} from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenuDropDown from "@/components/navbar/user-menu";
import { useGetMyAccountQuery } from "@/redux/api/wordrama";
import { useGetMyEntitlementsQuery } from "@/redux/api/wordrama";
import { useGetCurrentSubscriptionQuery } from "@/redux/api/wordrama";
import { hasEntitlement } from "@/lib/entitlements";
import { FEATURES } from "@/config/features";
import { useMarketplaceAccess } from "@/lib/useMarketplaceAccess";

import { showChristmas } from '@/lib/config';

import { GameThemeLogo } from "@/components/wordle/components/GameThemeLogo";
import type { getAppearanceTheme } from "@/config/themes";

export default function NavBar({
  links = [],
  isFirstLogin = false,
  themeClassName,
  gameAppearanceTheme,
}: {
  links?: { href: string, text: string }[];
  isFirstLogin?: boolean;
  themeClassName?: string;
  gameAppearanceTheme?: ReturnType<typeof getAppearanceTheme>;
}) {
  const { data: user, error } = useGetMyAccountQuery();
  const { data: subscriptionResponse } = useGetCurrentSubscriptionQuery();
  const currentSubscription =
    subscriptionResponse?.data?.subscription;
  const {
    subscriptionKey,
    isPlus,
    isCreator,
  } = useMarketplaceAccess();
  const upgradeLabel =
    isCreator
      ? "Creator ✓"
      : isPlus
        ? "Upgrade to Creator"
        : "Upgrade";
  const handleUpgradeClick = () => {
    if (isCreator) {
      window.location.href = "/settings/billing";
    } else {
      window.location.href = "/subscribe";
    }
  };
  const menuBackgroundColor = themeClassName?.match(
    /(?:^|\s)bg-\[(#[0-9a-fA-F]{3,8})\](?=\s|$)/
  )?.[1];
  const headerIconColorClass =
    gameAppearanceTheme?.app.text || "text-text dark:text-darkText";

  return (
    <header
      className={`sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 ${
        themeClassName ??
        "bg-bg dark:bg-darkBg text-text dark:text-darkText dark:border-darkBorder"
      }`}
    >
      <nav
        className={`hidden ${
          user ? "md:flex" : ""
        } flex-col gap-6 text-lg font-medium md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6`}
      >
        <Link
          href="/"
          className={`whitespace-nowrap transition-colors ${
            themeClassName
              ? "text-current hover:underline"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Dashboard
        </Link>

        {links.map((link, linkIdx) => (
          <Link
            key={`mm-${linkIdx}`}
            href={link.href}
            className={`whitespace-nowrap transition-colors ${
              themeClassName
                ? "text-current hover:underline"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.text}
          </Link>
        ))}
      </nav>

      <Sheet>
        {!isFirstLogin && !error && (
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className={`h-5 w-5 ${headerIconColorClass}`} />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
        )}

        <SheetContent
          side="left"
          className={themeClassName ? `${themeClassName} overflow-y-auto` : "overflow-y-auto"}
          style={{ backgroundColor: menuBackgroundColor }}
        >
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center gap-2">
              {gameAppearanceTheme ? (
                <GameThemeLogo
                  theme={gameAppearanceTheme}
                  className="h-auto w-[250px] max-w-full"
                />
              ) : (
                <Image
                  src={
                    showChristmas
                      ? "/images/wordrama-logo-christmas.png"
                      : "/images/wordrama-logo.png"
                  }
                  width={250}
                  height={50}
                  alt="Wordrama Logo"
                />
              )}
            </div>

            <Link
              href="/"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Dashboard
            </Link>

            {links.map((link, linkIdx) => (
              <Link
                key={`sb-${linkIdx}`}
                href={link.href}
                className={
                  themeClassName
                    ? "text-current hover:underline"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                {link.text}
              </Link>
            ))}

            <Link
              href="/how-to-play"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              How to Play
            </Link>
            <Link
              href="/wordle-strategy"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Wordle Strategy
            </Link>
            <Link
              href="/best-starting-words"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Best Starting Words
            </Link>
            <Link
              href="/wordle-tips"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Wordle Tips
            </Link>

            <a
              href="/contact"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Contact Us
            </a>

            <Link
              href="/privacy-policy"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms-of-use"
              className={
                themeClassName
                  ? "text-current hover:underline"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Terms of Use
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {!isFirstLogin && !error && (
        <div className="flex w-full items-center gap-2 md:ml-auto md:gap-1 lg:gap-2">
          <div className="ml-auto flex-1 sm:flex-initial">
            <Link href='/marketplace'>
              <Coins className={`h-5 w-5 ${headerIconColorClass}`} />
            </Link>
          </div>

          <div className="flex-1 sm:flex-initial">
            <Link href="/marketplace">
              {
                user?.data?.ledger?.coinBalance > 1000
                  ? user?.data?.ledger?.coinBalance > 1000000
                    ? `${(user?.data?.ledger?.coinBalance / 1000000).toFixed(1)}m`
                    : `${(user?.data?.ledger?.coinBalance / 1000).toFixed(1)}k`
                  : user?.data?.ledger?.coinBalance
              }
            </Link>
          </div>

          <div className="ml-4 flex-1 sm:flex-initial">
            <Link href={`/player/${user?.data?.id}`}>
              <Trophy className={`h-5 w-5 ${headerIconColorClass}`} />
            </Link>
          </div>

          <div className="mr-4 flex-1 sm:flex-initial">
            <Link href={`/player/${user?.data?.id}`}>
              {user?.data?.levels?.level}
            </Link>
          </div>

          <div className="ml-2">
            <Button onClick={handleUpgradeClick}>
              {upgradeLabel}
            </Button>
          </div>

          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full" aria-label="Open user menu">
                  {user?.data?.profileImage ? (
                    <Image
                      src={user?.data?.profileImage}
                      width={64}
                      height={64}
                      alt={user?.data?.displayName || "Profile Image"}
                      className="rounded-full"
                    />
                  ) : (
                    <CircleUser className={`h-5 w-5 ${headerIconColorClass}`} />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>

              <UserMenuDropDown
                username={user?.data?.displayName}
                themeClassName={themeClassName}
                menuBackgroundColor={menuBackgroundColor}
              />
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  );
}
