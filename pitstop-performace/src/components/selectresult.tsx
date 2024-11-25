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

interface SelectScrollableResultProps {
  selectedMake: string;
  onModelSelect: (model: string) => void;
}

export function SelectScrollableResult({ selectedMake, onModelSelect }: SelectScrollableResultProps) {
  const carModelsByMake: Record<string, string[]> = {
    Honda: ["Accord", "Civic", "CR-V", "Odyssey", "Prelude"],
    Ford: ["Explorer", "F-150", "Focus", "Mustang", "Ranger"],
    Toyota: ["Camry", "Corolla", "Highlander", "Supra", "Tacoma"],
    Lexus: ["ES", "LS", "NX", "RX", "UX"],
    Acura: ["Integra", "MDX", "NSX", "RDX", "ZDX"],
    Tesla: ["Cybertruck","Model S", "Model 3", "Model X", "Model Y"],
  };
  function getModels(make: string) {
    return carModelsByMake[make] || [];
  }
  
  const models = getModels(selectedMake);
  return (
    <Select onValueChange={onModelSelect}>
      <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
        <SelectValue placeholder="Model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
