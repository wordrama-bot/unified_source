'use client'

import { useState } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation';

export function HoverHome() {
  const [goHome, setGoHome] = useState(false);
  if (goHome) return redirect('/');
  return (
    <Button
      size="icon"
      className={'fixed left-10 top-10 z-50'}
      onClick={() => setGoHome(true)}
    >
      <Home className="stroke-text h-6 w-6 w500:h-4 w500:w-4" />
      <span className="sr-only">Home</span>
    </Button>
  )
}
