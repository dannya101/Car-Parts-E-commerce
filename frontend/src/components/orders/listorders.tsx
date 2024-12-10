'use client';
import React, { useState, useEffect } from "react";

type OrderItem = {
    product_name: string;
    product_thumbnail: string;
    item_quantity: number;
    item_price: number;
};

type Order = {
    id: number;
    status: string;
    total_price: number;
    items: OrderItem[];
};

export function ListOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/orders/", {
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

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

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
                        <li
                            key={order.id}
                            className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                            onClick={() => handleOrderClick(order)}
                        >
                            <h3 className="font-bold text-lg">Order #{index + 1}</h3>
                            <p>Status: <span className="text-green-600">{order.status}</span></p>
                            <p>Total: <span className="font-bold">${order.total_price.toFixed(2)}</span></p>
                        </li>
                    ))}
                </ul>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-3/4 max-w-lg">
                        <h3 className="text-2xl font-bold mb-4">Order Details</h3>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                        <p><strong>Total:</strong> ${selectedOrder.total_price.toFixed(2)}</p>
                        <h4 className="font-semibold mt-4">Items:</h4>
                        <ul className="space-y-2">
                            {selectedOrder.items.map((item, index) => (
                                <li key={index} className="flex items-start space-x-4">
                                    <img
                                        src={item.product_thumbnail}
                                        alt={item.product_name}
                                        className="w-16 h-16 object-cover"
                                    />
                                    <div>
                                        <p><strong>{item.product_name}</strong></p>
                                        <p>Quantity: {item.item_quantity}</p>
                                        <p>Price: ${item.item_price.toFixed(2)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={closeModal}
                            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
