import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Wordrama",
  description: "Find out why we are the best place to play Wordle online.",
  keywords: ['what is wordrama', 'why wordrama', 'wordrama', 'wordrama io', 'wordrama.io', 'wordle with leaderboards', 'wordle leaderboard', 'wordle stats']
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
