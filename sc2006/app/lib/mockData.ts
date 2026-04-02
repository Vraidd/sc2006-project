/**
 * Mock Data for Caregiver Dashboard
 * 
 * FRONTEND DEVELOPMENT:
 * This file provides mock data for development and testing purposes.
 * When DEBUG_MODE is enabled in debugConfig.ts, this data will be used instead of real API calls.
 * 
 * BACKEND DEVELOPER NOTE:
 * - This mock data simulates the structure of data returned by the backend API
 * - The real API endpoints expected are:
 *   - GET /api/booking?caregiverId={id} - Returns bookings for a caregiver
 *   - GET /api/auth/me - Returns current logged-in user
 * - When DEBUG_MODE is set to false, the frontend will use real API data instead
 * 
 * DATA STRUCTURES:
 * The mock data follows these interfaces that should match the backend API response:
 * - MockBooking: Booking with owner, caregiver, pet, and payment relations
 * - MockTransaction: Payment transaction records
 * 
 * TO DISABLE MOCK DATA:
 * Set DEBUG_MODE = false in ./debugConfig.ts to use real backend data
 */

import { DEBUG_MODE } from "./debugConfig";

// Types matching the BookingWithRelations structure from the dashboard
export interface MockOwner {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
}

export interface MockCaregiver {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
}

export interface MockPet {
  id: string;
  name: string;
  type: string;
  breed: string | null;
}

export interface MockPayment {
  id: string;
  status: string;
  amount: number;
}

export interface MockBooking {
  id: string;
  ownerId: string;
  caregiverId: string;
  petId: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  owner: MockOwner;
  caregiver: MockCaregiver;
  pet: MockPet;
  payment: MockPayment | null;
  // Additional fields used by the dashboard
  paymentStatus: string | null;
  paymentAmount: number | null;
}

// Mock current user (caregiver)
export const mockCaregiverUser = {
  id: "caregiver-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar: null,
  role: "CAREGIVER" as const,
};

// Mock owners
const mockOwners: MockOwner[] = [
  {
    id: "owner-001",
    name: "Michael Chen",
    avatar: null,
    email: "michael.chen@example.com",
  },
  {
    id: "owner-002",
    name: "Emily Davis",
    avatar: null,
    email: "emily.davis@example.com",
  },
  {
    id: "owner-003",
    name: "James Wilson",
    avatar: null,
    email: "james.wilson@example.com",
  },
  {
    id: "owner-004",
    name: "Lisa Anderson",
    avatar: null,
    email: "lisa.anderson@example.com",
  },
];

// Mock pets
const mockPets: MockPet[] = [
  {
    id: "pet-001",
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
  },
  {
    id: "pet-002",
    name: "Whiskers",
    type: "Cat",
    breed: "Persian",
  },
  {
    id: "pet-003",
    name: "Max",
    type: "Dog",
    breed: "German Shepherd",
  },
  {
    id: "pet-004",
    name: "Luna",
    type: "Cat",
    breed: "Siamese",
  },
  {
    id: "pet-005",
    name: "Charlie",
    type: "Dog",
    breed: "Labrador",
  },
];

