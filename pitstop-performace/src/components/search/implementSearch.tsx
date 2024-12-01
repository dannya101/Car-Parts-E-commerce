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
}

export default function SearchPage({ product_list }: ProductSelectorProps) {
  const { toast } = useToast()
  const [searchResults, setSearchResults] = useState<string>('')
  const filteredProducts = product_list.filter(product =>
    product.name.toLowerCase().includes(searchResults.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchResults(query);
    if (product_list.length === 0) {
      toast({
        title: "No results found",
        description: `No products match the search query: ${query}`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
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
                    {/* {product.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-200 rounded-full px-2 py-1">
                        {tag}
                      </span>
                    ))} */}
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

