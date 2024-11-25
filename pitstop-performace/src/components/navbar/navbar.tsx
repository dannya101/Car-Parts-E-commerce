'use client';

import Link from "next/link";
import NavbarItem from "@/components/navbar/navbaritem";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authcontext"
import { useToast } from "@/hooks/use-toast";

export default function navbar() {
  const {isAuthenticated, setIsAuthenticated} = useAuth();
  const [isAdmin, setIsAdmin] = useState(false); 
  const {toast} = useToast();
  const router = useRouter();

  const checkAdmin = async () => {
    const token = sessionStorage.getItem("access_token");

    try {
      const response = await fetch("http://localhost:8000/users/isAdmin", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
      });

      const data = await response.json();

      if(data.success) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check admin status"
      });
    }
  };

  const log_in_out = isAuthenticated ? (
    {label: "Logout", link: "/"}
  ) : (
    {label: "Login", link: "/login"}
  );

  const navLinks = [
    {label: "Home", link: "/"},
    {label: "About", link: "/about"},
    {label: "Support", link: "/support"},
    log_in_out,
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if(token) {
      setIsAuthenticated(true);
      checkAdmin();
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push("/");
    toast({
      title: "Logged Out",
      description: "User has logged out. Access-Token is now deleted"
    })
  }

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
              handleLogout={handleLogout}
            />
          ))}

        {/*ADMIN*/}
        {isAdmin && <NavbarItem
          key={"Admin"}
          navLink={{label: "Admin", link: "/admin"}}
          handleLogout={handleLogout}
        />
        }

        {/*CHECKOUT/CART*/}
        <Link href="/checkout" className="flex items-center justify-center bg-primary p-2 rounded-full hover:bg-opacity-80">
              <img src="/cart.svg" alt="Cart" width={30} height={30}/>
        </Link>
        </nav>

      </div>
    </div>
  );
}