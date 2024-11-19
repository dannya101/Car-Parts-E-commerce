'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "../../components/loginform";
import RegisterForm from "../../components/registerform";

export default function Login() {
    const [tabValue, setTabValue] = useState("login")

    const handleLoginSubmit = (email:string, password:string) => {
        // Handle login logic here (e.g., authenticate user)
        console.log("Logging in with:", email, password);
    };

    const handleRegisterSubmit = (email:string, password:string) => {
        // Handle registration logic here (e.g., create new user)
        console.log("Registering with:", email, password);
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
