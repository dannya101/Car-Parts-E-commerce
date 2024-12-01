'use client';
import { ProductItem } from "@/components/productitem";
import React, { useState, useEffect } from "react"
import { ClearCartButton } from "./clearCart";
import { ContinueButton } from "./continueToShopButton";
import { Button } from '../ui/navbutton';


export function CheckoutForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cart, setCart] = useState<{ product: { name: string; price: number }; quantity: number }[]>([]);
    const [total, setTotal] = useState<number>(0);

    // Fetch cart data from the backend
    useEffect(() => {
        const fetchCartData = async () => {
            const token = sessionStorage.getItem("access_token");

            if(!token) {
                console.error("Not Authenticated");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/cart/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                const data = await response.json();

                if (response.ok) {
                // Update state with cart items and total
                setCart(data.items);
                setTotal(data.total_price);
                } else {
                console.error("Error fetching cart data:", data);
                }
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };

        fetchCartData(); // Call the function to fetch data when the component mounts
    }, []);  // Empty dependency array to run only once when the component mounts

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsModalOpen(true);
        console.log("Form submitted!");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };
    const updateCartItem = async (index: number, newQuantity: number) => {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            console.error("Not Authenticated");
            return;
        }

        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;

        try {
            const response = await fetch("http://localhost:8000/cart/update/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    product_id: updatedCart[index].product.name, // Assuming the name is used as the ID
                    quantity: newQuantity,
                }),
            });
        }
        catch (error) {
            console.error("Error updating cart item:", error);
        }
    };
  
    return (
        <div>
        <form
        onSubmit={handleSubmit}
        className="checkout-form mx-auto max-w-3xl bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        >
        {/* Product List */}
        <div className="product-list space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart</h2>
            {cart.map((item, index) => (
            <ProductItem
                key={index}
                name={item.product.name}
                price={item.product.price}
                quantity={item.quantity}
                onIncrease={() => updateCartItem(index, item.quantity + 1)}
                onDecrease={() => updateCartItem(index, item.quantity - 1)}
            />
            ))}
        </div>

        {/* Total Section */}
        <div className="total-section text-right mb-4">
            <p className="text-xl font-bold">
            Total: <span className="text-blue-600">${total.toFixed(2)}</span>
            </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
            <ContinueButton />
            <ClearCartButton />
            <Button
            type="submit"
            className="w-40 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
            Place Order
            </Button>
        </div>
        
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