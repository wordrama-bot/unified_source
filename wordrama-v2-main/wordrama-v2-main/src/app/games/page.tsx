"use client"
import Games from '@/sections/games';
//import { getAppInsights } from '@/utils/appInsights';

export default function GamesPage() {
  //getAppInsights().trackPageView({ name: 'Games' });
  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[30dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <h1 className="px-5 text-center text-3xl font-heading md:text-4xl lg:text-5xl">
            Play Now!
          </h1>
        </div>
      </header>
      <Games
        games={[]}
      />
    </div>
  )
}
