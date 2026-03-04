"use client"
import { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    function login(event: FormEvent) {
        event.preventDefault();
        setErrorMsg(""); // clear prev errors

        if (!username) {
            setErrorMsg("Please enter your email or username.");
            return;
        }
        if (!password) {
            setErrorMsg("Please enter your password.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmail = emailRegex.test(username);
        
        console.log("Processing login:", { username, password, isEmail });
        // TODO: api thingy goes down here
    }
        
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-teal-500 rounded-xl mx-auto flex items-center justify-center text-white text-xl mb-4 shadow-sm">
                            🐾
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                        <p className="text-sm text-gray-500 mt-2">Sign in to your account to continue</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={login} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Email / Username</label>
                            <input 
                                id="username" 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                onChange={e => setUsername(e.target.value)} 
                                type="text"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                id="password" 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                onChange={e => setPassword(e.target.value)} 
                                type="password"
                                placeholder=""
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input id="remember-me" type="checkbox" className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                                <label htmlFor="remember-me" className="text-sm text-gray-600">Remember me</label>
                            </div>
                            <Link href="/forgot_password" className="text-sm font-medium text-teal-600 hover:text-teal-700">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-teal-600/20 mt-6">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Don't have an account? <Link href="/signup" className="font-bold text-teal-600 hover:text-teal-700">Sign up</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}