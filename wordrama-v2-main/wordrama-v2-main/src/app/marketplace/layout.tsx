import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordrama | Marketplace",
  description:
    "Customize your Wordrama experience with cosmetics, themes, word packs, and player rewards.",
  openGraph: {
    title: "Wordrama | Marketplace",
    description:
      "Customize your Wordrama experience with cosmetics, themes, word packs, and player rewards.",
  },
};

export default function MarketplaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
