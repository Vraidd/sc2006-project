"use client"
import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import ChatUI from "../../components/ChatUI";

export default function MessagesPage() {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white font-sans">
            <Navbar />

            {/* uses this for both owners & caregivers */}
            <Suspense fallback={<div className="flex-1 bg-slate-50" />}>
                <ChatUI />
            </Suspense>
        </div>
    );
}