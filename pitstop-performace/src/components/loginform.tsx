import {useState} from "react"

export default function LoginForm({onSubmit}: any) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="loginEmail" className="block text-sm font-medium text-white">Email</label>
                <input
                    type="email"
                    id="loginEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    required
                />
            </div>

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

            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
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