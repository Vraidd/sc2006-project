"use client"
import Navbar from "../../components/Navbar";

// MOCK DATA
const dummyTransactions = [
    { id: "TX-9901", date: "Feb 19, 2026", pet: "Dawg", caretaker: "Sarah Chen", amount: 260.00, fee: 13.00, total: 273.00, status: "Paid" }
];

export default function Transactions() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto pt-12 px-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Transactions</h1>
                <p className="text-gray-500 mb-8">View your history and platform service fees.</p>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4 text-right">Care Amount</th>
                                <th className="px-6 py-4 text-right">Fee (5%)</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {dummyTransactions.map((tx) => (
                                <tr key={tx.id} className="text-md">
                                    <td className="px-6 py-6">
                                        <p className="font-bold text-slate-900">{tx.pet} Care</p>
                                        <p className="text-sm text-gray-400 mt-0.5">ID: {tx.id} • {tx.date}</p>
                                    </td>
                                    <td className="px-6 py-6 text-right text-gray-600">${tx.amount.toFixed(2)}</td>
                                    <td className="px-6 py-6 text-right text-teal-600 font-medium">+${tx.fee.toFixed(2)}</td>
                                    <td className="px-6 py-6 text-right font-bold text-slate-900">${tx.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}