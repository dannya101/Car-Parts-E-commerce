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
import { SelectScrollableResult } from "@/components/search/selectresult";
import { useState } from "react";
import { Searchbutton } from "@/components/search/searchbutton";

export function SelectScrollable() {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedMake, setSelectedMake] = useState<string>("");

  const handleModelChange = (newValue: string) => {
    setSelectedModel(newValue);
  };

  const handleMakeChange = (newValue: string) => {
    setSelectedMake(newValue);
  }

  return (
    <>
    <Select onValueChange={handleMakeChange}>
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
    { selectedMake && <SelectScrollableResult selectedMake={selectedMake} onModelSelect={handleModelChange}/> }
    { selectedMake && selectedModel && <Searchbutton selectedMake={selectedMake} selectedModel={selectedModel}/>}
    </>
  )
}

