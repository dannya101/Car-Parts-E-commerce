"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectScrollableResult } from "@/components/search/selectresult";
import { useState, useEffect } from "react";
import { Searchbutton } from "@/components/search/searchbutton";

interface BrandCategories {
  brand_type_name: string;
  id: number;
  brand_type_description: string;
}

export function SelectScrollable() {
  const [brands, setBrands] = useState<BrandCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedBrand, setSelectedMake] = useState<{ id: number; brand_type_name: string } | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:8000/product/brandcategories");
        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.statusText}`);
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleModelChange = (newValue: string) => {
    setSelectedModel(newValue);
  };

  const handleMakeChange = (selectedId: string) => {
    const brand = brands.find((b) => b.id.toString() === selectedId);
    if (brand) {
      setSelectedMake({ id: brand.id, brand_type_name: brand.brand_type_name });
    }
  };

  console.log("Selected Brand: ", selectedBrand?.brand_type_name);
  console.log("Selected Brand ID: ", selectedBrand?.id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <Select onValueChange={handleMakeChange}>
        <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
          <SelectValue placeholder="Make" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id.toString()}>
              {brand.brand_type_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedBrand && (
        <SelectScrollableResult
          selectedBrandName={selectedBrand.brand_type_name}
          selectedBrandId={selectedBrand.id}
          onModelSelect={handleModelChange}
        />
      )}
      
      { selectedBrand && selectedModel && <Searchbutton selectedMake={selectedBrand.id} selectedModel={Number(selectedModel)}/>}
    </>
  );
}
