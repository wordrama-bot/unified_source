import MainLayout from '@/components/main-layout';
import { type Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Leaderboard | Wordrama",
  description: "See the top players in Wordrama games.",
  keywords: ['wordrama leaderboard', 'top wordrama player', 'top wordrama stats', 'top wordle stats', 'top wordle player', 'wordle with stats', 'wordle stats', 'cross-device stats'],
  openGraph: {
    title: "Leaderboard | Wordrama",
    description: "See the top players in Wordrama games.",
  }
};


export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MainLayout>
      { children }
    </MainLayout>
  )
}
