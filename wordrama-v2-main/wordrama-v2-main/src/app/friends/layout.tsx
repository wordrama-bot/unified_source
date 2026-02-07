import MainLayout from '@/components/main-layout';
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Friends | Wordrama",
  description: "Play wordrama with your friends.",
  keywords: ['wordrama friends', 'play wordle with friends']
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
