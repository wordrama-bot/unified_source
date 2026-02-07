"use client"
import { redirect } from 'next/navigation';
import { useAuth } from "@/providers/auth-provider";

export default function Layout({ 
  children 
}: Readonly<{ children: React.ReactNode }>) {
  const { role } = useAuth();

  if (role === 'PLAYER') return redirect('/settings')
  return children;
}