"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";
import Cookies from 'js-cookie'
import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const allAccepted = Cookies.get("CookieConsent");
    const consentStatus = localStorage.getItem("adConsent");
    if (allAccepted || consentStatus) setConsentGiven(true);
  }, []);


  const handleAcceptAll = () => {
    localStorage.setItem("adConsent", "personalized");
    setConsentGiven(true);
    // Trigger personalized ads script load
  };

  const handleAcceptPersonalized = () => {
    localStorage.setItem("adConsent", "personalized");
    setConsentGiven(true);
    // Trigger personalized ads script load
  };

  const handleAcceptNonPersonalized = () => {
    localStorage.setItem("adConsent", "non_personalized");
    setConsentGiven(true);
    // Trigger non-personalized ads script load
  };

  return (
    <AlertDialog open={!consentGiven} className="w-96">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cookies 🍪</AlertDialogTitle>
          <AlertDialogDescription>
            We use cookies to provide a better experience, including personalized
            ads. By continuing, you agree to our <Link href="/cookies" className="text-blue-500 hover:underline">cookie policy</Link>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <CookieConsent
            onAccept={handleAcceptAll}
            buttonText="Accept All"
            style={{ background: 'transparent'}}
            buttonStyle={{}}
            disableStyles={true}
            containerClasses="bg-bg dark:bg-darkBg text-black"
            buttonClasses="inline-flex items-center text-black justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-main border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none h-10 px-2 py-2"
          />
          <AlertDialogAction onClick={handleAcceptPersonalized}>Accept Personalized</AlertDialogAction>
          <AlertDialogAction onClick={handleAcceptNonPersonalized}>Accept Non-Personalized</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
