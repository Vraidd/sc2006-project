"use client"
import { Calendar } from "lucide-react";
import { useRef } from "react";

interface DatePickerModalProps {
    onClose: () => void;
}

const DatePickerModal = ({ onClose }: DatePickerModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    // Generating numbers 1 to 28 for February 2026
    const dates = Array.from({ length: 28 }, (_, i) => i + 1);

    return (
        <div 
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50 font-sans"
        >
            {/* MODAL CONTAINER */}
            <div 
                ref={modalRef}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden"
            >
                
                {/* CLOSE BTN */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>

                <div className="p-6">
                {/* HEADER */}
                <div className="flex items-center gap-2 mb-2">
                    <Calendar/>
                    <h2 className="text-xl font-bold text-gray-900">When will you be away?</h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Select your travel dates so we can show you available caretakers.
                </p>

                {/* CALENDAR WIDGET */}
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    {/* CALENDAR HEADER */}
                    <div className="flex items-center justify-between mb-4 px-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="font-semibold text-gray-800 text-sm">February 2026</span>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* DAYS OF WEEK */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-xs font-medium text-gray-400 py-1">
                            {day}
                        </div>
                    ))}
                    </div>

                    {/* DATES GRID */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                    {dates.map(date => {
                        const isPast = date < 16;
                        return (
                            <button
                                key={date}
                                disabled={isPast}
                                className={`
                                w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full
                                ${isPast 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-800 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors'
                                }
                                `}
                            >
                                {date}
                            </button>
                        );
                    })}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button 
                        disabled
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#87c5b8] rounded-lg opacity-90 cursor-not-allowed"
                    >
                    Confirm Dates
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;