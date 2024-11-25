'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
}

export default function Results() {
    const searchParams = useSearchParams();
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if(!make || !model) {
                setError("Missing Make or Model in search parameters");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/product/get/brand-model?brand_category_id=${make}&model_category_id=${model}`);

                if(!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.statusText}`);
                }

                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [make, model]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            {products.length > 0 ? (
            <ul>
                {products.map((product) => (
                <li key={product.id}>
                    <div className="border p-2 my-2">
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p>Price: ${product.price.toFixed(2)}</p>
                    </div>
                </li>
                ))}
            </ul>
            ) : (
            <p>No products found for the selected make and model.</p>
            )}
        </div>
    );
}