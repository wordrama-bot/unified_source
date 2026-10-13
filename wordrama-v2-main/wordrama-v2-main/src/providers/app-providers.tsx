"use client";

import React, { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { ThemeProvider } from "@/providers/theme-provider";
import AuthProvider from "@/providers/auth-provider";
import { store } from "@/redux/config/store";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import CookieConsentBanner from "@/components/cookie-consent";

export default function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCookiesVisible, setIsCookiesVisible] = useState(true);
  const [cookieBannerKey, setCookieBannerKey] = useState(0);

  useEffect(() => {
    const openPreferences = () => {
      setIsCookiesVisible(false);

      window.setTimeout(() => {
        setCookieBannerKey((prev) => prev + 1);
        setIsCookiesVisible(true);
      }, 0);
    };

    window.addEventListener(
      "open-cookie-preferences",
      openPreferences
    );

    return () => {
      window.removeEventListener(
        "open-cookie-preferences",
        openPreferences
      );
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
      >
        <AuthProvider>
          <ReduxProvider store={store}>
            <TooltipProvider>
              {isCookiesVisible && (
                <CookieConsentBanner
                  key={cookieBannerKey}
                  forceOpen={cookieBannerKey > 0}
                />
              )}

              {children}
            </TooltipProvider>

            <Toaster />
          </ReduxProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
