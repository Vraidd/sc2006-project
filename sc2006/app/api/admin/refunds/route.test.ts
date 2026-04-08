/** @jest-environment node */

import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';

const mockCookies = jest.fn();
const mockVerifyToken = jest.fn();

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}));

jest.mock('@/app/lib/utils', () => ({
  verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    incident: { findMany: jest.fn(), findUnique: jest.fn() },
    payment: { update: jest.fn() },
    notification: { create: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = jest.requireMock('@/app/lib/prisma').prisma as {
  user: { findUnique: jest.Mock };
  incident: { findMany: jest.Mock; findUnique: jest.Mock };
  payment: { update: jest.Mock };
  notification: { create: jest.Mock };
  $transaction: jest.Mock;
};

describe('admin refunds route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    mockCookies.mockResolvedValue({ get: () => ({ value: 'token' }) });
    mockVerifyToken.mockReturnValue({ userId: 'admin-1' });
    mockPrisma.user.findUnique.mockResolvedValue({ role: 'ADMIN' });
  });

  it('returns refund incidents and db stats', async () => {
    mockPrisma.incident.findMany.mockResolvedValue([
      {
        id: 'inc-1',
        bookingId: 'book-1',
        description: 'refund 1',
        status: 'PENDING',
        createdAt: new Date('2026-04-01T00:00:00Z'),
        booking: {
          totalPrice: 100,
          owner: { name: 'Owner 1', email: 'owner1@example.com' },
          caregiver: { name: 'Caregiver 1' },
          payment: { id: 'pay-1', amount: 100 },
        },
      },
      {
        id: 'inc-2',
        bookingId: 'book-2',
        description: 'refund 2',
        status: 'RESOLVED',
        createdAt: new Date('2026-04-02T00:00:00Z'),
        booking: {
          totalPrice: 50,
          owner: { name: 'Owner 2', email: 'owner2@example.com' },
          caregiver: { name: 'Caregiver 2' },
          payment: { id: 'pay-2', amount: 50 },
        },
      },
    ]);

    const request = new NextRequest('http://localhost/api/admin/refunds');
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.requests).toHaveLength(2);
    expect(payload.stats).toEqual({
      pendingCount: 1,
      approvedCount: 1,
      rejectedCount: 0,
      totalPendingAmount: 100,
    });
  });

  it('returns refund incidents even when the booking has no payment record', async () => {
    mockPrisma.incident.findMany.mockResolvedValue([
      {
        id: 'inc-1',
        bookingId: 'book-1',
        description: 'refund without payment',
        status: 'PENDING',
        createdAt: new Date('2026-04-01T00:00:00Z'),
        booking: {
          totalPrice: 80,
          owner: { name: 'Owner 1', email: 'owner1@example.com' },
          caregiver: { name: 'Caregiver 1' },
          payment: null,
        },
      },
    ]);

    const request = new NextRequest('http://localhost/api/admin/refunds');
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.requests).toHaveLength(1);
    expect(payload.requests[0].transactionId).toBeNull();
  });

  it('dismisses refund without requiring payment', async () => {
    const incident = {
      id: 'inc-1',
      bookingId: 'book-1',
      type: 'REFUND',
      booking: {
        totalPrice: 80,
        ownerId: 'owner-1',
        owner: { name: 'Owner 1' },
        caregiver: { name: 'Caregiver 1' },
        payment: null,
      },
    };

    mockPrisma.incident.findUnique.mockResolvedValue(incident);
    mockPrisma.$transaction.mockImplementation(async (handler) => {
      const tx = {
        incident: { update: jest.fn().mockResolvedValue({ ...incident, status: 'DISMISSED', createdAt: new Date() }) },
        payment: { update: jest.fn() },
        notification: { create: jest.fn() },
      };
      return handler(tx);
    });

    const request = new NextRequest('http://localhost/api/admin/refunds', {
      method: 'PATCH',
      body: JSON.stringify({ incidentId: 'inc-1', action: 'reject' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PATCH(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(mockPrisma.payment.update).not.toHaveBeenCalled();
  });

  it('rejects refund without requiring payment record update', async () => {
    const incident = {
      id: 'inc-1',
      bookingId: 'book-1',
      type: 'REFUND',
      booking: {
        totalPrice: 80,
        ownerId: 'owner-1',
        owner: { name: 'Owner 1' },
        caregiver: { name: 'Caregiver 1' },
        payment: null,
      },
    };

    mockPrisma.incident.findUnique.mockResolvedValue(incident);
    const txPaymentUpdate = jest.fn();
    mockPrisma.$transaction.mockImplementation(async (handler) => {
      const tx = {
        incident: { update: jest.fn().mockResolvedValue({ ...incident, status: 'DISMISSED', createdAt: new Date() }) },
        payment: { update: txPaymentUpdate },
        notification: { create: jest.fn() },
      };
      return handler(tx);
    });

    const request = new NextRequest('http://localhost/api/admin/refunds', {
      method: 'PATCH',
      body: JSON.stringify({ incidentId: 'inc-1', action: 'reject' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PATCH(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(txPaymentUpdate).not.toHaveBeenCalled();
  });

  it('approves refund with payment and updates payment status', async () => {
    const incident = {
      id: 'inc-1',
      bookingId: 'book-1',
      type: 'REFUND',
      booking: {
        totalPrice: 80,
        ownerId: 'owner-1',
        owner: { name: 'Owner 1' },
        caregiver: { name: 'Caregiver 1' },
        payment: { id: 'pay-1', amount: 80, status: 'COMPLETED' },
      },
    };

    mockPrisma.incident.findUnique.mockResolvedValue(incident);
    const paymentUpdate = jest.fn().mockResolvedValue({});
    const notificationCreate = jest.fn().mockResolvedValue({});
    mockPrisma.$transaction.mockImplementation(async (handler) => {
      const tx = {
        incident: { update: jest.fn().mockResolvedValue({ ...incident, status: 'RESOLVED', createdAt: new Date() }) },
        payment: { update: paymentUpdate },
        notification: { create: notificationCreate },
      };
      return handler(tx);
    });

    const request = new NextRequest('http://localhost/api/admin/refunds', {
      method: 'PATCH',
      body: JSON.stringify({ incidentId: 'inc-1', action: 'approve' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PATCH(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.request.status).toBe('Approved');
    expect(paymentUpdate).toHaveBeenCalled();
    expect(notificationCreate).toHaveBeenCalled();
    expect(notificationCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        userId: 'owner-1',
        type: 'PAYMENT_REFUNDED',
        title: 'Refund approved',
        data: expect.objectContaining({
          bookingId: 'book-1',
          incidentId: 'inc-1',
          amount: 80,
        }),
      }),
    }));
  });

  it('rejects approval without payment record', async () => {
    const incident = {
      id: 'inc-1',
      bookingId: 'book-1',
      type: 'REFUND',
      booking: {
        totalPrice: 80,
        ownerId: 'owner-1',
        owner: { name: 'Owner 1' },
        caregiver: { name: 'Caregiver 1' },
        payment: null,
      },
    };

    mockPrisma.incident.findUnique.mockResolvedValue(incident);

    const request = new NextRequest('http://localhost/api/admin/refunds', {
      method: 'PATCH',
      body: JSON.stringify({ incidentId: 'inc-1', action: 'approve' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PATCH(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/No payment record/i);
  });
});