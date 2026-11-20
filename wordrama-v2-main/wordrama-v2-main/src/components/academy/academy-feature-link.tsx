"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";

export default function AcademyFeatureLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { session } = useAuth();

  const destination =
    href === "/games/wordrama" && !session
      ? "/free-play"
      : href;

  return (
    <Link href={destination} className={className}>
      {children}
    </Link>
  );
}
