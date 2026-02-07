import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordrama | Sign Up",
  description: "Sign Up for a free account",
  openGraph: {
    title: "Wordrama | Sign Up",
    description: "Sign Up for a free account",
    type: "website",
    url: "https://wordrama.io/signup",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
