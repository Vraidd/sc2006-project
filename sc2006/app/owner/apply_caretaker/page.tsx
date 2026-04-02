"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { 
    BadgeCheck, 
    Upload, 
    DollarSign, 
    MapPin, 
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Briefcase,
    FileText,
    PawPrint,
    Home,
    X
} from "lucide-react";

const PET_TYPES = ["DOG", "CAT", "BIRD", "FISH", "REPTILE", "SMALL_ANIMAL"];

export default function ApplyCaretaker() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState<"PENDING" | "APPROVED" | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        biography: "",
        dailyRate: "",
        location: "",
        experienceYears: "",
        petPreferences: [] as string[],
        verificationDoc: "",
    });

    // Availability state
    const [availability, setAvailability] = useState<{
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[]>([]);

    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [newAvailability, setNewAvailability] = useState({
        dayOfWeek: 0,
        startTime: "09:00",
        endTime: "17:00"
    });

    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        if (!loading && user) {
            checkApplicationStatus();
        }
    }, [user, loading]);

    const checkApplicationStatus = async () => {
        try {
            const res = await fetch(`/api/caregivers/${user?.id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.caregiver) {
                    setHasApplied(true);
                    setApplicationStatus(data.caregiver.verified ? "APPROVED" : "PENDING");
                    setFormData({
                        biography: data.caregiver.biography || "",
                        dailyRate: data.caregiver.dailyRate?.toString() || "",
                        location: data.caregiver.location || "",
                        experienceYears: data.caregiver.experienceYears?.toString() || "",
                        petPreferences: data.caregiver.petPreferences || [],
                        verificationDoc: data.caregiver.verificationDoc || "",
                    });
                }
            }
        } catch (err) {
            console.error("Error checking application status:", err);
        }
    };

    const handlePetPreferenceToggle = (petType: string) => {
        setFormData(prev => ({
            ...prev,
            petPreferences: prev.petPreferences.includes(petType)
                ? prev.petPreferences.filter(p => p !== petType)
                : [...prev.petPreferences, petType]
        }));
    };

    const addAvailability = () => {
        setAvailability(prev => [...prev, { ...newAvailability }]);
        setShowAvailabilityModal(false);
        setNewAvailability({ dayOfWeek: 0, startTime: "09:00", endTime: "17:00" });
    };

    const removeAvailability = (index: number) => {
        setAvailability(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.biography || !formData.dailyRate || !formData.location || 
                !formData.experienceYears || formData.petPreferences.length === 0) {
                throw new Error("Please fill in all required fields");
            }

            const payload = {
                biography: formData.biography,
                dailyRate: parseFloat(formData.dailyRate),
                location: formData.location,
                experienceYears: parseInt(formData.experienceYears),
                petPreferences: formData.petPreferences,
                verificationDoc: formData.verificationDoc,
                availability: availability
            };

            const res = await fetch("/api/caregivers/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to submit application");
            }

            setSuccess(true);
            setHasApplied(true);
            setApplicationStatus("PENDING");
            
            // Redirect after 3 seconds
            setTimeout(() => {
                router.push("/caregiver");
            }, 3000);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <p className="text-slate-400 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-lg max-w-md text-center">
                        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-teal-100">
                            <CheckCircle size={40} className="text-teal-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-3">Application Submitted!</h2>
                        <p className="text-slate-600 font-medium mb-6">
                            Your caretaker application is now pending HR review. You'll be notified once approved.
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Redirecting to dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />
            
            <main className="max-w-4xl mx-auto pt-12 px-6">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            {hasApplied ? "Caretaker Application" : "Become a Caretaker"}
                        </h1>
                        {applicationStatus === "APPROVED" && (
                            <BadgeCheck size={32} className="text-teal-500" />
                        )}
                        {applicationStatus === "PENDING" && (
                            <Clock size={32} className="text-amber-500" />
                        )}
                    </div>
                    <p className="text-slate-500 text-base font-medium">
                        {hasApplied 
                            ? applicationStatus === "APPROVED" 
                                ? "Your application has been approved! You can now accept bookings."
                                : "Your application is pending HR approval. You can still accept bookings, but won't have the verified badge yet."
                            : "Join our network of trusted pet caretakers and start earning today."
                        }
                    </p>
                </div>

                {/* Status Banner */}
                {hasApplied && (
                    <div className={`mb-8 p-6 rounded-2xl border-2 flex items-center gap-4 ${
                        applicationStatus === "APPROVED" 
                            ? "bg-teal-50 border-teal-200" 
                            : "bg-amber-50 border-amber-200"
                    }`}>
                        {applicationStatus === "APPROVED" ? (
                            <>
                                <CheckCircle size={24} className="text-teal-600 shrink-0" />
                                <div>
                                    <p className="font-black text-teal-900 text-sm uppercase tracking-widest">Verified Caretaker</p>
                                    <p className="text-sm font-medium text-teal-700 mt-1">
                                        You have full access to all caretaker features and the verified badge.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={24} className="text-amber-600 shrink-0" />
                                <div>
                                    <p className="font-black text-amber-900 text-sm uppercase tracking-widest">Pending Verification</p>
                                    <p className="text-sm font-medium text-amber-700 mt-1">
                                        You can accept bookings now, but the verified badge will appear after HR approval.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Application Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white border border-slate-100 ruonded-4xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                <User size={20} className="text-teal-600" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                                    Biography <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.biography}
                                    onChange={(e) => setFormData({...formData, biography: e.target.value})}
                                    placeholder="Tell pet owners about your experience, passion for animals, and what makes you a great caretaker..."
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                                    disabled={hasApplied}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <MapPin size={12} className="text-teal-500" /> Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        placeholder="e.g., Central Singapore"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                                        disabled={hasApplied}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Briefcase size={12} className="text-teal-500" /> Years of Experience <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.experienceYears}
                                        onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                                        placeholder="0"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                                        disabled={hasApplied}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <DollarSign size={12} className="text-teal-500" /> Daily Rate (SGD) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.dailyRate}
                                    onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                                    placeholder="65.00"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                                    disabled={hasApplied}
                                />
                                <p className="text-xs font-medium text-slate-400 mt-2">
                                    Platform fee: 5% • You'll receive ${formData.dailyRate ? (parseFloat(formData.dailyRate) * 0.95).toFixed(2) : "0.00"} per day
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pet Preferences */}
                    <div className="bg-white border border-slate-100 ruonded-4xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                <PawPrint size={20} className="text-teal-600" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Pet Preferences</h2>
                        </div>

                        <p className="text-sm font-medium text-slate-600 mb-4">
                            Select the types of pets you're comfortable caring for <span className="text-red-500">*</span>
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {PET_TYPES.map((petType) => (
                                <button
                                    key={petType}
                                    type="button"
                                    onClick={() => !hasApplied && handlePetPreferenceToggle(petType)}
                                    disabled={hasApplied}
                                    className={`p-4 rounded-xl border-2 text-sm font-black uppercase tracking-wider transition-all ${
                                        formData.petPreferences.includes(petType)
                                            ? "bg-teal-50 border-teal-500 text-teal-700"
                                            : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
                                    } ${hasApplied ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                                >
                                    {petType.replace("_", " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="bg-white border border-slate-100 ruonded-4xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                    <Calendar size={20} className="text-teal-600" />
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Availability Schedule</h2>
                            </div>
                            {!hasApplied && (
                                <button
                                    type="button"
                                    onClick={() => setShowAvailabilityModal(true)}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-md shadow-teal-600/20"
                                >
                                    Add Slot
                                </button>
                            )}
                        </div>

                        {availability.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                <Clock size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    No availability added yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {availability.map((slot, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-slate-900 text-sm">
                                                {DAYS[slot.dayOfWeek]}
                                            </span>
                                            <span className="text-sm font-medium text-slate-600">
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                        </div>
                                        {!hasApplied && (
                                            <button
                                                type="button"
                                                onClick={() => removeAvailability(index)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Verification Document */}
                    <div className="bg-white border border-slate-100 ruonded-4xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                <FileText size={20} className="text-teal-600" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Verification Document</h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium text-slate-600">
                                Upload a government-issued ID or certification (optional but recommended for faster approval)
                            </p>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-teal-300 transition-colors">
                                <Upload size={32} className="text-slate-300 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-600 mb-2">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs font-medium text-slate-400">
                                    PDF, JPG, or PNG • Max 5MB
                                </p>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    disabled={hasApplied}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-3">
                            <AlertCircle size={24} className="text-red-600 shrink-0" />
                            <p className="text-sm font-bold text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    {!hasApplied && (
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-4 border border-slate-200 bg-white rounded-2xl text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-4 bg-teal-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </main>

            {/* Availability Modal */}
            {showAvailabilityModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white ruonded-4xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900">Add Availability</h3>
                            <button
                                onClick={() => setShowAvailabilityModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                                    Day of Week
                                </label>
                                <select
                                    value={newAvailability.dayOfWeek}
                                    onChange={(e) => setNewAvailability({...newAvailability, dayOfWeek: parseInt(e.target.value)})}
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                                >
                                    {DAYS.map((day, index) => (
                                        <option key={index} value={index}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newAvailability.startTime}
                                        onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={newAvailability.endTime}
                                        onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addAvailability}
                                className="w-full bg-teal-600 text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 mt-6"
                            >
                                Add Availability
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
