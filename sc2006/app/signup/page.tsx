"use client"
import { useState, FormEvent, ChangeEvent } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // PWD VALIDATION STATES
    const [isPwdNumbersPresent, setPwdNumbersPresent] = useState(false);
    const [isPwdUppercasePresent, setPwdUppercasePresent] = useState(false);
    const [isPwdLowercasePresent, setPwdLowercasePresent] = useState(false);
    const [isPwdSymbolsPresent, setPwdSymbolsPresent] = useState(false);

    function validatePassword(pwd: string) {
        setPwdNumbersPresent(/\d/.test(pwd));
        setPwdUppercasePresent(/[A-Z]/.test(pwd));
        setPwdLowercasePresent(/[a-z]/.test(pwd));
        setPwdSymbolsPresent(/[^a-zA-Z0-9]/.test(pwd));

        return /\d/.test(pwd) && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        const newPwd = event.target.value;
        setPassword(newPwd);
        validatePassword(newPwd);
    }

    function signup(event: FormEvent) {
        event.preventDefault();
        setErrorMsg("");

        if (!validatePassword(password) || password.length < 8) {
            setErrorMsg("Please ensure your password meets all requirements.");
            return;
        }
        if (confirmPassword !== password) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        console.log("Processing signup:", { email, username });
    }
        
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex flex-col lg:flex-row">
                {/* LEFT PANEL (DESKTOP ONLY): P & P community */}
                <div className="hidden lg:flex lg:w-2/5 bg-teal-800 flex-col justify-center p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-teal-700 to-teal-900 opacity-90 z-0" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-8 border border-white/20">
                            <PawPrint/>
                        </div>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">Join the Pawsport & Peer community</h1>
                        <p className="text-teal-100 text-lg mb-8">Create an account to find trusted care for your pets or become a verified peer caregiver.</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3"><span className="text-teal-400">✓</span> Evidence-based care</div>
                            <div className="flex items-center gap-3"><span className="text-teal-400">✓</span> Secure time-limited links</div>
                            <div className="flex items-center gap-3"><span className="text-teal-400">✓</span> Community accountability</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL (DESKTOP ONLY): form panel */}
                <div className="w-full lg:w-3/5 flex justify-center items-center p-8 lg:p-16 bg-gray-50">
                    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 lg:hidden">Create an account</h2>
                        <p className="text-gray-500 mb-8">Fill in your details to get started.</p>

                        {errorMsg && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg animate-pulse">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={signup} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                    onChange={e => setUsername(e.target.value)} 
                                    placeholder="Choose a unique username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    required
                                    type="password" 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                    onChange={handlePasswordChange} 
                                    placeholder="Create a strong password"
                                />
                            </div>

                            {/* ui for pwd requirements */}
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
                                <ul className="text-xs space-y-1.5 grid grid-cols-2">
                                    <li className={`flex items-center gap-1.5 ${password.length >= 8 ? "text-teal-600" : "text-gray-400"}`}>
                                        {password.length >= 8 ? "✓" : "○"} 8+ characters
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${isPwdUppercasePresent ? "text-teal-600" : "text-gray-400"}`}>
                                        {isPwdUppercasePresent ? "✓" : "○"} Uppercase letter
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${isPwdLowercasePresent ? "text-teal-600" : "text-gray-400"}`}>
                                        {isPwdLowercasePresent ? "✓" : "○"} Lowercase letter
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${isPwdNumbersPresent ? "text-teal-600" : "text-gray-400"}`}>
                                        {isPwdNumbersPresent ? "✓" : "○"} Number
                                    </li>
                                    <li className={`flex items-center gap-1.5 ${isPwdSymbolsPresent ? "text-teal-600" : "text-gray-400"} col-span-2`}>
                                        {isPwdSymbolsPresent ? "✓" : "○"} Special character (!@#$%)
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input 
                                    required
                                    type="password" 
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all" 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    placeholder="Repeat your password"
                                />
                            </div>

                            <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-md hover:shadow-teal-600/20 mt-6">
                                Create Account
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-600 mt-8">
                            Already on Pawsport & Peer? <Link href="/signin" className="font-bold text-teal-600 hover:text-teal-700">Sign in</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}