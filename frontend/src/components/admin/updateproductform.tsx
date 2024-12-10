'use client';

import { useState, useEffect } from "react";

interface Product {
    name: string, 
    description: string, 
    price: number, 
    tags: string | string[], 
    images: string | string[], 
    thumbnail: string,
    part_category_id: number,
    brand_category_id: number,
    model_category_id: number
}
  

interface AddProductFormProps {
    onSubmit: (productData: Product) => void;
    onCancel: () => void;
    product_id: number;
}

export default function UpdateProductForm({ onSubmit, onCancel, product_id }: AddProductFormProps) {
    const [id, setId] = useState(0);
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
    
    const [product, setProduct] = useState<Product | null>(null);

    const [partCategories, setPartCategories] = useState<any[]>([]);
    const [brandCategories, setBrandCategories] = useState<any[]>([]);
    const [modelCategories, setModelCategories] = useState<any[]>([]);

    useEffect(() => {
        if(product_id) {
            fetchProduct(product_id);
            fetchCategories();
        }
    }, [product_id]);

    const fetchCategories = async () => {
        try {
            const partResponse = await fetch("http://localhost:8000/product/partcategories");
            const brandResponse = await fetch("http://localhost:8000/product/brandcategories");
            const modelResponse = await fetch("http://localhost:8000/product/modelcategories");

            const partData = await partResponse.json();
            const brandData = await brandResponse.json();
            const modelData = await modelResponse.json();

            setPartCategories(partData);
            setBrandCategories(brandData);
            setModelCategories(modelData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProduct = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/product/get?product_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const data: Product = await response.json();

            setProduct(data);

            setId(id);
            setName(data.name || "");
            setDescription(data.description || "");
            setPrice(data.price || 0);

            // Parse tags and images if they are strings
            setTags(Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"));
            setImages(Array.isArray(data.images) ? data.images : JSON.parse(data.images || "[]"));

            setThumbnail(data.thumbnail || "");
            setPartCategory(data.part_category_id || 0);
            setBrandCategory(data.brand_category_id || 0);
            setModelCategory(data.model_category_id || 0);

        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (product) {
            const updatedProduct: Product = {
                name, 
                description, 
                price: price || product.price, // Default to the current price if not updated
                tags, 
                images, 
                thumbnail, 
                part_category_id, 
                brand_category_id, 
                model_category_id
            };
            console.log("Updated Product: ", JSON.stringify(updatedProduct));
            try {
                const response = await fetch(`http://localhost:8000/admin/products/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedProduct)
                });

                if (response.ok) {
                    const data = await response.json(); // Handle the response if needed
                    console.log("Product updated successfully:", data);
                    onSubmit(updatedProduct); // Pass the updated product to the onSubmit callback
                } else {
                    console.error("Failed to update product:", response.status);
                    // You can handle error scenarios here
                }
            } catch (error) {
                console.error("Error:", error);
                // Handle fetch errors here
            }
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
          setTags((prevTags) => [...prevTags, tagInput.trim()]);  // Add the new tag to the array
          setTagInput(""); // Clear the input field after adding the tag
        }
      };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));  // Remove the tag from the array
    };

    // Handle thumbnail file upload
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a FormData object to send the file
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8000/product/upload/image", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setThumbnail(data.imageUrl); // Set the thumbnail URL from the response
                    console.log("Thumbnail uploaded successfully:", data);
                } else {
                    console.error("Failed to upload thumbnail:", response.status);
                }
            } catch (error) {
                console.error("Error uploading thumbnail:", error);
            }
        }
    };

    return (
        <div>
            <h1>Update Product</h1>
            <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <label className="block text-sm font-medium mb-1">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                />

                {/* Description */}
                <label className="block text-sm font-medium mb-1">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                />

                {/* Price */}
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                    type="text"
                    value={price || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and a single decimal point
                            setPriceInput(value);
                            setPrice(parseFloat(value) || 0); // Update numeric state
                        }
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="0"
                    required={false}
                />

                {/* Thumbnail - File Upload */}
                <label className="block text-sm font-medium mb-1">Thumbnail (Upload Image):</label>
                <input
                    type="file"
                    onChange={handleThumbnailUpload}
                    className="w-full px-3 py-2 border rounded-lg"
                />

                {/* Category Select */}
                <label className="block text-sm font-medium mb-1">Part Category:</label>
                <select
                    value={part_category_id}
                    onChange={(e) => setPartCategory(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value={0}>Select Part Category</option>
                    {partCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.part_type_name}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium mb-1">Brand Category:</label>
                <select
                    value={brand_category_id}
                    onChange={(e) => setBrandCategory(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value={0}>Select Brand Category</option>
                    {brandCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.brand_type_name}
                        </option>
                    ))}
                </select>

                <label className="block text-sm font-medium mb-1">Model Category:</label>
                <select
                    value={model_category_id}
                    onChange={(e) => setModelCategory(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value={0}>Select Model Category</option>
                    {modelCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.model_name}
                        </option>
                    ))}
                </select>

                {/* Submit and Cancel buttons */}
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save Changes</button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
            </form>
        </div>
    );
}
