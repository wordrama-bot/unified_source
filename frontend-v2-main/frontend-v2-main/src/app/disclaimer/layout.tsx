import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Wordrama",
  description: "",
  keywords: ['wordrama disclaimer'],
  openGraph: {
    title: "Disclaimer | Wordrama",
    description: "",
    url: "https://wordrama.co/disclaimer",
    type: "website",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
