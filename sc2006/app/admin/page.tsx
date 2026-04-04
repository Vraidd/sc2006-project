"use client"
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import { 
    PawPrint, CheckCircle, AlertTriangle, CircleDollarSign, 
    ArrowRight, UserCheck, Settings, MapPin, Star, 
    BadgeCheck, Check, Minus, Clock, ShieldAlert,
    Mail, UserX, Eye, Search, ChevronUp, ChevronDown,
} from "lucide-react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("caretakers");
    
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    type PetType = "DOG" | "CAT" | "BIRD" | "REPTILE" | "FISH" | "SMALL_ANIMAL";
    const [petTypeFilter, setPetTypeFilter] = useState<"all" | PetType>("all");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("asc");
    
    // Transaction filters
    const [transactionSearch, setTransactionSearch] = useState("");
    const [transactionMethodFilter, setTransactionMethodFilter] = useState("all");
    const [transactionStatusFilter, setTransactionStatusFilter] = useState("all");
    const [transactionMinAmount, setTransactionMinAmount] = useState<number | undefined>(undefined);
    const [transactionMaxAmount, setTransactionMaxAmount] = useState<number | undefined>(undefined);
    const [transactionStartDate, setTransactionStartDate] = useState<Date | undefined>(undefined);
    const [transactionEndDate, setTransactionEndDate] = useState<Date | undefined>(undefined);
    const [transactionSortBy, setTransactionSortBy] = useState("");
    const [transactionSortOrder, setTransactionSortOrder] = useState<"asc" | "desc" | "none">("none");
    
    // Report filters
    const [reportSearch, setReportSearch] = useState("");
    const [reportPriorityFilter, setReportPriorityFilter] = useState("all");
    const [reportStatusFilter, setReportStatusFilter] = useState("all");
    const [reportStartDate, setReportStartDate] = useState<Date | undefined>(undefined);
    const [reportEndDate, setReportEndDate] = useState<Date | undefined>(undefined);
    const [reportSortBy, setReportSortBy] = useState("");
    const [reportSortOrder, setReportSortOrder] = useState<"asc" | "desc" | "none">("none");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const stats = [
        { label: "Active Care Contracts", value: "142", icon: (<PawPrint size={24}/>), color: "text-blue-600" },
        { label: "Pending HR Incidents", value: "3", icon: (<AlertTriangle size={24}/>), color: "text-red-600" },
        { label: "Revenue (5% Fee)", value: "$1,240.50", icon: (<CircleDollarSign size={24}/>), color: "text-teal-600" },
        { label: "Verification Queue", value: "12", icon: (<CheckCircle size={24}/>), color: "text-purple-600" }
    ];

    // Mock data based on CaregiverProfile schema
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

    const transactions = [
        { id: "TRX-101", client: "John Lim", caretaker: "Sarah Chen", pet: "Kiki (Cat)", startDate: new Date("2026-04-01"), endDate: new Date("2026-04-03"), amount: 130.00, status: "Completed", method: "Visa", datetime: new Date("2026-04-01T10:30:00") },
        { id: "TRX-102", client: "Siti Aminah", caretaker: "James Lee", pet: "Goldie (Fish)", startDate: new Date("2026-03-28"), endDate: new Date("2026-03-30"), amount: 160.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-28T14:45:00") },
        { id: "TRX-103", client: "Peter Tan", caretaker: "Lisa Wong", pet: "Max (Dog)", startDate: new Date("2026-03-25"), endDate: new Date("2026-03-27"), amount: 225.00, status: "Completed", method: "Visa", datetime: new Date("2026-03-25T11:15:00") },
        { id: "TRX-104", client: "Mary Koh", caretaker: "Kevin Lim", pet: "Buddy (Dog)", startDate: new Date("2026-03-20"), endDate: new Date("2026-03-24"), amount: 340.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-20T09:00:00") },
        { id: "TRX-105", client: "Alex Goh", caretaker: "Michelle Tay", pet: "Whiskers (Cat)", startDate: new Date("2026-03-18"), endDate: new Date("2026-03-22"), amount: 220.00, status: "Completed", method: "Visa", datetime: new Date("2026-03-18T15:30:00") },
        { id: "TRX-106", client: "Jenny Lee", caretaker: "Amanda Lee", pet: "Scales (Snake)", startDate: new Date("2026-03-15"), endDate: new Date("2026-03-19"), amount: 360.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-15T13:20:00") },
        { id: "TRX-107", client: "Tommy Wong", caretaker: "Stephanie Wong", pet: "Luna (Cat)", startDate: new Date("2026-03-12"), endDate: new Date("2026-03-16"), amount: 300.00, status: "Completed", method: "Visa", datetime: new Date("2026-03-12T16:45:00") },
        { id: "TRX-108", client: "Susan Tan", caretaker: "Daniel Tan", pet: "Tweety (Bird)", startDate: new Date("2026-03-10"), endDate: new Date("2026-03-14"), amount: 280.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-10T10:00:00") },
        { id: "TRX-109", client: "David Lim", caretaker: "Jason Ong", pet: "Nemo (Fish)", startDate: new Date("2026-03-08"), endDate: new Date("2026-03-12"), amount: 260.00, status: "Completed", method: "Visa", datetime: new Date("2026-03-08T14:15:00") },
        { id: "TRX-110", client: "Rachel Ng", caretaker: "Nicole Chia", pet: "Mittens (Cat)", startDate: new Date("2026-03-05"), endDate: new Date("2026-03-09"), amount: 220.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-05T11:30:00") },
        { id: "TRX-111", client: "Mark Teo", caretaker: "David Koh", pet: "Rex (Dog)", startDate: new Date("2026-03-03"), endDate: new Date("2026-03-07"), amount: 240.00, status: "Completed", method: "Visa", datetime: new Date("2026-03-03T09:45:00") },
        { id: "TRX-112", client: "Linda Ong", caretaker: "Rachel Goh", pet: "Snowball (Cat)", startDate: new Date("2026-03-01"), endDate: new Date("2026-03-05"), amount: 200.00, status: "Completed", method: "PayNow", datetime: new Date("2026-03-01T15:00:00") },
    ];

    const reports = [
        { 
            id: "INC-442", 
            reporter: "jane.teo@gmail.com", 
            title: "Did not feed the dog", 
            desc: "Caretaker failed to feed my dog or refill water bowl during 3-day sitting. Pet camera confirmed food bowl untouched.", 
            caretaker: "Sarah Chen", 
            priority: "High", 
            status: "Pending", 
            datetime: new Date("2026-02-15T14:30:00")
        },
        { 
            id: "INC-441", 
            reporter: "peter.tan@example.com", 
            title: "Pet got sick after care", 
            desc: "Cat developed gastroenteritis after 4-day sitting. Vet bills exceeded $300. Suspect inappropriate feeding.", 
            caretaker: "Mike Tan", 
            priority: "High", 
            status: "Pending", 
            datetime: new Date("2026-02-14T11:15:00")
        },
        { 
            id: "INC-440", 
            reporter: "mary.koh@example.com", 
            title: "Arrived 2 hours late without notice", 
            desc: "Caretaker arrived at 11 AM instead of scheduled 9 AM with no prior communication or apology.", 
            caretaker: "Emma Ng", 
            priority: "Medium", 
            status: "Pending", 
            datetime: new Date("2026-02-13T10:45:00")
        },
        { 
            id: "INC-439", 
            reporter: "alex.goh@example.com", 
            title: "Damaged property during sitting", 
            desc: "Family heirloom vase ($200) broken during care. Terrarium temperature gauge also moved from position.", 
            caretaker: "James Lee", 
            priority: "Medium", 
            status: "Resolved", 
            datetime: new Date("2026-02-12T15:20:00")
        },
        { 
            id: "INC-438", 
            reporter: "jenny.lee@example.com", 
            title: "Lost house keys", 
            desc: "Caretaker lost spare house key during 3-day service. Requires lock replacement costing $150.", 
            caretaker: "Lisa Wong", 
            priority: "High", 
            status: "Resolved", 
            datetime: new Date("2026-02-11T13:00:00")
        },
        { 
            id: "INC-437", 
            reporter: "tommy.wong@example.com", 
            title: "Did not follow feeding instructions", 
            desc: "Diabetic dog missed 2 insulin injections and received irregular feeding portions during 5-day care.", 
            caretaker: "Kevin Lim", 
            priority: "Medium", 
            status: "Resolved", 
            datetime: new Date("2026-02-10T09:30:00")
        },
        { 
            id: "INC-436", 
            reporter: "susan.tan@example.com", 
            title: "Dog escaped from yard during care", 
            desc: "Border Collie escaped through unsecured gate. Found 2 blocks away by neighbor. Very dangerous situation.", 
            caretaker: "Michelle Tay", 
            priority: "High", 
            status: "Resolved", 
            datetime: new Date("2026-02-09T16:45:00")
        },
        { 
            id: "INC-435", 
            reporter: "david.lim@example.com", 
            title: "No updates provided during care", 
            desc: "Only 2 photos sent during 7-day care. No communication for 5 days despite repeated requests.", 
            caretaker: "Daniel Tan", 
            priority: "Low", 
            status: "Resolved", 
            datetime: new Date("2026-02-08T12:15:00")
        },
    ];

    // Handle report resolution
    const handleReportResolution = (reportId: string) => {
        alert(`Report ${reportId} has been resolved and marked as completed.`);
    };

    // Handle column click for sorting (cycles: asc -> desc -> none)
    const handleCaretakerSort = (column: string) => {
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

    const handleTransactionSort = (column: string) => {
        if (transactionSortBy === column) {
            if (transactionSortOrder === "asc") setTransactionSortOrder("desc");
            else if (transactionSortOrder === "desc") {
                setTransactionSortOrder("none");
                setTransactionSortBy("");
            }
        } else {
            setTransactionSortBy(column);
            setTransactionSortOrder("asc");
        }
    };

    const handleReportSort = (column: string) => {
        if (reportSortBy === column) {
            if (reportSortOrder === "asc") setReportSortOrder("desc");
            else if (reportSortOrder === "desc") {
                setReportSortOrder("none");
                setReportSortBy("");
            }
        } else {
            setReportSortBy(column);
            setReportSortOrder("asc");
        }
    };

    // Sort icon helper
    const SortIcon = ({ column, currentSort, order }: { column: string; currentSort: string; order: "asc" | "desc" | "none" }) => {
        if (currentSort !== column) return <span className="w-4 h-4 inline-block mx-1 opacity-0">▲</span>;
        if (order === "asc") return <ChevronUp size={12} className="inline-block mx-1 text-teal-600" />;
        if (order === "desc") return <ChevronDown size={12} className="inline-block mx-1 text-teal-600" />;
        return null;
    };

    // Filter and sort transactions
    const filteredTransactions = transactions
        .filter((tx) => {
            if (transactionSearch) {
                const query = transactionSearch.toLowerCase();
                return (
                    tx.id.toLowerCase().includes(query) ||
                    tx.client.toLowerCase().includes(query) ||
                    tx.caretaker.toLowerCase().includes(query) ||
                    tx.pet.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((tx) => {
            if (transactionMethodFilter !== "all") {
                return tx.method === transactionMethodFilter;
            }
            return true;
        })
        .filter((tx) => {
            if (transactionStatusFilter !== "all") {
                return tx.status === transactionStatusFilter;
            }
            return true;
        })
        .filter((tx) => {
            if (transactionMinAmount && transactionMinAmount > 0 && tx.amount < transactionMinAmount) {
                return false;
            }
            if (transactionMaxAmount && transactionMaxAmount < 500 && tx.amount > transactionMaxAmount) {
                return false;
            }
            return true;
        })
        .filter((tx) => {
            if (transactionStartDate && tx.datetime < transactionStartDate) {
                return false;
            }
            if (transactionEndDate && tx.datetime > transactionEndDate) {
                return false;
            }
            return true;
        });

    // Filter and sort reports
    const filteredReports = reports
        .filter((report) => {
            if (reportSearch) {
                const query = reportSearch.toLowerCase();
                return (
                    String(report.id).toLowerCase().includes(query) ||
                    report.reporter.toLowerCase().includes(query) ||
                    report.title.toLowerCase().includes(query) ||
                    report.caretaker.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((report) => {
            if (reportPriorityFilter !== "all") {
                return report.priority === reportPriorityFilter;
            }
            return true;
        })
        .filter((report) => {
            if (reportStatusFilter !== "all") {
                return report.status === reportStatusFilter;
            }
            return true;
        })
        .filter((report) => {
            if (reportStartDate && report.datetime < reportStartDate) {
                return false;
            }
            if (reportEndDate && report.datetime > reportEndDate) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (reportSortBy) {
                case "id":
                    comparison = String(a.id).localeCompare(String(b.id));
                    break;
                case "reporter":
                    comparison = a.reporter.localeCompare(b.reporter);
                    break;
                case "priority":
                    // Sort by priority: High > Medium > Low
                    const priorityOrder: { [key: string]: number } = { "High": 3, "Medium": 2, "Low": 1 };
                    comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
                    break;
                case "status":
                    comparison = a.status.localeCompare(b.status);
                    break;
                case "datetime":
                    comparison = a.datetime.getTime() - b.datetime.getTime();
                    break;
                default:
                    // Default sort: by priority (High first), then by date (most recent first)
                    const defaultPriorityOrder: { [key: string]: number } = { "High": 1, "Medium": 2, "Low": 3 };
                    const priorityComp = (defaultPriorityOrder[a.priority] || 0) - (defaultPriorityOrder[b.priority] || 0);
                    if (priorityComp !== 0) {
                        comparison = -priorityComp; // Higher priority first (desc)
                    } else {
                        const dateComp = b.datetime.getTime() - a.datetime.getTime();
                        comparison = -dateComp; // More recent first (desc)
                    }
            }
            return reportSortOrder === "asc" ? comparison : -comparison;
        });

    // Filter and sort caretakers based on search and filter states
    const filteredCaretakers = caretakers
        .filter((ct) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    ct.name.toLowerCase().includes(query) ||
                    ct.email.toLowerCase().includes(query) ||
                    ct.location.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .filter((ct) => {
            // Status filter
            if (statusFilter !== "all") {
                return ct.status === statusFilter;
            }
            return true;
        })
        .filter((ct) => {
            // Location filter
            if (locationFilter !== "all") {
                return ct.location === locationFilter;
            }
            return true;
        })
        .filter((ct) => {
            // Pet type filter
            if (petTypeFilter !== "all") {
                return (ct.petPreferences as readonly PetType[]).includes(petTypeFilter);
            }
            return true;
        })
        .sort((a, b) => {
            // First priority: verificationStatus - Pending comes first
            const verificationPriority: { [key: string]: number } = {
                "Pending": 1,
                "Approved": 2,
                "Rejected": 3
            };
            const verificationA = verificationPriority[a.verificationStatus] ?? 4;
            const verificationB = verificationPriority[b.verificationStatus] ?? 4;
            
            if (verificationA !== verificationB) {
                return sortOrder === "asc" ? verificationA - verificationB : verificationB - verificationA;
            }
            
            // Second priority: custom column sorting
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.name.localeCompare(b.name);
                    break;
                case "experience":
                    comparison = (a.experienceYears || 0) - (b.experienceYears || 0);
                    break;
                case "rate":
                    comparison = (a.dailyRate || 0) - (b.dailyRate || 0);
                    break;
                case "location":
                    comparison = a.location.localeCompare(b.location);
                    break;
                default:
                    // Default: sort by createdAt (newest first)
                    comparison = b.createdAt.getTime() - a.createdAt.getTime();
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

    // Calculate pagination values
    const totalItems = activeTab === "caretakers" ? filteredCaretakers.length : 
                       activeTab === "transactions" ? filteredTransactions.length : 
                       filteredReports.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Get paginated data based on active tab
    const paginatedData = activeTab === "caretakers" 
        ? filteredCaretakers.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : activeTab === "transactions"
        ? filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar/>

            <main className="max-w-7xl mx-auto w-full py-12 px-8">
                <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h2>
                    <p className="text-slate-500 mt-2 text-base font-medium">Track daily platform performance and pending administrative tasks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 group transition-all hover:shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>{stat.icon}</div>
                                <span className="text-xs font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-lg uppercase tracking-widest">Live</span>
                            </div>
                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-12">
                    {/* Updated Tabs to match the image precisely */}
                    <div className="flex border-b border-slate-200 mb-6 gap-2">
                        <button onClick={() => setActiveTab("caretakers")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "caretakers" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            All Caretakers ({filteredCaretakers.length})
                        </button>
                        <button onClick={() => setActiveTab("transactions")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "transactions" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Past Transactions ({transactions.length})
                        </button>
                        <button onClick={() => setActiveTab("reports")} className={`px-4 py-3 text-sm transition-colors ${activeTab === "reports" ? "text-slate-900 font-bold border-b-2 border-slate-900" : "text-slate-500 font-medium hover:text-slate-900"}`}>
                            Reports ({reports.length})
                        </button>
                    </div>
                    {/* Compact Search and Filter Controls */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                        {activeTab === "caretakers" && (
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search name, email, or location..."
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
                                        onChange={(e) => setPetTypeFilter(e.target.value as "all" | PetType)}
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
                        )}

                        {activeTab === "transactions" && (
                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search ID, client, caretaker or pet..."
                                                value={transactionSearch}
                                                onChange={(e) => setTransactionSearch(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                            /> 
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Payment Method</label>
                                        <select
                                            value={transactionMethodFilter}
                                            onChange={(e) => setTransactionMethodFilter(e.target.value)}
                                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                        >
                                            <option value="all">All Methods</option>
                                            <option value="Visa">Visa</option>
                                            <option value="PayNow">PayNow</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                                        <select
                                            value={transactionStatusFilter}
                                            onChange={(e) => setTransactionStatusFilter(e.target.value)}
                                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                                    </div>
                                    
                                    {/* Date Range Fields */}
                                    <div className="flex items-end gap-2">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                            <input
                                                type="date"
                                                value={transactionStartDate ? transactionStartDate.toISOString().split('T')[0] : ''}
                                                onChange={(e) => setTransactionStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                                                className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                            />
                                        </div>
                                        {/* <span className="text-slate-400 pb-2">-</span> */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                                            <input
                                                type="date"
                                                value={transactionEndDate ? transactionEndDate.toISOString().split('T')[0] : ''}
                                                onChange={(e) => setTransactionEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                                                className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Min/Max Fields */}
                                    <div className="flex items-end gap-2">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Min ($)</label>
                                            <input
                                                type="number"
                                                value={transactionMinAmount ?? ''}
                                                onChange={(e) => setTransactionMinAmount(e.target.value === '' ? undefined : Number(e.target.value))}
                                                className="w-20 sm:w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                            />
                                        </div>
                                        {/* <span className="text-slate-400 pb-2">-</span> */}
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Max ($)</label>
                                            <input
                                                type="number"
                                                value={transactionMaxAmount ?? ''}
                                                onChange={(e) => setTransactionMaxAmount(e.target.value === '' ? undefined : Number(e.target.value))}
                                                className="w-20 sm:w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )}

                        {activeTab === "reports" && (
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search ID, reporter, incident details, title or caretaker..."
                                            value={reportSearch}
                                            onChange={(e) => setReportSearch(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Priority</label>
                                    <select
                                        value={reportPriorityFilter}
                                        onChange={(e) => setReportPriorityFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Priorities</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Status</label>
                                    <select
                                        value={reportStatusFilter}
                                        onChange={(e) => setReportStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none pr-10"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 translate-y-0.5 text-slate-400 pointer-events-none" />
                                </div>
                                
                                {/* Date Range Fields */}
                                <div className="flex items-end gap-2">
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                                        <input
                                            type="date"
                                            value={reportStartDate ? reportStartDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => setReportStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                                            className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        />
                                    </div>
                                    <span className="text-slate-400 pb-2">-</span>
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                                        <input
                                            type="date"
                                            value={reportEndDate ? reportEndDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => setReportEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                                            className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* RESULTS COUNT */}
                    {/* <div className="text-left text-sm font-medium italic text-slate-500 mb-1">
                        {activeTab === "caretakers" && `Showing ${filteredCaretakers.length} of ${caretakers.length} caregiver${caretakers.length !== 1 ? 's' : ''}`}
                        {activeTab === "transactions" && `Showing ${filteredTransactions.length} of ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
                        {activeTab === "reports" && `Showing ${filteredReports.length} of ${reports.length} report${reports.length !== 1 ? 's' : ''}`}
                    </div> */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm mb-3">
                        {/* Caretakers Tab */}
                        {activeTab === "caretakers" && (
                            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
                                <thead className="sticky top-0 z-10 bg-slate-50/50">
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('name')}
                                        >
                                            Caretaker <SortIcon column="name" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('location')}
                                        >
                                            Location <SortIcon column="location" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('rate')}
                                        >
                                            Daily Rate <SortIcon column="rate" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleCaretakerSort('experience')}
                                        >
                                            Experience <SortIcon column="experience" currentSort={sortBy} order={sortOrder} />
                                        </th>
                                        <th className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500">Status</th>
                                        <th className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCaretakers.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((ct) => (
                                        <tr key={ct.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={ct.avatar} alt={ct.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold flex gap-1 text-slate-900 text-sm items-center">
                                                                {ct.name} 
                                                                {ct.verified && (
                                                                    <BadgeCheck size={16} className="text-teal-500 shrink-0" fill="currentColor" stroke="white" />
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-500">{ct.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                                    {ct.location}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-sm font-bold text-slate-900">
                                                ${ct.dailyRate?.toFixed(2) || '0.00'}/day
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-sm font-bold text-slate-900">
                                                {ct.experienceYears || 0} years
                                            </td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <span className={`px-2.5 py-1 rounded-2xl text-xs uppercase font-bold border ${
                                                    ct.verificationStatus === "Approved" ? "bg-green-100 text-green-700 border-green-200" : 
                                                    ct.verificationStatus === "Pending" ? "bg-amber-100 text-amber-700 border-amber-200" : 
                                                    "bg-red-100 text-red-700 border-red-200"
                                                }`}>
                                                    {ct.verificationStatus as string}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <button 
                                                    onClick={() => window.location.href = `./admin/verified?search=${encodeURIComponent(ct.email)}`}
                                                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-teal-800 transition-colors"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === "transactions" && (
                            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                                <thead className="sticky top-0 z-10 bg-slate-50/50">
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('id')}
                                        >
                                            Transaction ID <SortIcon column="id" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('client')}
                                        >
                                            Client / Caretaker <SortIcon column="client" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500">Pet / Dates</th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('amount')}
                                        >
                                            Amount <SortIcon column="amount" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                        <th className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500">Method</th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleTransactionSort('datetime')}
                                        >
                                            Date & Time <SortIcon column="datetime" currentSort={transactionSortBy} order={transactionSortOrder} />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((tx) => (
                                        <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-4 sm:px-6 text-sm font-bold text-slate-900">{tx.id}</td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <p className="text-sm font-bold text-slate-900">{tx.client}</p>
                                                <p className="text-xs text-slate-500">Care by: {tx.caretaker}</p>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <p className="text-sm font-medium">{tx.pet}</p>
                                                <p className="text-xs text-slate-400">{tx.startDate.toLocaleDateString()} - {tx.endDate.toLocaleDateString()}</p>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-sm font-black text-slate-900">${tx.amount.toFixed(2)}</td>
                                            <td className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-500 uppercase">{tx.method}</td>
                                            <td className="py-4 px-4 sm:px-6">
                                                <p className="text-sm font-medium text-slate-700">{tx.datetime.toLocaleDateString()}</p>
                                                <p className="text-xs text-slate-500 uppercase">{tx.datetime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Reports Tab */}
                        {activeTab === "reports" && (
                             <table className="w-full text-left border-collapse min-w-[850px]">
                                <thead className="sticky top-0 z-10 bg-slate-50/50">
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th 
                                            className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('id')}
                                        >
                                            ID <SortIcon column="id" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('reporter')}
                                        >
                                            Reporter <SortIcon column="reporter" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th className="py-4 px-4 sm:px-6 text-xs font-black uppercase text-slate-500">Incident Details</th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('datetime')}
                                        >
                                            Filed <SortIcon column="datetime" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('priority')}
                                        >
                                            Priority <SortIcon column="priority" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th 
                                            className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500 cursor-pointer hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
                                            onClick={() => handleReportSort('status')}
                                        >
                                            Status <SortIcon column="status" currentSort={reportSortBy} order={reportSortOrder} />
                                        </th>
                                        <th className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs font-black uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((report) => (
                                        <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-sm font-bold text-slate-900">{report.id}</td>
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-sm font-bold text-slate-900">{report.reporter}</td>
                                            {/* Given a minimum width so it doesn't crush, but allowed to wrap */}
                                            <td className="py-4 px-4 sm:px-6 min-w-[250px] max-w-[300px]">
                                                <div className="font-bold text-slate-900 italic text-sm line-clamp-2">"{report.title}"</div>
                                                <div className="text-xs text-slate-500 mt-0.5">Against: {report.caretaker}</div>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <p className="text-sm font-medium text-slate-700">{report.datetime.toLocaleDateString()}</p>
                                                <p className="text-xs text-slate-500 uppercase">{report.datetime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs font-black uppercase rounded-2xl border ${
                                                    report.priority.toLowerCase() === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                                    report.priority.toLowerCase() === "medium" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                    "bg-blue-50 text-blue-700 border-blue-200"
                                                }`}>
                                                    {report.priority}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-2xl text-xs uppercase font-bold border ${
                                                    report.status.toLowerCase() === "resolved" ? "bg-green-100 text-green-700 border-green-200" : 
                                                    report.status.toLowerCase() === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : 
                                                    "bg-red-100 text-red-700 border-red-200"
                                                }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <button 
                                                    onClick={() => window.location.href = `/admin/incidents?search=${report.id}`}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                </div>
            </main>
        </div>
    );
}