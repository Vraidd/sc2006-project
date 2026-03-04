"use client"
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { AlertCircle, Play } from "lucide-react";

export default function AdminIncidents() {
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [isResolveOpen, setIsResolveOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState({
        id: "INC-442",
        title: "dog malnourished",
        reporter: "Mr Doob",
        caretaker: "Sarah Chen"
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Pending HR Incidents</h1>

                {/* INCIDENT CARD */}
                <div className="space-y-4">
                    <div className="bg-white border-l-4 border-red-500 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-black uppercase tracking-widest border border-red-200/50 shadow-sm">
                                <AlertCircle size={12} strokeWidth={3} className="shrink-0 leading-none" />
                                <span className="leading-none pt-px">High Priority</span>
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 italic">"{selectedIncident.title}"</h3>
                            <p className="text-sm text-slate-500 font-medium">
                                Reported by: {selectedIncident.reporter} • Caretaker: {selectedIncident.caretaker}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsEvidenceOpen(true)}
                                className="px-6 py-2.5 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                            >
                                View Evidence
                            </button>
                            <button 
                                onClick={() => setIsResolveOpen(true)}
                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                            >
                                Resolve Case
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL: VIEW EVIDENCE */}
            {isEvidenceOpen && (
                <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="font-bold text-slate-900">Evidence Review: {selectedIncident.id}</h2>
                            <button onClick={() => setIsEvidenceOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white relative overflow-hidden group">
                                <span className="text-4xl group-hover:scale-110 transition-transform cursor-pointer"><Play/></span>
                                <p className="absolute bottom-4 left-4 text-sm font-bold uppercase tracking-widest opacity-60">Check-in Video (15s)</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                                    <p className="text-sm font-black text-teal-600 uppercase mb-1">Upload Date</p>
                                    <p className="text-sm font-bold text-slate-800">Feb 19, 2026</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                                    <p className="text-sm font-black uppercase mb-1">Retention Status</p>
                                    <p className="text-sm font-bold">Deleting in 4 days</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
                            <button onClick={() => setIsEvidenceOpen(false)} className="px-8 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                                Close Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: RESOLVE CASE */}
            {isResolveOpen && (
                <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-lg text-slate-900">Final Resolution</h2>
                            <p className="text-sm text-slate-400">Case ID: {selectedIncident.id}</p>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-2">Resolution Notes</label>
                                <textarea 
                                    placeholder="Enter findings and action taken..."
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Dismiss Case</button>
                                <button className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Sanction User</button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setIsResolveOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">Submit Resolution</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}