"use client"
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { 
    Dog, 
    Video, 
    ArrowRight, 
    Lock, 
    Receipt, 
    MessageCircle, 
    ClipboardList,
    AlertCircle,
    ChevronRight
} from "lucide-react";

// DUMMY DATA
const activeJobs = [
    {
        id: 1,
        petName: "Dawg",
        ownerName: "Mr doob",
        status: "Action Required",
        requestType: "Video Check-In",
        deadline: "Due in 2h",
        payout: 247.00 // 95% after the 5% platform fee
    },
    {
        id: 2,
        petName: "Dawgy",
        ownerName: "Josh Tan",
        status: "On Track",
        requestType: "Regular Care",
        deadline: "Next check-in tomorrow",
        payout: 114.00
    }
];

export default function CaregiverDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* WELCOME & REVENUE (5% fee context) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Caregiver Console</h1>
                        <p className="text-slate-500 mt-1">Manage your active guests and pending requests.</p>
                    </div>
                    <div className="bg-white p-4 px-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</p>
                            <p className="text-xl font-black text-teal-600">$361.00</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <p className="text-xs text-slate-400 max-w-20 leading-tight font-medium">
                            After 5% platform fee
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: ACTIVE JOBS */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Active Arrangements
                            <span className="bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">{activeJobs.length}</span>
                        </h2>

                        {activeJobs.map((job) => (
                            <div key={job.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                                            <Dog size={28} className="text-teal-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{job.petName}</h3>
                                            <p className="text-sm text-slate-500">Owner: {job.ownerName}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                        job.status === 'Action Required' 
                                        ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' 
                                        : 'bg-slate-50 text-slate-500'
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>

                                {job.status === "Action Required" && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">
                                                <Video size={20} className="text-amber-900"/>
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-amber-900">Check-In Requested</p>
                                                <p className="text-xs text-amber-700">{job.deadline}</p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/caregiver/upload`}
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                                        >
                                            Upload Video
                                        </Link>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <a href={"/caregiver/blueprint"} className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">View Blueprint</a>
                                    <a href={"/caregiver/messages"} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Open Chat</a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: QUICK ACTIONS & ALERTS */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Quick Actions</h2>
                            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
                                
                                <Link 
                                    href="/caregiver/requests" 
                                    className="w-full flex justify-between items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                                >
                                    <span className="text-sm font-bold text-slate-700">New Requests</span>
                                    <span className="bg-teal-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">2</span>
                                </Link>
                                
                                <Link 
                                    href="/caregiver/transactions" 
                                    className="w-full flex justify-between items-center p-4 bg-white border border-transparent hover:border-slate-100 rounded-xl transition-colors group"
                                >
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-teal-600">Earnings & Fees</span>
                                    <span className="text-gray-400 group-hover:text-teal-600"><ChevronRight/></span>
                                </Link>

                            </div>
                        </div>

                        {/* DATA PRIVACY REMINDER */}
                        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20">
                            <h4 className="font-bold text-md mb-2 flex items-center gap-2">
                                <span className="flex items-center justify-center shrink-0">
                                    <Lock size={24} className="text-teal-400"/>
                                </span>
                                <span className="leading-none pt-[1.5px]">
                                    Privacy First
                                </span>
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                All check-in videos are deleted 1 week after the contract ends. Do not save pet media to your local device.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}