"use client"
import { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Dog, 
  Smartphone, 
  FileText, 
  ShieldAlert 
} from "lucide-react";

export default function IncidentModal({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* HEADER */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
                    <div className="flex items-center gap-3">
                        <span className="text-red-600">
                            <AlertTriangle size={20} />
                        </span>
                        <h2 className="text-xl font-bold text-slate-900">Report Incident</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {step === 1 ? (
                        <>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Please select the nature of the concern. This will flag the arrangement for <strong>immediate HR review</strong>.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'safety', label: 'Safety/Well-being Concern', icon: <Dog size={24} /> },
                                    { id: 'unresponsive', label: 'Caretaker Unresponsive', icon: <Smartphone size={24} /> },
                                    { id: 'other', label: 'Other Issue', icon: <FileText size={24} /> }
                                ].map((type) => (
                                    <button 
                                        key={type.id}
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50/50 transition-all text-left group"
                                    >
                                        <span className="text-slate-400 group-hover:text-red-600 transition-colors">{type.icon}</span>
                                        <span className="font-bold text-slate-700 group-hover:text-red-700">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description of Incident</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Please provide specific details about what happened..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                    <p className="text-[11px] text-amber-700 leading-relaxed font-medium flex gap-2">
                                        <ShieldAlert size={14} className="shrink-0" />
                                        <span>
                                            <strong>Note:</strong> Once submitted, this report and all related check-in videos will be locked and forwarded to our HR dispute team for a neutral resolution.
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Back</button>
                                <button onClick={onClose} className="flex-2 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                                    Submit to HR
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}