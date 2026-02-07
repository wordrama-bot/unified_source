import MainLayout from '@/components/main-layout';
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordrama | Marketplace",
  description: "Buy more WordPacks to expand your Wordrama experience.",
  openGraph: {
    title: "Wordrama | Marketplace",
    description: "Buy more WordPacks to expand your Wordrama experience.",
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
