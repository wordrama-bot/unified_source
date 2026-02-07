import MainLayout from '@/components/main-layout';
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | Wordrama",
  description: "Unlock milestones with Wordrama Achievements — track progress, earn badges, and join a competitive community!.",
  keywords: ['what is wordrama', 'why wordrama', 'wordrama', 'wordrama io', 'wordrama.io', 'wordle with leaderboards', 'wordle leaderboard', 'wordle stats', 'competitive']
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
