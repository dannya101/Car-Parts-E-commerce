import { Button } from "@/components/ui/selectbutton"
import { buttonVariants } from "@/components/ui/selectbutton"
import Link from "next/link"



export function Searchbutton() {
  return <Button asChild className="w-[140px]" variant={"outline"}>
  <Link href="/login">Search</Link>
</Button>

}
