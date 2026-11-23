"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import AuthNav from "@/components/navbar/h-nav";
import PublicNav from "@/components/navbar/public-nav";
import Footer from "@/sections/footer";

const publicLinks = [
  { href: "/free-play", text: "Quick Play" },
  { href: "/marketplace", text: "Marketplace" },
  { href: "/achievements", text: "Achievements" },
  { href: "/teams", text: "Teams" },
  { href: "/about", text: "About" },
  { href: "/login", text: "Sign Up / In" },
];

const memberLinks = [
  { href: "/games", text: "Games" },
  { href: "/leaderboard", text: "Leaderboard" },
  { href: "/marketplace", text: "Marketplace" },
  { href: "/achievements", text: "Achievements" },
  { href: "/teams", text: "Teams" },
];

export default function InformationalSiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text dark:bg-darkBg dark:text-darkText">
      {session ? (
        <AuthNav links={memberLinks} />
      ) : (
        <PublicNav links={publicLinks} />
      )}

      <div className="flex-1">{children}</div>

      <Footer />
    </div>
  );
}
