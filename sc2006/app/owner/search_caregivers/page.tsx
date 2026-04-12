"use client"
import { useState, useEffect, useMemo } from "react";
import Navbar from '../../components/Navbar';
import CaretakerCard from '../../components/CaretakerCard'; // Importing your component
import DatePickerModal from '../DatePickerModal';
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { 
    MapPin, 
    Search, 
    Navigation, 
    SlidersHorizontal, X,
    User,
    Calendar
} from 'lucide-react';

// DUMMY DATA - Updated to match CaretakerCard props
interface Caregiver {
  id: string;
  name: string;
  location: string;
  dailyRate: number;
  verified: boolean;
    petPreferences?: string[];

  //OPTIONAL
  experience?: number;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  petsHandled?: string[];
  locationCoords?: [number,number];
    availabilityStartDate?: string | null;
    availabilityEndDate?: string | null;
  bookings?: Array<{
    id: string;
    startDate: string;
    endDate: string;
    status: string;
  }>;
    availabilityMatchDays?: number | null;
}

interface OneMapOption {
    label: string;
    value: string;
    lat: number;
    lng: number;
}

const PET_TYPE_OPTIONS = [
        { label: 'Dogs', value: 'DOG' },
        { label: 'Cats', value: 'CAT' },
        { label: 'Birds', value: 'BIRD' },
        { label: 'Reptiles', value: 'REPTILE' },
        { label: 'Small Mammals', value: 'SMALL_ANIMAL' },
        { label: 'Fish', value: 'FISH' },
] as const;

const SG_REGIONS: Record<string, number[]> = {
    "Bukit Batok": [1.3496, 103.7496],
    "Jurong East": [1.3329, 103.7436],
    "Jurong West": [1.3404, 103.7090],
    "Clementi": [1.3162, 103.7649],
    "Ang Mo Kio": [1.3691, 103.8454],
    "Bishan": [1.3526, 103.8400],
    "Tampines": [1.3496, 103.9568],
    "Bedok": [1.3236, 103.9273],
    "Woodlands": [1.4360, 103.7860],
    "Yishun": [1.4304, 103.8354],
    "Punggol": [1.3984, 103.9072],
    "Sengkang": [1.3868, 103.8914]
};

import dynamic from 'next/dynamic';

//  IMPORTING MapComponent component
const MapComponent = dynamic(
    () => import('../../components/MapComponent'),
    { 
        ssr: false, 
        loading: () => (
            <div className="h-125 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-teal-600 font-bold animate-pulse">Loading map interface...</p>
            </div>
        )
    }
);

function startOfDay(date: Date | string) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(date: Date | string) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

function countInclusiveDays(start: Date, end: Date) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1);
}

function countOverlappingDays(
    requestedStart: Date,
    requestedEnd: Date,
    bookings: Array<{ startDate: string; endDate: string; status: string }>
) {
    let overlapDays = 0;

    for (const booking of bookings) {
        const status = String(booking.status ?? '').toUpperCase();
        if (status !== 'CONFIRMED' && status !== 'IN_PROGRESS') {
            continue;
        }

        const bookingStart = startOfDay(booking.startDate);
        const bookingEnd = endOfDay(booking.endDate);
        const overlapStart = new Date(Math.max(requestedStart.getTime(), bookingStart.getTime()));
        const overlapEnd = new Date(Math.min(requestedEnd.getTime(), bookingEnd.getTime()));

        if (overlapStart <= overlapEnd) {
            overlapDays += countInclusiveDays(startOfDay(overlapStart), startOfDay(overlapEnd));
        }
    }

    return overlapDays;
}

