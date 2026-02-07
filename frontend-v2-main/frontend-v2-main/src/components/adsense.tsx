import Script from "next/script";

type Props = {
  pId: string;
};

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  if (typeof window === "undefined") return null;

  if (localStorage.getItem("adConsent") === "personalized" || localStorage.getItem("cookiesAccepted") === "all") return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
     // data-adtest="on"
    />
  )
  else if (localStorage.getItem("adConsent") === "non_personalized") return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      //data-ad-format="autorelaxed"
      //data-adtest="on"
    />
  )
  return null;
};

export default GoogleAdsense;
