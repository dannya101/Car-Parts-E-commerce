'use client'

import { useState,useMemo } from 'react'
import { SearchBar } from '../ui/searchBar'
import { useToast } from '@/hooks/use-toast'
import { AddToCartButton } from '../addToCart'
import { useRouter } from "next/navigation";
import { Button } from '../ui/navbutton'


export default function HomeButton() {
  const [searchResults, setSearchResults] = useState<string>('')
  const router = useRouter();

  const execute = ()=> {
    router.push(`/results?query=${encodeURIComponent("all")}`);

  }

  return (
    <div className="">
      <Button
      variant={"outline"}
      onClick={execute}
      className='flex w-52 text-xl bg-white border-solid border-4 border-black'
      
      >View All Products</Button>
    </div>
  )
}

