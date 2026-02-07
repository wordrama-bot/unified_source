//import { type Metadata } from "next";

// export const metadata: Metadata = {
//   title: "About | Wordrama",
//   description: "Fin.",
//   keywords: ['what is wordrama', 'why wordrama', 'wordrama', 'wordrama io', 'wordrama.io', 'wordle with leaderboards', 'wordle leaderboard', 'wordle stats']
// };

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
