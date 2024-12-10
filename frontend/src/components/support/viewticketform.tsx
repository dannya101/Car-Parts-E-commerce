import TicketTable from "@/components/support/tickettable";
import {useState, useEffect} from "react"
import { useAuth } from "@/context/authcontext"
import { useToast } from "@/hooks/use-toast";


export default function ViewTicketForm({onSubmit}: any) {    
    const [isAdmin, setIsAdmin] = useState(false); 
    const {isAuthenticated, setIsAuthenticated} = useAuth();
    const {toast} = useToast();

    const checkAdmin = async () => {
        const token = sessionStorage.getItem("access_token");
        if(!token) {
            setIsAdmin(false);
            return;
        }

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

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if(token) {
          setIsAuthenticated(true);
          checkAdmin();
        } else {
          setIsAuthenticated(false);
        }
    }, [isAuthenticated]);

    return (
        <TicketTable admin={isAdmin}/>
    );
}