"use client"
import { useParams, redirect } from 'next/navigation';
import Join from '../page';

export default function JoinWithUrl(){
  const { joinCode }: { joinCode: string } = useParams();
  if (joinCode.length !== 6) redirect('/not-found');

  return <Join />
}
