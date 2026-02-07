import MainLayout from '@/components/main-layout';
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Games | Wordrama",
  description: "Play games on Wordrama.io",
  keywords: ['wordrama games'],
  openGraph: {
    title: "Games | Wordrama",
    description: "Play games on Wordrama.io",
    type: "website",
    url: "https://wordrama.io/games",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MainLayout className=''>
      { children }
    </MainLayout>
  )
}
