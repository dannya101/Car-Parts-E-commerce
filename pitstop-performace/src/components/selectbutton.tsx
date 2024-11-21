"use client";
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectScrollableResult } from "./selectresult";
import { useState } from "react";

export function SelectScrollable() {
  let boolVal = true;
  const [value, setValue] = useState<string>("");
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
        <SelectValue placeholder="Make" />
      </SelectTrigger>
      <SelectContent>
          <SelectItem value="Honda">Honda</SelectItem>
          <SelectItem value="Ford">Ford</SelectItem>
          <SelectItem value="Toyota">Toyota</SelectItem>
          <SelectItem value="Lexus">Lexus</SelectItem>
          <SelectItem value="Acura">Acura</SelectItem>
          <SelectItem value="Tesla">Tesla</SelectItem>
      </SelectContent>
    </Select>
    { value && <SelectScrollableResult selectedModel={value}/> }
    
    </>
  )
}

