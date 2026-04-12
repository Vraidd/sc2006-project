"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import {
  ChevronLeft,
  ShieldCheck,
  User,
  DollarSign,
  Briefcase,
  FileText,
  Search,
  Loader,
  MapPin,
  Eye,
  X,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface CaregiverApplication {
  id: string;
  name: string;
  email: string;
  biography?: string;
  dailyRate: number;
  location?: string;
  experienceYears?: number;
  petPreferences?: string[];
  availabilityStartDate?: string;
  availabilityEndDate?: string;
  verificationDocs?: Array<{
    name: string;
    content?: string;
  }>;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

const PETS_HANDLED_LIST: Record<string, string> = {
  DOG: "Dogs",
  CAT: "Cats",
  BIRD: "Birds",
  FISH: "Fish",
  REPTILE: "Reptiles",
  SMALL_ANIMAL: "Small Animals",
};

function VerifiedQueueContent() {
  const searchParams = useSearchParams();
  const { fireToast } = useToast();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");

  const [applications, setApplications] = useState<CaregiverApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CaregiverApplication | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/pending-applications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(Array.isArray(data.applications) ? data.applications : []);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load applications";
        setError(errorMsg);
        fireToast("danger", "Error", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [fireToast]);

  const sortedApplications = [...applications].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredCaretakers = sortedApplications.filter((caretaker) => {
    if (statusFilter !== "all" && statusFilter !== "pending") {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        caretaker.name.toLowerCase().includes(query) ||
        caretaker.email.toLowerCase().includes(query) ||
        (caretaker.location && caretaker.location.toLowerCase().includes(query)) ||
        (caretaker.petPreferences &&
          caretaker.petPreferences.some((pet) => (PETS_HANDLED_LIST[pet] || pet).toLowerCase().includes(query)))
      );
    }

    return true;
  });

  const getStatusBadge = () => {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
        <ShieldCheck size={12} strokeWidth={3} />
        Pending
      </span>
    );
  };

  const handleAction = async (caregiverId: string, action: "approve" | "reject") => {
    try {
      setActionLoading(caregiverId);
      const response = await fetch("/api/admin/pending-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, caregiverId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} application`);
      }

      setApplications((prev) => prev.filter((app) => app.id !== caregiverId));
      if (selectedApplication?.id === caregiverId) {
        setSelectedApplication(null);
      }

      const message = action === "approve" ? "Verified Badge Issued" : "Request Rejected";
      const description =
        action === "approve" ? "Caretaker has been approved" : "Caretaker application has been rejected";
      fireToast(action === "approve" ? "success" : "danger", message, description);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : `Failed to ${action} application`;
      fireToast("danger", "Error", errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Link
              href="/admin"
              className="text-teal-600 hover:text-teal-700 text-sm font-black uppercase tracking-widest flex items-center gap-1 mb-4 transition-transform hover:-translate-x-1"
            >
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Verify Caretakers
            </h1>
            <p className="text-base text-slate-500 mt-2 font-medium">
              Review caretaker applications and manage verified status.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-50">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Search
              </label>
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
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={24} className="text-teal-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Loading applications...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-md font-medium italic text-slate-400 ml-auto mb-2">
              Showing {filteredCaretakers.length} of {applications.length} caretaker
              {applications.length !== 1 ? "s" : ""}
            </div>

            <div className="space-y-4">
              {filteredCaretakers.length > 0 ? (
                filteredCaretakers.map((caretaker) => (
                  <div
                    key={caretaker.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shrink-0 mt-1">
                      <img
                        src={caretaker.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${caretaker.name}`}
                        alt={caretaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900">{caretaker.name}</h3>
                        {getStatusBadge()}
                      </div>
                      <p className="text-sm text-slate-500">{caretaker.email}</p>
                      {caretaker.phone && <p className="text-sm text-slate-500">{caretaker.phone}</p>}

                      <div className="flex flex-wrap gap-4 mt-3">
                        {caretaker.location && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{caretaker.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <DollarSign size={14} className="text-slate-400" />
                          <span>${caretaker.dailyRate}/day</span>
                        </div>
                        {caretaker.experienceYears !== undefined && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Briefcase size={14} className="text-slate-400" />
                            <span>{caretaker.experienceYears} years</span>
                          </div>
                        )}
                      </div>

                      {caretaker.biography && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mt-2">{caretaker.biography}</p>
                      )}

                      {caretaker.petPreferences && caretaker.petPreferences.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {caretaker.petPreferences.map((pet, idx) => (
                            <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                              {PETS_HANDLED_LIST[pet] || pet}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedApplication(caretaker)}
                          className="px-4 py-2 border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
                        >
                          <Eye size={14} /> Details
                        </button>
                        {caretaker.verificationDocs && caretaker.verificationDocs.length > 0 && (
                          <span className="px-3 py-2 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-black uppercase tracking-wider rounded-lg">
                            {caretaker.verificationDocs.length} Document{caretaker.verificationDocs.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-fit">
                      <button
                        onClick={() => handleAction(caretaker.id, "approve")}
                        disabled={actionLoading === caretaker.id}
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-teal-600/20 active:scale-95 flex items-center gap-2 disabled:cursor-not-allowed"
                      >
                        {actionLoading === caretaker.id ? (
                          <>
                            <Loader size={16} className="animate-spin" /> Processing
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} /> Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(caretaker.id, "reject")}
                        disabled={actionLoading === caretaker.id}
                        className="px-6 py-2.5 border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User size={32} />
                  </div>
                  {searchQuery ? (
                    <>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Results Found</h3>
                      <p className="text-slate-500 font-medium mt-2">
                        No caretakers match your search for "{searchQuery}".
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Clear</h3>
                      <p className="text-slate-500 font-medium mt-2">
                        No pending caretaker applications at this time.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setSelectedApplication(null)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Close details"
            >
              <X size={18} />
            </button>

            <div className="pr-8">
              <p className="text-xs font-black text-teal-700 uppercase tracking-widest mb-2">Application Details</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedApplication.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedApplication.email}</p>
              {selectedApplication.phone && <p className="text-sm text-slate-500">{selectedApplication.phone}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Rate</p>
                <p className="text-lg font-bold text-slate-900">${selectedApplication.dailyRate}/day</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Experience</p>
                <p className="text-lg font-bold text-slate-900">
                  {selectedApplication.experienceYears !== undefined ? `${selectedApplication.experienceYears} years` : "Not provided"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:col-span-2">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Location</p>
                <p className="text-base font-semibold text-slate-900">{selectedApplication.location || "Not provided"}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:col-span-2">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Availability</p>
                <p className="text-base font-semibold text-slate-900">
                  {selectedApplication.availabilityStartDate
                    ? new Date(selectedApplication.availabilityStartDate).toLocaleDateString()
                    : "Not provided"}
                  {selectedApplication.availabilityEndDate
                    ? ` - ${new Date(selectedApplication.availabilityEndDate).toLocaleDateString()}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Biography</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedApplication.biography || "No biography provided."}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Pet Preferences</p>
              {selectedApplication.petPreferences && selectedApplication.petPreferences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.petPreferences.map((pet, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                      {PETS_HANDLED_LIST[pet] || pet}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No pet preferences selected.</p>
              )}
            </div>

            <div className="mt-6">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Documents</p>
              {selectedApplication.verificationDocs && selectedApplication.verificationDocs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.verificationDocs.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.content || '#'}
                      target={doc.content ? '_blank' : undefined}
                      rel={doc.content ? 'noopener noreferrer' : undefined}
                      download={doc.name}
                      className={`flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-lg border ${
                        doc.content
                          ? 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'
                          : 'text-slate-600 bg-white border-slate-200 cursor-default'
                      }`}
                      onClick={(e) => {
                        if (!doc.content) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <FileText size={14} className="text-slate-400" />
                      {doc.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No documents attached.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function VerifiedQueue() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 font-sans pb-20" />}>
      <VerifiedQueueContent />
    </Suspense>
  );
}
