import {useState} from "react"

export default function ViewTicketForm({onSubmit}: any) {

    return (
        <form>
            <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
                {/* Ticket List */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4">Ticket ID</th>
                            <th className="py-2 px-4">Subject</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example Ticket Entries */}
                        <tr>
                            <td className="py-2 px-4">#12345</td>
                            <td className="py-2 px-4">Login Issue</td>
                            <td className="py-2 px-4">Open</td>
                            <td className="py-2 px-4">2024-11-18</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4">#12346</td>
                            <td className="py-2 px-4">Payment Issue</td>
                            <td className="py-2 px-4">Resolved</td>
                            <td className="py-2 px-4">2024-11-16</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    );
}