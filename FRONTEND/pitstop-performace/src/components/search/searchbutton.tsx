import { Button } from "@/components/ui/selectbuttondesign"
import { buttonVariants } from "@/components/ui/selectbuttondesign"
import Link from "next/link"
import { ContinueButton } from "../checkout/continueToShopButton"

interface SearchButtonProps {
  selectedModel: number;
  selectedMake: number;
}

export function Searchbutton({ selectedModel, selectedMake }: SearchButtonProps) {
  ContinueButton.updateSelection(selectedModel, selectedMake);
  return (
  <Button asChild className="w-[140px] bg-white font-bold border-solid border-2 border-black select-none" variant={"outline"} >
    <Link href={`/results?make=${selectedMake}&model=${selectedModel}`}>
      Search
    </Link>
  </Button>
  );
}
