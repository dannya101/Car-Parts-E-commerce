'use client'
import { useState } from 'react'
import { useTransition } from 'react'
import { Button } from './ui/navbutton'
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/authcontext"
import { useEffect } from 'react';


interface AddToCartButtonProps {
  productId: number
}
  
export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const {isAuthenticated, setIsAuthenticated} = useAuth();
  const { toast } = useToast()

  const handleAddToCart = async() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        });
        return;
    }
      try {
        const response = await fetch("http://localhost:8000/cart/add", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1,
            }),
        })
        if(!response.ok) {
          toast({
              variant: "destructive",
              title: "Failed to add to Cart",
              description: "Try Again"
            })
          throw new Error(`Failed to add to Cart: ${response.statusText}`);
        }
        else
        {
          toast({
            title: "Success",
            description: "Product Added Successfully to Cart"
        });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
        })
      }
    }

  return (
    <Button className="absolute bottom-4 left-4 z-10" onClick={handleAddToCart} disabled={isPending}>
    </Button>
  )
}

