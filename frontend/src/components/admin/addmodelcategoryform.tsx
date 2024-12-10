'use client';

import { useState, useEffect } from "react";

interface AddModelCategoryFormProps {
    onSubmit: (model_name: string, brand_id: number) => void;
    onCancel: () => void;
}

export default function AddModelCategoryForm({ onSubmit, onCancel }: AddModelCategoryFormProps) {
    const [model_name, setModelName] = useState("");
    const [brand_id, setBrandID] = useState(0);

    const [brandCategories, setBrandCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const brandResponse = await fetch("http://localhost:8000/product/brandcategories");

                const brandData = await brandResponse.json();

                setBrandCategories(brandData);
            } catch(error) {
                console.error("Error Fetching Brands: ", error);
            }
        };
        fetchBrands();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (model_name && brand_id != 0) {
            onSubmit(model_name, brand_id);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add Model Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">Model Name</label>
                    <input
                        type="text"
                        value={model_name}
                        onChange={(e) => setModelName(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Enter Model Name"
                    />
                </div>
                <div>
                    <label className="block text-sm">Model Brand</label>
                    <select
                        value={brand_id}
                        onChange={(e) => setBrandID(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    >
                        <option value={0}>Select Brand</option>
                        {brandCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.brand_type_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Add Model
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}