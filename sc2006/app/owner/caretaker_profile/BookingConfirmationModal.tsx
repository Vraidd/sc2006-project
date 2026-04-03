"use client"
import { useRef } from "react";
import { Receipt, Calendar as CalendarIcon, DollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface BookingConfirmationProps {
    caregiverName: string;
    dailyRate: number;
    days: number;
    onClose: () => void;
}

export default function BookingConfirmationModal({ caregiverName, dailyRate, days, onClose }: BookingConfirmationProps) {
    const { fireToast } = useToast();
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Platform math logic
    const subtotal = dailyRate * days;
    const platformFee = subtotal * 0.05; // 5% fee
    const total = subtotal + platformFee;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div ref={modalRef} className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
                <div className="p-8 bg-slate-900 text-white text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <Receipt size={32} className="text-teal-400" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">Confirm Request</h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">Review arrangement details</p>
                </div>

                <div className="p-8">
                    {/* SUMMARY INVOICE */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 mb-8">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                            <span className="text-sm font-bold text-slate-500">Caregiver</span>
                            <span className="text-sm font-black text-slate-900">{caregiverName}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                            <span className="text-sm font-bold text-slate-500">Duration</span>
                            <span className="text-sm font-black text-slate-900">{days} Days</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                            <span className="text-sm font-bold text-slate-500">Rate (${dailyRate}/day)</span>
                            <span className="text-sm font-bold text-slate-700">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                            <span className="text-sm font-bold text-slate-500">Platform Fee (5%)</span>
                            <span className="text-sm font-bold text-slate-700">${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-black text-slate-900 uppercase tracking-widest">Total</span>
                            <span className="text-3xl font-black text-teal-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-teal-50/50 p-4 rounded-xl border border-teal-100 mb-8">
                        <ShieldCheck size={20} className="text-teal-600 shrink-0" />
                        <p className="text-xs text-teal-800 font-medium leading-relaxed">
                            By confirming, you agree to Pawsport's Trust & Safety terms. No charges are made until the caregiver accepts.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={() => { fireToast("success", "Request Sent!", "Your booking request has been sent to the caregiver."); onClose(); }}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest py-4 transition-all shadow-xl shadow-teal-600/20 active:scale-95 flex justify-center items-center gap-2"
                        >
                            Send Request <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}