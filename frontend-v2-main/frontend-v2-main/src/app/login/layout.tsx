import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordrama | Login",
  description: "Login to your account",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
