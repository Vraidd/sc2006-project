/** @jest-environment node */

import { POST } from './route';
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
    chat: { findUnique: jest.fn() },
    booking: { findFirst: jest.fn() },
    incident: { create: jest.fn() },
  },
}));

const mockPrisma = jest.requireMock('@/app/lib/prisma').prisma as {
  chat: { findUnique: jest.Mock };
  booking: { findFirst: jest.Mock };
  incident: { create: jest.Mock };
};

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomUUID: () => 'uuid-1',
}));

describe('chat report route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    mockCookies.mockResolvedValue({ get: () => ({ value: 'token' }) });
    mockVerifyToken.mockReturnValue({ userId: 'owner-1' });
    mockPrisma.chat.findUnique.mockResolvedValue({ id: 'chat-1', ownerId: 'owner-1', caregiverId: 'caregiver-1' });
    mockPrisma.booking.findFirst.mockResolvedValue({ id: 'booking-1' });
    mockPrisma.incident.create.mockResolvedValue({ id: 'incident-1', status: 'PENDING', createdAt: new Date() });
  });

  it('creates incident from multipart report with attachment', async () => {
    const formData = new FormData();
    formData.append('chatId', 'chat-1');
    formData.append('description', 'This is a valid report description');
    formData.append('attachment', new File(['hello'], 'evidence.png', { type: 'image/png' }));

    const request = new NextRequest('http://localhost/api/chats/report', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(mockPrisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        attachmentName: 'evidence.png',
        attachmentType: 'image/png',
      }),
    }));
  });

  it('creates incident from JSON report without attachment', async () => {
    const request = new NextRequest('http://localhost/api/chats/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: 'chat-1',
        description: 'This is a valid report description',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(mockPrisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        attachmentUrl: null,
        attachmentType: null,
        attachmentName: null,
      }),
    }));
  });

  it('rejects caregiver chat reports', async () => {
    mockVerifyToken.mockReturnValue({ userId: 'caregiver-1' });

    const request = new NextRequest('http://localhost/api/chats/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: 'chat-1',
        description: 'This is a valid report description',
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.success).toBe(true);
    expect(mockPrisma.incident.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        reporterId: 'caregiver-1',
        caregiverId: 'owner-1',
        description: expect.stringContaining('owner'),
      }),
    }));
  });

  it('rejects invalid attachment type', async () => {
    const formData = new FormData();
    formData.append('chatId', 'chat-1');
    formData.append('description', 'This is a valid report description');
    formData.append('attachment', new File(['hello'], 'evidence.txt', { type: 'text/plain' }));

    const request = new NextRequest('http://localhost/api/chats/report', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/Attachment must be an image or video file/i);
  });
});