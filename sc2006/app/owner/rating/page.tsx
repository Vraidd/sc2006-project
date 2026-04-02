"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "../../components/Navbar"
import Link from "next/link"
import { Star, ChevronLeft, Send, Sparkles } from "lucide-react"

export default function RatingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/owner/my_bookings";
    
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 1000));
        console.log("Review submitted:", { rating, comment });
        setIsSubmitted(true);
        setIsSubmitting(false);
        
        // Auto-redirect after a short delay
        setTimeout(() => {
            router.push(redirectUrl);
        }, 1500)
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans pb-20">
                <Navbar />
                <main className="max-w-2xl mx-auto px-6 py-16 text-center">
                    <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Sparkles size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-3">Thank You!</h1>
                    <p className="text-slate-500 font-medium mb-2">Your review has been submitted.</p>
                    <p className="text-teal-600 font-bold text-sm mb-8">Redirecting you shortly...</p>
                    <Link 
                        href={redirectUrl}
                        className="inline-block px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Go Back Now
                    </Link>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />
            <main className="max-w-2xl mx-auto px-6 py-10">
                <Link href={redirectUrl} className="text-teal-600 hover:text-teal-700 text-sm font-bold flex items-center gap-1 mb-8">
                    <ChevronLeft size={16} /> Back to Bookings
                </Link>

                <h1 className="text-3xl font-black text-slate-900 mb-2">Rate Your Experience</h1>
                <p className="text-slate-500 font-medium mb-8">How was your booking?</p>

                {/* Star Rating */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 mb-6 shadow-sm">
                    <div className="flex justify-center gap-3 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    size={52}
                                    className={`transition-colors ${
                                        (hoveredRating || rating) >= star
                                            ? "text-amber-400 fill-amber-400 drop-shadow-md"
                                            : "text-slate-200"
                                    }`}
                                    strokeWidth={1.5}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-center text-lg font-bold text-teal-600">
                            {rating <= 2 ? "Poor" : rating === 3 ? "Average" : rating === 4 ? "Good" : "Excellent"}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 mb-6 shadow-sm">
                    <label className="block text-sm font-black text-slate-900 mb-3">
                        Leave a comment (optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience..."
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </main>
        </div>
    )
}