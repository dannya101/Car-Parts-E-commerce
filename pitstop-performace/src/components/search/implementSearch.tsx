'use client'

import { useState } from 'react'
import { SearchBar } from '../ui/searchBar'
import { useToast } from '@/hooks/use-toast'

export default function SearchPage() {
  const { toast } = useToast()
  const [searchResults, setSearchResults] = useState<string | null>(null)

  const handleSearch = async(query: string) => {
      try {
        const response = await fetch("http://localhost:8000/search/{search_terms}", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        })
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
        })
      }
      setSearchResults(`Search results for: ${query}`)
    }

  return (
    <div className="p-4">
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
      {searchResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Results:</h2>
          <p>{searchResults}</p>
        </div>
      )}
    </div>
  )
}

