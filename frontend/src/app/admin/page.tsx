'use client';

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminButtons from "@/components/admin/adminbuttons";
import AdminPassword from "@/components/admin/addminpassword";

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() =>{
        checkAdmin();
    }, []);

    
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

    return (
        <>
        {isAdmin && (
            <AdminButtons/>
        )}

        {!isAdmin && (
            <AdminPassword/>
        )}
        </>
    );
}