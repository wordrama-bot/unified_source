'use client'
import { cn } from '@/lib/utils';
import { redirect, usePathname } from "next/navigation";
import { getWordleGameUiState } from "@/redux/ui/helpers";
import { getAppearanceTheme } from "@/config/themes";
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

  const pathname = usePathname();
  const gameUiState = getWordleGameUiState();
  const appearanceTheme = getAppearanceTheme(gameUiState?.appearanceThemeId);

  const gameChromeClassName =
    pathname === "/games/wordrama" && appearanceTheme.meta.id !== "theme.default"
      ? [
          ...appearanceTheme.app.panel.split(/\s+/).filter(
            (className) => !/(^|:)!?text-/.test(className)
          ),
          appearanceTheme.app.text,
        ].join(" ")
      : undefined;

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

  const accountErrorStatus = (error as any)?.status;

  if (
    accountErrorStatus === 401 ||
    accountErrorStatus === 403
  ) {
    return redirect('/');
  }

  if (isLoading) return <Loader />
  return (
    <div className={cn("flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText", className)}>
      <NavBar
        themeClassName={gameChromeClassName}
        gameAppearanceTheme={gameChromeClassName ? appearanceTheme : undefined}
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
      <Footer themeClassName={gameChromeClassName} />
    </div>
  );
}
