import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordrama | Sign Up / In",
  description: "Sign up for Wordrama or log in to your account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
