/** @jest-environment node */

import { POST } from './route';

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
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    caregiverProfile: {
      upsert: jest.fn(),
    },
    notification: {
      createMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = jest.requireMock('@/app/lib/prisma').prisma as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
    findMany: jest.Mock;
  };
  caregiverProfile: {
    upsert: jest.Mock;
  };
  notification: {
    createMany: jest.Mock;
    create: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('caregiver apply route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';

    mockCookies.mockResolvedValue({
      get: () => ({ value: 'token' }),
    });

    mockVerifyToken.mockReturnValue({ userId: 'owner-1' });

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'owner-1',
      name: 'Owner One',
      role: 'OWNER',
    });

    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);

    mockPrisma.$transaction.mockImplementation(async (handler: any) => {
      const tx = {
        caregiverProfile: {
          upsert: mockPrisma.caregiverProfile.upsert,
        },
        user: {
          update: mockPrisma.user.update,
          findMany: mockPrisma.user.findMany,
        },
        notification: {
          createMany: mockPrisma.notification.createMany,
          create: mockPrisma.notification.create,
        },
      };

      mockPrisma.caregiverProfile.upsert.mockResolvedValue({
        id: 'owner-1',
      });

      mockPrisma.user.update.mockResolvedValue({ id: 'owner-1' });
      mockPrisma.notification.createMany.mockResolvedValue({ count: 1 });
      mockPrisma.notification.create.mockResolvedValue({ id: 'notif-1' });

      return handler(tx);
    });
  });

  it('saves owner application fields into caregiver profile row for the same user', async () => {
    const request = new Request('http://localhost/api/caregivers/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dailyRate: 65,
        biography: 'I have 3 years of experience.',
        location: 'Central',
        experienceYears: 3,
        petPreferences: ['DOG', 'CAT'],
        verificationDocs: [
          {
            name: 'id-card.png',
            content: 'data:image/png;base64,aGVsbG8=',
          },
        ],
        availability: [
          {
            startDate: '2026-04-10T00:00:00.000Z',
            endDate: '2026-04-20T00:00:00.000Z',
          },
        ],
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);

    expect(mockPrisma.caregiverProfile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'owner-1' },
        create: expect.objectContaining({
          id: 'owner-1',
          dailyRate: 65,
          biography: 'I have 3 years of experience.',
          location: 'Central',
          experienceYears: 3,
          petPreferences: ['DOG', 'CAT'],
          availabilityStartDate: new Date('2026-04-10T00:00:00.000Z'),
          availabilityEndDate: new Date('2026-04-20T00:00:00.000Z'),
        }),
        update: expect.objectContaining({
          dailyRate: 65,
          biography: 'I have 3 years of experience.',
          location: 'Central',
          experienceYears: 3,
          petPreferences: ['DOG', 'CAT'],
          availabilityStartDate: new Date('2026-04-10T00:00:00.000Z'),
          availabilityEndDate: new Date('2026-04-20T00:00:00.000Z'),
        }),
      })
    );

    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'owner-1' },
        data: expect.objectContaining({
          secondaryRole: 'CAREGIVER',
          biography: 'I have 3 years of experience.',
          location: 'Central',
        }),
      })
    );
  });
});
