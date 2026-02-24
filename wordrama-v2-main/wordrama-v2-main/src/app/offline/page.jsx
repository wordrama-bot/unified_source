"use client";
import Header from '@/sections/header';
import Footer from '@/sections/footer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useGetReadinessQuery } from '@/redux/api/wordrama';
import { useEffect } from 'react';

export default function OfflineError() {
  //const { data, refetch } = useGetReadinessQuery();
  
  //useEffect(() => {
  //  if (data?.status !== 'ok') return refetch();
  //}, []);

  return (
    <>
      <Header 
        heroText="Oops... Jay broke something again"
        ctaText="Try again"
        ctaLink="/"
      />
      <Footer />
      <ThemeSwitcher />
    </>
  )
}
