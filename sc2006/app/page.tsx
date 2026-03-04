"use client"
import Navbar from "./components/Navbar";
import Link from "next/link";
import { 
    PawPrint, 
    ClipboardList, 
    MapPin, 
    ShieldCheck, 
    Smartphone, 
    Instagram, 
    Twitter, 
    MessageCircle, 
    Mail,
    Video,
    Facebook
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            {/* HEADER/HERO */}
            <header className="w-full pt-32 pb-24 px-6 text-center bg-linear-to-b from-teal-50/50 to-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Pawsport & Peer
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 mb-10 font-medium">
                        Providing trusted care for pet owners since 2026
                    </p>
                    <Link 
                        href="/signup" 
                        className="inline-block bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-600/20 hover:-translate-y-0.5"
                    >
                        Join Us Now
                    </Link>
                </div>
            </header>

            <main className="w-full max-w-6xl mx-auto px-6 py-16 space-y-32">
                
                {/* WHAT WE OFFER */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What we offer</h2>
                        <p className="text-gray-500">Everything you need to ensure your pets are safe and loved.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard 
                            title="Pet Services"
                            body="Stay connected through 10-15s video check-ins. Our secure, time-limited links ensure real-time evidence of care."
                            icon={<Video size={24} />}
                        />
                        <FeatureCard 
                            title="Behavioral Blueprints"
                            body="Create detailed pet profiles including triggers and sensitivities to ensure your caregiver is fully prepared."
                            icon={<ClipboardList size={24} />}
                        />
                        <FeatureCard 
                            title="Smart Matching"
                            body="Find local caregivers using our matching engine, factoring in proximity and veterinary facility access."
                            icon={<MapPin size={24} />}
                        />
                        <FeatureCard 
                            title="Privacy & Security"
                            body="Your privacy is priority. We utilize automated data retention policies that expire video evidence after the care period."
                            icon={<ShieldCheck size={24} />}
                        />
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">How it works</h2>
                    <div className="space-y-4">
                        <StepCard 
                            step="1"
                            title="Create a Blueprint"
                            description="Tell the system about your pet's needs"
                        />
                        <StepCard 
                            step="2"
                            title="Match & Request"
                            description="Find a caregiver and send a time-limited check-in request."
                        />
                        <StepCard 
                            step="3"
                            title="Secure Upload"
                            description="The caregiver uploads a 10-15s video via a one-time link."
                        />
                        <StepCard 
                            step="4"
                            title="Peace of Mind"
                            description="Review the evidence and approve the care."
                        />
                    </div>
                </section>

                {/* TESTIMONIALS & FAQ */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* TESTIMONIALS */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Testimonials</h2>
                        <div className="bg-teal-50 border border-teal-100 p-8 rounded-2xl relative">
                            <span className="text-4xl absolute top-4 left-4 opacity-20">❝</span>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 relative z-10">Amazing service!</h3>
                            <p className="text-gray-700 relative z-10">"Thanks to this system, we are able to take care of our pets easily!"</p>
                            <p className="text-teal-700 font-semibold mt-4 relative z-10">— Jessica</p>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions (FAQ)</h2>
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-2">How do you match and request caregivers?</h3>
                            <p className="text-gray-600 text-sm">Use our search caregivers functions to search for one of our highly trained caregivers for your pets!</p>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="bg-teal-800 text-teal-50 pt-16 pb-8 border-t border-teal-700">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-center font-bold text-3xl md:text-4xl mb-12 text-white">Contact us here! We won't bite :)</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-teal-700/50 pb-12 mb-8 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-xl font-semibold text-white mb-6">Find us on</h3>
                            <div className="flex gap-4">
                                <SocialIcon icon={<Facebook size={20} />} />
                                <SocialIcon icon={<Instagram size={20} />} />
                                <SocialIcon icon={<Twitter size={20} />} />
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-xl font-semibold text-white mb-6">Contact Us</h3>
                            <div className="flex gap-4">
                                <SocialIcon icon={<MessageCircle size={20} />} />
                                <SocialIcon icon={<Mail size={20} />} />
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center text-teal-300 text-sm">&copy; 2026 Pawsport & Peer. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    )
}

// --- LOCAL UI COMPONENTS ---

function FeatureCard({ title = "", body = "", icon = null as any }) {
    return (
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
        </div>
    );
}

function StepCard({ step = "", title = "", description = "" }) {
    return (
        <div className="flex items-center gap-6 bg-white border border-gray-100 p-4 pr-6 rounded-2xl shadow-sm">
            <div className="w-12 h-12 shrink-0 bg-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                {step}
            </div>
            <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}

function SocialIcon({ icon = null as any }) {
    return (
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white cursor-pointer transition-all">
            {icon}
        </div>
    );
}