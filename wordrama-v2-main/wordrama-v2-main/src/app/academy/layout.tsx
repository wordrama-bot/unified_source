import type { ReactNode } from "react";
import InformationalSiteLayout from "@/components/site/informational-site-layout";

export default function AcademyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <InformationalSiteLayout>{children}</InformationalSiteLayout>;
}
