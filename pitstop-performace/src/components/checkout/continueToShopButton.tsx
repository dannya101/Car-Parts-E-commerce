'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/navbutton'

export function ContinueButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const continueShopping = () => {
    startTransition(() => {
      router.push(`/results?query=all`);
    });
  };

  return (
    <Button 
      onClick={continueShopping} 
      disabled={isPending}
      className="w-40 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
      variant="outline"
    >
      {isPending ? 'Loading...' : 'Continue Shopping'}
    </Button>
  );
}
