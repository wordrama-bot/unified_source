"use client"
import Header from '@/sections/header';
import Footer from '@/sections/footer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useEffect } from 'react';
//import { getAppInsights } from '@/utils/appInsights';

export default function Custom404() {
  //useEffect(() => {
  //  getAppInsights().trackPageView({ name: 'Not Found Page' });
  //}, [])

  return (
    <>
      <Header
        heroText="Page Not Found"
        ctaText="Return Home"
        ctaLink="/"
      />
      <Footer />
      <ThemeSwitcher />
    </>
  )
}
