"use client"
import { redirect, useParams } from 'next/navigation';

export default function ProfilePage() {
  const { playerId } = useParams();

  return redirect(`/player/${playerId}`)
}
