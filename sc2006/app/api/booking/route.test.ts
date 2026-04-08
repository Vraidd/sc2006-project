/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET, POST, PATCH } from './route';

const mockCookies = jest.fn();
const mockVerifyToken = jest.fn();
const mockRequestPaymentInChat = jest.fn();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

jest.mock('@/app/lib/utils', () => ({
  verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    booking: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    caregiverProfile: { findUnique: jest.fn() },
    pet: { findUnique: jest.fn() },
  },
}));

const mockPrisma = jest.requireMock('@/app/lib/prisma').prisma as {
  booking: {
    findMany: jest.Mock;
    findFirst: jest.Mock;
    findUnique: jest.Mock;
    updateMany: jest.Mock;
    update: jest.Mock;
    create: jest.Mock;
  };
  caregiverProfile: { findUnique: jest.Mock };
  pet: { findUnique: jest.Mock };
};

jest.mock('@/app/lib/paymentRequestChat', () => ({
  requestPaymentInChat: (...args: unknown[]) => mockRequestPaymentInChat(...args),
}));

describe('booking route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    mockCookies.mockResolvedValue({ get: () => ({ value: 'token' }) });
    mockVerifyToken.mockReturnValue({ userId: 'owner-1' });
    mockPrisma.caregiverProfile.findUnique.mockResolvedValue({ id: 'cg-1', dailyRate: 50, availabilityStartDate: null, availabilityEndDate: null });
    mockPrisma.pet.findUnique.mockResolvedValue({ id: 'pet-1', ownerId: 'owner-1' });
    mockPrisma.booking.findFirst.mockResolvedValue(null);
    mockPrisma.booking.create.mockResolvedValue({ id: 'booking-1' });
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      caregiverId: 'cg-1',
      ownerId: 'owner-1',
      status: 'CONFIRMED',
      startDate: new Date('2026-04-01T00:00:00Z'),
      endDate: new Date('2026-04-03T00:00:00Z'),
      totalPrice: 100,
      caregiver: { caregiverProfile: { dailyRate: 50 } },
      pet: { name: 'Buddy' },
    });
  });

  it('creates a one-day booking when start and end dates match', async () => {
    const request = new NextRequest('http://localhost/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caregiverId: 'cg-1',
        petId: 'pet-1',
        startDate: '2026-04-10T00:00:00.000Z',
        endDate: '2026-04-10T00:00:00.000Z',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(mockPrisma.booking.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        totalPrice: 50,
      }),
    }));
  });

  it('rejects booking when caregiver has confirmed overlap', async () => {
    mockPrisma.booking.findFirst.mockResolvedValueOnce({ id: 'existing-booking' });

    const request = new NextRequest('http://localhost/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caregiverId: 'cg-1',
        petId: 'pet-1',
        startDate: '2026-04-10T00:00:00.000Z',
        endDate: '2026-04-12T00:00:00.000Z',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toBe('Booking conflict');
  });

  it('rejects booking when caregiver has in-progress overlap', async () => {
    mockPrisma.booking.findFirst.mockResolvedValueOnce({ id: 'existing-booking', status: 'IN_PROGRESS' });

    const request = new NextRequest('http://localhost/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caregiverId: 'cg-1',
        petId: 'pet-1',
        startDate: '2026-04-10T00:00:00.000Z',
        endDate: '2026-04-12T00:00:00.000Z',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toBe('Booking conflict');
  });

  it('rejects booking completion before end date passes', async () => {
    mockVerifyToken.mockReturnValue({ userId: 'cg-1' });
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'booking-1',
      caregiverId: 'cg-1',
      ownerId: 'owner-1',
      status: 'CONFIRMED',
      startDate: new Date('2026-04-10T00:00:00Z'),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      totalPrice: 100,
      caregiver: { caregiverProfile: { dailyRate: 50 } },
      pet: { name: 'Buddy' },
    });

    const request = new NextRequest('http://localhost/api/booking', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: 'booking-1', status: 'COMPLETED' }),
    });

    const response = await PATCH(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Booking cannot be completed yet');
  });
});