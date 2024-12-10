'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './navbutton'
import { Input } from './input'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter();

  const handleSubmit = ()=> {
    onSearch(query)
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow bg-white border-solid border-2 border-black"
        aria-label="Search input"
      />
      <Button onClick={handleSubmit} aria-label="Perform search">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )
}

