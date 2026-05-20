"use client";

import { useEffect, useRef } from "react";

const GoogleAd = ({
  client,
  slot,
  format = "auto",
  responsive = "true",
  minHeight = 280,
}) => {
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
    <div
      className="w-full overflow-hidden"
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: `${minHeight}px`,
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default GoogleAd;