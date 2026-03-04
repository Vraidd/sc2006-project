"use client"
import Link from "next/link";
import Navbar from "./components/Navbar";
import { MoveLeft, Home, Search, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex items-center justify-center px-6 py-20">
                <div className="max-w-xl w-full text-center">
                    {/* ERROR GRAPHIC */}
                    <div className="relative mb-12">
                        <div className="text-[12rem] font-black text-slate-100 leading-none select-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-white rounded-4xl shadow-xl border border-slate-100 flex items-center justify-center text-teal-500 animate-bounce">
                                <AlertCircle size={48} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* TEXT CONTENT */}
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                        Paws lost their way.
                    </h1>
                    <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto">
                        The page you are looking for doesn't exist or has been moved within the network.
                    </p>

                    {/* QUICK ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => history.back()}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            <MoveLeft size={18} /> Go Back
                        </button>
                        
                        <Link 
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-600/20"
                        >
                            <Home size={18} /> Return Home
                        </Link>
                    </div>

                    {/* SUGGESTED LINKS */}
                    <div className="mt-16 pt-8 border-t border-slate-200">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            Try searching for care instead
                        </p>
                        <Link 
                            href="/owner/search_caregivers"
                            className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-colors"
                        >
                            <Search size={16} /> Browse Caregivers
                        </Link>
                    </div>
                </div>
            </main>

            {/* FOOTER ACCENT */}
            <div className="py-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                System Error Code: 0x404_NOT_FOUND
            </div>
        </div>
    );
}