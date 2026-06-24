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

export default function NavBar({
  links = [],
  isFirstLogin = false,
}: {
  links?: { href: string, text: string }[],
  isFirstLogin?: boolean
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

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-bg dark:bg-darkBg text-text dark:text-darkText dark:border-darkBorder px-4 md:px-6">
      <nav
        className={`${!user ? 'hidden' : ''} flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6`}
      >
        <Link
          href="/"
          className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>

        {links.map((link, linkIdx) => (
          <Link
            key={`mm-${linkIdx}`}
            href={link.href}
            className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
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
              <Menu className="h-5 w-5 dark:text-darkText" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
        )}

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <div className="flex items-center gap-2">
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
            </div>

            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>

            {links.map((link, linkIdx) => (
              <Link
                key={`sb-${linkIdx}`}
                href={link.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {link.text}
              </Link>
            ))}

            <Link
              href="/how-to-play"
              className="text-muted-foreground hover:text-foreground"
            >
              How to Play
            </Link>
            <Link
              href="/wordle-strategy"
              className="text-muted-foreground hover:text-foreground"
            >
              Wordle Strategy
            </Link>
            <Link
              href="/best-starting-words"
              className="text-muted-foreground hover:text-foreground"
            >
              Best Starting Words
            </Link>
            <Link
              href="/wordle-tips"
              className="text-muted-foreground hover:text-foreground"
            >
              Wordle Tips
            </Link>

            <a
              href="/contact"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact Us
            </a>

            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-foreground"
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="text-muted-foreground hover:text-foreground"
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
              <Coins className="h-5 w-5 text-text dark:text-darkText" />
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
              <Trophy className="h-5 w-5 text-text dark:text-darkText" />
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
                    <CircleUser className="h-5 w-5 text-text dark:text-darkText" />
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>

              <UserMenuDropDown username={user?.data?.displayName} />
            </DropdownMenu>
          </div>
        </div>
      )}
    </header>
  );
}
