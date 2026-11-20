"use client";

import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const helpLinks = [
  {
    label: "How to Play",
    description: "Rules, guesses, and tile colors",
    href: "/academy/getting-started",
  },
  {
    label: "Coins, XP & Rewards",
    description: "Learn how progression works",
    href: "/academy/coins-xp-rewards",
  },
  {
    label: "Word Packs & Themes",
    description: "Discover purchases and unlocks",
    href: "/academy/marketplace",
  },
  {
    label: "Wordrama Academy",
    description: "Explore all seven lessons",
    href: "/academy",
  },
];

interface GameplayHelpMenuProps {
  buttonClassName?: string;
  panelClassName?: string;
  titleClassName?: string;
  backgroundColor?: string;
  textColor?: string;
  isCustom?: boolean;
}

export default function GameplayHelpMenu({
  buttonClassName = "",
  panelClassName = "",
  titleClassName = "",
  backgroundColor,
  textColor,
  isCustom = false,
}: GameplayHelpMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="default"
          size="icon"
          className={`absolute top-20 z-10 ${
            isCustom ? "right-72" : "right-44"
          } ${buttonClassName}`}
          aria-label="Open Wordrama Help"
          title="Wordrama Help"
        >
          <CircleHelp className="h-6 w-6" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={12}
        className={`z-50 w-[min(320px,calc(100vw-24px))] rounded-lg border-2 p-4 shadow-lg ${panelClassName}`}
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        <h2 className={`mb-2 text-lg font-semibold ${titleClassName}`}>
          Wordrama Help
        </h2>

        <p className="mb-4 text-sm opacity-80">
          Need a hand? Explore guides and discover
          everything Wordrama offers.
        </p>

        <div className="space-y-2">
          {helpLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md border border-current/20 p-3 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="block font-semibold">
                {link.label}
              </span>

              <span className="mt-1 block text-xs opacity-75">
                {link.description}
              </span>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
