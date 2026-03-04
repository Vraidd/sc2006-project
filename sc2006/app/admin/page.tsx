"use client"
import Link from "next/link";
import Navbar from "../components/Navbar";
import { PawPrint, CheckCircle, AlertTriangle, CircleDollarSign, ArrowRight, UserCheck, Settings } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Active Care Contracts", value: "142", icon: (<PawPrint size={24}/>), color: "text-blue-600" },
        { label: "Pending HR Incidents", value: "3", icon: (<AlertTriangle size={24}/>), color: "text-red-600", link: "/admin/incidents" },
        { label: "Revenue (5% Fee)", value: "$1,240.50", icon: (<CircleDollarSign size={24}/>), color: "text-teal-600" },
        { label: "Verification Queue", value: "12", icon: (<CheckCircle size={24}/>), color: "text-purple-600", link: "/admin/verified" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar/>

            <main className="max-w-7xl mx-auto w-full py-12 px-8">
                <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h2>
                    <p className="text-slate-500 mt-2 text-base font-medium">Real-time status of the care coordination network.</p>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group transition-all hover:shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-lg uppercase tracking-widest">Live</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
                            
                            {stat.link && (
                                <Link href={stat.link} className="mt-6 flex items-center gap-2 text-xs font-black text-teal-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                                    Manage Queue <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* HR INCIDENT MANAGEMENT [UC6] */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                                Urgent HR Incidents
                            </h3>
                            <Link href="/admin/incidents" className="text-sm font-black text-teal-600 uppercase tracking-widest hover:underline">
                                View all reports →
                            </Link>
                        </div>
                        
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-red-50/20">
                                <div>
                                    <p className="text-lg font-bold text-slate-900">"dog malnourished"</p>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">Reported by: Mr Doob • ID: INC-442</p>
                                </div>
                                <Link href="/admin/incidents" className="bg-white border-2 border-red-100 text-red-600 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm active:scale-95">
                                    Review Evidence
                                </Link>
                            </div>
                            <div className="p-8 flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold text-slate-900">"Unresponsive during active care"</p>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">Reported by: Doomy • ID: INC-441</p>
                                </div>
                                <div className="bg-slate-50 text-slate-400 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100">
                                    Pending Upload
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS & MAINTENANCE */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Controls</h3>
                        
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
                            {/* LINKED VERIFICATION BUTTON */}
                            <Link href="/admin/verified" className="w-full bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between hover:bg-slate-800 transition-all group active:scale-95">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <UserCheck className="text-teal-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-sm uppercase tracking-widest">Verify Peers</p>
                                        <p className="text-xs text-slate-400 font-medium">12 pending badges</p>
                                    </div>
                                </div>
                                <ArrowRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </Link>

                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <h4 className="text-base font-black text-slate-900 mb-2 flex items-center gap-2">
                                    <Settings size={18} className="text-teal-500" /> Data Retention
                                </h4>
                                <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                                    Auto-deleting evidence 1 week after contract end as per revised system specs.
                                </p>
                                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                                    <div className="bg-teal-500 h-full w-[85%] rounded-full animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
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