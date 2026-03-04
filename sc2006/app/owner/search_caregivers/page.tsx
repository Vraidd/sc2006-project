"use client"
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import CaretakerCard from '../../components/CaretakerCard'; // Importing your component
import { 
  MapPin, 
  Calendar, 
  Search,
  Maximize2
} from 'lucide-react';

// DUMMY DATA - Updated to match CaretakerCard props
const dummyCaregivers = [
    {
        id: 1,
        name: "Sarah Chen",
        location: "Bukit Batok",
        experience: "5+ years",
        rating: 4.9,
        reviews: 47,
        price: 65,
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        isVerified: true,
        petsHandled: ["Dogs", "Cats"]
    },
    {
        id: 2,
        name: "Lisa Wong",
        location: "Ang Mo Kio",
        experience: "7+ years",
        rating: 4.8,
        reviews: 63,
        price: 75,
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        isVerified: true,
        petsHandled: ["Dogs", "Cats", "Reptiles"]
    },
    {
        id: 3,
        name: "Jason Lim",
        location: "Jurong East",
        experience: "3+ years",
        rating: 4.7,
        reviews: 28,
        price: 55,
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason",
        isVerified: false,
        petsHandled: ["Dogs", "Birds", "Fish"]
    }
];

export default function SearchCaregivers() {
    const [caregivers] = useState(dummyCaregivers);

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-12">
                {/* HEADER SECTION - Size Increased */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Find Caregivers</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">
                        Discover trusted peers in your area based on your pet's specific needs.
                    </p>
                </div>

                {/* SEARCH & FILTER BAR - Size Increased */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-12 flex flex-col lg:flex-row gap-5 items-center">
                    <div className="flex-1 w-full relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                            <MapPin size={20} />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Location or postal code..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-all" 
                        />
                    </div>
                    <div className="flex-1 w-full relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                            <Calendar size={20} />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Select dates..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-all" 
                        />
                    </div>
                    <button className="w-full lg:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-xs py-4 px-10 rounded-2xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 active:scale-95">
                        <Search size={16} strokeWidth={3} /> Search
                    </button>
                </div>

                {/* RESULTS HEADER - Size Increased */}
                <div className="flex justify-between items-center mb-8 px-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {caregivers.length} Caregivers available
                    </h2>
                    <button className="text-teal-600 text-base font-bold hover:text-teal-700 flex items-center gap-2 transition-colors">
                        <Maximize2 size={16} /> Expand Search Radius
                    </button>
                </div>

                {/* CAREGIVER GRID - Now using CaretakerCard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caregivers.map(caregiver => (
                        <CaretakerCard 
                            key={caregiver.id}
                            name={caregiver.name}
                            location={caregiver.location}
                            experience={caregiver.experience}
                            rating={caregiver.rating}
                            reviews={caregiver.reviews}
                            price={caregiver.price}
                            imageUrl={caregiver.imageUrl}
                            isVerified={caregiver.isVerified}
                            petsHandled={caregiver.petsHandled}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}