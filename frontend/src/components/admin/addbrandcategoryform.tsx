'use client';

import { useState } from "react";

interface AddBrandCategoryFormProps {
    onSubmit: (name: string, description: string) => void;
    onCancel: () => void;
}

export default function AddBrandCategoryForm({ onSubmit, onCancel }: AddBrandCategoryFormProps) {
    const [brand_type_name, setName] = useState("");
    const [brand_type_description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (brand_type_name) {
            onSubmit(brand_type_name, brand_type_description); // Submit the form
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add Brand Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">Brand Name</label>
                    <input
                        type="text"
                        value={brand_type_name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Enter Brand Name"
                    />
                </div>
                <div>
                    <label className="block text-sm">Brand Description</label>
                    <input
                        type="text"
                        value={brand_type_description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Enter Brand Description"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Add Category
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