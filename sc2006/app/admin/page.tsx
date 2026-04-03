"use client"
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { 
    PawPrint, CheckCircle, AlertTriangle, CircleDollarSign, 
    ArrowRight, UserCheck, Settings, MapPin, Star, 
    BadgeCheck, Check, Minus, Clock, ShieldAlert,
    Mail, UserX, Eye, Search, ChevronUp, ChevronDown
} from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("caretakers");
    
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [petTypeFilter, setPetTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("asc");
    
    // Transaction filters
    const [transactionSearch, setTransactionSearch] = useState("");
    const [transactionMethodFilter, setTransactionMethodFilter] = useState("all");
    const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
    const [transactionSortBy, setTransactionSortBy] = useState("");
    const [transactionSortOrder, setTransactionSortOrder] = useState<"asc" | "desc" | "none">("none");
    
    // Report filters
    const [reportSearch, setReportSearch] = useState("");
    const [reportPriorityFilter, setReportPriorityFilter] = useState("all");
    const [reportStatusFilter, setReportStatusFilter] = useState("all");
    const [reportSortBy, setReportSortBy] = useState("");
    const [reportSortOrder, setReportSortOrder] = useState<"asc" | "desc" | "none">("none");

    const stats = [
        { label: "Active Care Contracts", value: "142", icon: (<PawPrint size={24}/>), color: "text-blue-600" },
        { label: "Pending HR Incidents", value: "3", icon: (<AlertTriangle size={24}/>), color: "text-red-600" },
        { label: "Revenue (5% Fee)", value: "$1,240.50", icon: (<CircleDollarSign size={24}/>), color: "text-teal-600" },
        { label: "Verification Queue", value: "12", icon: (<CheckCircle size={24}/>), color: "text-purple-600" }
    ];

    const caretakers = [
        { id: 1, name: "Sarah Chen", email: "sarah.chen@example.com", location: "Bukit Batok", pets: ["Dogs", "Cats"], rate: "$65/day", experience: "5 years", status: "Approved", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", documents: ["NRIC_Front.jpg", "NRIC_Back.jpg", "Pet_Care_Cert.pdf"], availability: "Mar 15 - Apr 30, 2026", biography: "Passionate pet lover with 5 years of experience caring for dogs and cats. Certified in pet first aid and animal behavior." },
        { id: 2, name: "Mike Tan", email: "mike.tan@example.com", location: "Tampines", pets: ["Birds", "Small Mammals"], rate: "$55/day", experience: "3 years", status: "Approved", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", documents: ["NRIC_Front.jpg", "First_Aid_Cert.pdf"], availability: "Apr 1 - Apr 20, 2026", biography: "Specialized in exotic pets and small mammals. Have experience with birds, hamsters, and guinea pigs." },
        { id: 3, name: "Lisa Wong", email: "lisa.wong@example.com", location: "Jurong East", pets: ["Dogs", "Cats", "Reptiles"], rate: "$75/day", experience: "7 years", status: "Approved", dropoff: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", documents: ["NRIC_Front.jpg", "NRIC_Back.jpg", "Pet_Care_Cert.pdf", "Background_Check.pdf"], availability: "Mar 10 - May 15, 2026", biography: "Professional pet sitter with extensive experience in all types of pets including reptiles." },
        { id: 4, name: "James Lee", email: "james.lee@example.com", location: "Woodlands", pets: ["Reptiles", "Fish"], rate: "$80/day", experience: "10 years", status: "Approved", dropoff: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", documents: ["NRIC_Front.jpg", "Specialty_Cert.pdf"], availability: "Mar 20 - Apr 25, 2026", biography: "Aquarium specialist and reptile expert with over a decade of experience." },
        { id: 5, name: "Emma Ng", email: "emma.ng@example.com", location: "Bedok", pets: ["Dogs"], rate: "$70/day", experience: "2 years", status: "Approved", dropoff: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", documents: ["NRIC_Front.jpg", "Incomplete_Form.pdf"], availability: "Mar 25 - Apr 10, 2026", biography: "Dog enthusiast with experience in training and care." },
    ];

    const transactions = [
        { id: "TRX-101", client: "John Lim", caretaker: "Sarah Chen", pet: "Kiki (Cat)", dates: "Apr 01 - Apr 03", amount: "$130.00", status: "Completed", method: "Visa", date: "Apr 01, 2026" },
        { id: "TRX-102", client: "Siti Aminah", caretaker: "James Lee", pet: "Goldie (Fish)", dates: "Mar 28 - Mar 30", amount: "$160.00", status: "Completed", method: "PayNow", date: "Mar 28, 2026" },
    ];

    const reports = [
        { id: "INC-442", reporter: "jiaxinlow716@gmail.com", title: "did not feed the dog", desc: "she did not feed the dogs its 12:5...", caretaker: "Sarah Chen", priority: "High", status: "Pending", filed: "Feb 15, 2026" }
    ];

    // Handle report resolution
    const handleReportResolution = (reportId: string) => {
        alert(`Report ${reportId} has been resolved and marked as completed.`);
    };

    // Handle column click for sorting (cycles: asc -> desc -> none)
    const handleCaretakerSort = (column: string) => {
        if (sortBy === column) {
            if (sortOrder === "asc") setSortOrder("desc");
            else if (sortOrder === "desc") {
                setSortOrder("none");
                setSortBy("");
            }
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const handleTransactionSort = (column: string) => {
        if (transactionSortBy === column) {
            if (transactionSortOrder === "asc") setTransactionSortOrder("desc");
            else if (transactionSortOrder === "desc") {
                setTransactionSortOrder("none");
                setTransactionSortBy("");
            }
        } else {
            setTransactionSortBy(column);
            setTransactionSortOrder("asc");
        }
    };

    const handleReportSort = (column: string) => {
        if (reportSortBy === column) {
            if (reportSortOrder === "asc") setReportSortOrder("desc");
            else if (reportSortOrder === "desc") {
                setReportSortOrder("none");
                setReportSortBy("");
            }
        } else {
            setReportSortBy(column);
            setReportSortOrder("asc");
        }
    };

    // Sort icon helper
    const SortIcon = ({ column, currentSort, order }: { column: string; currentSort: string; order: "asc" | "desc" | "none" }) => {
        if (currentSort !== column) return <span className="w-4 h-4 inline-block ml-1 opacity-0">▲</span>;
        if (order === "asc") return <ChevronUp size={12} className="inline ml-1 text-teal-600" />;
        if (order === "desc") return <ChevronDown size={12} className="inline ml-1 text-teal-600" />;
        return null;
    };

    // Filter and sort transactions
    const filteredTransactions = transactions
        .filter((tx) => {
            if (transactionSearch) {
                const query = transactionSearch.toLowerCase();
                return (
                    tx.id.toLowerCase().includes(query) ||
                    tx.client.toLowerCase().includes(query) ||
                    tx.caretaker.toLowerCase().includes(query) ||
                    tx.pet.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((tx) => {
            if (transactionMethodFilter !== "all") {
                return tx.method === transactionMethodFilter;
            }
            return true;
        })
        .filter((tx) => {
            if (transactionStatusFilter !== "all") {
                return tx.status === transactionStatusFilter;
            }
            return true;
        });

    // Filter and sort reports
    const filteredReports = reports
        .filter((report) => {
            if (reportSearch) {
                const query = reportSearch.toLowerCase();
                return (
                    String(report.id).toLowerCase().includes(query) ||
                    report.reporter.toLowerCase().includes(query) ||
                    report.title.toLowerCase().includes(query) ||
                    report.caretaker.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((report) => {
            if (reportPriorityFilter !== "all") {
                return report.priority === reportPriorityFilter;
            }
            return true;
        })
        .filter((report) => {
            if (reportStatusFilter !== "all") {
                return report.status === reportStatusFilter;
            }
            return true;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (reportSortBy) {
                case "id":
                    comparison = String(a.id).localeCompare(String(b.id));
                    break;
                case "reporter":
                    comparison = a.reporter.localeCompare(b.reporter);
                    break;
                case "priority":
                    comparison = a.priority.localeCompare(b.priority);
                    break;
                case "status":
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = 0;
            }
            return reportSortOrder === "asc" ? comparison : -comparison;
        });

    // Filter and sort caretakers based on search and filter states
    const filteredCaretakers = caretakers
        .filter((ct) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    ct.name.toLowerCase().includes(query) ||
                    ct.email.toLowerCase().includes(query) ||
                    ct.location.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((ct) => {
            // Status filter
            if (statusFilter !== "all") {
                return ct.status === statusFilter;
            }
            return true;
        })
        .filter((ct) => {
            // Location filter
            if (locationFilter !== "all") {
                return ct.location === locationFilter;
            }
            return true;
        })
        .filter((ct) => {
            // Pet type filter
            if (petTypeFilter !== "all") {
                return ct.pets.includes(petTypeFilter);
            }
            return true;
        })
        .sort((a, b) => {
            // Sorting logic
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "experience":
                    comparison = parseInt(a.experience) - parseInt(b.experience);
                    break;
                case "rate":
                    comparison = parseInt(a.rate.replace(/\D/g, "")) - parseInt(b.rate.replace(/\D/g, ""));
                    break;
                case "location":
                    comparison = a.location.localeCompare(b.location);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar/>

            <main className="max-w-7xl mx-auto w-full py-12 px-8">
                <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Dashboard</h2>
                    <p className="text-slate-500 mt-2 text-base font-medium">Real-time status of the care coordination network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 group transition-all hover:shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>{stat.icon}</div>
                                <span className="text-xs font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-lg uppercase tracking-widest">Live</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-12">
                    {/* Updated Tabs to match the image precisely */}
                    <div className="flex border-b border-slate-200 mb-6 gap-2">
                        <button onClick={() => setActiveTab("caretakers")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "caretakers" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            All Caretakers ({filteredCaretakers.length})
                        </button>
                        <button onClick={() => setActiveTab("transactions")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "transactions" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Past Transactions ({transactions.length})
                        </button>
                        <button onClick={() => setActiveTab("reports")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "reports" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Reports ({reports.length})
                        </button>
                    </div>

                    {/* Compact Search and Filter Controls */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                        {activeTab === "caretakers" && (
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search name, email, location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Locations</option>
                                        <option value="Bukit Batok">Bukit Batok</option>
                                        <option value="Tampines">Tampines</option>
                                        <option value="Jurong East">Jurong East</option>
                                        <option value="Woodlands">Woodlands</option>
                                        <option value="Bedok">Bedok</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={petTypeFilter}
                                        onChange={(e) => setPetTypeFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Pets</option>
                                        <option value="Dogs">Dogs</option>
                                        <option value="Cats">Cats</option>
                                        <option value="Birds">Birds</option>
                                        <option value="Reptiles">Reptiles</option>
                                        <option value="Fish">Fish</option>
                                        <option value="Small Mammals">Small Mammals</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {activeTab === "transactions" && (
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search ID, client, caretaker..."
                                        value={transactionSearch}
                                        onChange={(e) => setTransactionSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={transactionMethodFilter}
                                        onChange={(e) => setTransactionMethodFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Methods</option>
                                        <option value="Visa">Visa</option>
                                        <option value="PayNow">PayNow</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={transactionStatusFilter}
                                        onChange={(e) => setTransactionStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        {activeTab === "reports" && (
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search ID, reporter, title, caretaker..."
                                        value={reportSearch}
                                        onChange={(e) => setReportSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={reportPriorityFilter}
                                        onChange={(e) => setReportPriorityFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Priorities</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={reportStatusFilter}
                                        onChange={(e) => setReportStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        )}
                    </div>
                    {/* RESULTS COUNT */}
                    <div className="text-left text-sm font-medium italic text-slate-500 mb-1">
                        {activeTab === "caretakers" && `Showing ${filteredCaretakers.length} of ${caretakers.length} caregiver${caretakers.length !== 1 ? 's' : ''}`}
                        {activeTab === "transactions" && `Showing ${filteredTransactions.length} of ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                        {activeTab === "reports" && `Showing ${filteredReports.length} of ${reports.length} report${reports.length !== 1 ? 's' : ''}`}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                        {/* Caretakers Tab - Updated to match image table style precisely without manage buttons */}
                        {activeTab === "caretakers" && (
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th 
                                            className="py-4 px-6 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('name')}
                                        >
                                            Caretaker <SortIcon column="name" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('location')}
                                        >
                                            Location <SortIcon column="location" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('rate')}
                                        >
                                            Daily Rate <SortIcon column="rate" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-sm font-medium text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('experience')}
                                        >
                                            Experience <SortIcon column="experience" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Availability</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCaretakers.map((ct) => (
                                        <tr key={ct.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={ct.img} alt={ct.name} className="w-9 h-9 rounded-full object-cover" />
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-slate-900 text-sm">{ct.name}</span>
                                                        </div>
                                                        <div className="text-xs text-slate-500">{ct.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    {ct.location}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">
                                                {ct.rate}
                                            </td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">
                                                {ct.experience}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium text-slate-700">{ct.availability}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded text-xs uppercase font-bold ${
                                                    ct.status === "Approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {ct.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button 
                                                    onClick={() => window.location.href = `./admin/verified?search=${encodeURIComponent(ct.email)}`}
                                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-colors"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === "transactions" && (
                            <table className="w-full text-left border-collapse min-w-225">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('id')}
                                        >
                                            Transaction ID <SortIcon column="id" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('client')}
                                        >
                                            Client / Caretaker <SortIcon column="client" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Pet / Dates</th>
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('amount')}
                                        >
                                            Amount <SortIcon column="amount" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">{tx.id}</td>
                                            <td className="py-4 px-6">
                                                <p className="text-sm font-bold text-slate-900">{tx.client}</p>
                                                <p className="text-xs text-slate-500">Care by: {tx.caretaker}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-sm font-medium">{tx.pet}</p>
                                                <p className="text-xs text-slate-400">{tx.dates}</p>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-black text-slate-900">{tx.amount}</td>
                                            <td className="py-4 px-6 text-xs font-bold text-slate-500 uppercase">{tx.method}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === "reports" && (
                             <table className="w-full text-left border-collapse min-w-225">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('id')}
                                        >
                                            ID <SortIcon column="id" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('reporter')}
                                        >
                                            Reporter <SortIcon column="reporter" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Incident Details</th>
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('priority')}
                                        >
                                            Priority <SortIcon column="priority" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('status')}
                                        >
                                            Status <SortIcon column="status" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">{report.id}</td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">{report.reporter}</td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-slate-900 italic text-sm">"{report.title}"</div>
                                                <div className="text-xs text-slate-500">Against: {report.caretaker}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 text-[10px] font-black uppercase bg-red-100 text-red-700 rounded">
                                                    {report.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-xs font-bold text-orange-600 uppercase flex items-center gap-1 mt-4">
                                                <Clock size={14}/> {report.status}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button 
                                                    onClick={() => window.location.href = `/admin/incidents?search=${report.id}`}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}