export default function SearchCaregivers() {
    const { fetchCaregivers } = useUsers();
    const [allCaregivers, setAllCaregivers] = useState<Caregiver[]>([]);
    const { loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    // FILTER & MAP STATES
    const [locationInput, setLocationInput] = useState("");
    const [locationCoords, setLocationCoords] = useState<[number, number]>([0,0]);
    const [isLocating, setIsLocating] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [minDistance, setMinDistance] = useState(5);
    const [petTypes, setPetTypes] = useState<string[]>([]);
    const [minYearsExperience, setMinYearsExperience] = useState(0);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null });
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [locationOptions, setLocationOptions] = useState<OneMapOption[]>([]);
    const [locationSearchLoading, setLocationSearchLoading] = useState(false);

    useEffect(() => {
    const loadCaregivers = async () => {
      setLoading(true);
        try {
            const data = await fetchCaregivers();
            setAllCaregivers(data);
        } catch (error) {
            console.error('Failed to load caregivers:', error);
        } finally {
            setLoading(false);
        }
        };

        loadCaregivers();
    }, []);

    useEffect(() => {
        const id = setTimeout(() => {
            const query = locationInput.trim();
            if (query.length < 2) {
                setLocationOptions([]);
                return;
            }

            setLocationSearchLoading(true);
            fetch(`/api/onemap/search?q=${encodeURIComponent(query)}`)
                .then((r) => r.json())
                .then((data) => {
                    const options = Array.isArray(data?.options) ? data.options : [];
                    setLocationOptions(options);
                })
                .catch(() => setLocationOptions([]))
                .finally(() => setLocationSearchLoading(false));
        }, 300);

        return () => clearTimeout(id);
    }, [locationInput]);

    const getDistance = (p1: number[], p2: number[]) => {
        const toRad = (deg: number) => deg * (Math.PI / 180);
        const R = 6371; // Earth's radius in km
        const dLat = toRad(p2[0] - p1[0]);
        const dLon = toRad(p2[1] - p1[1]);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(p1[0])) * Math.cos(toRad(p2[0])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const getFilteredCaregivers = useMemo(() => {
        return allCaregivers
            .filter(caregiver => {
                // Location filter
                const hasLocation = locationCoords[0] !== 0 || locationCoords[1] !== 0;
                if (hasLocation) {
                    if (!caregiver.locationCoords) return false;
                    if (getDistance(caregiver.locationCoords, locationCoords) > minDistance) return false;
                }
                // Pet type filter
                if (petTypes.length > 0) {
                    const caregiverPets = caregiver.petPreferences ?? caregiver.petsHandled ?? [];
                    const hasPet = caregiverPets.some(pet => petTypes.includes(pet));
                    if (!hasPet) return false;
                }
                // Experience filter
                if ((caregiver.experience || 0) < minYearsExperience) return false;

                let startDate = selectedDates.start;
                let endDate = selectedDates.end;

                if (startDate && !endDate) {
                    endDate = startDate;
                } else if (endDate && !startDate) {
                    startDate = endDate;
                }

                caregiver.availabilityMatchDays = null;

                if (startDate && endDate) {
                    const selectedStart = startOfDay(startDate);
                    const selectedEnd = endOfDay(endDate);
                    let effectiveStart = selectedStart;
                    let effectiveEnd = selectedEnd;

                    if (caregiver.availabilityStartDate && caregiver.availabilityEndDate) {
                        const caregiverAvailableStart = startOfDay(caregiver.availabilityStartDate);
                        const caregiverAvailableEnd = endOfDay(caregiver.availabilityEndDate);

                        const overlapStartMs = Math.max(selectedStart.getTime(), caregiverAvailableStart.getTime());
                        const overlapEndMs = Math.min(selectedEnd.getTime(), caregiverAvailableEnd.getTime());

                        if (overlapStartMs > overlapEndMs) {
                            caregiver.availabilityMatchDays = 0;
                            return false;
                        }

                        effectiveStart = new Date(overlapStartMs);
                        effectiveEnd = new Date(overlapEndMs);
                    }

                    const totalRequestedDays = countInclusiveDays(startOfDay(effectiveStart), startOfDay(effectiveEnd));
                    const overlappingDays = countOverlappingDays(effectiveStart, effectiveEnd, caregiver.bookings ?? []);
                    const matchedAvailableDays = Math.max(0, totalRequestedDays - overlappingDays);

                    caregiver.availabilityMatchDays = matchedAvailableDays;
                    if (matchedAvailableDays <= 0) return false;
                }

                return true;
            })
            .sort((a, b) => {
                const overlapDiff = (b.availabilityMatchDays ?? 0) - (a.availabilityMatchDays ?? 0);
                if (overlapDiff !== 0) return overlapDiff;

                const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
                if (ratingDiff !== 0) return ratingDiff;

                const reviewsDiff = (b.reviews ?? 0) - (a.reviews ?? 0);
                if (reviewsDiff !== 0) return reviewsDiff;

                return (a.name ?? '').localeCompare(b.name ?? '');
            });
    }, [allCaregivers, locationInput, locationCoords, minDistance, petTypes, minYearsExperience, searchTrigger]);

    const topRatedCaregivers = useMemo(() => getFilteredCaregivers.slice(0, 3), [getFilteredCaregivers]);

    const handleMapClick = (coords: [number, number]) => {
        const lat = coords[0].toFixed(4);
        const lng = coords[1].toFixed(4);
        setLocationInput(`${lat}, ${lng}`);
        setLocationCoords(coords);
    };

    const handlePetTypeUpdate = (petType: string) => {
        if (petTypes.includes(petType)) 
            setPetTypes(petTypes.filter(type => type !== petType));
        else 
            setPetTypes([...petTypes, petType]);
    }

    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationInput("My Location");
                    setLocationCoords([position.coords.latitude,position.coords.longitude]);
                    setIsLocating(false);
                },
                (error) => {
                    setIsLocating(false);
                }
            );
        }
    };

    const handleSelectRegion = (region: string) => {
        setLocationInput(region);
        setLocationCoords(SG_REGIONS[region] as [number, number]);
        setLocationOptions([]);
        setShowLocationDropdown(false);
    };

    const handleSelectLocationOption = (option: OneMapOption) => {
        setLocationInput(option.label);
        setLocationCoords([option.lat, option.lng]);
        setLocationOptions([]);
        setShowLocationDropdown(false);
    };

    const handleSelectCaregiver = (cg: any) => {
        setLocationInput(cg.name);
        if (cg.locationCoords) setLocationCoords(cg.locationCoords);
        setLocationOptions([]);
        setShowLocationDropdown(false);
    };

    if (loading) return <div>Loading...</div>;
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Find Caretakers</h1>
                    <h5 className="text-lg text-slate-500 mt-2 font-bold">
                        Discover trusted peers in your area based on your pet's specific needs.
                    </h5>
                </div>
                <div className="mb-12">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Map View</h2>
                    <p className="text-base text-slate-500 mt-2 font-medium">
                        Enter your location or click anywhere on the map to find nearby caretakers.
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <button
                            onClick={() => setIsDatePickerOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                        >
                            <Calendar size={16} className="text-teal-600" />
                            <span>Availability</span>
                            {(selectedDates.start || selectedDates.end) && (
                                <span className="w-2 h-2 rounded-full bg-teal-500 ml-1"></span>
                            )}
                        </button>
                    </div>

                    {/* WARNING: COMMENT THIS OUT WHEN EDITING OTHER THINGS CAUSE WE DON'T WANNA SPAM TOO MANY API CALLS TO data.gov.sg */}
                    <MapComponent
                    userLocation={locationCoords}
                    onMapClick={handleMapClick}
                    caregivers={getFilteredCaregivers}
                    searchRadius={minDistance}
                    minDistance={minDistance}
                    />
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-12 flex flex-col lg:flex-row gap-5 items-center">
                
                    {/* MULTI-SEARCH FIELD */}
                    <div className="flex-1 w-full relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors z-10">
                            <Search size={20} /> 
                        </span>
                        
                        <input 
                            type="text" 
                            value={locationInput}
                            onChange={(e) => {
                                setLocationInput(e.target.value);
                                setLocationCoords([0, 0]);
                                setShowLocationDropdown(true);
                            }}
                            onFocus={() => setShowLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                            placeholder="Search by location, postal code, or caretaker name..." 
                            className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium focus:outline-none focus:border-teal-500 focus:bg-white transition-all relative z-0" 
                        />
                        
                        {/* Locate Me Button */}
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); 
                                handleGetLocation();
                            }}
                            disabled={isLocating}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-slate-200/50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 px-3 py-2 rounded-xl transition-all disabled:opacity-50 z-10 text-xs font-bold"
                        >
                            <Navigation size={14} className={isLocating ? "animate-pulse text-teal-600" : ""} />
                            <span className="hidden sm:inline">{isLocating ? "Locating..." : "Locate Me"}</span>
                        </button>

                        {/* MULTI-SEARCH DROPDOWN MENU */}
                        {showLocationDropdown && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                
                                {/* Use Current Location */}
                                <div 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleGetLocation();
                                        setShowLocationDropdown(false);
                                    }}
                                    className="px-5 py-3 hover:bg-teal-50 cursor-pointer text-teal-700 font-bold transition-colors flex items-center gap-3 border-b border-slate-100 mb-1"
                                >
                                    <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg">
                                        <Navigation size={16} />
                                    </div>
                                    Use my current location
                                </div>

                                {/* IF INPUT IS EMPTY: Show Top Caretakers & Top Locations */}
                                {locationInput.length === 0 ? (
                                    <>
                                        <div className="mb-2">
                                            <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Top Caretakers</div>
                                            {topRatedCaregivers.map(cg => (
                                                <div key={`top-cg-${cg.id}`} onClick={() => handleSelectCaregiver(cg)} className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-bold transition-colors flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                                                        <User size={14} />
                                                    </div>
                                                    {cg.name}
                                                    <span className="ml-auto text-xs text-amber-500">★ {cg.rating}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Popular Locations</div>
                                            {["Tampines", "Ang Mo Kio", "Jurong East"].map((region) => (
                                                <div 
                                                    key={`top-loc-${region}`}
                                                    onClick={() => handleSelectRegion(region)}
                                                    className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium transition-colors flex items-center gap-3"
                                                >
                                                    <MapPin size={16} className="text-slate-400 opacity-50" />
                                                    {region}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    /* IF INPUT HAS TEXT: Show Filtered Results */
                                    <>
                                        {/* LOCATION SUGGESTIONS */}
                                        <div className="mb-2">
                                            <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Locations</div>
                                            {locationSearchLoading ? (
                                                <div className="px-5 py-3 text-slate-500 text-sm">Searching locations...</div>
                                            ) : locationOptions.length > 0 ? (
                                                locationOptions.slice(0, 8).map((option) => (
                                                    <div
                                                        key={`loc-${option.value}-${option.lat}-${option.lng}`}
                                                        onClick={() => handleSelectLocationOption(option)}
                                                        className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium transition-colors flex items-center gap-3"
                                                    >
                                                        <MapPin size={16} className="text-slate-400 opacity-70" />
                                                        <span className="truncate">{option.label}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-5 py-3 text-slate-400 text-sm">No locations found.</div>
                                            )}
                                        </div>

                                        {/* CARETAKER SUGGESTIONS */}
                                        {getFilteredCaregivers.length > 0 && (
                                            <div className="mb-2">
                                                <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">Caretakers</div>
                                                {getFilteredCaregivers.map(cg => (
                                                    <div key={`cg-${cg.id}`} onClick={() => handleSelectCaregiver(cg)} className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-bold transition-colors flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                                                            <User size={14} />
                                                        </div>
                                                        {cg.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setShowLocationDropdown(false);
                            setSearchTrigger(prev => prev + 1);
                        }}
                        className="w-full lg:w-auto bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-xs py-4 px-10 rounded-2xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Search size={16} strokeWidth={3} /> Search
                    </button>
                </div>

                <div className="flex justify-between items-center mb-8 px-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {getFilteredCaregivers.length} Caretakers available
                    </h2>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm hover:border-teal-500 hover:text-teal-600 transition-all font-bold text-sm text-slate-700"
                    >
                        <SlidersHorizontal size={18} />
                        Filters

                        {/* show a green dot if they changed the default radius */}
                        {minDistance !== 5 && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 ml-1"></span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getFilteredCaregivers.map(caregiver => (
                        <CaretakerCard
                            id={caregiver.id}
                            key={caregiver.id}
                            name={caregiver.name}
                            location={caregiver.location}
                            experience={caregiver.experience || 0}
                            rating={caregiver.rating || 0}
                            reviews={caregiver.reviews || 0}
                            price={caregiver.dailyRate}
                            imageUrl={caregiver.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(caregiver.name)}`}
                            isVerified={caregiver.verified}
                            petsHandled={caregiver.petsHandled || ["Dogs"]}
                        />
                    ))}
                </div>
            </main>

            {/* FILTER MODAL */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    {/* Modal Container */}
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Filters</h3>
                            <button 
                                onClick={() => setIsFilterModalOpen(false)} 
                                className="text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-50 rounded-full"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto space-y-8">
                            
                            {/* Filter 1: Distance */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Search Radius</h4>
                                    <span className="text-teal-600 font-bold text-sm">{minDistance} km</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" max="50" step="1"
                                    value={minDistance}
                                    onChange={(e) => {
                                        setMinDistance(Number(e.target.value));
                                    }}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                />
                            </div>

                            {/* Filter 2: Pet Type (Preview) */}
                            <div className="pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Pet Type</h4>
                                <div className="flex flex-wrap gap-3">
                                    {PET_TYPE_OPTIONS.map(({ label, value }) => (
                                        <button 
                                        key={value} 
                                        onClick={() => handlePetTypeUpdate(value)}
                                        className={`
                                                px-5 py-2.5 rounded-xl border text-sm font-bold transition-all
                                                ${petTypes.includes(value) 
                                                    ? "border-teal-500 text-teal-700 bg-teal-50 shadow-sm" 
                                                    : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 bg-white"
                                                }
                                            `}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter 3: Min # years experience */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Min. Years Of Experience</h4>
                                    <span className="text-teal-600 font-bold text-sm">{minYearsExperience} years</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="20" step="1"
                                    value={minYearsExperience}
                                    onChange={(e) => {
                                        setMinYearsExperience(Number(e.target.value));
                                    }}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                />
                            </div>

                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setMinDistance(5);
                                    setPetTypes([]);
                                    setMinYearsExperience(0);
                                }}
                                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 underline underline-offset-4 text-sm"
                            >
                                Reset to default
                            </button>
                            <button 
                                onClick={() => setIsFilterModalOpen(false)}
                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-95"
                            >
                                Show {getFilteredCaregivers.length} Results
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDatePickerOpen && (
                <DatePickerModal
                    initialStartDate={selectedDates.start}
                    initialEndDate={selectedDates.end}
                    onClose={() => setIsDatePickerOpen(false)}
                    onConfirm={(startDate, endDate) => {
                        setSelectedDates({ start: startDate, end: endDate });
                        setIsDatePickerOpen(false);
                    }}
                />
            )}
        </div>
    );
}