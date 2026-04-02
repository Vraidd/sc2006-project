"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { 
  ChevronLeft, 
  ShieldCheck, 
  XCircle, 
  FileText, 
  ExternalLink,
  UserCheck,
  Clock,
  Search
} from "lucide-react";

const allPendingRequests = [
    {
        id: "VREQ-102",
        name: "Marcus Tan",
        email: "marcus@pawsport.com",
        type: "Identity & Criminal Record",
        submittedAt: "March 4, 2026",
        documents: ["nric_front.jpg", "background_check_cert.pdf"]
    },
    {
        id: "VREQ-103",
        name: "Chloe Ng",
        email: "chloe.ng@gmail.com",
        type: "Pet First Aid Certification",
        submittedAt: "March 3, 2026",
        documents: ["red_cross_pet_cpr.pdf"]
    },
    {
        id: "VREQ-104",
        name: "Ahmed bin Yusof",
        email: "ahmed.pets@gmail.com",
        type: "Pet Care Certification",
        submittedAt: "March 2, 2026",
        documents: ["pet_care_cert.pdf"]
    },
    {
        id: "VREQ-105",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        type: "Animal Behavior Training",
        submittedAt: "March 1, 2026",
        documents: ["behavior_training.pdf"]
    }
];

export default function VerifiedQueue() {
    const searchParams = useSearchParams();
    const searchParam = searchParams.get('search') || '';
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [requests, setRequests] = useState(allPendingRequests);

    useEffect(() => {
        setSearchQuery(searchParam);
    }, [searchParam]);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        alert(`${action === 'approve' ? 'Issuing Verified Badge' : 'Rejecting Request'} for ${id}`);
        setRequests(requests.filter(req => req.id !== id));
    };

    const filteredRequests = requests.filter(req => 
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-5xl mx-auto px-8 py-12">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex-1">
                        <Link href="/admin" className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1">
                            <ChevronLeft size={16} /> Back to Overview
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Caregiver Verifications
                        </h1>
                        <p className="text-base text-slate-500 mt-2 font-medium">Review legal documents and issue Verified Peer badges.</p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-md ml-8">
                        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search caregivers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col lg:flex-row gap-10 justify-between items-start lg:items-center">
                            
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                        <UserCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{req.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{req.email}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Check Category</p>
                                        <p className="text-sm font-bold text-slate-700">{req.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Entry</p>
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Clock size={14} className="text-teal-500" /> {req.submittedAt}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Evidence Uploads</p>
                                    <div className="flex flex-wrap gap-2">
                                        {req.documents.map(doc => (
                                            <a key={doc} href="#" className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 transition-all shadow-sm group">
                                                <FileText size={16} className="text-slate-400 group-hover:text-teal-500" />
                                                {doc}
                                                <ExternalLink size={14} className="ml-2 text-slate-300" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full lg:w-64">
                                <button 
                                    onClick={() => handleAction(req.id, 'approve')}
                                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-xl shadow-teal-600/20 active:scale-95 flex justify-center items-center gap-2"
                                >
                                    <ShieldCheck size={18} /> Issue Badge
                                </button>
                                <button 
                                    onClick={() => handleAction(req.id, 'reject')}
                                    className="bg-white border-2 border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 text-xs font-black uppercase tracking-widest py-5 rounded-2xl transition-all active:scale-95 flex justify-center items-center gap-2"
                                >
                                    <XCircle size={18} /> Decline Request
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-32 text-center">
                            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={40} />
                            </div>
                            {searchQuery ? (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Results Found</h3>
                                    <p className="text-slate-500 font-medium mt-2">No caregivers match your search for "{searchQuery}".</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Secure</h3>
                                    <p className="text-slate-500 font-medium mt-2">All verification requests have been processed.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}