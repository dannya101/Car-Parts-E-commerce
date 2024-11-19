'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateTicketForm from "@/components/createticketform";
import ViewTicketForm from "@/components/viewticketform";

export default function Support() {
    const [tabValue, setTabValue] = useState("submit")

    const handleTicketSubmit = (subject:string, description:string) => {
        console.log("Ticket Submitted: ", subject, description);
    }

    return (
        <div className="h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Support</h1>

                {/* Tabs for "Submit Ticket" and "View Tickets" */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <Tabs value={tabValue} onValueChange={setTabValue}>
                        <TabsList className="flex justify-center mb-4">
                            <TabsTrigger value="submit">Submit a Ticket</TabsTrigger>
                            <TabsTrigger value="view">View My Tickets</TabsTrigger>
                        </TabsList>

                        {/* Submit Ticket Section */}
                        <TabsContent value="submit">
                            <CreateTicketForm onSubmit={handleTicketSubmit} />
                        </TabsContent>

                        {/* View Tickets Section */}
                        <TabsContent value="view">
                            <ViewTicketForm/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
