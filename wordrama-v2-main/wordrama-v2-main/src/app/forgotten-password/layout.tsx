import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Wordrama",
  description: "Forgotten your password. No worries, lets reset it.",
  keywords: ['wordrama password reset']
};

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
