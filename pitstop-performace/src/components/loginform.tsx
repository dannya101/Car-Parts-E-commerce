import {useState} from "react"

export default function LoginForm({onSubmit}: any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(username, password);
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