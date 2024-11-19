import Link from "next/link"
import Image from "next/image";
import NavbarItem from "./navbaritem";

export default function navbar() {
  const navLinks = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Support", link: "/support"}
  ];

  return (
    <div className="bg-primary text-primary-foreground h-16 flex items-center">
      <div className="container mx-auto flex justify-between">

        {/*LOGO*/}
        <img src="/webname.svg" alt="logo" width={465} height={62}/>
        
        {/*NAVIGATION LINKS*/}
        <nav className="flex gap-4">
          {navLinks.map((navLink) => (
            <NavbarItem
              key={navLink.label}
              navLink={navLink}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}