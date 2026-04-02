"use client"
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { 
    PawPrint, CheckCircle, AlertTriangle, CircleDollarSign, 
    ArrowRight, UserCheck, Settings, MapPin, Star, 
    BadgeCheck, Check, Minus, Clock, ShieldAlert
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
        { id: 2, name: "Mike Tan", email: "mike.tan@example.com", location: "East Singapore", pets: ["Birds"], rate: "$55/day", rating: 4.7, status: "Approved", dropoff: true, img: "https://i.pravatar.cc/150?u=mike" },
        { id: 3, name: "Lisa Wong", email: "lisa.wong@example.com", location: "West Singapore", pets: ["Dogs", "Reptiles"], rate: "$75/day", rating: 4.8, status: "Pending", dropoff: false, img: "https://i.pravatar.cc/150?u=lisa" },
        { id: 4, name: "James Lee", email: "james.lee@example.com", location: "North Singapore", pets: ["Fish"], rate: "$80/day", rating: 5.0, status: "Approved", dropoff: true, img: "https://i.pravatar.cc/150?u=james" },
        { id: 5, name: "Emma Ng", email: "emma.ng@example.com", location: "South Singapore", pets: ["Dogs"], rate: "$70/day", rating: 4.6, status: "Pending", dropoff: false, img: "https://i.pravatar.cc/150?u=emma" },
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
                    <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 mb-6 shadow-sm">
                        <button onClick={() => setActiveTab("caretakers")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "caretakers" ? "bg-slate-900 text-white font-bold" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Caretakers Management
                        </button>
                        <button onClick={() => setActiveTab("transactions")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "transactions" ? "bg-slate-900 text-white font-bold" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Transaction History
                        </button>
                        <button onClick={() => setActiveTab("reports")} className={`px-4 py-2 text-sm rounded-lg transition-colors ${activeTab === "reports" ? "bg-slate-900 text-white font-bold" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Incident Reports
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
                        {activeTab === "caretakers" && (
                            <table className="w-full text-left border-collapse min-w-225">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Caretaker</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Location</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Status</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Drop-off</th>
                                        <th className="py-4 px-6 text-xs font-black uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {caretakers.map((ct) => (
                                        <tr key={ct.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-6 flex items-center gap-3">
                                                <img src={ct.img} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-bold text-slate-900">{ct.name}</span>
                                                        {ct.status === "Approved" && <BadgeCheck size={16} className="text-teal-500" />}
                                                    </div>
                                                    <span className="text-xs text-slate-500">{ct.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-medium"><MapPin size={14} className="inline mr-1"/> {ct.location}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded ${ct.status === "Approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                                    {ct.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {ct.dropoff ? <Check size={18} className="text-green-600 font-bold" /> : <Minus size={18} className="text-slate-300" />}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button className="text-xs font-black uppercase text-teal-600 hover:underline">Manage</button>
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