import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Wordrama",
  description: "How we protect your privacy.",
  keywords: ['wordrama', 'privacy', 'privacy policy', 'wordrama privacy policy'],
  openGraph: {
    title: "Privacy Policy | Wordrama",
    description: "How we protect your privacy.",
    type: "website",
    url: "https://wordrama.co/privacy",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
