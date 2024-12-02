import React from "react";
import { ListOrders } from "@/components/orders/listorders";

export default function Orders() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">ORDERS</h1>
            <ListOrders />
        </div>
    );
}
