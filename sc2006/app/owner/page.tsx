"use client"
import { useState } from "react";
import CaretakerCard from "../components/CaretakerCard";
import Navbar from "../components/Navbar";
import PetCategoryButton from "./PetCategoryButton";
import DatePickerModal from "./DatePickerModal";
import FiltersModal from "./FiltersModal";
// Standardizing icons for the Pet Matchmaking Engine (UC2)
import { 
  Dog, 
  Cat, 
  Bird, 
  Turtle, 
  Rabbit, 
  Fish, 
  Calendar, 
  SlidersHorizontal 
} from "lucide-react";

const petCategories = [
    { name: 'Dogs', icon: <Dog size={24} />, borderColor: 'border-orange-200', bgColor: 'bg-orange-50/50', iconColor: 'text-orange-500' },
    { name: 'Cats', icon: <Cat size={24} />, borderColor: 'border-purple-200', bgColor: 'bg-purple-50/50', iconColor: 'text-purple-500' },
    { name: 'Birds', icon: <Bird size={24} />, borderColor: 'border-blue-200', bgColor: 'bg-blue-50/50', iconColor: 'text-blue-500' },
    { name: 'Reptiles', icon: <Turtle size={24} />, borderColor: 'border-green-200', bgColor: 'bg-green-50/50', iconColor: 'text-green-500' },
    { name: 'Small Mammals', icon: <Rabbit size={24} />, borderColor: 'border-rose-200', bgColor: 'bg-rose-50/50', iconColor: 'text-rose-500' },
    { name: 'Fish', icon: <Fish size={24} />, borderColor: 'border-cyan-200', bgColor: 'bg-cyan-50/50', iconColor: 'text-cyan-500' },
];

// DUMMY DATA (Maintained for UC2 Logic)
const caretakers = [
    {
        id: 1,
        name: "Sarah Chen",
        location: "Bukit Batok",
        experience: "5+ years",
        rating: 4.9,
        reviews: 47,
        price: 65,
        isVerified: true,
        petsHandled: ["Dogs","Cats"],
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        id: 2,
        name: "Lisa Wong",
        location: "Jurong East",
        experience: "7+ years",
        rating: 4.8,
        reviews: 63,
        price: 75,
        isVerified: true,
        petsHandled: ["Dogs", "Cats", "Birds"],
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    },
    {
        id: 3,
        name: "Emma Ng",
        location: "Punggol",
        experience: "4+ years",
        rating: 4.6,
        reviews: 31,
        price: 70,
        isVerified: true,
        petsHandled: ["Dogs"],
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    }
];

export default function Dashboard() {
    const [selectedPet, setSelectedPet] = useState("");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const caretakersList = selectedPet 
        ? caretakers.filter(item => item.petsHandled.includes(selectedPet))
        : caretakers;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
            <Navbar/>
            
            {/* HERO Section aligned with Brand Identity */}
            <header className="w-full py-20 px-6 text-center bg-teal-600 flex flex-col items-center justify-center shadow-inner">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-black text-white tracking-tight">
                    Trusted Care for Your <span className="text-amber-400">Beloved Pets</span>
                </h1>
                <p className="text-lg md:text-xl text-teal-50 max-w-2xl mb-8 font-medium">
                    Find verified, experienced caretakers who'll treat your furry, feathered or scaly friends like family.
                </p>
            </header>
            
            <main className="w-full max-w-7xl mx-auto px-6 py-16 grow">
                
                {/* Pet Selection (UC2 Entry Point) */}
                <section className="mb-12">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Browse by Pet Type</h2>
                    <div className="flex flex-wrap gap-4">
                        {petCategories.map(pet => (
                            <PetCategoryButton
                                key={pet.name}
                                name={pet.name}
                                icon={pet.icon}
                                borderColor={pet.borderColor}
                                bgColor={pet.bgColor}
                                iconColor={pet.iconColor}
                                onClick={() => setSelectedPet(pet.name === selectedPet ? "" : pet.name)} 
                                selected={pet.name===selectedPet}
                            />
                        ))}
                    </div>
                </section>

                <section>
                    {/* headers & action controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 border-b border-slate-200 pb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                {`${selectedPet ? selectedPet : "All"} Caretakers`}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 font-medium">{caretakersList.length} professionals available</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsDatePickerOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                            >
                                <Calendar size={16} className="text-teal-600" />
                                <span>Availability</span>
                            </button>
                            
                            <button 
                                onClick={() => setIsFiltersOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                            >
                                <SlidersHorizontal size={16} className="text-teal-600" />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* CARETAKERS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {caretakersList.map((caretaker) => (
                            <CaretakerCard 
                                key={caretaker.id}
                                {...caretaker} 
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {caretakersList.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Dog size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No caretakers found for this category</p>
                        </div>
                    )}
                </section>
            </main>
            
            <footer className="w-full p-8 bg-slate-100 mt-auto border-t border-slate-200">
                <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2026 Pawsport & Peer. All Rights Reserved.</p>
            </footer>

            {/* MODALS */}
            {isDatePickerOpen && (
                <DatePickerModal onClose={() => setIsDatePickerOpen(false)} />
            )}
            {isFiltersOpen && (
                <FiltersModal onClose={() => setIsFiltersOpen(false)} />
            )}
        </div>
    )
}