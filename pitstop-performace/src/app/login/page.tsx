'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "../../components/loginform";
import RegisterForm from "../../components/registerform";

export default function Login() {
    const [tabValue, setTabValue] = useState("login")

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
            } else {
                console.error("Login Failed: ", data);
            }
        }
        catch(error) {
            console.error("Error Logging In: ", error)
        }
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
            <div className="max-w-md mx-auto p-4 pt-20">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login or Register</h1>

                <Tabs value={tabValue} onValueChange={setTabValue}>

                    {/* Pop-out container */}
                    <div className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700">
                        <TabsList>
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <LoginForm onSubmit={handleLoginSubmit} />
                        </TabsContent>

                        <TabsContent value="register">
                            <RegisterForm onSubmit={handleRegisterSubmit} />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
    )
}
