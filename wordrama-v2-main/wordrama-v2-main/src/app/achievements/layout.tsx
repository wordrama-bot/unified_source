import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | Wordrama",
  description:
    "Learn how Wordrama achievements work, earn XP and coins, and track your progress through Wordrama.",
  keywords: [
    "wordrama achievements",
    "wordrama xp",
    "wordrama coins",
    "wordrama progression",
    "wordrama leaderboard",
    "wordrama",
    "wordrama io",
    "wordrama.io",
    "wordle achievements",
    "wordle stats",
    "competitive word games",
  ],
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
