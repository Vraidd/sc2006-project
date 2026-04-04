"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Pagination from "../../components/Pagination";
import { 
    AlertCircle, Play, Search, Filter, 
    AlertTriangle, Clock, CheckCircle, 
    User, Calendar, X, 
    ChevronLeft, ChevronDown
} from "lucide-react";

// Mock incident reports based on schema structure
const mockIncidentReports = [
    { 
        id: "INC-442", 
        reporter: "jane.teo@gmail.com", 
        title: "Did not feed the dog", 
        desc: "Caretaker failed to feed my dog or refill water bowl during 3-day sitting. Pet camera confirmed food bowl untouched.", 
        caretaker: "Sarah Chen", 
        priority: "High", 
        status: "Pending", 
        datetime: new Date("2026-02-15T14:30:00")
    },
    { 
        id: "INC-441", 
        reporter: "peter.tan@example.com", 
        title: "Pet got sick after care", 
        desc: "Cat developed gastroenteritis after 4-day sitting. Vet bills exceeded $300. Suspect inappropriate feeding.", 
        caretaker: "Mike Tan", 
        priority: "High", 
        status: "Pending", 
        datetime: new Date("2026-02-14T11:15:00")
    },
    { 
        id: "INC-440", 
        reporter: "mary.koh@example.com", 
        title: "Arrived 2 hours late without notice", 
        desc: "Caretaker arrived at 11 AM instead of scheduled 9 AM with no prior communication or apology.", 
        caretaker: "Emma Ng", 
        priority: "Medium", 
        status: "Pending", 
        datetime: new Date("2026-02-13T10:45:00")
    },
    { 
        id: "INC-439", 
        reporter: "alex.goh@example.com", 
        title: "Damaged property during sitting", 
        desc: "Family heirloom vase ($200) broken during care. Terrarium temperature gauge also moved from position.", 
        caretaker: "James Lee", 
        priority: "Medium", 
        status: "Resolved", 
        datetime: new Date("2026-02-12T15:20:00")
    },
    { 
        id: "INC-438", 
        reporter: "jenny.lee@example.com", 
        title: "Lost house keys", 
        desc: "Caretaker lost spare house key during 3-day service. Requires lock replacement costing $150.", 
        caretaker: "Lisa Wong", 
        priority: "High", 
        status: "Resolved", 
        datetime: new Date("2026-02-11T13:00:00")
    },
    { 
        id: "INC-437", 
        reporter: "tommy.wong@example.com", 
        title: "Did not follow feeding instructions", 
        desc: "Diabetic dog missed 2 insulin injections and received irregular feeding portions during 5-day care.", 
        caretaker: "Kevin Lim", 
        priority: "Medium", 
        status: "Resolved", 
        datetime: new Date("2026-02-10T09:30:00")
    },
    { 
        id: "INC-436", 
        reporter: "susan.tan@example.com", 
        title: "Dog escaped from yard during care", 
        desc: "Border Collie escaped through unsecured gate. Found 2 blocks away by neighbor. Very dangerous situation.", 
        caretaker: "Michelle Tay", 
        priority: "High", 
        status: "Resolved", 
        datetime: new Date("2026-02-09T16:45:00")
    },
    { 
        id: "INC-435", 
        reporter: "david.lim@example.com", 
        title: "No updates provided during care", 
        desc: "Only 2 photos sent during 7-day care. No communication for 5 days despite repeated requests.", 
        caretaker: "Daniel Tan", 
        priority: "Low", 
        status: "Resolved", 
        datetime: new Date("2026-02-08T12:15:00")
    },
];

