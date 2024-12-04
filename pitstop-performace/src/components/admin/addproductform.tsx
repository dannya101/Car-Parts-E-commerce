'use client';

import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface AddProductFormProps {
    onSubmit: (productData:{
        name: string, 
        description: string, 
        price: number, 
        tags: string[], 
        images: string[], 
        thumbnail: string,
        part_category_id: number,
        brand_category_id: number,
        model_category_id: number
    }) => void;
    onCancel: () => void;
}

export default function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [priceInput, setPriceInput] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<string>("");
    const [part_category_id, setPartCategory] = useState<number>(0);
    const [brand_category_id, setBrandCategory] = useState<number>(0);
    const [model_category_id, setModelCategory] = useState<number>(0);
    
    const [partCategories, setPartCategories] = useState<any[]>([]);
    const [brandCategories, setBrandCategories] = useState<any[]>([]);
    const [modelCategories, setModelCategories] = useState<any[]>([]);

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const partResponse = await fetch("http://localhost:8000/product/partcategories");
                const brandResponse = await fetch("http://localhost:8000/product/brandcategories");
                const modelResponse = await fetch("http://localhost:8000/product/modelcategories");

                const partData = await partResponse.json();
                const brandData = await brandResponse.json();
                const modelData = await modelResponse.json();

                if(partResponse.ok) setPartCategories(partData);
                if(brandResponse.ok) setBrandCategories(brandData);
                if(modelResponse.ok) setModelCategories(modelData);

                if(!partResponse.ok) throw new Error("FETCH PART CATEGORY ERROR");
                if(!brandResponse.ok) throw new Error("FETCH BRAND CATEGORY ERROR");
                if(!modelResponse.ok) throw new Error("FETCH MODEL CATEGORY ERROR");
                
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Make sure part, model, and brand categories have at least 1 value",
                    variant: "destructive"
                })
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && description && price > 0) {
            const productData = {
                name,
                description,
                price,
                tags,
                images,
                thumbnail,
                part_category_id,
                brand_category_id,
                model_category_id,
            };
            onSubmit(productData);  // Use the correct call signature
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags((prev) => [...prev, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };


    const handleRemoveImage = (url: string) => {
        setImages((prev) => prev.filter((img) => img !== url));
        if (thumbnail === url) setThumbnail(""); // Clear thumbnail if it's the removed image
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white shadow rounded-lg">
            <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                        rows={3}
                        required
                    />
                </div>

                <div>
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                    type="text"
                    value={priceInput}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and a single decimal point
                            setPriceInput(value);
                            setPrice(parseFloat(value) || 0); // Update numeric state
                        }
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    required
                />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image URL:</label>
                    <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                        placeholder="Enter an image URL"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Tags:</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="flex-grow px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                            placeholder="Enter a tag"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Add Tag
                        </button>
                    </div>
                    <div className="mt-2 space-x-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Categories Display */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Part Category:</label>
                    <select
                        value={part_category_id}
                        onChange={(e) => setPartCategory(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    >
                        <option value={0}>Select Part Category</option>
                        {partCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.part_type_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Brand Category:</label>
                    <select
                        value={brand_category_id}
                        onChange={(e) => setBrandCategory(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    >
                        <option value={0}>Select Brand Category</option>
                        {brandCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.brand_type_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Model Category:</label>
                    <select
                        value={model_category_id}
                        onChange={(e) => setModelCategory(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                    >
                        <option value={0}>Select Model Category</option>
                        {modelCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.model_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </form>
    );
}