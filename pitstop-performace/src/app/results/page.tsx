'use client';

import { useRouter, useSearchParams } from "next/navigation";


export default function Results() {
    const searchParams = useSearchParams();
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    return (
        <div>
            <h1>Results</h1>
            <p>Selected Make: {make}</p>
            <p>Selected Model: {model}</p>
        </div>
    )
}