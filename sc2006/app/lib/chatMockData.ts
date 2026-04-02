/**
 * Mock Data for ChatUI Component
 * 
 * This file provides mock data for the ChatUI component when DEBUG_MODE is enabled.
 * It includes sample conversations, messages, and payment requests.
 * 
 * BACKEND DEVELOPER NOTE:
 * The following API endpoints should return data in this format:
 * - GET /api/chats - Returns list of conversations
 * - GET /api/messages?bookingId={id} - Returns messages for a booking
 * - GET /api/payment?bookingId={id} - Returns payment request for a booking
 * - POST /api/payment - Process payment
 */

import { DEBUG_MODE } from "./debugConfig";

// Types for chat data
export interface MockMessage {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

export interface MockPaymentRequest {
    id: string;
    bookingId: string;
    amount: number;
    status: "PENDING" | "PAID" | "CANCELLED";
    requestedBy: string;
    requestedAt: string;
    paidAt?: string;
}

export interface MockConversation {
    id: string;
    name: string;
    initial: string;
    avatar: string | null;
    otherId: string;
    lastMessage: string;
    date: string;
    status: string;
    role: "OWNER" | "CAREGIVER";
}

// Mock current user (changes based on who's logged in)
export function getMockCurrentUser(userRole: "OWNER" | "CAREGIVER" = "OWNER") {
    if (userRole === "OWNER") {
        return {
            id: "user-owner-001",
            name: "Michael Chen",
            email: "michael.chen@example.com",
            role: "OWNER" as const,
            avatar: null,
        };
    }
    return {
        id: "user-caregiver-001",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "CAREGIVER" as const,
        avatar: null,
    };
}

// Mock conversations
export const mockConversations: MockConversation[] = [
    {
        id: "booking-001",
        name: "Sarah Johnson",
        initial: "SJ",
        avatar: null,
        otherId: "user-caregiver-001",
        lastMessage: "Thank you for taking care of Buddy!",
        date: "2 hours ago",
        status: "IN_PROGRESS",
        role: "CAREGIVER",
    },
    {
        id: "booking-002",
        name: "Emily Davis",
        initial: "ED",
        avatar: null,
        otherId: "user-owner-002",
        lastMessage: "The booking details look great!",
        date: "Yesterday",
        status: "CONFIRMED",
        role: "OWNER",
    },
    {
        id: "booking-003",
        name: "James Wilson",
        initial: "JW",
        avatar: null,
        otherId: "user-owner-003",
        lastMessage: "Max loved his stay!",
        date: "3 days ago",
        status: "COMPLETED",
        role: "OWNER",
    },
    {
        id: "booking-004",
        name: "Lisa Anderson",
        initial: "LA",
        avatar: null,
        otherId: "user-caregiver-002",
        lastMessage: "Looking forward to next week!",
        date: "1 week ago",
        status: "CONFIRMED",
        role: "CAREGIVER",
    },
];

// Mock messages for each conversation
export const mockMessagesByBooking: Record<string, MockMessage[]> = {
    "booking-001": [
        {
            id: "msg-001",
            senderId: "user-owner-001",
            content: "Hi Sarah! Just wanted to check in on Buddy.",
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-001", name: "Michael Chen", avatar: null },
        },
        {
            id: "msg-002",
            senderId: "user-caregiver-001",
            content: "Hi Michael! Buddy is doing great! He had a fun walk in the park this morning.",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
        },
        {
            id: "msg-003",
            senderId: "user-owner-001",
            content: "That's wonderful to hear! Did he eat well?",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-001", name: "Michael Chen", avatar: null },
        },
        {
            id: "msg-004",
            senderId: "user-caregiver-001",
            content: "Yes, he finished his entire bowl! I'll send you some photos later.",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
        },
        {
            id: "msg-005",
            senderId: "user-owner-001",
            content: "Thank you for taking care of Buddy!",
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-001", name: "Michael Chen", avatar: null },
        },
    ],
    "booking-002": [
        {
            id: "msg-006",
            senderId: "user-caregiver-001",
            content: "Hi Emily! I'm confirming our booking for next week.",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
        },
        {
            id: "msg-007",
            senderId: "user-owner-002",
            content: "Perfect! I'll drop Whiskers off on Monday morning.",
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-002", name: "Emily Davis", avatar: null },
        },
        {
            id: "msg-008",
            senderId: "user-caregiver-001",
            content: "Great! Any special instructions for Whiskers?",
            createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
        },
        {
            id: "msg-009",
            senderId: "user-owner-002",
            content: "The booking details look great!",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-002", name: "Emily Davis", avatar: null },
        },
    ],
    "booking-003": [
        {
            id: "msg-010",
            senderId: "user-owner-003",
            content: "Max had such a wonderful time with you!",
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-003", name: "James Wilson", avatar: null },
        },
        {
            id: "msg-011",
            senderId: "user-caregiver-001",
            content: "He was such a good boy! We had so much fun at the dog park.",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-001", name: "Sarah Johnson", avatar: null },
        },
        {
            id: "msg-012",
            senderId: "user-owner-003",
            content: "Max loved his stay!",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-003", name: "James Wilson", avatar: null },
        },
    ],
    "booking-004": [
        {
            id: "msg-013",
            senderId: "user-caregiver-002",
            content: "Hi! I'm excited to watch Luna next week!",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-002", name: "Lisa Anderson", avatar: null },
        },
        {
            id: "msg-014",
            senderId: "user-owner-001",
            content: "Great! I'll send you her care instructions.",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-owner-001", name: "Michael Chen", avatar: null },
        },
        {
            id: "msg-015",
            senderId: "user-caregiver-002",
            content: "Looking forward to next week!",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            sender: { id: "user-caregiver-002", name: "Lisa Anderson", avatar: null },
        },
    ],
};

// Mock payment requests (for demonstrating payment functionality)
export const mockPaymentRequests: Record<string, MockPaymentRequest> = {
    "booking-001": {
        id: "payment-001",
        bookingId: "booking-001",
        amount: 250.00,
        status: "PENDING",
        requestedBy: "user-caregiver-001",
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    "booking-003": {
        id: "payment-003",
        bookingId: "booking-003",
        amount: 350.00,
        status: "PAID",
        requestedBy: "user-caregiver-001",
        requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
};

/**
 * Get mock conversations based on current user role
 */
export function getMockConversations(userRole: "OWNER" | "CAREGIVER"): MockConversation[] {
    if (!DEBUG_MODE) return [];
    
    // Filter conversations based on user role
    return mockConversations.filter(c => c.role !== userRole);
}

/**
 * Get mock messages for a specific booking
 */
export function getMockMessages(bookingId: string): MockMessage[] {
    if (!DEBUG_MODE) return [];
    return mockMessagesByBooking[bookingId] || [];
}

/**
 * Get mock payment request for a specific booking
 */
export function getMockPaymentRequest(bookingId: string): MockPaymentRequest | null {
    if (!DEBUG_MODE) return null;
    return mockPaymentRequests[bookingId] || null;
}

/**
 * Process mock payment (simulate API call)
 */
export async function processMockPayment(bookingId: string, paymentId: string): Promise<{ success: boolean; error?: string }> {
    if (!DEBUG_MODE) {
        return { success: false, error: "Debug mode disabled" };
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const payment = mockPaymentRequests[paymentId];
    if (!payment) {
        return { success: false, error: "Payment not found" };
    }
    
    if (payment.status === "PAID") {
        return { success: false, error: "Payment already processed" };
    }
    
    // Update payment status
    payment.status = "PAID";
    payment.paidAt = new Date().toISOString();
    
    return { success: true };
}