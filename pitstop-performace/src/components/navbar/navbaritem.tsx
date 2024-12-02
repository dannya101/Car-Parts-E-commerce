import { Button } from "@/components/ui/navbutton";
import Link from "next/link";

interface NavbarItemProps {
  navLink: {
    label: string;
    link: string;
  };
  handleClick?: () => void;
}

export default function NavbarItem({ navLink, handleClick }: NavbarItemProps) {
  const { label, link } = navLink;

  return handleClick ? (
    <Button
      className="h-full flex bg-navbutton text-navbutton-foreground hover:bg-navbutton-foreground hover:text-white transition-colors duration-300 px-4"
      onClick={handleClick}
    >
      {label}
    </Button>
  ) : (
    <Link
      href={link}
      className="h-full flex bg-navbutton text-navbutton-foreground hover:bg-navbutton-foreground hover:text-white transition-colors duration-300 px-4 items-center justify-center"
    >
      {label}
    </Link>
  );
}
