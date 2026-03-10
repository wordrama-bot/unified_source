"use client";

import { useEffect } from "react";

type Props = {
  pId: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    google_ad_client?: string;
  }
}

const SCRIPT_ID = "google-adsense-script";

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  useEffect(() => {
    const adConsent = window.localStorage.getItem("adConsent");
    const cookiesAccepted = window.localStorage.getItem("cookiesAccepted");

    const allowPersonalized =
      adConsent === "personalized" || cookiesAccepted === "all";

    const allowNonPersonalized = adConsent === "non_personalized";

    if (!allowPersonalized && !allowNonPersonalized) {
      return;
    }

    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    // For non-personalized ads, tell AdSense before loading/pushing ads
    if (allowNonPersonalized) {
      (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`;
    script.crossOrigin = "anonymous";

    document.head.appendChild(script);
  }, [pId]);

  return null;
};

export default GoogleAdsense;