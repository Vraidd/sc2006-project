/**
 * ChatUI Component with Payment Integration
 * 
 * Message Types:
 * - "text": Regular chat messages
 * - "payment_request": Payment request messages (owner sees Pay button, caregiver sees Awaiting status)
 * 
 * LOCAL DEBUG MODE:
 * Set USE_LOCAL_DEBUG = true to use mock data for testing
 * Set USE_LOCAL_DEBUG = false to use real backend API
 */

"use client"
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MessageCircle, ChevronLeft, Send, CreditCard, CheckCircle, Clock, Dog } from "lucide-react";

// Local debug mode for this component only
const USE_LOCAL_DEBUG = true;

type Message = {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: { id: string; name: string; avatar: string | null };
    type?: "text" | "payment_request";
    // For payment_request type messages
    paymentData?: {
        amount: number;
        status: "PENDING" | "PAID";
        bookingId: string;
        petName: string;
    };
};

type Conversation = {
    id: string;
    name: string;
    initial: string;
    avatar: string | null;
    otherId: string;
    lastMessage: string;
    date: string;
    status: string;
    role: "OWNER" | "CAREGIVER";
};

export default function ChatUI() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<"OWNER" | "CAREGIVER" | null>(null);
    const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Get current user
    useEffect(() => {
        if (USE_LOCAL_DEBUG) {
            // Use mock user for testing (default to OWNER role)
            setCurrentUserId("user-owner-001");
            setCurrentUserRole("OWNER");
            return;
        }
        
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.user?.id) {
                    setCurrentUserId(data.user.id);
                    setCurrentUserRole(data.user.role);
                }
            })
            .catch(() => {});
    }, []);

    // Fetch all conversations
    useEffect(() => {
        setLoadingConvos(true);
        
        if (USE_LOCAL_DEBUG) {
            // Use mock conversations - show conversations where the other party has the opposite role
            const mockConversations: Conversation[] = [
                { id: "booking-001", name: "Sarah Johnson", initial: "SJ", avatar: null, otherId: "user-caregiver-001", lastMessage: "Payment request sent", date: "2 hours ago", status: "IN_PROGRESS", role: "CAREGIVER" },
                { id: "booking-002", name: "Emily Davis", initial: "ED", avatar: null, otherId: "user-owner-002", lastMessage: "The booking details look great!", date: "Yesterday", status: "CONFIRMED", role: "OWNER" },
                { id: "booking-003", name: "James Wilson", initial: "JW", avatar: null, otherId: "user-owner-003", lastMessage: "Payment completed!", date: "3 days ago", status: "COMPLETED", role: "OWNER" },
                { id: "booking-004", name: "Lisa Anderson", initial: "LA", avatar: null, otherId: "user-caregiver-002", lastMessage: "Looking forward to next week!", date: "1 week ago", status: "CONFIRMED", role: "CAREGIVER" },
            ];
            
            // Filter based on current user role (show conversations with opposite role)
            const filtered = mockConversations.filter(c => c.role !== "OWNER");
            setConversations(filtered);
            
            // Auto-select from URL param or first conversation
            const paramId = searchParams.get("bookingId");
            if (paramId) {
                setActiveChat(paramId);
            } else if (filtered.length > 0) {
                setActiveChat(filtered[0].id);
            }
            
            setLoadingConvos(false);
            return;
        }
        
        fetch("/api/chats")
            .then((r) => r.json())
            .then((data) => {
                if (data.conversations) {
                    setConversations(data.conversations);
                    // Auto-select from URL param or first conversation
                    const paramId = searchParams.get("bookingId");
                    if (paramId) {
                        setActiveChat(paramId);
                    } else if (data.conversations.length > 0) {
                        setActiveChat(data.conversations[0].id);
                    }
                }
            })
            .catch(() => {})
            .finally(() => setLoadingConvos(false));
    }, []);

    // Update activeConvo when activeChat or conversations change
    useEffect(() => {
        setActiveConvo(conversations.find((c) => c.id === activeChat) ?? null);
    }, [activeChat, conversations]);

    // Fetch messages when activeChat changes
    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        }
        
        if (USE_LOCAL_DEBUG) {
            // Mock messages for each booking - including payment request as a message type
            const mockMessagesByBooking: Record<string, Message[]> = {
                "booking-001": [
                    // Regular messages
                    { id: "msg-001", senderId: "user-owner-001", content: "Hi Sarah! Just wanted to check in on Buddy.", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), sender: { id: "user-owner-001", name: "Michael Chen", avatar: null }, type: "text" },
                    { id: "msg-002", senderId: "user-caregiver-001", content: "Hi Michael! Buddy is doing great! He had a fun walk in the park this morning.", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null }, type: "text" },
                    // Payment request message (sent by caregiver)
                    { 
                        id: "payment-msg-001", 
                        senderId: "user-caregiver-001", 
                        content: "Payment request for Buddy's care", 
                        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
                        sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
                        type: "payment_request",
                        paymentData: {
                            amount: 250.00,
                            status: "PENDING",
                            bookingId: "booking-001",
                            petName: "Buddy"
                        }
                    },
                ],
                "booking-003": [
                    // Regular messages
                    { id: "msg-010", senderId: "user-owner-003", content: "Max had such a wonderful time with you!", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), sender: { id: "user-owner-003", name: "James Wilson", avatar: null }, type: "text" },
                    { id: "msg-011", senderId: "user-caregiver-001", content: "He was such a good boy! We had so much fun at the dog park.", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null }, type: "text" },
                    // Paid payment request message
                    { 
                        id: "payment-msg-003", 
                        senderId: "user-caregiver-001", 
                        content: "Payment request for Max's care", 
                        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
                        sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
                        type: "payment_request",
                        paymentData: {
                            amount: 350.00,
                            status: "PAID",
                            bookingId: "booking-003",
                            petName: "Max"
                        }
                    },
                ],
            };
            
            setMessages(mockMessagesByBooking[activeChat] || []);
            setLoadingMessages(false);
            return;
        }
        
        setLoadingMessages(true);
        fetch(`/api/messages?bookingId=${activeChat}`)
            .then((r) => r.json())
            .then((data) => setMessages(data.messages ?? []))
            .catch(() => setMessages([]))
            .finally(() => setLoadingMessages(false));
    }, [activeChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle payment processing (for owners) - with mock support
    async function handlePayment(messageId: string, paymentData: NonNullable<Message['paymentData']>) {
        if (USE_LOCAL_DEBUG) {
            setProcessingPaymentId(messageId);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update the message to show paid status
            setMessages(prev => prev.map(msg => 
                msg.id === messageId 
                    ? { ...msg, paymentData: { ...msg.paymentData!, status: "PAID" as const } }
                    : msg
            ));
            setProcessingPaymentId(null);
            alert(`Payment of $${paymentData.amount.toFixed(2)} successful!`);
            return;
        }
        
        // Real API call
        setProcessingPaymentId(messageId);
        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: paymentData.bookingId,
                    messageId: messageId,
                }),
            });
            
            const data = await res.json();
            if (data.success) {
                // Update the message to show paid status
                setMessages(prev => prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, paymentData: { ...msg.paymentData!, status: "PAID" as const } }
                        : msg
                ));
                alert("Payment successful!");
            } else {
                alert("Payment failed: " + (data.error ?? "Unknown error"));
            }
        } catch (error) {
            alert("Payment failed due to network error");
        } finally {
            setProcessingPaymentId(null);
        }
    }

    async function sendMessage() {
        if (!newMessage.trim() || !activeChat || !activeConvo) return;

        if (USE_LOCAL_DEBUG) {
            const newMsg: Message = {
                id: `msg-${Date.now()}`,
                senderId: currentUserId || "user-owner-001",
                content: newMessage.trim(),
                createdAt: new Date().toISOString(),
                sender: { id: currentUserId || "user-owner-001", name: "Michael Chen", avatar: null },
                type: "text",
            };
            setMessages(prev => [...prev, newMsg]);
            setNewMessage("");
            return;
        }

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: activeChat,
                    receiverId: activeConvo.otherId,
                    content: newMessage.trim(),
                }),
            });
            const data = await res.json();
            if (data.message) {
                setMessages((prev) => [...prev, data.message]);
                setNewMessage("");
                // Update last message in conversation list
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeChat
                            ? { ...c, lastMessage: newMessage.trim(), date: "Now" }
                            : c
                    )
                );
            }
        } catch {
            alert("Failed to send message");
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    const filtered = conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex bg-slate-50 border-t border-gray-100" style={{ height: "calc(100vh - 64px)" }}>

            {/* LEFT SIDEBAR */}
            <div className={`${activeChat ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex-col shrink-0`}>
                <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Messages</h2>
                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConvos ? (
                        <p className="text-slate-400 text-center text-sm font-medium p-6">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                <MessageCircle size={24} />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest">No conversations</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filtered.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => setActiveChat(chat.id)}
                                    className={`flex items-center gap-3 p-4 border-l-4 text-left transition-all ${
                                        activeChat === chat.id
                                            ? "bg-teal-50/50 border-teal-500"
                                            : "border-transparent hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="w-11 h-11 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-black shrink-0 shadow-sm">
                                        {chat.initial}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <p className="text-md font-bold text-slate-900 truncate pr-2 leading-none">{chat.name}</p>
                                            <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-tighter">{chat.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate font-medium">{chat.lastMessage || "No messages yet"}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: CHAT AREA */}
            <div className={`${!activeChat ? "hidden md:flex" : "flex"} flex-1 flex-col bg-[#F8FAFC]`}>
                {activeChat && activeConvo ? (
                    <>
                        {/* HEADER */}
                        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
                            <button
                                onClick={() => setActiveChat(null)}
                                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-teal-500/20">
                                {activeConvo.initial}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm truncate pr-4 leading-none pt-px">
                                {activeConvo.name}
                            </h3>
                        </div>

                        {/* MESSAGES */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
                            {loadingMessages ? (
                                <p className="text-slate-400 text-center text-sm">Loading messages...</p>
                            ) : messages.length === 0 ? (
                                <p className="text-slate-400 text-center text-sm">No messages yet. Say hello!</p>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.senderId === currentUserId;
                                    
                                    // Render payment request message
                                    if (msg.type === "payment_request" && msg.paymentData) {
                                        const isPending = msg.paymentData.status === "PENDING";
                                        const isOwner = currentUserRole === "OWNER";
                                        const isProcessing = processingPaymentId === msg.id;
                                        
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-sm w-full rounded-2xl shadow-sm overflow-hidden ${
                                                    isPending 
                                                        ? "bg-amber-50 border-2 border-amber-200" 
                                                        : "bg-emerald-50 border-2 border-emerald-200"
                                                }`}>
                                                    {/* Payment Card Header */}
                                                    <div className="px-4 py-3 flex items-center gap-2 border-b border-amber-100/50">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                            isPending ? "bg-amber-100" : "bg-emerald-100"
                                                        }`}>
                                                            <CreditCard size={16} className={isPending ? "text-amber-600" : "text-emerald-600"} />
                                                        </div>
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${
                                                            isPending ? "text-amber-700" : "text-emerald-700"
                                                        }`}>
                                                            {isPending ? "Payment Request" : "Payment Completed"}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Payment Card Body */}
                                                    <div className="px-4 py-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Dog size={14} className="text-slate-500" />
                                                            <span className="text-sm font-bold text-slate-900">{msg.paymentData.petName}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-slate-500">Amount</span>
                                                            <span className="text-lg font-black text-slate-900">${msg.paymentData.amount.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Payment Card Footer - Role-based actions */}
                                                    {isPending && isOwner && !isMe && (
                                                        <div className="px-4 py-3 bg-amber-100/50 border-t border-amber-200">
                                                            <button
                                                                onClick={() => handlePayment(msg.id, msg.paymentData!)}
                                                                disabled={isProcessing}
                                                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            >
                                                                {isProcessing ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                        <span>Processing...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CreditCard size={14} />
                                                                        <span>Pay Now</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    {isPending && !isOwner && (
                                                        <div className="px-4 py-3 bg-amber-100/50 border-t border-amber-200">
                                                            <div className="flex items-center justify-center gap-2 text-amber-700">
                                                                <Clock size={14} />
                                                                <span className="text-xs font-bold">Awaiting payment</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {isPending && isMe && (
                                                        <div className="px-4 py-3 bg-amber-100/50 border-t border-amber-200">
                                                            <div className="flex items-center justify-center gap-2 text-amber-700">
                                                                <Clock size={14} />
                                                                <span className="text-xs font-bold">Waiting for owner to pay</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {!isPending && (
                                                        <div className="px-4 py-3 bg-emerald-100/50 border-t border-emerald-200">
                                                            <div className="flex items-center justify-center gap-2 text-emerald-700">
                                                                <CheckCircle size={14} />
                                                                <span className="text-xs font-bold">Paid</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                    // Regular text message
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
                                                isMe
                                                    ? "bg-teal-600 text-white rounded-tr-sm"
                                                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm"
                                            }`}>
                                                <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                                <p className={`text-xs mt-2 font-bold uppercase tracking-tighter opacity-70 ${isMe ? "text-right" : "text-slate-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* INPUT */}
                        <div className="p-4 bg-white border-t border-slate-100 pb-8 md:pb-6">
                            <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-teal-600/20 shrink-0 active:scale-95"
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
                        <div className="w-20 h-20 bg-white border border-slate-100 rounded-4xl flex items-center justify-center shadow-sm">
                            <MessageCircle size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select a conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
}