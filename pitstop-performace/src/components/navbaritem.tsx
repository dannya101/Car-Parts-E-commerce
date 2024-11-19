import Link from "next/link"
import {Button} from "@/components/ui/button"
interface NavbarItemProps {
    navLink: {
        label: string,
        link: string
    };
}

export default function NavbarItem({navLink}:NavbarItemProps){
    return (
        <Link 
            key={navLink.label}
            href={navLink.link}
        >
            <Button>{navLink.label}</Button>
        </Link>
    )
}
