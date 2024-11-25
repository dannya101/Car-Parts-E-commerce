import { Button } from "@/components/ui/selectbuttondesign"
import { buttonVariants } from "@/components/ui/selectbuttondesign"
import Link from "next/link"

interface SearchButtonProps {
  selectedModel: number;
  selectedMake: number;
}

export function Searchbutton({ selectedModel, selectedMake }: SearchButtonProps) {
  return (
  <Button asChild className="w-[140px] bg-white border-solid border-2 border-black select-none" variant={"outline"} >
    <Link href={`/results?make=${selectedMake}&model=${selectedModel}`}>
      Search
    </Link>
  </Button>
  );
}
