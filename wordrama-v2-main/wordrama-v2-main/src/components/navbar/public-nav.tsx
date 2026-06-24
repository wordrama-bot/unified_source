import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { showChristmas } from "@/lib/config";

const tutorialLinks = [
  { href: "/how-to-play", text: "How to Play" },
  { href: "/wordle-strategy", text: "Wordle Strategy" },
  { href: "/best-starting-words", text: "Best Starting Words" },
  { href: "/wordle-tips", text: "Wordle Tips" },
  { href: "/benefits-of-word-games", text: "Benefits of Word Games" },
];

export default function NavBar({
  links = [],
}: {
  links?: { href: string; text: string }[];
}) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-bg px-4 text-text dark:border-darkBorder dark:bg-darkBg dark:text-darkText md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-0 text-muted-foreground hover:text-foreground">
              Tutorials
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {tutorialLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href}>{link.text}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <Sheet>
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

        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
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

            <div className="grid gap-3 border-t pt-4 dark:border-darkBorder">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Tutorials
              </p>

              {tutorialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <div className="grid gap-3 border-t pt-4 dark:border-darkBorder">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Support
              </p>

              <a
                href="/contact"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </a>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}