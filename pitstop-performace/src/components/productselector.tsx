import React, { useState, useEffect } from "react";
import { Button } from "./ui/navbutton";
import { METHODS } from "http";
import { useToast } from "@/hooks/use-toast";
import { AddToCartButton } from "./addToCart";
import SearchPage from "./search/implementSearch";
import { SearchBar } from "./ui/searchBar";


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

interface ProductSelectorProps {
  onProductSelect: (productId: number) => void;  // Callback function to return product ID
  product_list: Product[];
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ product_list, onProductSelect }): JSX.Element => {
  const [products, setProducts] = useState<Product[]>(product_list);
  const [searchResults, setSearchResults] = useState<string>('');
  

  useEffect(() => {
    setProducts(product_list);
  }, [product_list]);

  // Handle product selection and call the callback with the selected product's ID
  const handleProductSelect = (productId: number) => {
    onProductSelect(productId);  // Return the product ID to the parent component
  };

  console.log("Products: ", products);
  const filteredProducts = product_list.filter(product =>
    product.name.toLowerCase().includes(searchResults.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchResults(query);
  }


  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-4 ml-4">
      <h2 className="text-2xl font-bold">Browse Products</h2>
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
      </div>
      <div className="grid grid-cols-4 gap-6 overflow-y-auto max-h-[80vh] mt-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="relative w-[330px] h-[400px] p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductSelect(product.id)} // Return the product ID on click
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="text-2xl font-semibold">{product.name}</h3>
              <p className="text-md text-gray-600">{product.description}</p>
              <h4 className="absolute bottom-4 right-6 text-4xl font-bold">${product.price}</h4>
             <AddToCartButton productId={product.id} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products available</p>
        )}
      </div>
    </div>
  );
};


export default ProductSelector;