"use client"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar/>
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Enter your email and we'll send you a recovery link.
                        </p>
                    </div>

                    {!isSent ? (
                        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsSent(true); }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="name@example.com"
                                />
                            </div>
                            <button className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-shadow shadow-md">
                                Send Recovery Link
                            </button>
                        </form>
                    ) : (
                        <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl text-center">
                            <p className="text-sm text-teal-800 font-medium">Link sent! Check your inbox for further instructions.</p>
                        </div>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Remembered it? <Link href="/signin" className="font-bold text-teal-600 hover:text-teal-700">Back to Sign In</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}