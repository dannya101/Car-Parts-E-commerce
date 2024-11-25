import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import {useEffect, useState} from "react";

interface Ticket {
    id: string;
    title: string;
    description: string;
    created_at: string;
}

export default function TicketTable() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = sessionStorage.getItem("access_token");

            if(!token) {
                console.error("Not Authenticated");
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/support/ticket/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if(!response.ok) {
                    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
                }

                const data = await response.json();
                setTickets(data.tickets);
            } catch(error) {
                if(error instanceof Error){
                    setError(error.message);
                } else {
                    setError("An unknown error occured");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    return (
        <Table>
            <TableCaption>My Tickets</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Ticket ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Date Submitted</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.description}</TableCell>
                        <TableCell className="text-right">{ticket.created_at}</TableCell>
                    </TableRow>
                ))}
                {tickets.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-xl py-4 text-red-500 ">
                            No Tickets Submitted
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}