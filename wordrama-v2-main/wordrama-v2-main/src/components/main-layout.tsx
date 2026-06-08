'use client'
import { cn } from '@/lib/utils';
import { redirect } from "next/navigation";
import { useAuth } from '@/providers/auth-provider';
import NavBar from "@/components/navbar/h-nav";
import Loader from "@/sections/loading";
import Footer from "@/sections/footer";
import { useGetMyAccountQuery } from "@/redux/api/wordrama";
import { getAppearanceTheme } from '@/config/themes';
import { getWordleGameUiState } from '@/redux/ui/helpers';
import Header from '@/sections/header';

export default function Layout({
  children,
  className = ''
}: Readonly<{ children: React.ReactNode, className: string }>) {
  const { user } = useAuth();
  const { data: myAccount, isLoading, error } = useGetMyAccountQuery();

  const gameUiState = getWordleGameUiState();

  const appearanceTheme = getAppearanceTheme(
    gameUiState?.appearanceThemeId ||
    myAccount?.data?.playerSettings?.appearanceThemeId
  );

  const shellThemeClasses = `${appearanceTheme.app.background} ${appearanceTheme.app.text}`;
  const shellPanelThemeClasses = appearanceTheme.app.panel;

  if (!user) return (
    <div className={cn("flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText", className)}>
      <NavBar
        links={[
          { href: "/login", text: "Login" },
          { href: "/about", text: "About" },
          { href: "/free-play", text: "Wordle" },
        ]}
      />
      <Header
        ctaLink='/login'
        ctaText='Login'
        heroText='You must be logged in to access this page'
      />
      <Footer />
    </div>
  )

  if (error) return redirect('/');
  if (isLoading && !error) return <Loader />
  return (
    <div className={cn(`flex min-h-screen w-full flex-col border:border dark:border-darkBorder transition-colors ${shellThemeClasses}`, className)}>
      <NavBar
        className={shellPanelThemeClasses}
        links={[
          { href: "/games", text: "Games" },
          { href: "/leaderboard", text: "Leaderboard" },
          { href: "/marketplace", text: "Marketplace" },
          { href: "/achievements", text: "Achievements" },
          { href: "/teams", text: "Teams" },
        ]}
      />
      { children }
      <Footer className={shellPanelThemeClasses} />
    </div>
  );
}
