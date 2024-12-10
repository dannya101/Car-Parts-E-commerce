import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import TicketDetail from "@/components/support/ticketdetail";

interface Ticket {
    id: string;
    title: string;
    description: string;
    created_at: string;
    user_name: string;
}

interface TicketTableProps {
    admin: boolean; // Add an admin prop
}

export default function TicketTable({ admin }: TicketTableProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = sessionStorage.getItem("access_token");

            if (!token) {
                console.error("Not Authenticated");
                return;
            }

            try {
                const url = admin
                    ? "http://localhost:8000/admin/support/getalltickets"
                    : "http://localhost:8000/support/ticket/all";

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch tickets: ${response.statusText}`);
                }

                const data = await response.json();
                setTickets(data.tickets);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [admin]);

    const handleRowClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const handleBack = () => {
        setSelectedTicket(null);
    };

    if (selectedTicket) {
        return <TicketDetail ticket={selectedTicket} onBack={handleBack} />;
    }

    return (
        <Table>
            <TableCaption>My Tickets</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">{admin ? "User Name" : "Ticket ID"}</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Date Submitted</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                            Loading...
                        </TableCell>
                    </TableRow>
                ) : error ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-red-500 py-4">
                            {error}
                        </TableCell>
                    </TableRow>
                ) : tickets.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-xl py-4 text-red-500">
                            No Tickets Submitted
                        </TableCell>
                    </TableRow>
                ) : (
                    tickets.map((ticket) => (
                        <TableRow
                            key={ticket.id}
                            onClick={() => handleRowClick(ticket)}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <TableCell className="font-medium">{admin ? ticket.user_name : ticket.id}</TableCell>
                            <TableCell>{ticket.title}</TableCell>
                            <TableCell>{ticket.description}</TableCell>
                            <TableCell className="text-right">{ticket.created_at}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}