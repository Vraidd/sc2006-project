"use client"
import { Dog, Calendar, MapPin, Inbox, Check, X } from "lucide-react";
import Navbar from "../../components/Navbar";

// DUMMY DATA
const pendingRequests = [
    {
        id: "REQ-202",
        ownerName: "Mr Doob",
        petName: "Dawg",
        petType: "Dog (Poodle)",
        dates: "Feb 22 - Feb 25, 2026",
        location: "Bukit Batok",
        price: 195.00,
        message: "Hi! Dawg is very shy but loves evening walks. Would you be available?"
    }
];

export default function IncomingRequests() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar/>
            
            <main className="max-w-4xl mx-auto pt-12 px-6 pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Booking Requests</h1>
                    <p className="text-slate-500 mt-1 font-medium">Review and respond to new care inquiries.</p>
                </div>

                {pendingRequests.length > 0 ? (
                    <div className="space-y-6">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
                                {/* PET PREVIEW SIDEBAR */}
                                <div className="md:w-48 bg-teal-50 flex flex-col items-center justify-center p-8 border-r border-gray-50">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 border border-teal-100/50">
                                        <Dog size={32} className="text-teal-600" />
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm mb-1">{req.petName}</p>
                                    <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest">{req.petType}</p>
                                </div>

                                {/* REQUEST DETAILS */}
                                <div className="flex-1 p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Request from {req.ownerName}</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">ID: {req.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-teal-600">${req.price}</p>
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Est. Earnings</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <div className="text-slate-400"><Calendar size={16} /></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Dates</p>
                                                <p className="text-xs font-bold text-slate-700 leading-none pt-px">{req.dates}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                                            <div className="text-slate-400"><MapPin size={16} /></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                                <p className="text-xs font-bold text-slate-700 leading-none pt-px">{req.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Message from Owner</p>
                                        <div className="bg-teal-50/30 p-5 rounded-2xl border border-teal-50 italic text-sm text-slate-600 leading-relaxed">
                                            "{req.message}"
                                        </div>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98]">
                                            <Check size={16} /> Accept Request
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-8 border-2 border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-[0.98]">
                                            <X size={16} /> Decline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                            <Inbox size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No pending requests</h3>
                        <p className="text-slate-500 mt-2 font-medium">New pet owner inquiries will appear here.</p>
                    </div>
                )}
            </main>
        </div>
    );
}