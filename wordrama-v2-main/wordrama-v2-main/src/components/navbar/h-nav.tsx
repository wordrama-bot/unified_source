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

import { showChristmas } from '@/lib/config';

export default function NavBar({
  links = [],
  isFirstLogin = false,
  className = '',
}: {
  links?: { href: string, text: string }[],
  isFirstLogin?: boolean,
  className?: string,
}) {
  const { data: user, error } = useGetMyAccountQuery();

  return (
    <header className={`sticky top-0 flex h-16 items-center gap-4 border-b bg-bg dark:bg-darkBg text-current dark:border-darkBorder px-4 md:px-6 transition-colors ${className}`}>
      <nav
        className={`${isFirstLogin || error ? '' : 'hidden'} flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            src={
              showChristmas
                ? "https://utfs.io/f/vieUBZcrouNZHgZwgWPc5QTiy9PYrsMqS3jRhEFC148IZDw0"
                : "https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr"
            }
            width={isFirstLogin || error ? 250 : 500}
            height={50}
            alt="Wordrama Logo"
          />
          <span className="sr-only">Wordrama</span>
        </Link>

        {links.map((link, linkIdx) => (
          <Link
            key={`mm-${linkIdx}`}
            href={link.href}
            className="text-current transition-colors hover:opacity-80"
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
            >
              <Menu className="h-5 w-5 text-current" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
        )}

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src={
                  showChristmas
                    ? "https://utfs.io/f/vieUBZcrouNZHgZwgWPc5QTiy9PYrsMqS3jRhEFC148IZDw0"
                    : "https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr"
                }
                width={250}
                height={50}
                alt="Wordrama Logo"
              />
              <span className="sr-only">Wordrama</span>
            </Link>

            {links.map((link, linkIdx) => (
              <Link
                key={`sb-${linkIdx}`}
                href={link.href}
                className="text-current hover:opacity-80"
              >
                {link.text}
              </Link>
            ))}

            <Link
              href="/how-to-play"
              className="text-current hover:opacity-80"
            >
              How to Play
            </Link>
            <Link
              href="/wordle-strategy"
              className="text-current hover:opacity-80"
            >
              Wordle Strategy
            </Link>
            <Link
              href="/best-starting-words"
              className="text-current hover:opacity-80"
            >
              Best Starting Words
            </Link>
            <Link
              href="/wordle-tips"
              className="text-current hover:opacity-80"
            >
              Wordle Tips
            </Link>

            <a
              href="mailto:support@wordrama.io?subject=Wordrama Support Request"
              className="text-current hover:opacity-80"
            >
              Contact Us
            </a>

            <Link
              href="/privacy-policy"
              className="text-current hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-current hover:opacity-80"
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="text-current hover:opacity-80"
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
              <Coins className="h-5 w-5 text-current" />
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
              <Trophy className="h-5 w-5 text-current" />
            </Link>
          </div>

          <div className="mr-4 flex-1 sm:flex-initial">
            <Link href={`/player/${user?.data?.id}`}>
              {user?.data?.levels?.level}
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {user?.data?.profileImage ? (
                  <Image
                    src={user?.data?.profileImage}
                    width={64}
                    height={64}
                    alt={user?.data?.displayName || "Profile Image"}
                    className="rounded-full"
                  />
                ) : (
                  <CircleUser className="h-5 w-5 text-current" />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>

            <UserMenuDropDown username={user?.data?.displayName} />
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}