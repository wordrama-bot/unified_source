'use client'
import { cn } from '@/lib/utils';
import { redirect } from "next/navigation";
import { useAuth } from '@/providers/auth-provider';
import NavBar from "@/components/navbar/h-nav";
import Loader from "@/sections/loading";
import Footer from "@/sections/footer";
import { useGetMyAccountQuery } from "@/redux/api/wordrama";
import Header from '@/sections/header';

export default function Layout({
  children,
  className = ''
}: Readonly<{ children: React.ReactNode, className: string }>) {
  const { user } = useAuth();
  const { data: myAccount, isLoading, error } = useGetMyAccountQuery();

  if (!user) return (
    <div className={cn("flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText", className)}>
      <NavBar
        links={[
          { href: "/", text: "Home" },
          { href: "/free-play", text: "Quick Play" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
          { href: "/about", text: "About" },
          { href: "/login", text: "Sign Up / In" },
          { href: "/tutorials", text: "Tutorials" },
        ]}
      />
      <Header
        ctaLink="/login"
        ctaText="Sign Up / In"
        heroText="Create a free account to access this page"
      />
      <Footer />
    </div>
  )

  if (error) return redirect('/');
  if (isLoading && !error) return <Loader />
  return (
    <div className={cn("flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText", className)}>
      <NavBar
        links={[
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
        ]}
      />
      <main className="w-full flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
