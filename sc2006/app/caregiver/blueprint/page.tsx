"use client"
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Dog, 
  ClipboardList, 
  AlertCircle, 
  Info,
  ShieldCheck
} from 'lucide-react';

export default function CaregiverPetBlueprint() {
    // In a real scenario, this would be fetched based on a pet ID in the URL
    const [petData] = useState({
        name: "Dawg",
        species: "Dog",
        breed: "Poodle",
        age: "3",
        size: "Medium",
        triggers: "Loud noises (thunder, fireworks), unfamiliar large dogs",
        dietaryNeeds: "Allergic to chicken. Requires grain-free kibble twice a day.",
        careNotes: "Needs a 30-minute walk every evening. Friendly but shy at first."
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <Link href="/caregiver" className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1">
                        <ChevronLeft size={16} /> Back to Console
                    </Link>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{petData.name}'s Blueprint</h1>
                                <span className="bg-teal-50 text-teal-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-teal-100 flex items-center gap-1">
                                    <ShieldCheck size={12} strokeWidth={3} /> Official Record
                                </span>
                            </div>
                            <p className="text-slate-500 mt-1 font-medium italic">Standardized care instructions provided by the owner.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: PET DOSSIER SUMMARY */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 p-8 text-center">
                            <div className="w-32 h-32 mx-auto bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                                <Dog size={56} className="text-teal-600/30" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-black text-xl text-slate-900">{petData.name}</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{petData.breed}</p>
                        </div>

                        <div className="bg-white rounded-4xl shadow-sm border border-slate-100 p-8 space-y-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">Vitals</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Age</p>
                                    <p className="text-sm font-bold text-slate-700">{petData.age} Years Old</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Size Category</p>
                                    <p className="text-sm font-bold text-slate-700">{petData.size}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Vaccination</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                        <ShieldCheck size={14} className="text-teal-500" /> Verified Current
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CARE INSTRUCTIONS (THE ENGINE) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                                    <ClipboardList size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Behavioral Blueprint [UC1]</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mandatory Care Protocols</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* SECTION: TRIGGERS */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-red-500 uppercase tracking-widest mb-3">
                                        <AlertCircle size={14} /> Behavioral Triggers
                                    </label>
                                    <div className="w-full p-5 bg-red-50/30 border border-red-100 rounded-2xl text-sm text-slate-700 leading-relaxed font-medium">
                                        {petData.triggers}
                                    </div>
                                </div>

                                {/* SECTION: DIETARY */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-teal-600 uppercase tracking-widest mb-3">
                                        <Info size={14} /> Dietary Needs & Allergies
                                    </label>
                                    <div className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed font-bold">
                                        {petData.dietaryNeeds}
                                    </div>
                                </div>

                                {/* SECTION: CARE NOTES */}
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                                        General Care Protocols
                                    </label>
                                    <div className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed font-medium">
                                        {petData.careNotes}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Privacy & Compliance Footnote */}
                        <div className="px-10 py-6 bg-slate-900 rounded-4xl text-white flex items-center gap-4">
                            <ShieldCheck className="text-teal-400 shrink-0" size={32} />
                            <p className="text-xs text-slate-400 leading-normal font-medium">
                                This blueprint is part of the <strong className="text-white">Active Care Arrangement</strong>. Access to this data is restricted to verified caretakers and will be automatically locked 7 days after the arrangement ends.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}