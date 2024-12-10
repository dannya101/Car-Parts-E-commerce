import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm({onSubmit}: any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {isAuthenticated, setIsAuthenticated} = useAuth();
    const {toast} = useToast();
    const router = useRouter();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        handleLoginSubmit(username, password);
    };

    const handleLoginSubmit = async (username:string, password:string) => {
        try {
            const response = await fetch("http://localhost:8000/users/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: username,
                    password: password,
                }).toString(),
            });

            const data = await response.json();
            if(response.ok) {
                console.log("Login Successful: ", data);
                sessionStorage.setItem("access_token", data.access_token);
                setIsAuthenticated(true);
                toast({
                    title: "Login Successful",
                    description: "Access Token Has Been Stored In Session",
                });
                router.push("/");
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Username or Password is incorrect. Try Again or Register a New Account",
                });
            }
        }
        catch(error) {
            console.error("Error Logging In: ", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "System Error: Try Again",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            {/*Username*/}
            <div className="mb-4">
                <label htmlFor="loginUsername" className="block text-sm font-medium text-white">Username</label>
                <input
                    type="string"
                    id="loginUsername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/*Password*/}
            <div className="mb-4">
                <label htmlFor="loginPassword" className="block text-sm font-medium text-white">Password</label>
                <input
                    type="password"
                    id="loginPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

            {/*Submit*/}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-400 to-green-500 text-white p-2 rounded"
            >
                Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-2">
                <a
                    href="/forgot-password"
                    className="text-sm text-blue-400 hover:underline"
                >
                    Forgot your password?
                </a>
            </div>
        </form>
    );
}