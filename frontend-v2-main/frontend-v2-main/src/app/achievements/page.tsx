"use client"
import Achievements from '@/sections/achievements';
//import { getAppInsights } from '@/utils/appInsights';

export default function AchievementsPage() {
  //getAppInsights().trackPageView({ name: 'My Achievements Page' });
  return (
    <div>
      <header className="dark:bg-darkBg inset-0 flex min-h-[20dvh] w-full flex-col items-center justify-center bg-bg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 text-center">
          <h2 className="px-5 text-center text-2xl font-heading md:text-3xl lg:mb-15 lg:text-4xl">
            Achievements
          </h2>
        </div>
      </header>
      <Achievements />
    </div>
  )
}
