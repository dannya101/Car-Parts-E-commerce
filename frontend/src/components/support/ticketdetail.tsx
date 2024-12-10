'use client';

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import TicketReplyForm from "@/components/support/ticketreply";

interface Ticket {
    id: string;
    title: string;
    description: string;
    created_at: string;
}

interface Reply {
    id: number;
    ticket_id: number;
    content: string;
    user_name: string;
    created_at: string;
}

interface TicketDetailProps {
    ticket: Ticket;
    onBack: () => void;
}

export default function TicketDetail({ ticket, onBack }: TicketDetailProps) {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {toast} = useToast();

    useEffect(() => {
        const fetchReplies = async () => {
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
                const response = await fetch(`http://localhost:8000/support/ticket?ticket_id=${ticket.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if(!response.ok) {
                    toast({
                        variant: "destructive",
                        title: "Error getting Ticket",
                        description: "Try again"
                    })
                }

                const data = await response.json();
                setReplies(data.replies || []);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error getting Ticket",
                    description: "Try again"
                })
            } finally {
                setLoading(false);
            }
        };

        fetchReplies();
    }, [ticket.id]);

    const handleReplyAdded = (reply: Reply) => {
        setReplies((prevReplies) => [...prevReplies, reply]);
    };

    return (
        <div>
            <button onClick={onBack} className="mb-4 text-blue-500">
                Back to Tickets
            </button>
            <h2 className="text-2xl font-bold mb-4">Ticket: {ticket.title}</h2>
            <p>{ticket.description}</p>
            <h3 className="text-xl font-semibold mt-6 mb-2">Replies:</h3>
            {loading && <p>Loading replies...</p>}
            {replies.length === 0 && !loading && <p>No replies yet.</p>}
            {replies.map((reply) => (
                <div key={reply.id} className="border-t py-2">
                    <p className="font-semibold">{reply.user_name}</p>
                    <p>{reply.content}</p>
                    <p className="text-sm text-gray-500">{reply.created_at}</p>
                </div>
            ))}

            {/* Reply Form */}
            <TicketReplyForm ticketId={ticket.id} onReplyAdded={handleReplyAdded} />
        </div>
    );
}