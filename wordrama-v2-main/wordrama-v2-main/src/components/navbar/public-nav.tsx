import { CircleUser, Menu, Coins, Trophy } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { showChristmas } from '@/lib/config';

export default function NavBar({
  links = []
}: {
  links?: { href: string, text: string }[]
}) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-bg dark:bg-darkBg text-text dark:text-darkText dark:border-darkBorder px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
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
            width={250}
            height={50}
            alt="Wordrama Logo"
          />
          <span className="sr-only">Wordrama</span>
        </Link>

        {links.map((link, linkIdx) => (
          <Link
            key={`mm-${linkIdx}`}
            href={link.href}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.text}
          </Link>
        ))}

        <Link
          href="/how-to-play"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          How to Play
        </Link>
        <Link
          href="/wordle-strategy"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Strategy
        </Link>
        <Link
          href="/best-starting-words"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Starting Words
        </Link>
        <Link
          href="/wordle-tips"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Tips
        </Link>
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5 dark:text-darkText" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

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
              href="mailto:support@wordrama.io?subject=Wordrama Support Request"
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
    </header>
  );
}