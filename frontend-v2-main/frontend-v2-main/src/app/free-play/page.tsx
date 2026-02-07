"use client"
import Wordle from '@/components/freePlay';
import Image from 'next/image';
import GoogleAd from '@/components/GoogleAd';
import { useEffect } from "react";

export default function FreePlayPage() {
  return (
    <>
      <Wordle />
    </>
  );
}
