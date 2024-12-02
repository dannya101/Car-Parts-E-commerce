'use client';

import ProductSelector from "@/components/productselector";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  
export default function Results() {
    const searchParams = useSearchParams();
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const query = searchParams.get("query")

    const [productList, setProductList] = useState<Product[]>([]);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    useEffect(() => {
        const makeNum = Number(make);
        const modelNum = Number(model);
        if(query)
        {
            apiGetProducts(query);
        }
        else if(makeNum && modelNum) {
            apiGetProductsBySpecs(makeNum, modelNum);
        }
    }, [make, model, query]);

    const apiGetProducts = async (query: string) => {
        try {
          const response = await fetch(`http://localhost:8000/search/${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setProductList(data);
          console.log("DATA: ", data);
        } catch (error) {
          console.error("Error fetching products by query:", error);
        }
      };

    const apiGetProductsBySpecs = async (make: number, model: number) => {
        try {
            const apiQuery = query ? `http://localhost:8000/search/${encodeURIComponent(query)}`
            : `http://localhost:8000/product/get/brand-model?brand_category_id=${make}&model_category_id=${model}`; // Default endpoint for all products
            const response = await fetch(apiQuery, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            setProductList(data);
            console.log("DATA: ", data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleProductSelect = (product_id: number) => {
        setSelectedProductId(product_id);
        console.log("Selected Product ID: ", product_id);
    }

    return (
        <div>
            <ProductSelector product_list={productList} onProductSelect={handleProductSelect}/>
        </div>
    );
}