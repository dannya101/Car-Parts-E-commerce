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

export function SelectScrollable() {
  return (
    <Select>
      <SelectTrigger className="w-[150px]">
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
  )
}
