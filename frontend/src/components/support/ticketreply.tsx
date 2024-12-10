'use client';

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReplyFormProps {
    ticketId: string;
    onReplyAdded: (reply: {id: number; ticket_id: number; content: string; user_name: string; created_at: string}) => void;
}

export default function TicketReplyForm({ ticketId, onReplyAdded}: ReplyFormProps) {
    const [newReply, setNewReply] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = sessionStorage.getItem("access_token");
        if (!token) {
            toast({
                variant: "destructive",
                title: "Must Login to Reply",
                description: "Register an account or Login",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/support/ticket/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    content: newReply,
                }),
            });

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Error submitting reply",
                    description: "Please try again",
                });
                return;
            }

            const reply = await response.json();
            onReplyAdded(reply); // Notify parent component of the new reply
            setNewReply(""); // Clear the form
            toast({
                title: "Reply submitted",
                description: "Your reply has been added.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error submitting reply",
                description: "Please try again",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleReplySubmit} className="mt-6">
            <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Write your reply here"
                required
            ></textarea>
            <button
                type="submit"
                className={`mt-2 bg-blue-500 text-white py-2 px-4 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
            >
                {loading ? "Submitting..." : "Submit Reply"}
            </button>
        </form>
    );
}