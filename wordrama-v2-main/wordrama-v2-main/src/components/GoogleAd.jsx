"use client";

import { useEffect, useRef, useState } from "react";

const GoogleAd = ({
  client,
  slot,
  format = "auto",
  responsive = "true",
  minHeight = 280,
}) => {
  const adRef = useRef(null);
  const initializedRef = useRef(false);
  const [isUnfilled, setIsUnfilled] = useState(false);

  useEffect(() => {
    if (!adRef.current || initializedRef.current) return;

    const observer = new MutationObserver(() => {
      if (adRef.current?.getAttribute("data-ad-status") === "unfilled") {
        setIsUnfilled(true);
      }
    });

    observer.observe(adRef.current, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      initializedRef.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }

    return () => observer.disconnect();
  }, []);

  if (isUnfilled) return null;

  return (
    <div
      className="w-full overflow-hidden rounded-lg bg-transparent"
      style={{ minHeight: `${minHeight}px` }}
      aria-label="Advertisement"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: `${minHeight}px`,
          backgroundColor: "transparent",
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
