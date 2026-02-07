import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Wordrama",
  description: "How and why we use cookies.",
  keywords: ['wordrama', 'cookies', 'cookie policy', 'wordrama cookie policy'],
  openGraph: {
    title: "Cookie Policy | Wordrama",
    description: "How and why we use cookies.",
    type: "website",
    url: "https://wordrama.co/cookie-policy"
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
