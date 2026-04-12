"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Pagination from "../../components/Pagination";
import {
  DollarSign,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  FileText,
  FileSearch,
  ClipboardCheck,
} from "lucide-react";

type RefundStatus = "Pending" | "Approved" | "Rejected";

type RefundRequestRecord = {
  id: string;
  incidentId: string;
  bookingId: string;
  owner: string;
  ownerName: string;
  caretaker: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  datetime: Date;
  transactionId: string | null;
};

type RefundStats = {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalPendingAmount: number;
};

type RefundTab = "pending" | "past";

function AdminRefundsContent() {
  const searchParams = useSearchParams();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isDismissOpen, setIsDismissOpen] = useState(false);
  const [processAction, setProcessAction] = useState<"approve" | "reject">("approve");
  const [processNote, setProcessNote] = useState("");

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeTab, setActiveTab] = useState<RefundTab>(
    searchParams.get("tab") === "past" ? "past" : "pending"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [refundRequests, setRefundRequests] = useState<RefundRequestRecord[]>([]);
  const [refundStats, setRefundStats] = useState<RefundStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalPendingAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [dismissTarget, setDismissTarget] = useState<RefundRequestRecord | null>(null);

  const loadRefundRequests = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/admin/refunds", { credentials: "include" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch refund requests");
      }

      const requests: RefundRequestRecord[] = (data.requests ?? []).map((request: any) => ({
        ...request,
        datetime: new Date(request.datetime),
      }));

      setRefundRequests(requests);
      setRefundStats({
        pendingCount: Number(data?.stats?.pendingCount ?? 0),
        approvedCount: Number(data?.stats?.approvedCount ?? 0),
        rejectedCount: Number(data?.stats?.rejectedCount ?? 0),
        totalPendingAmount: Number(data?.stats?.totalPendingAmount ?? 0),
      });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to fetch refund requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRefundRequests();
  }, []);

  useEffect(() => {
    const searchVal = searchParams.get("search");
    if (searchVal) {
      const found = refundRequests.find((r) => r.id.toLowerCase() === searchVal.toLowerCase());
      if (found) {
        setSelectedRefundId(found.id);
        return;
      }
    }

    if (!refundRequests.some((request) => request.id === selectedRefundId)) {
      const fallback = refundRequests.find((request) => request.status === "Pending") || refundRequests[0] || null;
      setSelectedRefundId(fallback?.id ?? null);
    }
  }, [refundRequests, searchParams, selectedRefundId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, startDate, endDate]);

  const selectedRefund = useMemo(
    () => refundRequests.find((request) => request.id === selectedRefundId) ?? null,
    [refundRequests, selectedRefundId]
  );

  const filteredRequests = refundRequests
    .filter((request) => {
      if (activeTab === "pending") return request.status === "Pending";
      return request.status !== "Pending";
    })
    .filter((request) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        request.id.toLowerCase().includes(query) ||
        request.bookingId.toLowerCase().includes(query) ||
        request.owner.toLowerCase().includes(query) ||
        request.ownerName.toLowerCase().includes(query) ||
        request.caretaker.toLowerCase().includes(query)
      );
    })
    .filter((request) => {
      const requestDate = new Date(request.datetime);
      requestDate.setHours(0, 0, 0, 0);

      if (startDate) {
        const start = new Date(startDate);
        if (requestDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(request.datetime) > end) return false;
      }

      return true;
    });

  const totalItems = filteredRequests.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const getStatusBadge = (status: RefundStatus) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} strokeWidth={3} />
            {status}
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle size={12} strokeWidth={3} />
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-200">
            <XCircle size={12} strokeWidth={3} />
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedRefund) return;

    setIsProcessing(true);
    setProcessError(null);

    try {
      const response = await fetch("/api/admin/refunds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          incidentId: selectedRefund.incidentId,
          action: processAction,
          note: processNote.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to process refund request");
      }

      await loadRefundRequests();
      setIsProcessOpen(false);
      setProcessNote("");
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : "Failed to process refund request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDismissRefund = async (request: RefundRequestRecord) => {
    setIsProcessing(true);
    setProcessError(null);

    try {
      const response = await fetch("/api/admin/refunds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          incidentId: request.incidentId,
          action: "reject",
          note: "Dismissed by admin",
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to dismiss refund request");
      }

      await loadRefundRequests();
      setIsDismissOpen(false);
      setDismissTarget(null);
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : "Failed to dismiss refund request");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
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
              Refund Requests
            </h1>
            <p className="text-base text-slate-500 mt-2 font-medium">
              Review and process refund requests from pet owners.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{refundStats.pendingCount}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Approved</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{refundStats.approvedCount}</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-teal-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Rejected</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{refundStats.rejectedCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle size={20} className="text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Amount</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">${refundStats.totalPendingAmount.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <DollarSign size={20} className="text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${
                activeTab === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              Pending ({refundStats.pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest border transition-all ${
                activeTab === "past"
                  ? "bg-slate-100 text-slate-700 border-slate-300"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              Past ({refundStats.approvedCount + refundStats.rejectedCount})
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-50">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ID, booking, owner or caretaker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <span className="text-slate-400 pb-2">-</span>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-slate-500 mb-3">
          {isLoading
            ? "Loading refund requests..."
            : loadError
            ? loadError
            : `Showing ${filteredRequests.length} of ${refundRequests.length} request${refundRequests.length === 1 ? "" : "s"}`}
        </div>

        <div className="space-y-4 mb-3">
          {!isLoading && !loadError && paginatedRequests.map((request) => (
            <div
              key={request.id}
              className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-stretch justify-between gap-6"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  request.status === "Approved"
                    ? "bg-teal-500"
                    : request.status === "Pending"
                    ? "bg-amber-500"
                    : request.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-slate-300"
                }`}
              />

              <div className="flex-1 space-y-4 pl-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-md font-black text-slate-900 tracking-wider">{request.id}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-xl font-black text-slate-900">${request.amount.toFixed(2)}</div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                      {request.ownerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-md font-bold text-slate-900">{request.ownerName}</p>
                      <p className="text-sm font-medium text-slate-500">{request.owner}</p>
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-8 bg-slate-200" />

                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-md text-slate-600">
                      Caretaker: <span className="font-bold text-slate-900">{request.caretaker}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Reason for request
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{request.reason}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <Calendar size={14} className="text-slate-400" />
                    <span>
                      Filed: <span className="font-bold text-black">{formatDate(request.datetime)}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <FileText size={14} className="text-slate-400" />
                    <span>
                      Booking: <span className="font-bold text-black">{request.bookingId}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <FileText size={14} className="text-slate-400" />
                    <span>
                      Transaction ID: <span className="font-bold text-black">{request.transactionId ?? "-"}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3 min-w-50 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                <button
                  onClick={() => {
                    setSelectedRefundId(request.id);
                    setIsDetailOpen(true);
                  }}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FileSearch size={16} className="text-slate-400" />
                  Details
                </button>
                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedRefundId(request.id);
                        setIsProcessOpen(true);
                        setProcessError(null);
                      }}
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ClipboardCheck size={16} />
                      Process
                    </button>
                    <button
                      onClick={() => {
                        setDismissTarget(request);
                        setIsDismissOpen(true);
                        setProcessError(null);
                      }}
                      disabled={isProcessing}
                      className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {!isLoading && !loadError && paginatedRequests.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No refund requests found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            totalItems={totalItems}
            startItem={startItem}
            endItem={endItem}
          />
        )}
      </main>

      {isDetailOpen && selectedRefund && (
        <div
          className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 md:p-6"
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="font-bold text-xl text-slate-900">Refund Request Details</h2>
              <p className="text-sm font-semibold text-slate-500">Request ID: {selectedRefund.id}</p>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Status</span>
                {getStatusBadge(selectedRefund.status)}
              </div>

              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                <span className="text-sm font-medium text-teal-700">Refund Amount</span>
                <span className="text-2xl font-bold text-teal-600">${selectedRefund.amount.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Booking ID</span>
                  <span className="text-sm font-bold text-slate-900">{selectedRefund.bookingId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Transaction ID</span>
                  <span className="text-sm font-bold text-slate-900">{selectedRefund.transactionId ?? "-"}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Owner</p>
                <p className="text-sm font-bold text-slate-900">{selectedRefund.ownerName}</p>
                <p className="text-sm text-slate-500">{selectedRefund.owner}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Caretaker</p>
                <p className="text-sm font-bold text-slate-900">{selectedRefund.caretaker}</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-2">Reason for Refund</p>
                <p className="text-sm text-amber-900">{selectedRefund.reason}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Filed On</span>
                <span className="text-sm font-bold text-slate-900">{formatDate(selectedRefund.datetime)}</span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 mt-auto">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              {selectedRefund.status === "Pending" && (
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsProcessOpen(true);
                    setProcessError(null);
                  }}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-all shadow-md"
                >
                  Process Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isProcessOpen && selectedRefund && (
        <div
          className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 md:p-6"
          onClick={() => setIsProcessOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="font-bold text-xl text-slate-900">Process Refund</h2>
              <p className="text-sm font-semibold text-slate-500">Request ID: {selectedRefund.id}</p>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-teal-700">Refund Amount</span>
                  <span className="text-2xl font-bold text-teal-600">${selectedRefund.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-600">To</span>
                  <span className="text-teal-900 font-medium">{selectedRefund.ownerName}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-3">Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProcessAction("approve")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      processAction === "approve"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <CheckCircle size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-bold">Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcessAction("reject")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      processAction === "reject"
                        ? "bg-red-50 border-red-500 text-red-700"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <XCircle size={24} className="mx-auto mb-2" />
                    <span className="text-sm font-bold">Reject</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">
                  {processAction === "approve" ? "Approval Notes" : "Rejection Reason"} (Optional)
                </label>
                <textarea
                  value={processNote}
                  onChange={(e) => setProcessNote(e.target.value)}
                  placeholder={`Enter ${processAction === "approve" ? "approval" : "rejection"} notes...`}
                  className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
                />
              </div>

              {processError && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-700">
                  {processError}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0 mt-auto">
              <button
                onClick={() => setIsProcessOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={isProcessing}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  processAction === "approve"
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing
                  ? "Processing..."
                  : processAction === "approve"
                  ? "Approve & Process"
                  : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDismissOpen && dismissTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 md:p-6"
          onClick={() => {
            if (isProcessing) return;
            setIsDismissOpen(false);
            setDismissTarget(null);
          }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="font-bold text-xl text-slate-900">Dismiss Refund Request</h2>
              <p className="text-sm font-semibold text-slate-500">Request ID: {dismissTarget.id}</p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700">
                Are you sure you want to dismiss this refund request from <span className="font-bold text-slate-900">{dismissTarget.ownerName}</span>?
              </p>

              {processError && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-700">
                  {processError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    if (isProcessing) return;
                    setIsDismissOpen(false);
                    setDismissTarget(null);
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDismissRefund(dismissTarget)}
                  disabled={isProcessing}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Dismissing..." : "Confirm Dismiss"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRefunds() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 font-sans" />}>
      <AdminRefundsContent />
    </Suspense>
  );
}
