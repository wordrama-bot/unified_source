"use client";

import { useEffect, useRef } from "react";

const GoogleAd = ({ client, slot, format = "auto", responsive = "true" }) => {
  const adRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!adRef.current || initializedRef.current) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default GoogleAd;