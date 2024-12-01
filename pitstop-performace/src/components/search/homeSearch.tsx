'use client'

import { useState,useMemo } from 'react'
import { SearchBar } from '../ui/searchBar'
import { useToast } from '@/hooks/use-toast'
import { AddToCartButton } from '../addToCart'


export default function HomeSearch() {
  const { toast } = useToast()
  const [searchResults, setSearchResults] = useState<string>('')

  const handleSearch = async(query: string) => {
    setSearchResults(query);
    try {
        const response = await fetch("http://localhost:8000/search/{search_terms}", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                search_terms: searchResults
            }),
        })
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
        })
      }
  }

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
      
      {/* {searchResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
          {`Search Results for "${searchResults}"`}
          </h2>

        


        </div>
      )} */}
    </div>
  )
}

