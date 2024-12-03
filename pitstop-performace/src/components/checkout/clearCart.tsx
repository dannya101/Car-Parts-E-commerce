'use client'
import { useState } from 'react'
import { useTransition } from 'react'
import { Button } from '../ui/navbutton';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCart } from '@/context/cartcontext';


// ClearCartButton component that handles the cart clearing
export function ClearCartButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const {cartCount, subFromCart, clearCart} = useCart()

  const ClearCart = async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/cart/clear", {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      clearCart()
      router.push("/"); // Navigate after clearing cart
    } catch (error) {
      toast({
        title: "Error",
        description: `${error}`,
      });
    }
  };

  return (
    <Button
      onClick={ClearCart}
      disabled={isPending}
      className="w-40 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
    >
      Cancel Cart
    </Button>
  );
}
