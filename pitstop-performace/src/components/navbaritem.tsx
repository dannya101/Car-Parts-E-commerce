import Link from "next/link"
import { Button } from "@/components/ui/navbutton"
interface NavbarItemProps {
    navLink: {
        label: string,
        link: string
    };
}

export default function NavbarItem({navLink}:NavbarItemProps){
    return (
            <Button 
            asChild
            className="h-full flex bg-navbutton text-navbutton-foreground hover:bg-navbutton-foreground hover:text-white transition-colors duration-300 px-4"
            >
                <Link href={navLink.link}>{navLink.label}</Link>
            </Button>
    )
}
