'use client';

import { useState } from "react";
import AddPartCategoryForm from "@/components/admin/addpartcategoryform";
import AddBrandCategoryForm from "@/components/admin/addbrandcategoryform";
import AddProductForm from "@/components/admin/addproductform"; 
import AddModelCategoryForm from "@/components/admin/addmodelcategoryform";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<string | null>(null); // Track which form is visible
    const { toast } = useToast();

    const handleAddPartCategory = () => {
        setShowForm("addPartCategory");
    };

    const handleAddBrandCategory = () => {
        setShowForm("addBrandCategory");
    };

    const handleAddModelCategory = () => {
        setShowForm("addModelCategory");
    };

    const handleAddProduct = () => {
        setShowForm("addProduct");
    };

    const apiAddCategory = async (categoryType: string, data: { part_type_name?: string; part_type_description?: string; name?: string; description?: string }) => {
        console.log("Sending Data:", JSON.stringify(data));
        const response = await fetch(`http://localhost:8000/admin/add-${categoryType}-category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Send the data as JSON
        });
    
        if (response.ok) {
            return response.json();
        } else {
            const errorResponse = await response.text(); // Log error from backend
            console.error("Error Response:", errorResponse);
            throw new Error("Failed to add category");
        }
    };

    const apiAddModel = async (data: {model_name: string, brand_id: number}) => {
        console.log("Sending Data:", JSON.stringify(data));
        const response = await fetch(`http://localhost:8000/admin/add-model-category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Send the data as JSON
        });
    
        if (response.ok) {
            return response.json();
        } else {
            const errorResponse = await response.text(); // Log error from backend
            console.error("Error Response:", errorResponse);
            throw new Error("Failed to add category");
        }
    }

    const apiAddProduct = async (data: {name: string, price: number, description: string, part_category_id: number, brand_category_id: number, model_category_id: number}) => {
        console.log("data obj: ", data);
        console.log("API Send: ", JSON.stringify(data));
        const response = await fetch("http://localhost:8000/admin/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    
        return response.json();
    }

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
    
        try {
            if (showForm === "addPartCategory") {
                // Map form fields to backend keys
                const response = await apiAddCategory("part", data);
                console.log("API Response:", response);
            } else if (showForm === "addBrandCategory") {
                const response = await apiAddCategory("brand", data);
                console.log("API Response:", response);
            } else if (showForm === "addModelCategory") {
                const response = await apiAddModel(data);
            } else if (showForm === "addProduct") {
                const response = await apiAddProduct(data);
                console.log("API Response:", response);
            }
    
            toast({
                title: "Success",
                description: "Form submitted successfully",
            });
        } catch (error) {
            console.error("Submission Error:", error);
            toast({
                title: "Error",
                description: "Failed to submit form. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setShowForm(null); // Close the form
        }
    };

    const handleCancel = () => {
        setShowForm(null); // Close form when cancelled
    };

    return (
        <div className="container p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Page</h1>

            {/* Buttons for different actions */}
            <div className="space-y-4 mb-6">
                <button 
                    onClick={handleAddPartCategory} 
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    Add Part Category
                </button>
                <button 
                    onClick={handleAddBrandCategory} 
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    Add Brand Category
                </button>
                <button 
                    onClick={handleAddModelCategory} 
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    Add Model Category
                </button>
                <button 
                    onClick={handleAddProduct} 
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    disabled={loading}
                >
                    Add Product
                </button>
            </div>

            {/* Form Rendering Based on Button Click */}
            {showForm === "addPartCategory" && (
                <AddPartCategoryForm
                    onSubmit={(part_type_name, part_type_description) => handleFormSubmit({ part_type_name, part_type_description })}
                    onCancel={handleCancel}
                />
            )}
            {showForm === "addBrandCategory" && (
                <AddBrandCategoryForm
                    onSubmit={(brand_type_name, brand_type_description) => handleFormSubmit({ brand_type_name, brand_type_description })}
                    onCancel={handleCancel}
                />
            )}
            {showForm === "addModelCategory" && (
                <AddModelCategoryForm
                    onSubmit={(model_name, brand_id) => handleFormSubmit({ model_name, brand_id })}
                    onCancel={handleCancel}
                />
            )}
            {showForm === "addProduct" && (
                <AddProductForm
                    onSubmit={(productData) => handleFormSubmit(productData)}
                    onCancel={handleCancel}
                />
            )}

            {/* Optional: Display loading indicator */}
            {loading && <p className="mt-4 text-center text-gray-500">Loading...</p>}
        </div>
    );
}