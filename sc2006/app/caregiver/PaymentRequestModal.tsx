"use client"
import { useState, useRef } from "react"
import { X, DollarSign, Send } from "lucide-react"

interface PaymentRequestModalProps {
    bookingId: string
    bookingTotal: number
    ownerName: string
    petName: string
    onClose: () => void
    onSubmit: (amount: number) => void
}

export default function PaymentRequestModal({
    bookingId,
    bookingTotal,
    ownerName,
    petName,
    onClose,
    onSubmit
}: PaymentRequestModalProps) {
    const [amount, setAmount] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const modalRef = useRef<HTMLDivElement>(null)

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose()
        }
    }

    const handleSubmit = () => {
        const numAmount = parseFloat(amount)
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Please enter a valid amount")
            return
        }
        if (numAmount > bookingTotal) {
            alert(`Amount cannot exceed the booking total of $${bookingTotal.toFixed(2)}`)
            return
        }
        
        setIsSubmitting(true)
        // Simulate API call delay
        setTimeout(() => {
            onSubmit(numAmount)
            setIsSubmitting(false)
        }, 1000)
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={handleOverlayClick}
        >
            <div 
                ref={modalRef}
                className="bg-white rounded-4xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Request Payment</h2>
                            <p className="text-xs text-slate-500">Booking for {petName}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Booking Info */}
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Client</p>
                        <p className="text-sm font-bold text-slate-900">{ownerName}</p>
                        <p className="text-xs font-black uppercase text-slate-500 tracking-widest mt-3 mb-1">Booking Total</p>
                        <p className="text-sm font-bold text-slate-900">${bookingTotal.toFixed(2)}</p>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-xs font-black uppercase text-slate-700 tracking-widest mb-2">
                            Amount to Request
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                max={bookingTotal}
                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Enter the amount you'd like to request from this booking.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-50 flex gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-200 bg-white rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                        className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={14} />
                        )}
                        {isSubmitting ? "Sending..." : "Send Request"}
                    </button>
                </div>
            </div>
        </div>
    )
}