"use client"
import React from 'react';
import Header from '@/sections/header';
import { PricingSection } from '@/sections/pricing';

export default function GamesPage() {
  return (
    <div>
      <Header
        className='min-h-[20dvh] dark:bg-darkBg inset-0 flex w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]'
        showLogo={false}
        heroText="Choose your Wordrama Plan"
      />
      <PricingSection />
    </div>
  )
}
