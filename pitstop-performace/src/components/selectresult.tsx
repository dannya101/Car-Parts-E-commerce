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

<<<<<<< Updated upstream
interface SelectScrollableResultProps {
  selectedModel: string;
}

export function SelectScrollableResult({ selectedModel }: SelectScrollableResultProps) {
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
  
  const models = getModels(selectedModel);
  return (
    <Select>
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
=======
export function SelectScrollableResult() {

    // const handleClick = () => {
    //   if(selectedModel === ("Honda"))
    //   {
    //     return (
    //       <Select>
    //         <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
    //           <SelectValue placeholder="Model" />
    //         </SelectTrigger>
  
    //         <SelectContent>
    //             <SelectItem value="Accord">Honda</SelectItem>
    //             <SelectItem value="Odyssey">Ford</SelectItem>
    //             <SelectItem value="Civic">Toyota</SelectItem>
    //             <SelectItem value=".">Lexus</SelectItem>
    //             <SelectItem value=".">Acura</SelectItem>
    //             <SelectItem value=".">Tesla</SelectItem>
    //         </SelectContent>
    //       </Select>)
    //   } 
    //   else if(selectedModel === "Toyota"){
    //     return (
    //       <Select>
    //         <SelectTrigger className="w-[150px] bg-white border-solid border-2 border-black">
    //           <SelectValue placeholder="Model" />
    //         </SelectTrigger>
  
    //         <SelectContent>
    //             <SelectItem value="Camry">Honda</SelectItem>
    //             <SelectItem value="Corolla">Ford</SelectItem>
    //             <SelectItem value="Tacoma">Toyota</SelectItem>
    //             <SelectItem value="Supra">Lexus</SelectItem>
    //             <SelectItem value=".">Acura</SelectItem>
    //             <SelectItem value="">Tesla</SelectItem>
    //         </SelectContent>
    //       </Select>)
    //   }
    // };
  
    return(
      <Select>
        <SelectTrigger disabled={true} className="w-[150px] bg-white border-solid border-2 border-black">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
  
      </Select>
    )
  }
>>>>>>> Stashed changes
