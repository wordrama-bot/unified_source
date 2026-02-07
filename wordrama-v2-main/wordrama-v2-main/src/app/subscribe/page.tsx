"use client"
import React from 'react';
import Header from '@/sections/header';
import { PricingSection } from '@/sections/pricing';
import { useAuth } from '@/providers/auth-provider';

export default function GamesPage() { 
  const { role } = useAuth();
  const heroText = () => {
    if (role === 'STREAMER' || role === 'PRO') {
      return 'Best for pro players & streamers'
    } else if(role === 'CASUAL') {
      return 'Time to go pro?'
    } else {
      return 'Best for casual players'
    }
  }
  return (
    <div>
      <Header
        className='min-h-[20dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
        showLogo={false}
        heroText={heroText()}
      />
      <PricingSection />
    </div>
  )
}
