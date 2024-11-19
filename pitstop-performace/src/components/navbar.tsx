import Link from "next/link";
import NavbarItem from "./navbaritem";

export default function navbar() {
  const navLinks = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Support", link: "/support"},
    {label: "Login", link: "/login"}
  ];

  return (
    <div className="bg-primary text-primary-foreground h-16 flex items-center">
      <div className="container mx-auto flex justify-between pr-4 pl-4">

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

        {/*CHECKOUT/CART*/}
        <Link href="/checkout" className="flex items-center justify-center bg-primary p-2 rounded-full hover:bg-opacity-80">
              <img src="/cart.svg" alt="Cart" width={30} height={30}/>
        </Link>
        </nav>

      </div>
    </div>
  );
}