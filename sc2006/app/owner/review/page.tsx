"use client"
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { 
  ChevronLeft, 
  Film, 
  Check, 
  RotateCcw, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function ReviewEvidence() {
    const { fireToast } = useToast();
    const handleApprove = () => fireToast("success", "Check-in Approved", "Record saved to audit log.");
    const handleReupload = () => fireToast("info", "Re-upload Requested", "Caregiver has been notified in-app.");
    const handleFlag = () => fireToast("warning", "Incident Flagged", "Redirecting to Incident Report...");

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-10">
                <Link href="/owner/active_care" className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-1 mb-6">
                    <ChevronLeft size={16} /> Back to Active Care
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    
                    {/* LEFT: VIDEO PLAYER */}
                    <div className="md:w-3/5 bg-slate-900 flex items-center justify-center p-4 min-h-100 relative">
                        <div className="text-center text-white/50">
                            <span className="mb-4 flex justify-center">
                                <Film size={64} strokeWidth={1.5} className="text-white" />
                            </span>
                            <p className="text-base font-medium text-white">10-15s Check-in Video</p>
                            <p className="text-sm mt-1">Uploaded by Sarah Chen</p>
                        </div>
                        
                        {/* Expiry Badge - Size Increased */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                            <Clock size={14} className="text-red-400" />
                            <span className="font-medium">Auto-deletes in 23h 59m</span>
                        </div>
                    </div>

                    {/* RIGHT: CONTEXT & ACTION PANEL */}
                    <div className="md:w-2/5 p-8 flex flex-col justify-center border-l border-gray-100 bg-white">
                        <div className="mb-8">
                            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider border border-amber-200">
                                Pending Review
                            </span>
                            <h2 className="text-2xl font-bold text-slate-900 mt-5">Update for Dawg</h2>
                            <p className="text-base text-gray-500 mt-2 italic leading-relaxed">
                                "He just finished his evening walk and is ready for dinner!"
                            </p>
                            <p className="text-sm text-gray-400 mt-6 font-medium">
                                Received: Feb 19, 2026 • 6:15 PM
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-base font-bold text-slate-900 mb-3 border-b border-gray-100 pb-3">Select an action:</p>
                            
                            <button 
                                onClick={handleApprove}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <Check size={18} strokeWidth={3} /> Approve Update
                            </button>
                            
                            <button 
                                onClick={handleReupload}
                                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} strokeWidth={2.5} /> Request Re-upload
                            </button>
                            
                            <button 
                                onClick={handleFlag}
                                className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                            >
                                <AlertTriangle size={18} strokeWidth={2.5} /> Flag Incident
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed px-2 font-bold uppercase tracking-wide">
                                Flagging triggers the neutral HR review workflow for dispute resolution.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}