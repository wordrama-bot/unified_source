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
    if (document.getElementById(SCRIPT_ID)) {
      return;
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