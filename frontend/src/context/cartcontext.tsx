'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  addToCart: (quantity?: number) => void;
  subFromCart: () => void;
  clearCart: () => void;
  setCartVal : (quantity?:number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    
    const getCartPopulation = async () => {
        const token = sessionStorage.getItem('access_token');
        try {
        const response = await fetch("http://localhost:8000/cart/getTotalItems", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        setCartCount(data.total_items);
        } catch(error) {
            console.error(error);
        }
    }

    const addToCart = () => {
        getCartPopulation();
    }
  const subFromCart = () => setCartCount((prevCount) => prevCount - 1);
  const clearCart = () => setCartCount(0);
  const setCartVal = () => setCartCount((newCount) => newCount);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, subFromCart, clearCart , setCartVal}}>
      {children}
    </CartContext.Provider>
  );
};
