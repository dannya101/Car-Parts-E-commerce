'use client';
import { Button } from "./ui/navbutton";

type ProductItemProps = {
    name: string;
    price: number;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export function ProductItem({ name, price, quantity, onIncrease, onDecrease }: ProductItemProps) {
    return (
      <div className="product-item flex justify-between items-center border-b border-gray-300 py-4">
        <div className="product-details">
          <h2 className="text-lg font-medium">{name}</h2>
            <Button variant="outline" size="sm" onClick={onDecrease} disabled={quantity <= 1}>-</Button>
            <span className="text-sm text-gray-500"> Quantity: {quantity}</span>
            <Button variant="outline" size="sm" onClick={onIncrease}>+</Button>
        </div>
        <p className="product-price text-lg font-bold">${(price * quantity).toFixed(2)}</p>
      </div>
    );
  }