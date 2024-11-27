'use client'
import { useState } from 'react'
import { useTransition } from 'react'
import { Button } from './ui/navbutton'
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  productId: number
}
  
export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            toast({
            title: "Authentication Required",
            description: "Please log in to add items to your cart.",
            });
            return;
        }
        const response = await fetch("http://localhost:8000/cart/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1,
            }),
        })
        toast({
          title: "Success",
          description: `Response ${response}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Eror",
        })
      }
    })
  }

  return (
    <Button onClick={handleAddToCart} disabled={isPending}>
      {isPending ? 'Adding...' : 'Add to Cart'}
    </Button>
  )
}

