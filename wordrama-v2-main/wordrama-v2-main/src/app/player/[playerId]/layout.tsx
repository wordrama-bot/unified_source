import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Profile | Wordrama",
  description: "Checkout out my stats.",
  keywords: ['wordrama', 'player', 'profile'],
  openGraph: {
    title: "Player Profile | Wordrama",
    description: "Checkout out my stats.",
    type: "website",
    url: "https://wordrama.vercel.app/player"
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
