"use client"
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { 
    PawPrint, CheckCircle, AlertTriangle, CircleDollarSign, 
    ArrowRight, UserCheck, Settings, MapPin, Star, 
    BadgeCheck, Check, Minus, Clock, ShieldAlert,
    Mail, UserX, Eye
} from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("caretakers");

    const stats = [
        { label: "Active Care Contracts", value: "142", icon: (<PawPrint size={24}/>), color: "text-blue-600" },
        { label: "Pending HR Incidents", value: "3", icon: (<AlertTriangle size={24}/>), color: "text-red-600", link: "/admin/incidents" },
        { label: "Revenue (5% Fee)", value: "$1,240.50", icon: (<CircleDollarSign size={24}/>), color: "text-teal-600" },
        { label: "Verification Queue", value: "12", icon: (<CheckCircle size={24}/>), color: "text-purple-600", link: "/admin/verified" }
    ];

    const caretakers = [
        { id: 1, name: "Sarah Chen", email: "sarah.chen@example.com", location: "Central Singapore", pets: ["Dogs", "Cats"], rate: "$65/day", rating: 4.9, status: "Approved", dropoff: true, img: "https://i.pravatar.cc/150?u=sarah" },
        { id: 2, name: "Mike Tan", email: "mike.tan@example.com", location: "East Singapore", pets: ["Birds", "Small Mammals"], rate: "$55/day", rating: 4.7, status: "Approved", dropoff: true, img: "https://i.pravatar.cc/150?u=mike" },
        { id: 3, name: "Lisa Wong", email: "lisa.wong@example.com", location: "West Singapore", pets: ["Dogs", "Cats", "Reptiles"], rate: "$75/day", rating: 4.8, status: "Approved", dropoff: false, img: "https://i.pravatar.cc/150?u=lisa" },
        { id: 4, name: "James Lee", email: "james.lee@example.com", location: "North Singapore", pets: ["Reptiles", "Fish"], rate: "$80/day", rating: 5.0, status: "Approved", dropoff: true, img: "https://i.pravatar.cc/150?u=james" },
        { id: 5, name: "Emma Ng", email: "emma.ng@example.com", location: "South Singapore", pets: ["Dogs"], rate: "$70/day", rating: 4.6, status: "Approved", dropoff: false, img: "https://i.pravatar.cc/150?u=emma" },
    ];

    const transactions = [
        { id: "TRX-101", client: "John Lim", caretaker: "Sarah Chen", pet: "Kiki (Cat)", dates: "Apr 01 - Apr 03", amount: "$130.00", status: "Completed", method: "Visa", date: "Apr 01, 2026" },
        { id: "TRX-102", client: "Siti Aminah", caretaker: "James Lee", pet: "Goldie (Fish)", dates: "Mar 28 - Mar 30", amount: "$160.00", status: "Completed", method: "PayNow", date: "Mar 28, 2026" },
    ];

    const reports = [
        { id: 1, reporter: "jiaxinlow716@gmail.com", title: "did not feed the dog", desc: "she did not feed the dogs its 12:5...", caretaker: "Sarah Chen", priority: "High", status: "Pending", filed: "Feb 15, 2026" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar/>

            <main className="max-w-7xl mx-auto w-full py-12 px-8">
                <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h2>
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
                            All Caretakers ({caretakers.length})
                        </button>
                        <button onClick={() => setActiveTab("transactions")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "transactions" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Past Transactions ({transactions.length})
                        </button>
                        <button onClick={() => setActiveTab("reports")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "reports" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Reports ({reports.length})
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                        {/* Caretakers Tab - Updated to match image table style precisely without manage buttons */}
                        {activeTab === "caretakers" && (
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Caretaker</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Location</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Pet Types</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Daily Rate</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Rating</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Drop-off</th>
                                        <th className="py-4 px-6 text-sm font-medium text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {caretakers.map((ct) => (
                                        <tr key={ct.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={ct.img} alt={ct.name} className="w-9 h-9 rounded-full object-cover" />
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-slate-900 text-sm">{ct.name}</span>
                                                            <BadgeCheck size={14} className="text-teal-500" />
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
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2">
                                                    {ct.pets.map(pet => (
                                                        <span key={pet} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded text-xs font-medium">
                                                            {pet}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-bold text-slate-900">
                                                {ct.rate}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                                    <Star size={14} className="fill-amber-400 text-amber-400" />
                                                    {ct.rating.toFixed(1)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded text-xs uppercase font-bold ${
                                                    ct.status === "Approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>
                                                    {ct.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {ct.dropoff ? (
                                                    <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                ) : (
                                                    <Minus size={16} className="text-slate-400" />
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button 
                                                    onClick={() => window.location.href = `./admin/verified?search=${encodeURIComponent(ct.name)}`}
                                                    className="text-xs font-black uppercase text-teal-600 hover:underline"
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
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Transaction ID</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Client / Caretaker</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Pet / Dates</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Amount</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
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
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Reporter</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Incident Details</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Priority</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
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
                                                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest">Resolve</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* BOTTOM SYSTEM CONTROLS - UNCHANGED */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                                Urgent HR Incidents
                            </h3>
                        </div>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold text-slate-900">"dog malnourished"</p>
                                <p className="text-sm text-slate-500 mt-1">Reported by: Mr Doob • ID: INC-442</p>
                            </div>
                            <button className="border-2 border-red-100 text-red-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50">Review</button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Controls</h3>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                             <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100">
                                <h4 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
                                    <Settings size={18} className="text-teal-500" /> Data Retention
                                </h4>
                                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3 mt-4">
                                    <div className="bg-teal-500 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                </div>
                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Next cleanup: 04:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}