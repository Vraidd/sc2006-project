"use client"
import { useState } from 'react';
import Navbar from "../../components/Navbar"
import Link from 'next/link';
import IncidentModal from "./IncidentModal";
import { 
  ChevronLeft, 
  Circle, 
  Video, 
  Check, 
  AlertTriangle,
  Clock
} from "lucide-react";

export default function ActiveCare() {
    const [requestSent, setRequestSent] = useState(false);
    const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

    const handleRequestCheckIn = () => {
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar />
            
            <main className="max-w-3xl mx-auto px-6 py-10">
                <Link href="/owner/my_bookings" className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-1 mb-6 transition-all hover:-translate-x-1">
                    <ChevronLeft size={16} /> Back to Bookings
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    {/* HEADER */}
                    <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                        <div>
                            <span className="bg-teal-500 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 flex items-center gap-2 w-fit animate-pulse">
                                <Circle size={8} fill="currentColor" /> In Progress
                            </span>
                            <h1 className="text-4xl font-black tracking-tight">Care for Dawg</h1>
                            <p className="text-slate-400 text-base mt-2 font-medium">Feb 16 - Feb 19, 2026</p>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Caregiver</p>
                            <p className="font-black text-teal-400 text-xl">Sarah Chen</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-12">
                        {/* ACTIVITY TIMELINE */}
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                Activity Timeline
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                            </h3>
                            <div className="border-l-2 border-slate-100 ml-4 space-y-10 relative">
                                <div className="relative pl-10">
                                    <div className="w-5 h-5 bg-white border-4 border-amber-400 rounded-full absolute -left-2.75 top-1 z-10 shadow-sm"></div>
                                    <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-4xl shadow-sm">
                                        <p className="text-base font-bold text-slate-900">Check-in Video Received</p>
                                        <p className="text-sm text-slate-500 mt-1.5 font-medium flex items-center gap-1.5">
                                            <Clock size={14} /> Uploaded 10 minutes ago
                                        </p>
                                        <Link 
                                            href="/owner/review" 
                                            className="mt-5 inline-block bg-amber-500 text-white text-sm font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-amber-600 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                                        >
                                            Review Evidence
                                        </Link>
                                    </div>
                                </div>

                                <div className="relative pl-10">
                                    <div className="w-5 h-5 bg-white border-4 border-teal-500 rounded-full absolute -left-2.75 top-1 z-10 shadow-sm"></div>
                                    <p className="text-base font-bold text-slate-900">Check-in Approved</p>
                                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Yesterday, 6:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* REQUEST CHECK-IN ACTION */}
                        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-teal-600 border border-slate-50">
                                <Video size={28} />
                            </div>
                            <h3 className="font-black text-slate-900 text-xl mb-3">Request Video Check-In</h3>
                            <p className="text-base text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed font-medium">
                                This will send a <strong className="text-slate-900">real-time notification</strong> to Sarah to record and upload a 10-15s video.
                            </p>
                            
                            <button 
                                onClick={handleRequestCheckIn}
                                disabled={requestSent}
                                className={`w-full max-w-xs font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 mx-auto active:scale-95 ${
                                    requestSent 
                                    ? "bg-teal-100 text-teal-700 cursor-not-allowed shadow-none" 
                                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20"
                                }`}
                            >
                                {requestSent ? <><Check size={18} strokeWidth={3} /> Request Notified</> : "Send Request"}
                            </button>
                        </div>

                        {/* EMERGENCY ACTION */}
                        <div className="pt-8 border-t border-slate-100 text-center">
                            <button 
                                onClick={() => setIsIncidentModalOpen(true)}
                                className="text-sm font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-all flex items-center justify-center gap-2 mx-auto"
                            >
                                <AlertTriangle size={16} /> Report an incident or safety concern
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODALS */}
            {isIncidentModalOpen && (
                <IncidentModal onClose={() => setIsIncidentModalOpen(false)} />
            )}
        </div>
    );
}