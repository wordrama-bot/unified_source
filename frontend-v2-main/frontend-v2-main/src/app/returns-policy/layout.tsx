import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns Policy | Wordrama",
  description: "How to submit a return request for a product you purchased from Wordrama.",
  keywords: ['wordrama', 'returns', 'returns policy', 'wordrama returns policy'],
  openGraph: {
    title: "Returns Policy | Wordrama",
    description: "How to submit a return request for a product you purchased from Wordrama.",
  }
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
