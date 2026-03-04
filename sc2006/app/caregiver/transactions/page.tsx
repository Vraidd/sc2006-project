"use client"
import Navbar from "../../components/Navbar";

// DUMMY DATA
const dummyTransactions = [
    {
        id: "TXN-0892",
        date: "Feb 19, 2026",
        petName: "Dawg",
        ownerName: "Mr doob",
        gross: 260.00,
        fee: 13.00, // 5% platform fee
        net: 247.00,
        status: "Pending Clearance"
    },
    {
        id: "TXN-0871",
        date: "Feb 12, 2026",
        petName: "Dawgy",
        ownerName: "Josh Tan",
        gross: 120.00,
        fee: 6.00, // 5% platform fee
        net: 114.00,
        status: "Paid Out"
    }
];

export default function CaregiverTransactions() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                {/* HEADER */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900">Earnings & Payouts</h1>
                    <p className="text-slate-500 mt-1">Track your completed jobs and platform fee deductions.</p>
                </div>

                {/* EARNINGS SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Earnings</p>
                        <p className="text-3xl font-black text-teal-600">$361.00</p>
                        <p className="text-xs text-slate-400 mt-2">Available to withdraw</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Clearance</p>
                        <p className="text-3xl font-black text-slate-800">$247.00</p>
                        <p className="text-xs text-amber-500 font-medium mt-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> 1 active job
                        </p>
                    </div>
                    <div className="bg-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100">
                        <p className="text-xs font-bold text-teal-600/70 uppercase tracking-widest mb-1">Platform Fees Paid</p>
                        <p className="text-3xl font-black text-teal-800">$19.00</p>
                        <p className="text-xs text-teal-600 mt-2 font-medium">5% per transaction</p>
                    </div>
                </div>

                {/* TRANSACTIONS TABLE */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-white flex justify-between items-center">
                        <h2 className="font-bold text-slate-800">Transaction History</h2>
                        <button className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
                            Download CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Job Details</th>
                                    <th className="px-6 py-4 text-right">Gross Booking</th>
                                    <th className="px-6 py-4 text-right">Platform Fee (5%)</th>
                                    <th className="px-6 py-4 text-right">Net Payout</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {dummyTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900">{tx.petName} <span className="text-slate-400 font-medium">({tx.ownerName})</span></p>
                                            <p className="text-xs text-slate-400 mt-0.5">{tx.id} • {tx.date}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-slate-600 font-medium">
                                            ${tx.gross.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-red-400 font-medium">
                                            -${tx.fee.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-teal-600">
                                            ${tx.net.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                tx.status === 'Paid Out' 
                                                ? 'bg-green-50 text-green-600 border border-green-100' 
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}