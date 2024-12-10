'use client';

import { useState } from "react";

interface AddPartCategoryFormProps {
    onSubmit: (name: string, description: string) => void;
    onCancel: () => void;
}

export default function AddPartCategoryForm({ onSubmit, onCancel }: AddPartCategoryFormProps) {
    const [part_type_name, setPartTypeName] = useState("");
    const [part_type_description, setPartTypeDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (part_type_name) {
            onSubmit(part_type_name, part_type_description); // Submit with correct keys
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add Part Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">Part Type Name</label>
                    <input
                        type="text"
                        value={part_type_name}
                        onChange={(e) => setPartTypeName(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Enter Part Name"
                    />
                </div>
                <div>
                    <label className="block text-sm">Part Type Description</label>
                    <input
                        type="text"
                        value={part_type_description}
                        onChange={(e) => setPartTypeDescription(e.target.value)}
                        className="border p-2 w-full"
                        placeholder="Enter Part Description"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Add Part
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