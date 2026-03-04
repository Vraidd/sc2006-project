"use client"
import Navbar from "../../components/Navbar";
import ChatUI from "../../components/ChatUI";

export default function MessagesPage() {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white font-sans">
            <Navbar />

            {/* uses this for both owners & caregivers */}
            <ChatUI />
        </div>
    );
}