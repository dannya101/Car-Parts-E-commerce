import React, { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/navbutton";
import { useToast } from "@/hooks/use-toast";
import { AddToCartButton } from "./addToCart";
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

const ProductSelector: React.FC<ProductSelectorProps> = ({ product_list = [], onProductSelect }): JSX.Element => {
  const [products, setProducts] = useState<Product[]>(product_list);
  const [searchResults, setSearchResults] = useState<string>('');

  useEffect(() => {
    setProducts(product_list);
    console.log("Updated productList: ", product_list);
  }, [product_list]);

  // Handle product selection and call the callback with the selected product's ID
  const handleProductSelect = (productId: number) => {
    onProductSelect(productId);  // Return the product ID to the parent component
  };


  const filteredProducts = useMemo(() => {
    if (!searchResults || searchResults.localeCompare("") === 0) return product_list;
    return product_list.filter(product => 
      product.name.toLowerCase().includes(searchResults.toLowerCase()) ||
      product.description.toLowerCase().includes(searchResults.toLowerCase())
    );
  }, [product_list, searchResults]);


  console.log("Products: ", products);
  console.log("Filtered Products: ", filteredProducts)
  console.log("Search: ", searchResults)
  const handleSearch = async(query: string) => {
    setSearchResults(query);
    if(filteredProducts.length === 0)
    {
      console.log("Products length is 0")
    }

  }


  return (
    <div className="flex flex-col items-center">
      <div className="relative mt-4 flex-row space-x-40 flex">
      <h2 className="text-2xl font-semibold mb-4">
          {searchResults ? `Search Results for "${searchResults}"` : "All Products"}
      </h2>
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
      </div>
      <div className="grid grid-cols-4 gap-6 overflow-y-auto max-h-[80vh] mt-4"> 
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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