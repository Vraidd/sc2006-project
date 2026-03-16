"use client"
import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { DEBUG_MODE, MOCK_ROLE } from "../lib/debugConfig";
import { useAuth } from "@/hooks/useAuth";
import { 
    Calendar, 
    House, 
    MessageCircle, 
    PawPrint, 
    Search, 
    LayoutDashboard, 
    Inbox, 
    CircleDollarSign, 
    Shield, 
    AlertTriangle, 
    Settings, 
    LogOut, 
    CreditCard,
    X,
    Menu,
    UserCheck
} from "lucide-react";

const ownerLinks = [
    { name: "Dashboard", href: "/owner", icon: <House size={18}/> },
    { name: "My Pets", href: "/owner/my_pets", icon: <PawPrint size={18}/> }, 
    { name: "Bookings", href: "/owner/my_bookings", icon: <Calendar size={18}/> },
    { name: "Payments", href: "/owner/transactions", icon: <CreditCard size={18}/> },
    { name: "Search", href: "/owner/search_caregivers", icon: <Search size={18}/> },
    { name: "Messages", href: "/owner/messages", icon: <MessageCircle size={18}/> }, 
];

const caregiverLinks = [
    { name: "Console", href: "/caregiver", icon: <LayoutDashboard size={18}/> }, 
    { name: "Requests", href: "/caregiver/requests", icon: <Inbox size={18}/> }, 
    { name: "Earnings", href: "/caregiver/transactions", icon: <CircleDollarSign size={18}/> }, 
    { name: "Messages", href: "/caregiver/messages", icon: <MessageCircle size={18}/> }, 
];

const adminLinks = [
    { name: "Admin Home", href: "/admin", icon: <Shield size={18}/> },
    { name: "Verifications", href: "/admin/verified", icon: <UserCheck size={18}/> },
    { name: "Incidents", href: "/admin/incidents", icon: <AlertTriangle size={18}/> }, 
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSignedUp = DEBUG_MODE ? MOCK_ROLE !== "GUEST" : user !== null; 
    // const currentRole = DEBUG_MODE ? MOCK_ROLE : (pathname.includes('/owner') ? "OWNER" : (pathname.includes('/admin') ? "ADMIN" : "CAREGIVER"));
    const currentRole = DEBUG_MODE ? MOCK_ROLE : user?.role;

    interface NavLink {
        name: string;
        href: string;
        icon: ReactNode;
    }

    let activeLinks: NavLink[] = [];
    if (isSignedUp) {
        if (currentRole === "OWNER") activeLinks = ownerLinks;
        else if (currentRole === "CAREGIVER") activeLinks = caregiverLinks;
        else if (currentRole === "ADMIN") activeLinks = adminLinks;
    }

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
        
        logout();
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm">
            {/* DEBUG BAR */}
            {DEBUG_MODE && (
                <div className="bg-amber-500 text-[10px] text-white font-black py-1 text-center uppercase tracking-widest">
                    ⚠️ Debug Mode Active: Logged in as {MOCK_ROLE}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center h-16">
                
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-4 cursor-pointer group shrink-0">
                    <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:bg-teal-600 transition-colors shadow-sm">
                        <PawPrint size={20} />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">
                        Pawsport & Peer
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden lg:flex justify-center items-center gap-6">
                    {activeLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className={`text-[13px] font-bold flex items-center gap-2 px-1 py-5 border-b-2 transition-all ${
                                    isActive ? "border-teal-600 text-teal-600" : "border-transparent text-slate-400 hover:text-teal-600 hover:border-teal-200"
                                }`}
                            >
                                {link.icon} {link.name}
                            </Link>
                        )
                    })}
                </div>

                {/* DESKTOP PROFILE */}
                <div className="flex items-center gap-3">
                    {isSignedUp ? (
                        <div className="relative hidden lg:block" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black text-sm"
                            >
                                {DEBUG_MODE ? currentRole?.[0] || '' : user?.name?.[0] || ''}
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div className="px-4 py-3 bg-slate-50 border-b border-gray-100">
                                        <p className="text-xs font-bold text-slate-900">{user?.name} ACCOUNT</p>
                                    </div>
                                    <div className="p-2">
                                        {currentRole !== "ADMIN" && (
                                            <Link 
                                                href={`/${currentRole?.toLowerCase()}/profile`} 
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-600 rounded-xl transition-colors"
                                            >
                                                <Settings size={16} /> View Profile
                                            </Link>
                                        )}
                                        {/* ✅ FIXED: Desktop button now calls handleLogout */}
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden lg:flex gap-2">
                            <Link href="/signin" className="px-5 py-2.5 text-sm font-bold text-teal-600">Sign In</Link>
                            <Link href="/signup" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold">Sign Up</Link>
                        </div>
                    )}

                    {/* MOBILE TOGGLE */}
                    <button 
                        className="lg:hidden p-2 text-slate-500"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-gray-100 shadow-xl absolute w-full left-0 z-50 h-[calc(100vh-64px)]">
                    <div className="flex flex-col px-6 pt-2 pb-8 h-full">
                        <div className="space-y-2 grow">
                            {activeLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href} 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-base font-bold flex items-center gap-4 p-4 rounded-2xl ${
                                        pathname === link.href ? "bg-teal-50 text-teal-700" : "text-slate-500"
                                    }`}
                                >
                                    {link.icon} {link.name}
                                </Link>
                            ))}
                        </div>
                        
                        <div className="pt-6 border-t border-slate-100 mt-6 pb-6">
                            {isSignedUp && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2 mb-4">
                                        <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black">{DEBUG_MODE ? currentRole?.[0] || '' : user?.name?.[0] || ''}</div>
                                        <p className="text-sm font-bold text-slate-900">Signed in as {currentRole}</p>
                                    </div>
                                    
                                    {currentRole !== "ADMIN" && (
                                        <Link 
                                            href={`/${currentRole?.toLowerCase()}/profile`} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold"
                                        >
                                            <Settings size={18} /> View Profile
                                        </Link>
                                    )}
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}