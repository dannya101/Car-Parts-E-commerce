'use client'

import { useState,useMemo } from 'react'
import { SearchBar } from '../ui/searchBar'
import { useToast } from '@/hooks/use-toast'
import { AddToCartButton } from '../addToCart'
import { useRouter } from "next/navigation";


export default function HomeSearch() {
  const [searchResults, setSearchResults] = useState<string>('')
  const router = useRouter();

  const handleSearch = async(query: string) => {
    setSearchResults(query);
    router.push(`/results?query=${encodeURIComponent(query)}`);
  }

  return (
    <div className="">
      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} placeholder="Enter your search query" />
    </div>
  )
}

