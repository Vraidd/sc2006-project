"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { 
    AlertCircle, Play, Search, Filter, 
    AlertTriangle, Clock, CheckCircle, 
    User, Calendar, X, 
    ChevronLeft, ChevronDown
} from "lucide-react";

export default function AdminIncidents() {
    const searchParams = useSearchParams();
    
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [isResolveOpen, setIsResolveOpen] = useState(false);
    
    // Get initial values from URL params (reads once on load, does not update URL later)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || "all");
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");
    
    // Mock incidents data
    const [incidents] = useState([
        {
            id: "INC-442",
            title: "Dog Malnourished",
            reporter: "Mr Doob",
            caretaker: "Sarah Chen",
            priority: "High",
            status: "Pending",
            filed: "Feb 15, 2026",
            description: "The dog appears underweight and not properly fed during the care period."
        },
        {
            id: "INC-443",
            title: "Late Check-in",
            reporter: "Jane Smith",
            caretaker: "Mike Tan",
            priority: "Medium",
            status: "Pending",
            filed: "Mar 02, 2026",
            description: "Caretaker was 2 hours late for the scheduled check-in time."
        },
        {
            id: "INC-444",
            title: "Missing Supplies",
            reporter: "David Lee",
            caretaker: "Lisa Wong",
            priority: "Low",
            status: "Resolved",
            filed: "Mar 18, 2026",
            description: "Pet food and water were not provided as requested."
        }
    ]);

    // Get incident ID from URL params if available on load
    const [selectedIncident, setSelectedIncident] = useState(() => {
        const searchVal = searchParams.get('search');
        if (searchVal) {
            const found = incidents.find(i => i.id.toLowerCase() === searchVal.toLowerCase());
            if (found) return found;
        }
        return incidents.find(i => i.priority === "High" && i.status === "Pending") || incidents[0];
    });

    // Filter incidents based on search and filters
    const filteredIncidents = incidents.filter(incident => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                incident.id.toLowerCase().includes(query) ||
                incident.title.toLowerCase().includes(query) ||
                incident.reporter.toLowerCase().includes(query) ||
                incident.caretaker.toLowerCase().includes(query)
            );
        }
        return true;
    }).filter(incident => {
        // Priority filter
        if (priorityFilter !== "all") {
            return incident.priority === priorityFilter;
        }
        return true;
    }).filter(incident => {
        // Status filter
        if (statusFilter !== "all") {
            return incident.status === statusFilter;
        }
        return true;
    });

    // Helper for dynamic card borders
    const getPriorityBorder = (priority: string) => {
        switch(priority) {
            case "High": return "border-l-red-500";
            case "Medium": return "border-l-orange-500";
            default: return "border-l-blue-400";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1">
                        <Link href="/admin" className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1">
                            <ChevronLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            HR Incidents Management
                        </h1>
                        <p className="text-base text-slate-500 mt-2 font-medium">Review and resolve reported incidents from the system.</p>
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
                                placeholder="Search by ID, title, reporter, or caretaker..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            />
                        </div>

                        {/* Priority Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-md font-medium italic text-slate-400 ml-auto mb-2">
                    Showing {filteredIncidents.length} of {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
                </div>

                {/* INCIDENT LIST */}
                <div className="space-y-4">
                    {filteredIncidents.map((incident) => (
                        <div 
                            key={incident.id}
                            className={`bg-white border-y border-r border-slate-200 border-l-4 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md ${getPriorityBorder(incident.priority)}`}
                        >
                            <div className="space-y-3 flex-1">
                                {/* Top Row: ID & Badges */}
                                <div className="flex items-center gap-3">
                                    <span className="text-md font-bold text-slate-500">
                                        {incident.id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                                        incident.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                                        incident.priority === "Medium" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                        "bg-blue-50 text-blue-700 border-blue-200"
                                    }`}>
                                        {incident.priority === "High" && <AlertTriangle size={12} strokeWidth={3} />}
                                        {incident.priority} Priority
                                    </span>
                                     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                                         incident.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"
                                     }`}>
                                         {incident.status === "Pending" ? <Clock size={12} /> : <CheckCircle size={12} />}
                                         {incident.status}
                                     </span>
                                </div>
                                
                                {/* Main Title */}
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{incident.title}</h3>
                                </div>

                                {/* Bottom Row: Metadata Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <User size={14} className="text-slate-400" />
                                        <span>Reported by: <span className="font-semibold">{incident.reporter}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <User size={14} className="text-slate-400" />
                                        <span>Caretaker: <span className="font-semibold">{incident.caretaker}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>Filed: {incident.filed}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions Column */}
                            <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                                <button 
                                    onClick={() => {
                                        setSelectedIncident(incident);
                                        setIsEvidenceOpen(true);
                                    }}
                                    className="px-6 py-2.5 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    View Evidence
                                </button>
                                {incident.status === "Pending" && (
                                    <button 
                                        onClick={() => {
                                            setSelectedIncident(incident);
                                            setIsResolveOpen(true);
                                        }}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
                                    >
                                        Resolve Incident
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {filteredIncidents.length === 0 && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No incidents found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* MODAL: VIEW EVIDENCE */}
            {isEvidenceOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 md:p-6" onClick={() => setIsEvidenceOpen(false)}>
                    {/* Increased max-width from 640px to 880px to accommodate the two columns */}
                    <div className="bg-white rounded-[24px] w-full max-w-[880px] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col p-6 md:p-8 gap-6" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-[#1e293b] text-2xl mb-1">Evidence Review: {selectedIncident.id}</h2>
                                <p className="text-lg font-medium italic text-[#64748b]">{selectedIncident.title}</p>
                            </div>
                            <button onClick={() => setIsEvidenceOpen(false)} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 -mr-2 -mt-2">
                                <X size={24} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Two-Column Content Area */}
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Left Column: Video Area (Takes up ~55% of width on desktop) */}
                            <div className="w-full md:w-[55%] flex flex-col">
                                <div className="aspect-[16/9] w-full bg-[#1a1c29] rounded-2xl flex items-center justify-center text-white relative overflow-hidden group shadow-inner">
                                    <div className="w-16 h-16 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                                        <Play fill="currentColor" size={48} className="ml-2 text-white" />
                                    </div>
                                    <p className="absolute bottom-5 left-6 text-xs font-bold uppercase tracking-widest text-[#cbd5e1] drop-shadow-md">Check-in Video (15s)</p>
                                </div>
                            </div>

                            {/* Right Column: Details (Takes up ~45% of width on desktop) */}
                            <div className="w-full md:w-[45%] flex flex-col gap-4">
                                
                                {/* Metadata Grid - Kept as 2x2 for compactness in the column */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Reporter */}
                                    <div className="p-3.5 bg-[#f0fdf4] rounded-xl border border-[#a7f3d0]">
                                        <p className="text-[10px] font-black text-[#059669] uppercase tracking-wider mb-1">Reporter</p>
                                        <p className="text-sm font-bold text-[#0f172a] truncate">{selectedIncident.reporter}</p>
                                    </div>
                                    
                                    {/* Caretaker */}
                                    <div className="p-3.5 bg-white rounded-xl border border-[#e2e8f0]">
                                        <p className="text-[10px] font-black text-[#64748b] uppercase tracking-wider mb-1">Caretaker</p>
                                        <p className="text-sm font-bold text-[#0f172a] truncate">{selectedIncident.caretaker}</p>
                                    </div>
                                    
                                    {/* Priority */}
                                    <div className={`p-3.5 rounded-xl border ${
                                        selectedIncident.priority === "High" ? "bg-[#fff7ed] border-[#fed7aa]" :
                                        selectedIncident.priority === "Medium" ? "bg-[#fffbeb] border-[#fde68a]" :
                                        "bg-[#eff6ff] border-[#bfdbfe]"
                                    }`}>
                                        <p className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                                            selectedIncident.priority === "High" ? "text-[#ea580c]" :
                                            selectedIncident.priority === "Medium" ? "text-[#d97706]" :
                                            "text-[#2563eb]"
                                        }`}>Priority</p>
                                        <p className="text-sm font-bold text-[#0f172a]">{selectedIncident.priority}</p>
                                    </div>
                                    
                                    {/* Filed Date */}
                                    <div className="p-3.5 bg-white rounded-xl border border-[#e2e8f0]">
                                        <p className="text-[10px] font-black text-[#64748b] uppercase tracking-wider mb-1">Filed Date</p>
                                        <p className="text-sm font-bold text-[#0f172a]">{selectedIncident.filed}</p>
                                    </div>
                                </div>
                                
                                {/* Incident Description */}
                                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex-1">
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <AlertCircle size={14} className="text-[#64748b]" strokeWidth={2.5} /> 
                                        <p className="text-[11px] font-black uppercase tracking-wider text-[#64748b]">Description</p>
                                    </div>
                                    <p className="text-[14px] text-[#475569] leading-relaxed">{selectedIncident.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="flex justify-end pt-4 mt-2 border-t border-[#f1f5f9]">
                            <button onClick={() => setIsEvidenceOpen(false)} className="px-8 py-3 bg-[#0d9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766e] transition-colors shadow-sm">
                                Close Review
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}

            {/* MODAL: RESOLVE CASE */}
            {isResolveOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6" onClick={() => setIsResolveOpen(false)}>
                    <div className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-lg text-slate-900">Final Resolution</h2>
                            <p className="text-sm text-slate-500">Case ID: {selectedIncident.id}</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Resolution Notes</label>
                                <textarea 
                                    placeholder="Enter findings and action taken..."
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Dismiss Case</button>
                                <button className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Sanction User</button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button onClick={() => setIsResolveOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">Submit Resolution</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}