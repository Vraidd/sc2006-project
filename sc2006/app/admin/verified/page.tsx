"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Pagination from "../../components/Pagination";
import { 
  ChevronLeft, 
  ShieldCheck, 
  XCircle, 
  MapPin, 
  Search,
  SlidersHorizontal,
  CheckCircle,
  User,
  DollarSign,
  Car,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronUp,
  Star,
  BadgeCheck
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

// Mock caretakers based on CaregiverProfile schema
const caretakers = [
    { 
        id: "user-001", 
        name: "Sarah Chen", 
        email: "sarah.chen@example.com", 
        location: "Bukit Batok", 
        petPreferences: ["DOG", "CAT"] as const, 
        dailyRate: 65.00, 
        experienceYears: 5, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", 
        verificationDoc: null,
        averageRating: 4.8,
        totalReviews: 42,
        completedBookings: 56,
        biography: "Passionate pet lover with 5 years of experience caring for dogs and cats. Certified in pet first aid and animal behavior.",
        createdAt: new Date("2025-01-15T08:00:00")
    },
    { 
        id: "user-002", 
        name: "Mike Tan", 
        email: "mike.tan@example.com", 
        location: "Tampines", 
        petPreferences: ["BIRD", "SMALL_ANIMAL"] as const, 
        dailyRate: 55.00, 
        experienceYears: 3, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", 
        verificationDoc: null,
        averageRating: 4.5,
        totalReviews: 18,
        completedBookings: 24,
        biography: "Specialized in exotic pets and small mammals. Have experience with birds, hamsters, and guinea pigs.",
        createdAt: new Date("2025-02-20T10:30:00")
    },
    { 
        id: "user-003", 
        name: "Lisa Wong", 
        email: "lisa.wong@example.com", 
        location: "Jurong East", 
        petPreferences: ["DOG", "CAT", "REPTILE"] as const, 
        dailyRate: 75.00, 
        experienceYears: 7, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa", 
        verificationDoc: "verification_cert.pdf",
        averageRating: 4.9,
        totalReviews: 89,
        completedBookings: 112,
        biography: "Professional pet sitter with extensive experience in all types of pets including reptiles.",
        createdAt: new Date("2024-08-10T14:00:00")
    },
    { 
        id: "user-004", 
        name: "James Lee", 
        email: "james.lee@example.com", 
        location: "Woodlands", 
        petPreferences: ["REPTILE", "FISH"] as const, 
        dailyRate: 80.00, 
        experienceYears: 10, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", 
        verificationDoc: "aquarium_cert.pdf",
        averageRating: 4.7,
        totalReviews: 67,
        completedBookings: 85,
        biography: "Aquarium specialist and reptile expert with over a decade of experience.",
        createdAt: new Date("2024-06-05T09:15:00")
    },
    { 
        id: "user-005", 
        name: "Emma Ng", 
        email: "emma.ng@example.com", 
        location: "Bedok", 
        petPreferences: ["DOG"] as const, 
        dailyRate: 70.00, 
        experienceYears: 2, 
        verified: false, 
        verificationStatus: "Rejected" as const, 
        status: "LOCKED" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", 
        verificationDoc: null,
        averageRating: 3.8,
        totalReviews: 8,
        completedBookings: 12,
        biography: "Dog enthusiast with experience in training and care.",
        createdAt: new Date("2025-03-01T11:00:00")
    },
    { 
        id: "user-006", 
        name: "David Koh", 
        email: "david.koh@example.com", 
        location: "Ang Mo Kio", 
        petPreferences: ["DOG", "CAT"] as const, 
        dailyRate: 60.00, 
        experienceYears: 4, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", 
        verificationDoc: null,
        averageRating: 4.6,
        totalReviews: 31,
        completedBookings: 38,
        biography: "Experienced dog walker and cat caregiver with a love for all animals.",
        createdAt: new Date("2025-01-22T16:45:00")
    },
    { 
        id: "user-007", 
        name: "Rachel Goh", 
        email: "rachel.goh@example.com", 
        location: "Pasir Ris", 
        petPreferences: ["CAT", "BIRD"] as const, 
        dailyRate: 50.00, 
        experienceYears: 2, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel", 
        verificationDoc: null,
        averageRating: 4.4,
        totalReviews: 15,
        completedBookings: 19,
        biography: "Cat lover with experience in bird care. Gentle and patient with all pets.",
        createdAt: new Date("2025-02-14T13:20:00")
    },
    { 
        id: "user-008", 
        name: "Kevin Lim", 
        email: "kevin.lim@example.com", 
        location: "Hougang", 
        petPreferences: ["DOG"] as const, 
        dailyRate: 85.00, 
        experienceYears: 8, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin", 
        verificationDoc: "dog_trainer_cert.pdf",
        averageRating: 4.9,
        totalReviews: 78,
        completedBookings: 95,
        biography: "Professional dog trainer with 8 years of experience. Specialized in large breeds.",
        createdAt: new Date("2024-09-18T08:30:00")
    },
    { 
        id: "user-009", 
        name: "Michelle Tay", 
        email: "michelle.tay@example.com", 
        location: "Sengkang", 
        petPreferences: ["CAT", "SMALL_ANIMAL"] as const, 
        dailyRate: 55.00, 
        experienceYears: 3, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle", 
        verificationDoc: "pet_care_cert.pdf",
        averageRating: 4.7,
        totalReviews: 45,
        completedBookings: 52,
        biography: "Gentle caregiver for cats and small mammals. Experienced with elderly pets.",
        createdAt: new Date("2025-01-08T10:00:00")
    },
    { 
        id: "user-010", 
        name: "Daniel Tan", 
        email: "daniel.tan@example.com", 
        location: "Punggol", 
        petPreferences: ["DOG", "CAT", "BIRD"] as const, 
        dailyRate: 70.00, 
        experienceYears: 6, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel", 
        verificationDoc: null,
        averageRating: 4.5,
        totalReviews: 28,
        completedBookings: 35,
        biography: "Multi-pet household experience. Can handle dogs, cats, and birds simultaneously.",
        createdAt: new Date("2025-02-28T15:00:00")
    },
    { 
        id: "user-011", 
        name: "Amanda Lee", 
        email: "amanda.lee@example.com", 
        location: "Toa Payoh", 
        petPreferences: ["REPTILE"] as const, 
        dailyRate: 90.00, 
        experienceYears: 5, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda", 
        verificationDoc: "reptile_specialist.pdf",
        averageRating: 4.8,
        totalReviews: 56,
        completedBookings: 68,
        biography: "Reptile specialist with expertise in snakes, lizards, and turtles.",
        createdAt: new Date("2024-11-12T12:30:00")
    },
    { 
        id: "user-012", 
        name: "Jason Ong", 
        email: "jason.ong@example.com", 
        location: "Clementi", 
        petPreferences: ["FISH", "REPTILE"] as const, 
        dailyRate: 65.00, 
        experienceYears: 4, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jason", 
        verificationDoc: null,
        averageRating: 4.3,
        totalReviews: 22,
        completedBookings: 28,
        biography: "Aquatic and reptile care specialist. Experienced with saltwater and freshwater setups.",
        createdAt: new Date("2025-03-05T09:45:00")
    },
    { 
        id: "user-013", 
        name: "Stephanie Wong", 
        email: "stephanie.wong@example.com", 
        location: "Bishan", 
        petPreferences: ["DOG", "CAT"] as const, 
        dailyRate: 75.00, 
        experienceYears: 7, 
        verified: true, 
        verificationStatus: "Approved" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Stephanie", 
        verificationDoc: "vet_nurse_cert.pdf",
        averageRating: 4.9,
        totalReviews: 94,
        completedBookings: 118,
        biography: "Veterinary nurse with 7 years of professional pet care experience.",
        createdAt: new Date("2024-07-20T14:15:00")
    },
    { 
        id: "user-014", 
        name: "Ryan Teo", 
        email: "ryan.teo@example.com", 
        location: "Yishun", 
        petPreferences: ["DOG"] as const, 
        dailyRate: 60.00, 
        experienceYears: 2, 
        verified: false, 
        verificationStatus: "Rejected" as const, 
        status: "LOCKED" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan", 
        verificationDoc: null,
        averageRating: 3.5,
        totalReviews: 5,
        completedBookings: 7,
        biography: "Dog lover looking to gain more experience in pet sitting.",
        createdAt: new Date("2025-03-10T11:30:00")
    },
    { 
        id: "user-015", 
        name: "Nicole Chia", 
        email: "nicole.chia@example.com", 
        location: "Serangoon", 
        petPreferences: ["CAT"] as const, 
        dailyRate: 55.00, 
        experienceYears: 3, 
        verified: false, 
        verificationStatus: "Pending" as const, 
        status: "ACTIVE" as const, 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole", 
        verificationDoc: null,
        averageRating: 4.6,
        totalReviews: 33,
        completedBookings: 41,
        biography: "Cat behavior specialist with experience in shy and anxious cats.",
        createdAt: new Date("2025-01-30T16:00:00")
    },
];

const PETS_HANDLED_LIST: Record<string, string> = {
    "DOG": "Dogs",
    "CAT": "Cats",
    "BIRD": "Birds",
    "FISH": "Fish",
    "REPTILE": "Reptiles",
    "SMALL_ANIMAL": "Small Animals",
};

export default function VerifiedQueue() {
    const searchParams = useSearchParams();
    const { fireToast } = useToast();

    // Get initial values from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [petTypeFilter, setPetTypeFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [minAmount, setMinAmount] = useState<number | undefined>(undefined);
    const [maxAmount, setMaxAmount] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("asc");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            if (sortOrder === "asc") setSortOrder("desc");
            else if (sortOrder === "desc") {
                setSortOrder("none");
                setSortBy("");
            }
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const sortedCaretakers = [...caretakers].sort((a, b) => {
        const verificationPriority: Record<string, number> = {
            "Pending": 1,
            "Approved": 2,
            "Rejected": 3
        };
        const verificationA = verificationPriority[a.verificationStatus] ?? 4;
        const verificationB = verificationPriority[b.verificationStatus] ?? 4;
        
        if (verificationA !== verificationB) {
            return verificationA - verificationB;
        }
        
        const statusPriority: Record<string, number> = { 
            ACTIVE: 1, 
            SUSPENDED: 2, 
            LOCKED: 3 
        };
        const statusA = statusPriority[a.status] ?? 4;
        const statusB = statusPriority[b.status] ?? 4;
        
        return statusA - statusB;
    });

    const filteredCaretakers = sortedCaretakers
        .filter((caretaker) => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    caretaker.name.toLowerCase().includes(query) ||
                    caretaker.email.toLowerCase().includes(query) ||
                    caretaker.location.toLowerCase().includes(query) ||
                    caretaker.petPreferences.some(pet => pet.toLowerCase().includes(query))
                );
            }
            return true;
        })
        .filter((caretaker) => statusFilter === "all" ? true : caretaker.status === statusFilter)
        .filter((caretaker) => locationFilter === "all" ? true : caretaker.location === locationFilter)
        .filter((caretaker) => petTypeFilter === "all" ? true : caretaker.petPreferences.some(pet => pet === petTypeFilter))
        .filter((caretaker) => verificationFilter === "all" ? true : caretaker.verified === (verificationFilter === "verified"))
        .filter((caretaker) => minAmount ? caretaker.dailyRate >= minAmount : true)
        .filter((caretaker) => maxAmount ? caretaker.dailyRate <= maxAmount : true)
        .filter((caretaker) => startDate ? new Date(caretaker.createdAt) >= new Date(startDate) : true)
        .filter((caretaker) => endDate ? new Date(caretaker.createdAt) <= new Date(endDate) : true)
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "name": comparison = a.name.localeCompare(b.name); break;
                case "experience": comparison = (a.experienceYears || 0) - (b.experienceYears || 0); break;
                case "rate": comparison = (a.dailyRate || 0) - (b.dailyRate || 0); break;
                case "location": comparison = a.location.localeCompare(b.location); break;
                case "rating": comparison = (a.averageRating || 0) - (b.averageRating || 0); break;
                case "bookings": comparison = (a.completedBookings || 0) - (b.completedBookings || 0); break;
                default: comparison = 0;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    const totalItems = filteredCaretakers.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const paginatedCaretakers = filteredCaretakers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case "Approved":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-200">
                        <CheckCircle size={12} strokeWidth={3} /> {status}
                    </span>
                );
            case "Pending":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldCheck size={12} strokeWidth={3} /> {status}
                    </span>
                );
            case "Rejected":
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={12} strokeWidth={3} /> {status}
                    </span>
                );
            default: return null;
        }
    };

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        const caretaker = caretakers.find(c => c.id === id);
        const message = action === 'approve' ? 'Verified Badge Issued' : 'Request Rejected';
        const description = `${action === 'approve' ? 'Badge' : 'Rejection'} issued for ${caretaker?.name || `ID ${id}`}`;
        fireToast(action === 'approve' ? 'success' : 'danger', message, description);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            <Navbar />

            <main className="max-w-6xl mx-auto py-12 px-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1">
                        <Link href="/admin" className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1">
                            <ChevronLeft size={16} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Verify Caregivers
                        </h1>
                        <p className="text-base text-slate-500 mt-2 font-medium">Review caregiver applications and manage verified status.</p>
                    </div>
                </div>

                {/* SEARCH AND FILTER CONTROLS */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap items-end gap-3 mb-3">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search name, email, location or pets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="LOCKED">Locked</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Location</label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Locations</option>
                                <option value="Bukit Batok">Bukit Batok</option>
                                <option value="Tampines">Tampines</option>
                                <option value="Jurong East">Jurong East</option>
                                <option value="Woodlands">Woodlands</option>
                                <option value="Bedok">Bedok</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Pet Type</label>
                            <select
                                value={petTypeFilter}
                                onChange={(e) => setPetTypeFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Pets</option>
                                <option value="DOG">Dogs</option>
                                <option value="CAT">Cats</option>
                                <option value="BIRD">Birds</option>
                                <option value="REPTILE">Reptiles</option>
                                <option value="FISH">Fish</option>
                                <option value="SMALL_ANIMAL">Small Mammals</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="relative">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Verification</label>
                            <select
                                value={verificationFilter}
                                onChange={(e) => setVerificationFilter(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                            >
                                <option value="all">All Caregivers</option>
                                <option value="verified">Verified Only</option>
                                <option value="unverified">Unverified Only</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Min ($)</label>
                            <input
                                type="number"
                                value={minAmount ?? ''}
                                onChange={(e) => setMinAmount(e.target.value === '' ? undefined : Number(e.target.value))}
                                className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Max ($)</label>
                            <input
                                type="number"
                                value={maxAmount ?? ''}
                                onChange={(e) => setMaxAmount(e.target.value === '' ? undefined : Number(e.target.value))}
                                className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                placeholder="500"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                                    className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                                <input
                                    type="date"
                                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                                    className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-3">
                    {paginatedCaretakers.length > 0 ? paginatedCaretakers.map((caretaker) => (
                        <div key={caretaker.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start">
                            
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 flex-shrink-0 mt-1">
                                <img
                                    src={caretaker.avatar}
                                    alt={caretaker.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 space-y-4 w-full">
                                
                                {/* Top Header Row */}
                                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 w-full">
                                    <div>
                                        <div className="flex items-center gap-3 flex-wrap mb-1">
                                            <h3 className="text-xl font-bold text-slate-900">{caretaker.name}</h3>
                                            {getStatusBadge(caretaker.verificationStatus)}
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2">{caretaker.email}</p>
                                        
                                        <div className="flex flex-wrap gap-4 font-bold">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span>{caretaker.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <Briefcase size={14} className="text-slate-400" />
                                                <span>{caretaker.experienceYears || 0} years exp</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <DollarSign size={14} className="text-slate-400" />
                                                <span>${caretaker.dailyRate?.toFixed(2) || '0.00'}/day</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions - Desktop (Hidden on Mobile) */}
                                    <div className="hidden md:flex flex-row gap-3 min-w-[400px] ml-4">
                                        {caretaker.status === "ACTIVE" && !caretaker.verified ? (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(caretaker.id, 'approve')}
                                                    className="w-full px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <ShieldCheck size={16} /> Verify
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(caretaker.id, 'reject')}
                                                    className="w-full px-5 py-2.5 border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95 text-center"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => fireToast('info', 'Already Processed', `${caretaker.name} is already ${caretaker.verified ? 'verified' : caretaker.status.toLowerCase()}`)}
                                                className="w-full px-5 py-2.5 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-default text-center"
                                            >
                                                {caretaker.verified ? 'Verified' : caretaker.status}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Biography */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <FileText size={12} className="text-slate-400" /> Biography
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{caretaker.biography}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Pets Tags */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Pets Handled</p>
                                        <div className="flex flex-wrap gap-2">
                                            {caretaker.petPreferences.map((pet, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                                    {PETS_HANDLED_LIST[pet]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Documents</p>
                                        <div className="flex flex-wrap gap-2">
                                            {caretaker.verificationDoc ? (
                                                <a href="#" className="flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all shadow-sm group">
                                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                    </svg>
                                                    {caretaker.verificationDoc}
                                                </a>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic py-1.5">No documents uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Mobile (Hidden on Desktop) */}
                                <div className="flex md:hidden flex-col gap-3 w-full mt-4 border-t border-slate-100 pt-4">
                                    {caretaker.status === "ACTIVE" && !caretaker.verified ? (
                                        <>
                                            <button 
                                                onClick={() => handleAction(caretaker.id, 'approve')}
                                                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <ShieldCheck size={16} /> Verify
                                            </button>
                                            <button 
                                                onClick={() => handleAction(caretaker.id, 'reject')}
                                                className="w-full py-2.5 border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95 text-center"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => fireToast('info', 'Already Processed', `${caretaker.name} is already ${caretaker.verified ? 'verified' : caretaker.status.toLowerCase()}`)}
                                            className="w-full py-2.5 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-default text-center"
                                        >
                                            {caretaker.verified ? 'Verified' : caretaker.status}
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User size={32} />
                            </div>
                            {searchQuery ? (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Results Found</h3>
                                    <p className="text-slate-500 font-medium mt-2">No caregivers match your search for "{searchQuery}".</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Clear</h3>
                                    <p className="text-slate-500 font-medium mt-2">No caregivers match the current filter.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                    />
                )}
            </main>
        </div>
    );
}