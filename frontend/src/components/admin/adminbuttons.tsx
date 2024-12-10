'use client';

import { useEffect, useState } from "react";
import AddPartCategoryForm from "@/components/admin/addpartcategoryform";
import AddBrandCategoryForm from "@/components/admin/addbrandcategoryform";
import AddProductForm from "@/components/admin/addproductform"; 
import AddModelCategoryForm from "@/components/admin/addmodelcategoryform";
import { useToast } from "@/hooks/use-toast";
import ProductSelector from "@/components/productselector";
import UpdateProductForm from "@/components/admin/updateproductform";
import DeleteProductForm from "@/components/admin/deleteproductform";

interface Product {
    id: number,
    name: string, 
    description: string, 
    price: number, 
    tags: string[], 
    images: string[], 
    thumbnail: string,
    part_category_id: number,
    brand_category_id: number,
    model_category_id: number
}

export default function AdminButtons() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<string | null>(null); // Track which form is visible
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productList, setProductList] = useState<Product[]>([]);
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

    const handleUpdateProduct = async () => {
        setShowForm("updateProduct");
        await apiGetAllProducts();
    };

    const handleDeleteProduct = async () => {
        setShowForm("deleteProduct");
        await apiGetAllProducts();
    };

    const handleProductSelect = (product_id: number) => {
        setSelectedProductId(product_id);
        console.log("Selected Product ID: ", product_id);
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

    const apiGetAllProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/product/");
            if (!response.ok) {
            throw new Error("Failed to fetch products");
            }
            const data: Product[] = await response.json();
            setProductList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const apiGetSelectedProduct = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/product/get?product_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data: Product = await response.json();

            setSelectedProduct(data);
        } catch (error) {
            console.error("Error fetching product: ", error);
        } finally {
            setLoading(false);
        }
    };

    const apiRemoveProduct = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/admin/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(!response.ok) {
                throw new Error("Failed to delete product")
            }

            const reply = await response.json();

            console.log("Delete Response: ",reply);
        } catch (error) {
            console.error("Error Deleting Product: ", error);
        } finally {
            setLoading(false);
        }
    };

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
            } else if (showForm === "updateProduct") {
                setSelectedProductId(null);
            } else if (showForm === "deleteProduct" && selectedProductId) {
                await apiRemoveProduct(selectedProductId);
                await apiGetAllProducts();
                setSelectedProductId(null);
                setShowForm(null);
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
        setSelectedProductId(null);
        setSelectedProduct(null);
        setShowForm(null); // Close form when cancelled
    };

    useEffect(() => {
        if(selectedProductId) {
            apiGetSelectedProduct(selectedProductId);
        }
    }, [selectedProductId]);

    return (
        <>
        <div className="container p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Page</h1>

            {/* Buttons for different actions */}
            <div className="space-y-4 mb-6">

                {/* Row 1: Part, Brand, Model Categories */}
                <div className="flex flex-wrap gap-2">
                    {/*Add Part Category*/}
                    <button 
                        onClick={handleAddPartCategory} 
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Add Part Category
                    </button>

                    {/*Add Brand Category*/}
                    <button 
                        onClick={handleAddBrandCategory} 
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Add Brand Category
                    </button>

                    {/*Add Model Category*/}
                    <button 
                        onClick={handleAddModelCategory} 
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Add Model Category
                    </button>
                </div>

                {/* Row 2: Product Actions */}
                <div className="flex flex-wrap gap-2">
                    {/*Add Product*/}
                    <button 
                        onClick={handleAddProduct} 
                        className="bg-green-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Add Product
                    </button>

                    {/*Update Product*/}
                    <button 
                        onClick={handleUpdateProduct} 
                        className="bg-yellow-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Update Product
                    </button>

                    {/*Delete Product*/}
                    <button 
                        onClick={handleDeleteProduct} 
                        className="bg-red-500 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Delete Product
                    </button>
                </div>
            </div>
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
            {showForm === "updateProduct" && !selectedProductId && productList && (
                <ProductSelector 
                    onProductSelect={handleProductSelect} 
                    product_list={productList}
                />
            )}
            {showForm === "updateProduct" && selectedProductId && (
                <UpdateProductForm 
                    onSubmit={(productData) => handleFormSubmit(productData)}
                    onCancel={handleCancel}
                    product_id={selectedProductId}
                />
            )}
            {showForm === "deleteProduct" && !selectedProductId && productList && (
                <ProductSelector 
                    onProductSelect={handleProductSelect}
                    product_list={productList}
                />
            )}
            {showForm === "deleteProduct" && selectedProductId && (
                <DeleteProductForm 
                    product_id={selectedProductId} 
                    onCancel={handleCancel} 
                    onSubmit={() => handleFormSubmit({})}
                />
            )}
            </>
    )
}