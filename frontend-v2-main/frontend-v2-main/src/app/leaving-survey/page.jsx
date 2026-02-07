"use client"
import Header from '@/sections/header';
import Footer from '@/sections/footer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useEffect } from 'react';
//import { getAppInsights } from '@/utils/appInsights';
import { freePlayApi } from '@/redux/api/freePlay';
import { friendsApi } from '@/redux/api/friends';
import { systemApi } from '@/redux/api/system';
import { teamApi } from '@/redux/api/teams';
import { wordramaApiV3 } from '@/redux/api/wordrama';
import { useDispatch } from "react-redux";
import { useAuth } from '@/providers/auth-provider';


export default function LeavingSurvey() {
  const { deleteLogout } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    //getAppInsights().trackPageView({ name: 'Leaving Survey Page' });
    deleteLogout();
    dispatch(wordramaApiV3.util.resetApiState());
    dispatch(freePlayApi.util.resetApiState());
    dispatch(friendsApi.util.resetApiState());
    dispatch(systemApi.util.resetApiState());
    dispatch(teamApi.util.resetApiState());

    setTimeout(() => {
      window.location.href = 'https://forms.office.com/e/xY1s85bqVA';
    }, 1000);
  }, [])

  return (
    <>
      <Header
        heroText="Redirecting to Survey..."
        ctaText="Taking too long? Click here to take the survey now."
        ctaLink="https://forms.office.com/e/xY1s85bqVA"
      />
      <Footer />
      <ThemeSwitcher />
    </>
  )
}
