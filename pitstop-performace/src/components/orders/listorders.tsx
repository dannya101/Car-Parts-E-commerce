'use client';
import React, { useState, useEffect } from "react";

type OrderItem = {
    product_name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    user_id: number;
    status: string;
    total_price: number;
    items: OrderItem[]; 
};

export function ListOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/orders", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.order_content); 
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch orders.");
                }
            } catch (err) {
                setError("Error fetching orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map((order, index) => (
                        <li key={order.id} className="p-4 border rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">Order #{index + 1}</h3>
                            <p>Status: <span className="text-green-600">{order.status}</span></p>
                            <p>Total: <span className="font-bold">${order.total_price.toFixed(2)}</span></p>
                            <h4 className="font-semibold mt-2">Items:</h4>
                            <ul className="space-y-2 pl-4">
                                {order.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="text-sm">
                                        <p><strong>Item #{itemIndex + 1}</strong></p>
                                        <p>Product: <span className="font-bold">{item.product_name}</span></p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
