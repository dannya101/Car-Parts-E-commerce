import {useState} from "react"

export default function CreateTicketForm({onSubmit}: any) {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(subject, description);
    };

    return (
        <form onSubmit={handleSubmit}>

            {/*Subject*/}
            <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium">
                    Subject
                </label>
                <input
                    id="subject"
                    type="text"
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Brief Summary"
                    required
                />
            </div>

            {/*Description*/}
            <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium">
                    Password
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