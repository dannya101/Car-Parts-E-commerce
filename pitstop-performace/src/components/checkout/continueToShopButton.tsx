'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/navbutton'

interface ContinueButtonProps {
  initialModel?: number;
  initialMake?: number;
}

export function ContinueButton({ initialModel = 1, initialMake = 1 }: ContinueButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [selectedMake, setSelectedMake] = useState(initialMake);

  const continueShopping = () => {
    startTransition(() => {
      router.push(`/results?make=${selectedMake}&model=${selectedModel}`);
    });
  };

  // Static method to update the selection
  ContinueButton.updateSelection = (model: number, make: number) => {
    setSelectedModel(model);
    setSelectedMake(make);
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
// Add static method to the component
ContinueButton.updateSelection = (model: number, make: number) => {
    // This will be replaced when the component is rendered
    console.warn('ContinueButton not yet rendered');
  };