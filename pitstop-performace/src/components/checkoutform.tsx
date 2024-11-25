'use client';
import { ProductItem } from "@/components/productitem";
import React, { useState } from "react"

export function CheckoutForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsModalOpen(true);
        console.log("Form submitted!");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const mockTotal = 123.45;
    const mockCart = [
        {id: 1, name: "Tires", price: 125.99, quantity: 4},
        {id: 2, name: "Wheels", price: 100.99, quantity: 4},
        {id: 3, name: "Gear Shifter", price: 25.99, quantity: 1},
    ];
    
  
    return (
        <div>
        <form
        onSubmit={handleSubmit}
        className="checkout-form mx-auto max-w-3xl bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
        {/* Product List */}
        <div className="product-list space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart</h2>
            {mockCart.map((product) => (
            <ProductItem
                key={product.id}
                name={product.name}
                price={product.price}
                quantity={product.quantity}
            />
            ))}
        </div>

        {/* Total Section */}
        <div className="total-section text-right mb-4">
            <p className="text-xl font-bold">
            Total: <span className="text-blue-600">${mockTotal.toFixed(2)}</span>
            </p>
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
            Place Order
        </button>
        </form>
        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
                <h2 className="text-2xl font-bold text-center mb-4">Complete Your Order</h2>

                <form>
                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Payment Method</label>
                    <select className="w-full p-2 border rounded">
                    <option value="creditCard">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bankTransfer">Bank Transfer</option>
                    </select>
                </div>

                {/* Shipping Method */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Shipping Method</label>
                    <select className="w-full p-2 border rounded">
                    <option value="standard">Standard Shipping</option>
                    <option value="express">Express Shipping</option>
                    </select>
                </div>

                {/* Billing Address */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Billing Address</label>
                    <input type="text" placeholder="Street Address" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="City" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="State/Province" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="ZIP Code" className="w-full p-2 border rounded mb-2" />
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Shipping Address</label>
                    <input type="text" placeholder="Street Address" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="City" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="State/Province" className="w-full p-2 border rounded mb-2" />
                    <input type="text" placeholder="ZIP Code" className="w-full p-2 border rounded mb-2" />
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                    <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                    Close
                    </button>
                    <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                    Confirm Order
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
    </div>
    );
  }