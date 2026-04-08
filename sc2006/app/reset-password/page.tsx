"use client"
import { Suspense, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPassword } = useAuth();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            setErrorMsg("Invalid or missing reset token.");
            setIsValidating(false);
            return;
        }
        setToken(tokenParam);
        setIsValidating(false);
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");

        if (!newPassword) {
            setErrorMsg("Please enter a new password.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMsg("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (!token) {
            setErrorMsg("Invalid or missing reset token.");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token, newPassword);
            router.push("/signin?reset=true");
        } catch (err: any) {
            console.error("Error", err);
            setErrorMsg(err.message || "An unexpected error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Enter your new password below.
                        </p>
                    </div>

                    {isValidating ? (
                        <div className="text-center text-gray-500 text-sm py-4">
                            Verifying reset token...
                        </div>
                    ) : errorMsg && !token ? (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                            {errorMsg}
                            <p className="mt-2">
                                <Link href="/forgot_password" className="font-medium underline hover:text-red-700">
                                    Request a new reset link
                                </Link>
                            </p>
                        </div>
                    ) : !token ? null : (
                        <>
                            {errorMsg && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg animate-pulse">
                                    {errorMsg}
                                </div>
                            )}
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" 
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" 
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Updating..." : "Update Password"}
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Remembered it? <Link href="/signin" className="font-bold text-teal-600 hover:text-teal-700">Back to Sign In</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex flex-col" />}>
            <ResetPasswordContent />
        </Suspense>
    );
}