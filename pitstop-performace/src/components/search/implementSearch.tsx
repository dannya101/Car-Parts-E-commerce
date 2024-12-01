'use client'

import { useState,useMemo } from 'react'
import { SearchBar } from '../ui/searchBar'
import { useToast } from '@/hooks/use-toast'
import { AddToCartButton } from '../addToCart'

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
  product_list: Product[];
  searchResults: String;
}

export default function SearchPage({ product_list, searchResults }: ProductSelectorProps) {
  const [query, setQuery] = useState(''); // State to track the search input
  const [filteredItems, setFilteredItems] = useState<Product[]>(product_list);
  // const filteredProducts = product_list.filter(product =>
  //   product.name.toLowerCase().includes(searchResults.toLowerCase())
  // );


  const handleFilter = (query: string) => {
    const lowerQuery = query.toLowerCase(); // Convert query to lowercase
    const results = product_list.filter(product => product.name.toLowerCase().includes(lowerQuery) || 
    product.description.toLowerCase().includes(lowerQuery)); // Filter logic
    setFilteredItems(results); // Update filtered items
  };

  return (
    <div className="p-4">
      {searchResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
          {`Search Results for "${searchResults}"`}
          </h2>

        {product_list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product_list.map((product) => (
              <div
                key={product.id}
                className="relative flex flex-col justify-between p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div>
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  <AddToCartButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products available</p>
        )}


        </div>
      )}
    </div>
  )
}