export default function AdminIncidents() {
    const searchParams = useSearchParams();
    
    const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
    const [isResolveOpen, setIsResolveOpen] = useState(false);
    const [refundEnabled, setRefundEnabled] = useState(false);
    const [refundAmount, setRefundAmount] = useState<string>('');
    
    // Get initial values from URL params (reads once on load, does not update URL later)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || "all");
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Mock incidents data
    const [incidents] = useState(mockIncidentReports);

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

    // Pagination calculations
    const totalItems = filteredIncidents.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                            HR Incident Management
                        </h1>
                        <p className="text-base text-slate-500 mt-2 font-medium">Review and resolve reported incidents from the system.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search ID, reporter, title or caretaker..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                        
                        {/* Date Range Fields */}
                        <div className="flex items-end gap-2">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                <input
                                    type="date"
                                    className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                            <span className="text-slate-400 pb-2">-</span>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                                <input
                                    type="date"
                                    className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {/* <div className="text-md font-medium italic text-slate-400 ml-auto mb-2">
                    Showing {filteredIncidents.length} of {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
                </div> */}

                {/* INCIDENT LIST */}
                <div className="space-y-4 mb-3">
                    {paginatedIncidents.map((incident) => (
                        <div 
                            key={incident.id}
                            className={`bg-white border-y border-r border-slate-200 border-l-4 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-8 transition-all hover:shadow-md ${getPriorityBorder(incident.priority)}`}
                        >
                            <div className="space-y-3 flex-1">
                                {/* Top Row: ID & Badges (Consolidated) */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm font-black text-slate-500 tracking-wider">
                                        {incident.id}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        incident.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                                        incident.priority === "Medium" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                        "bg-blue-50 text-blue-700 border-blue-200"
                                    }`}>
                                        {incident.priority === "High" && <AlertTriangle size={12} strokeWidth={3} />}
                                        {incident.priority} Priority
                                    </span>
                                     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                         incident.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-100 text-green-600 border-green-200"
                                     }`}>
                                         {incident.status === "Pending" ? <Clock size={12} /> : <CheckCircle size={12} />}
                                         {incident.status}
                                     </span>
                                </div>
                                
                                {/* Main Title & Clamped Description */}
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{incident.title}</h3>
                                    {/* line-clamp-3 ensures it never goes beyond 3 lines */}
                                    <p className="text-sm font-medium text-slate-600 line-clamp-3 leading-relaxed max-w-4xl">
                                        {incident.desc}
                                    </p>
                                </div>

                                {/* Bottom Row: Metadata Grid */}
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <User size={14} className="text-slate-400" />
                                        <span>Reported by: <span className="font-semibold text-slate-900">{incident.reporter}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <User size={14} className="text-slate-400" />
                                        <span>Caretaker: <span className="font-semibold text-slate-900">{incident.caretaker}</span></span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>Filed: {incident.datetime.getDate()}/{incident.datetime.getMonth() + 1}/{incident.datetime.getFullYear()} at {incident.datetime.getHours().toString().padStart(2, '0')}:{incident.datetime.getMinutes().toString().padStart(2, '0')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions Column - Now aligned to the top right */}
                            <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[160px]">
                                <button 
                                    onClick={() => {
                                        setSelectedIncident(incident);
                                        setIsEvidenceOpen(true);
                                    }}
                                    className="w-full px-6 py-2.5 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap"
                                >
                                    View Evidence
                                </button>
                                {incident.status === "Pending" && (
                                    <button 
                                        onClick={() => {
                                            setSelectedIncident(incident);
                                            setIsResolveOpen(true);
                                        }}
                                        className="w-full px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap"
                                    >
                                        Resolve Incident
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {paginatedIncidents.length === 0 && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No incidents found</h3>
                            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                    />
                )}
            </main>

            {/* MODAL: VIEW EVIDENCE */}
            {isEvidenceOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 md:p-6" onClick={() => setIsEvidenceOpen(false)}>
                    {/* Added max-h-[90vh] and flex-col to constrain height and allow internal scrolling */}
                    <div className="bg-white rounded-[24px] w-full max-w-[880px] max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Header (Pinned to top) */}
                        <div className="flex justify-between items-start p-6 md:p-8 pb-4 shrink-0">
                            <div>
                                <h2 className="font-bold text-[#1e293b] text-2xl mb-1">Evidence Review: {selectedIncident.id}</h2>
                                <p className="text-lg font-medium italic text-[#64748b]">{selectedIncident.title}</p>
                            </div>
                            <button onClick={() => setIsEvidenceOpen(false)} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 -mr-2 -mt-2">
                                <X size={24} strokeWidth={2} />
                            </button>
                        </div>

                        {/* Middle Content Area (Scrollable on small screens) */}
                        <div className="flex flex-col md:flex-row gap-6 px-6 md:px-8 pb-6 md:pb-8 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            
                            {/* Left Column: Video Area */}
                            <div className="w-full md:w-[55%] flex flex-col shrink-0">
                                <div className="aspect-[16/9] w-full bg-[#1a1c29] rounded-2xl flex items-center justify-center text-white relative overflow-hidden group shadow-inner">
                                    <div className="w-16 h-16 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                                        <Play fill="currentColor" size={48} className="ml-2 text-white" />
                                    </div>
                                    <p className="absolute bottom-5 left-6 text-xs font-bold uppercase tracking-widest text-[#cbd5e1] drop-shadow-md">Check-in Video (15s)</p>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="w-full md:w-[45%] flex flex-col gap-4">
                                
                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Reporter */}
                                    <div className="p-3.5 bg-[#f0fdf4] rounded-xl border border-[#a7f3d0]">
                                        <p className="text-[10px] font-black text-[#059669] uppercase tracking-wider mb-1">Reporter's Email</p>
                                        <p className="text-sm font-bold text-[#0f172a] truncate" title={selectedIncident.reporter}>{selectedIncident.reporter}</p>
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
                                        <p className="text-[10px] font-black text-[#64748b] uppercase tracking-wider mb-1">Filed Date & Time</p>
                                        <p className="text-sm font-bold text-[#0f172a]">{selectedIncident.datetime.toLocaleDateString()}</p>
                                        <p className="text-xs font-medium text-[#64748b]">{selectedIncident.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                
                                {/* Incident Description */}
                                <div className="p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex-1 flex flex-col max-h-[190px]">
                                    <div className="flex items-center gap-1.5 mb-2 shrink-0">
                                        <AlertCircle size={14} className="text-[#64748b]" strokeWidth={2.5} /> 
                                        <p className="text-[11px] font-black uppercase tracking-wider text-[#64748b]">Description</p>
                                    </div>
                                    <div className="overflow-y-auto pr-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                                        <p className="text-[14px] text-[#475569] leading-relaxed">
                                            {selectedIncident.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action (Pinned to bottom) */}
                        <div className="flex justify-end p-6 md:p-8 py-4 bg-white border-t border-[#f1f5f9] shrink-0 mt-auto">
                            <button onClick={() => setIsEvidenceOpen(false)} className="px-8 py-3 bg-[#0d9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766e] transition-colors shadow-sm">
                                Close Review
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}

            {/* MODAL: RESOLVE CASE */}
            {isResolveOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 md:p-6" onClick={() => setIsResolveOpen(false)}>
                    {/* Added max-h-[90vh] and flex-col here as well */}
                    <div className="bg-white rounded-[24px] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                            <h2 className="font-bold text-xl text-slate-900">Resolve Incident</h2>
                            <p className="text-sm font-semibold text-slate-500">Case ID: {selectedIncident.id}</p>
                        </div>
                        
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Resolution Notes</label>
                                <textarea 
                                    placeholder="Enter findings and action taken..."
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                                />
                            </div>
                            
                            {/* Refund Section */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <input 
                                        type="checkbox" 
                                        id="processRefund" 
                                        className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                                        checked={refundEnabled}
                                        onChange={(e) => {
                                            setRefundEnabled(e.target.checked);
                                            if (!e.target.checked) setRefundAmount('');
                                        }}
                                    />
                                    <label htmlFor="processRefund" className="text-sm font-bold text-amber-900 cursor-pointer">Process Refund</label>
                                </div>
                                <div className={`pl-6 transition-opacity ${refundEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <label className="text-xs font-black text-amber-700 uppercase tracking-widest block mb-2">Refund Amount ($)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        disabled={!refundEnabled}
                                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:bg-slate-100"
                                    />
                                    <p className="text-xs text-amber-600 mt-1">Full or partial refund to the client</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">Dismiss Case</button>
                                <button className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Sanction User</button>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 mt-auto">
                            <button onClick={() => setIsResolveOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">Submit Resolution</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}