import React, { useState } from "react";

export default function AdminPassword() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const token = sessionStorage.getItem("access_token");

        try {
            // Simulate password check (Replace with your API logic)
            const response = await fetch(`http://localhost:8000/users/setAdmin?password=${encodeURIComponent(password)}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                setSuccess(true);
                window.location.reload();
            } else {
                const data = await response.json();
                setError(data.message || "Invalid password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center p-20 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
                <h1 className="text-2xl font-bold text-center mb-4">Admin Password</h1>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium mb-2">
                            Enter Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    {success && <p className="text-green-600">User is now an admin!</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}