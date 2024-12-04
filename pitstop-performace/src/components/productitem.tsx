'use client';
import { Button } from "./ui/navbutton";

type ProductItemProps = {
    name: string;
    price: number;
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onDelete: () => void;
}

export function ProductItem({ name, price, quantity, onIncrease, onDecrease, onDelete }: ProductItemProps) {
    return (
      <div className="product-item flex justify-between items-center border-b border-gray-300 py-4">
        <div className="product-details">
          <h2 className="text-lg font-medium">{name}</h2>
            <Button variant="outline" size="sm" type="button" onClick={onDecrease} disabled={quantity <= 1}>-</Button>
            <span className="text-sm text-gray-500"> Quantity: {quantity}</span>
            <Button variant="outline" size="sm" type="button" onClick={onIncrease}>+</Button>
        </div>
        {/* <Button className="w-16 bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700" variant="outline" size="sm" type="button">Delete</Button> */}
        <div className="flex items-center space-x-4">
          <p className="product-price text-lg font-bold">${(price * quantity).toFixed(2)}</p>
          <Button 
            className="bg-red-600 text-white font-bold rounded hover:bg-red-700" 
            variant="outline" 
            size="sm" 
            type="button"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  }