import { useState } from "react";

export default function RegisterForm({ onSubmit }: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        onSubmit(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>

            {/*Email*/}
            <div className="mb-4">
                <label htmlFor="registerEmail" className="block text-sm font-medium text-white">Email</label>
                <input
                    type="email"
                    id="registerEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/*Password*/}
            <div className="mb-4">
                <label htmlFor="registerPassword" className="block text-sm font-medium text-white">Password</label>
                <input
                    type="password"
                    id="registerPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/*Confirm Password*/}
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/*Register*/}
            <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded"
            >
                Register
            </button>
        </form>
    );
}