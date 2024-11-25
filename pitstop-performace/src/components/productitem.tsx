'use client';

type ProductItemProps = {
    name: string;
    price: number;
    quantity: number;
}

export function ProductItem({ name, price, quantity }: ProductItemProps) {
    return (
      <div className="product-item flex justify-between items-center border-b border-gray-300 py-4">
        <div className="product-details">
          <h2 className="text-lg font-medium">{name}</h2>
          <p className="text-sm text-gray-500">Quantity: {quantity}</p>
        </div>
        <p className="product-price text-lg font-bold">${(price * quantity).toFixed(2)}</p>
      </div>
    );
  }