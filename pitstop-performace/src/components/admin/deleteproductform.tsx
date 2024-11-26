'use client';

import {useState, useEffect} from "react";

interface DeleteProductFormProps {
    onSubmit: () => void;
    onCancel: () => void;
    product_id: number;
}

export default function DeleteProductForm({onCancel, product_id}: DeleteProductFormProps) {

    useEffect(() => {
        removeProduct(product_id);
    }, [product_id]);

    const removeProduct = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/admin/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        
            const reply = await response.json();

            console.log(reply);
        } catch (error) {
            console.error("Error Deleting Product: ", error);
            return;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (<></>)
}