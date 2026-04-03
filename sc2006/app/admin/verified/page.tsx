"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { 
  ChevronLeft, 
  ShieldCheck, 
  XCircle, 
  MapPin, 
  Search,
  SlidersHorizontal,
  CheckCircle,
  User,
  DollarSign,
  Car,
  Briefcase,
  FileText,
  ChevronDown
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const caretakers = [
    { id: 1, name: "Sarah Chen", email: "sarah.chen@example.com", location: "Bukit Batok", pets: ["Dogs", "Cats"], rate: "$65/day", experience: "5 years", status: "Pending", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", documents: ["NRIC_Front.jpg", "NRIC_Back.jpg", "Pet_Care_Cert.pdf"], availability: "Mar 15 - Apr 30, 2026", biography: "Passionate pet lover with 5 years of experience caring for dogs and cats. Certified in pet first aid and animal behavior." },
    { id: 2, name: "Mike Tan", email: "mike.tan@example.com", location: "Tampines", pets: ["Birds", "Small Mammals"], rate: "$55/day", experience: "3 years", status: "Pending", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", documents: ["NRIC_Front.jpg", "First_Aid_Cert.pdf"], availability: "Apr 1 - Apr 20, 2026", biography: "Specialized in exotic pets and small mammals. Have experience with birds, hamsters, and guinea pigs." },
    { id: 3, name: "Lisa Wong", email: "lisa.wong@example.com", location: "Jurong East", pets: ["Dogs", "Cats", "Reptiles"], rate: "$75/day", experience: "7 years", status: "Approved", dropoff: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", documents: ["NRIC_Front.jpg", "NRIC_Back.jpg", "Pet_Care_Cert.pdf", "Background_Check.pdf"], availability: "Mar 10 - May 15, 2026", biography: "Professional pet sitter with extensive experience in all types of pets including reptiles." },
    { id: 4, name: "James Lee", email: "james.lee@example.com", location: "Woodlands", pets: ["Reptiles", "Fish"], rate: "$80/day", experience: "10 years", status: "Approved", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", documents: ["NRIC_Front.jpg", "Specialty_Cert.pdf"], availability: "Mar 20 - Apr 25, 2026", biography: "Aquarium specialist and reptile expert with over a decade of experience." },
    { id: 5, name: "Emma Ng", email: "emma.ng@example.com", location: "Bedok", pets: ["Dogs"], rate: "$70/day", experience: "2 years", status: "Rejected", dropoff: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", documents: ["NRIC_Front.jpg", "Incomplete_Form.pdf"], availability: "Mar 25 - Apr 10, 2026", biography: "Dog enthusiast with experience in training and care." },
];

export default function VerifiedQueue() {
    const searchParams = useSearchParams();
    const { fireToast } = useToast();

    // Get initial values from URL params (reads once on load, does not update URL later)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");

    // Sort caretakers: Pending first, then Approved, then Rejected
    const sortedCaretakers = [...caretakers].sort((a, b) => {
        const priority: Record<string, number> = { 
            Pending: 1, 
            Approved: 2, 
            Rejected: 3 
        };

        const priorityA = priority[a.status] ?? 4;
        const priorityB = priority[b.status] ?? 4;

        return priorityA - priorityB;
    });

    // Filter caretakers based on search and filters
    const filteredCaretakers = sortedCaretakers.filter(caretaker => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                caretaker.name.toLowerCase().includes(query) ||
                caretaker.email.toLowerCase().includes(query) ||
                caretaker.location.toLowerCase().includes(query) ||
                caretaker.pets.some(pet => pet.toLowerCase().includes(query))
            );
        }
        return true;
    }).filter(caretaker => {
        // Status filter
        if (statusFilter !== "all") {
            return caretaker.status === statusFilter;
        }
        return true;
    });

    // Helper for status badge styling
    const getStatusBadge = (status: string) => {
        switch(status) {
            case "Pending":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldCheck size={12} strokeWidth={3} />
                        {status}
                    </span>
                );
            case "Approved":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-200">
                        <CheckCircle size={12} strokeWidth={3} />
                        {status}
                    </span>
                );
            case "Rejected":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={12} strokeWidth={3} />
                        {status}
                    </span>
                );
            default:
                return null;
        }
    };

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        const caretaker = caretakers.find(c => c.id === id);
        const message = action === 'approve' ? 'Verified Badge Issued' : 'Request Rejected';
        const description = `${action === 'approve' ? 'Badge' : 'Rejection'} issued for ${caretaker?.name || `ID ${id}`}`;
        fireToast(action === 'approve' ? 'success' : 'danger', message, description);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1">
                        <Link href="/admin" className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1">
                            <ChevronLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Caregiver Verifications
                        </h1>
                        <p className="text-base text-slate-500 mt-2 font-medium">Review caregiver applications and manage verified status.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search Field */}
                        <div className="relative flex-1 min-w-[250px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, location, or pets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={16} className="text-slate-400" />
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Results Count */}
                <div className="text-md font-medium italic text-slate-400 ml-auto mb-2">
                    Showing {filteredCaretakers.length} of {caretakers.length} caregiver{caretakers.length !== 1 ? 's' : ''}
                </div>

                <div className="space-y-4">
                    {filteredCaretakers.length > 0 ? filteredCaretakers.map((caretaker) => (
                        <div key={caretaker.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 flex-shrink-0">
                                <img
                                    src={caretaker.img}
                                    alt={caretaker.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="text-xl font-bold text-slate-900">{caretaker.name}</h3>
                                    {getStatusBadge(caretaker.status)}
                                </div>
                                <p className="text-sm text-slate-500">{caretaker.email}</p>
                                
                                {/* Metadata Row */}
                                <div className="flex flex-wrap gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <MapPin size={14} className="text-slate-400" />
                                        <span>{caretaker.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <DollarSign size={14} className="text-slate-400" />
                                        <span>{caretaker.rate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span>{caretaker.experience}</span>
                                    </div>
                                    {caretaker.dropoff && (
                                        <div className="flex items-center gap-1.5 text-sm text-teal-600">
                                            <Car size={14} className="text-teal-400" />
                                            <span>Drop-off Available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Biography */}
                                <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FileText size={12} className="text-slate-400" /> Biography
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{caretaker.biography}</p>
                                </div>

                                {/* Pets Tags */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {caretaker.pets.map((pet, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                            {pet}
                                        </span>
                                    ))}
                                </div>

                                {/* Documents and Availability */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {/* Documents */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Documents</p>
                                        <div className="flex flex-wrap gap-2">
                                            {caretaker.documents.map((doc, idx) => (
                                                <a key={idx} href="#" className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-sm group">
                                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                    </svg>
                                                    {doc}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Availability</p>
                                        <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                                            <p className="text-sm font-medium text-slate-700">{caretaker.availability}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 min-w-fit">
                                {caretaker.status === "Pending" ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(caretaker.id, 'approve')}
                                            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center gap-2"
                                        >
                                            <ShieldCheck size={16} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(caretaker.id, 'reject')}
                                            className="px-6 py-2.5 border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => fireToast('info', 'Already Processed', `${caretaker.name} is already ${caretaker.status.toLowerCase()}`)}
                                        className="px-6 py-2.5 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-default"
                                    >
                                        {caretaker.status}
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User size={32} />
                            </div>
                            {searchQuery ? (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Results Found</h3>
                                    <p className="text-slate-500 font-medium mt-2">No caregivers match your search for "{searchQuery}".</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Clear</h3>
                                    <p className="text-slate-500 font-medium mt-2">No caregivers match the current filter.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}