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

export function SelectScrollableResult(selectedModel : string) {

    const handleClick = () => {
      if(selectedModel === ("Honda"))
      {
        return (
          <Select>
            <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
  
            <SelectContent>
                <SelectItem value="Accord">Honda</SelectItem>
                <SelectItem value="Odyssey">Ford</SelectItem>
                <SelectItem value="Civic">Toyota</SelectItem>
                <SelectItem value=".">Lexus</SelectItem>
                <SelectItem value=".">Acura</SelectItem>
                <SelectItem value=".">Tesla</SelectItem>
            </SelectContent>
          </Select>)
      } 
      else if(selectedModel === "Toyota"){
        return (
          <Select>
            <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
  
            <SelectContent>
                <SelectItem value="Camry">Honda</SelectItem>
                <SelectItem value="Corolla">Ford</SelectItem>
                <SelectItem value="Tacoma">Toyota</SelectItem>
                <SelectItem value="Supra">Lexus</SelectItem>
                <SelectItem value=".">Acura</SelectItem>
                <SelectItem value="">Tesla</SelectItem>
            </SelectContent>
          </Select>)
      }
    };
  
    return(
      <Select>
        <SelectTrigger disabled={true} className="w-[150px] bg-white border-solid border-2 border-black">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
  
      </Select>
    )
  }