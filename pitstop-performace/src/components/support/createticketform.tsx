import {useState} from "react"
import { useToast } from "@/hooks/use-toast";

export default function CreateTicketForm({onSubmit}: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {toast} = useToast();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSubmitting(true);

        const token = sessionStorage.getItem("access_token");

        if(!token) {
            console.error("Not Authenticated");
            toast({
                variant: "destructive",
                title: "Must Login to View Submit a Ticket",
                description: "Register an account or Login"
              })
            return;
        }


        try {
            const response = await fetch("http://localhost:8000/support/ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description
                }),
            });

            if(!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Failed To Create Support Ticket",
                    description: "Try Again"
                  })
                throw new Error(`Failed to create ticket: ${response.statusText}`);
            }

            const data = await response.json();

        } catch {
            console.error("Failed to create ticket");
            return;
        } finally {
            toast({
                title: "Support Ticket Created",
                description: "Ticket Has Been Created"
              })
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            {/*Title*/}
            <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Brief Summary"
                    required
                />
            </div>

            {/*Description*/}
            <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Describe your issue in detail"
                    rows={Number("4")}
                    required
                />
            </div>

            {/*Submit*/}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
            >
                Submit Ticket
            </button>
        </form>
    );
}