// Helper to get dates relative to today
function getDates(offsetDays: number, durationDays: number) {
  const start = new Date();
  start.setDate(start.getDate() + offsetDays);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

// Mock bookings for the caregiver dashboard
export const mockBookings: MockBooking[] = [
  {
    id: "booking-001",
    ownerId: "owner-001",
    caregiverId: "caregiver-001",
    petId: "pet-001",
    startDate: getDates(-2, 5).start, // Started 2 days ago, 5 day booking
    endDate: getDates(-2, 5).end,
    status: "IN_PROGRESS",
    totalPrice: 250.0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[0],
    caregiver: mockCaregiverUser,
    pet: mockPets[0],
    payment: null,
    paymentStatus: null,
    paymentAmount: null,
  },
  {
    id: "booking-002",
    ownerId: "owner-002",
    caregiverId: "caregiver-001",
    petId: "pet-002",
    startDate: getDates(3, 4).start, // Starts in 3 days
    endDate: getDates(3, 4).end,
    status: "CONFIRMED",
    totalPrice: 180.0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[1],
    caregiver: mockCaregiverUser,
    pet: mockPets[1],
    payment: null,
    paymentStatus: null,
    paymentAmount: null,
  },
  {
    id: "booking-003",
    ownerId: "owner-003",
    caregiverId: "caregiver-001",
    petId: "pet-003",
    startDate: getDates(-10, 7).start, // Completed booking
    endDate: getDates(-10, 7).end,
    status: "IN_PROGRESS",
    totalPrice: 350.0,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[2],
    caregiver: mockCaregiverUser,
    pet: mockPets[2],
    payment: {
      id: "payment-001",
      status: "PENDING",
      amount: 350.0,
    },
    paymentStatus: "PENDING",
    paymentAmount: 350.0,
  },
  {
    id: "booking-004",
    ownerId: "owner-004",
    caregiverId: "caregiver-001",
    petId: "pet-004",
    startDate: getDates(7, 3).start, // Future booking
    endDate: getDates(7, 3).end,
    status: "CONFIRMED",
    totalPrice: 120.0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[3],
    caregiver: mockCaregiverUser,
    pet: mockPets[3],
    payment: null,
    paymentStatus: null,
    paymentAmount: null,
  },
];

// Mock pending bookings (for requests page)
export const mockPendingBookings: MockBooking[] = [
  {
    id: "pending-001",
    ownerId: "owner-001",
    caregiverId: "caregiver-001",
    petId: "pet-005",
    startDate: getDates(14, 5).start,
    endDate: getDates(14, 5).end,
    status: "PENDING",
    totalPrice: 275.0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[0],
    caregiver: mockCaregiverUser,
    pet: mockPets[4],
    payment: null,
    paymentStatus: null,
    paymentAmount: null,
  },
  {
    id: "pending-002",
    ownerId: "owner-002",
    caregiverId: "caregiver-001",
    petId: "pet-001",
    startDate: getDates(20, 3).start,
    endDate: getDates(20, 3).end,
    status: "PENDING",
    totalPrice: 135.0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    owner: mockOwners[1],
    caregiver: mockCaregiverUser,
    pet: mockPets[0],
    payment: null,
    paymentStatus: null,
    paymentAmount: null,
  },
];

// Mock transactions for transactions page
export interface MockTransaction {
  id: string;
  bookingId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: "PAID" | "PENDING" | "FAILED";
  date: string;
  petName: string;
  ownerName: string;
}

export const mockTransactions: MockTransaction[] = [
  {
    id: "txn-001",
    bookingId: "booking-003",
    amount: 350.0,
    platformFee: 17.5,
    netAmount: 332.5,
    status: "PENDING",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    petName: "Max",
    ownerName: "James Wilson",
  },
  {
    id: "txn-002",
    bookingId: "booking-prev-001",
    amount: 200.0,
    platformFee: 10.0,
    netAmount: 190.0,
    status: "PAID",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    petName: "Bella",
    ownerName: "Michael Chen",
  },
  {
    id: "txn-003",
    bookingId: "booking-prev-002",
    amount: 150.0,
    platformFee: 7.5,
    netAmount: 142.5,
    status: "PAID",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    petName: "Coco",
    ownerName: "Emily Davis",
  },
];

/**
 * Hook-like function to get mock bookings based on filters
 * This simulates the API call behavior
 */
export function getMockBookings(filters?: { caregiverId?: string | null; ownerId?: string | null; petId?: string | null }): MockBooking[] {
  let result = [...mockBookings, ...mockPendingBookings];
  
  if (filters?.caregiverId) {
    result = result.filter(b => b.caregiverId === filters.caregiverId);
  }
  if (filters?.ownerId) {
    result = result.filter(b => b.ownerId === filters.ownerId);
  }
  if (filters?.petId) {
    result = result.filter(b => b.petId === filters.petId);
  }
  
  return result;
}

/**
 * Check if debug mode is enabled and return mock data or empty array
 */
export function getBookingsForDashboard(caregiverId: string): MockBooking[] {
  if (!DEBUG_MODE) {
    return [];
  }
  
  // Return bookings where the caregiver is involved
  return getMockBookings({ caregiverId }).filter(
    b => b.status === "CONFIRMED" || b.status === "IN_PROGRESS"
  );
}

export function getPendingBookingsCount(caregiverId: string): number {
  if (!DEBUG_MODE) {
    return 0;
  }
  
  return getMockBookings({ caregiverId }).filter(
    b => b.status === "PENDING"
  ).length;
}

// Export for use in components
export { DEBUG_MODE };