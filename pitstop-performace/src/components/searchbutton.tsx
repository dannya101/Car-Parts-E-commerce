import { Button } from "@/components/ui/selectbuttondesign"
import { buttonVariants } from "@/components/ui/selectbuttondesign"
import Link from "next/link"



export function Searchbutton() {
  return <Button asChild className="w-[140px] bg-white border-solid border-2 border-black select-none" variant={"outline"} >
  <Link href="/login">Search</Link>
</Button>

}
