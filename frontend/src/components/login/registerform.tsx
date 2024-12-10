import { useState } from "react";
import {useRouter} from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function RegisterForm({ onSubmit }: any) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {toast} = useToast();
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        toast({
            title: "User Registered Successfully",
            description: "Login with username and password to continue"
        })
        handleRegisterSubmit(username, email, password);
        onSubmit(username, email, password);
    };

    const handleRegisterSubmit = async (username:string, email:string, password:string) => {
        try {
            const response = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if(response.ok) {
                console.log("Registration Successful: ", data);
            } else {
                console.error("Registration Failed: ", data);
            }
        } catch(error) {
            console.error("Error Registering: ", error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>

            {/*Username*/}
            <div className="mb-4">
                <label htmlFor="registerUsername" className="block text-sm font-medium text-white">Username</label>
                <input
                    type="string"
                    id="registerUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

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