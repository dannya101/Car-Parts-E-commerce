import React, { useState, useEffect } from "react";

// Define the product type
interface Product {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
}

interface ProductSelectorProps {
  onProductSelect: (productId: number) => void;  // Callback function to return product ID
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ onProductSelect }): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/product/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Handle product selection and call the callback with the selected product's ID
  const handleProductSelect = (productId: number) => {
    onProductSelect(productId);  // Return the product ID to the parent component
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Browse Products</h2>
      <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[80vh]">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[330px] h-[400px] p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleProductSelect(product.id)} // Return the product ID on click
          >
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSelector;