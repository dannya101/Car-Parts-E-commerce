'use client';

import {useState, useEffect} from "react";

interface DeleteProductFormProps {
    onSubmit: () => void;
    onCancel: () => void;
    product_id: number;
}

export default function DeleteProductForm({onSubmit, onCancel, product_id}: DeleteProductFormProps) {

    return (
        <div>
            <p>Are you sure you want to delete product {product_id}?</p>
            <button onClick={onSubmit} className="bg-red-500 text-white py-2 px-4 rounded">Confirm Delete</button>
            <button onClick={onCancel} className="bg-gray-300 py-2 px-4 rounded">Cancel</button>
        </div>
    );
}