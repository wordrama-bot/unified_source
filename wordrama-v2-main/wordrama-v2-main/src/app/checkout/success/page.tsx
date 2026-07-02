"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">Payment successful</h1>
      <p>Your subscription is being activated.</p>
      <Button asChild>
        <Link href="/teams/create">Return to team creation</Link>
      </Button>
    </main>
  );
}
