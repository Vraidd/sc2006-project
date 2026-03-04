"use client"
import { useState } from "react";
import { Search, MessageCircle, ChevronLeft, Send } from "lucide-react";

// DUMMY DATA
const MOCK_CONVERSATIONS = [
    {
        id: "1",
        name: "sarah.chen@example.com",
        initial: "S",
        lastMessage: "Awesome, see you then!",
        date: "Feb 15",
        isActive: true
    },
    {
        id: "2",
        name: "Mr doob",
        initial: "T",
        lastMessage: "Yeah, he's super friendly!",
        date: "Feb 14",
        isActive: false
    },
    {
        id: "3",
        name: "A new guy",
        initial: "T",
        lastMessage: "",
        date: "Feb 13",
        isActive: false
    }
];

const MOCK_MESSAGES: Record<string, { id: number, sender: string, text: string, time: string }[]> = {
    "1": [
        { id: 1, sender: "them", text: "Hey! Just wanted to confirm dawg's walk is at 6 PM?", time: "4:45 PM" },
        { id: 2, sender: "me", text: "Hi Sarah! Yes, 6 PM is perfect. He's ready!", time: "4:50 PM" },
        { id: 3, sender: "them", text: "Awesome, see you then!", time: "4:52 PM" }
    ],
    "2": [
        { id: 1, sender: "me", text: "Hey Mr doob, is Dawg okay with other dogs around?", time: "2:00 PM" },
        { id: 2, sender: "them", text: "Yeah, he's super friendly! Just keep him away from peanuts.", time: "2:15 PM" }
    ],
    "3": [

    ]
};

export default function ChatUI() {
    const [search, setSearch] = useState("");
    const [activeChat, setActiveChat] = useState<string | null>("1"); 

    const currentMessages = activeChat && MOCK_MESSAGES[activeChat] ? MOCK_MESSAGES[activeChat] : [];

    return (
        <div className="flex bg-slate-50 border-t border-gray-100" style={{ height: "calc(100vh - 64px)" }}>
            
            {/* LEFT SIDEBAR: CONVO LIST */}
            <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex-col shrink-0`}>
                <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Messages</h2>
                    
                    {/* SEARCH BAR with Lucide Icon */}
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
                    {MOCK_CONVERSATIONS.length > 0 ? (
                        <div className="flex flex-col">
                            {MOCK_CONVERSATIONS.map((chat) => (
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
                                            <p className="text-md font-bold text-slate-900 truncate pr-2 leading-none">
                                                {chat.name}
                                            </p>
                                            <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-tighter">{chat.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate font-medium">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                <MessageCircle size={24} />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest">No conversations</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: ACTIVE CHAT AREA */}
            <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#F8FAFC]`}>
                {activeChat ? (
                    <>
                        {/* CHAT HEADER */}
                        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
                            <button 
                                onClick={() => setActiveChat(null)}
                                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-teal-500/20">
                                {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.initial}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm truncate pr-4 leading-none pt-px">
                                {MOCK_CONVERSATIONS.find(c => c.id === activeChat)?.name}
                            </h3>
                        </div>

                        {/* MESSAGES */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
                            {currentMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${
                                        msg.sender === 'me' 
                                        ? 'bg-teal-600 text-white rounded-tr-sm' 
                                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                                    }`}>
                                        <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                                        <p className={`text-xs mt-2 font-bold uppercase tracking-tighter opacity-70 ${msg.sender === 'me' ? 'text-right' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CHAT INPUT */}
                        <div className="p-4 bg-white border-t border-slate-100 pb-8 md:pb-6">
                            <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
                                <input 
                                    type="text" 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                                />
                                <button className="w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-teal-600/20 shrink-0 active:scale-95">
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