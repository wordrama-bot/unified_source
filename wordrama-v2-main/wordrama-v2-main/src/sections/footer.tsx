"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="z-30 bg-bg px-5 py-8 text-center font-base dark:bg-darkBg m500:text-sm">
      <p>© 2023-{new Date().getFullYear()} Wordrama. All rights reserved.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="font-semibold">Wordrama</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link className="hover:underline" href="/about">About</Link>
            <Link className="hover:underline" href="/free-play">Quick Play</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Tutorials</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link className="hover:underline" href="/how-to-play">How to Play</Link>
            <Link className="hover:underline" href="/wordle-strategy">Wordle Strategy</Link>
            <Link className="hover:underline" href="/best-starting-words">Best Starting Words</Link>
            <Link className="hover:underline" href="/wordle-tips">Wordle Tips</Link>
            <Link className="hover:underline" href="/benefits-of-word-games">Benefits of Word Games</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Legal & Support</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link className="hover:underline" href="/privacy-policy">Privacy Policy</Link>
            <Link className="hover:underline" href="/cookies">Cookie Policy</Link>
            <Link className="hover:underline" href="/returns-policy">Returns Policy</Link>
            <Link className="hover:underline" href="/shipping-policy">Shipping Policy</Link>
            <Link className="hover:underline" href="/terms-of-use">Terms of Use</Link>
            <Link className="hover:underline" href="/acceptable-use">Acceptable Use</Link>
            <Link className="hover:underline" href="/disclaimer">Disclaimer</Link>
            <a className="hover:underline" href="mailto:support@wordrama.io?subject=Wordrama Support Request">Contact Us</a>
            <button
              type="button"
              className="hover:underline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("open-cookie-preferences"));
                }
              }}
            >
              Consent Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <a className="mx-2" href="https://www.tiktok.com/@wordrama.io" target="_blank" rel="noopener noreferrer">
          <Image src="/tiktok.svg" alt="TikTok Logo" width={32} height={32} />
        </a>

        <a className="mx-2" href="https://www.instagram.com/wordrama.io" target="_blank" rel="noopener noreferrer">
          <Image src="/instagram.svg" alt="Instagram Icon" width={32} height={32} />
        </a>

        <a className="mx-2" href="https://discord.gg/cRunwK229g" target="_blank" rel="noopener noreferrer">
          <Image src="/discord.svg" alt="Discord Icon" width={32} height={32} />
        </a>
      </div>
    </footer>
  );
}