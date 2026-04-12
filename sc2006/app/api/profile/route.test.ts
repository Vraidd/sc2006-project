/** @jest-environment node */

import { NextRequest } from 'next/server';

const mockVerifyToken = jest.fn();

jest.mock('@/app/lib/utils', () => ({
  verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
}));

jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    caregiverProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = jest.requireMock('@/app/lib/prisma').prisma as {
  caregiverProfile: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  user: {
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

// Import PUT after mocking dependencies
const { PUT } = require('./route');

describe('PUT /api/profile', () => {
  const userId = 'owner-with-secondary-caregiver';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    mockVerifyToken.mockReturnValue({ userId });
  });

  it('should save pet preferences for owners with caregiverProfile (secondaryRole CAREGIVER)', async () => {
    // Setup: Owner with secondary role caregiver who has a caregiverProfile
    mockPrisma.caregiverProfile.findUnique.mockResolvedValue({
      id: userId,
      name: 'Test Caregiver Owner',
      petPreferences: [],
      dogSizes: [],
      services: [],
    });

    const mockUpdateUser = {
      id: userId,
      email: 'owner@example.com',
      name: 'Test Caregiver Owner',
      phone: '1234567890',
      role: 'OWNER',
      avatar: null,
      verified: false,
      location: 'Test Location',
      biography: 'Test bio',
      latitude: 1.3521,
      longitude: 103.8198,
    };

    const mockUpdateCaregiverProfile = {
      id: userId,
      name: 'Test Caregiver Owner',
      petPreferences: ['DOG', 'CAT', 'BIRD'],
      dogSizes: ['SMALL', 'MEDIUM'],
      services: ['BOARDING', 'WALKING'],
    };

    mockPrisma.$transaction.mockImplementation(async (handler: any) => {
      const tx = {
        caregiverProfile: {
          update: mockPrisma.caregiverProfile.update,
        },
        user: {
          update: mockPrisma.user.update,
        },
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdateUser);
      mockPrisma.caregiverProfile.update.mockResolvedValue(mockUpdateCaregiverProfile);

      return handler(tx);
    });

    const url = new URL('http://localhost/api/profile');
    const request = new NextRequest(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'cookie': 'access_token=test-token' },
      body: JSON.stringify({
        name: 'Test Caregiver Owner',
        phone: '1234567890',
        biography: 'Test bio',
        location: 'Test Location',
        latitude: '1.3521',
        longitude: '103.8198',
        dailyRate: '150',
        experience: '5',
        isAcceptingRequests: true,
        selectedPets: ['DOG', 'CAT', 'BIRD'],
        selectedSizes: ['SMALL', 'MEDIUM'],
        selectedServices: ['BOARDING', 'WALKING'],
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    // Verify caregiverProfile was checked
    expect(mockPrisma.caregiverProfile.findUnique).toHaveBeenCalledWith({
      where: { id: userId },
    });

    // Verify transaction was used to update both user and caregiverProfile
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    
    // Verify pet preferences were saved
    expect(data.user.caregiverProfile.petPreferences).toEqual(['DOG', 'CAT', 'BIRD']);
    expect(data.user.caregiverProfile.dogSizes).toEqual(['SMALL', 'MEDIUM']);
    expect(data.user.caregiverProfile.services).toEqual(['BOARDING', 'WALKING']);
  });

  it('should only update user fields if no caregiverProfile exists', async () => {
    const regularOwnerId = 'regular-owner-no-caregiver';
    mockVerifyToken.mockReturnValue({ userId: regularOwnerId });

    // Mock no caregiverProfile exists
    mockPrisma.caregiverProfile.findUnique.mockResolvedValue(null);

    const mockUpdateUser = {
      id: regularOwnerId,
      email: 'owner@example.com',
      name: 'Pet Owner',
      phone: '9876543210',
      role: 'OWNER',
      avatar: null,
      verified: false,
      location: 'Owner Location',
      biography: 'I am a pet owner',
      latitude: 1.3521,
      longitude: 103.8198,
    };

    mockPrisma.user.update.mockResolvedValue(mockUpdateUser);

    const url = new URL('http://localhost/api/profile');
    const request = new NextRequest(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'cookie': 'access_token=test-token' },
      body: JSON.stringify({
        name: 'Pet Owner',
        phone: '9876543210',
        biography: 'I am a pet owner',
        location: 'Owner Location',
        latitude: '1.3521',
        longitude: '103.8198',
        selectedPets: ['DOG'], // This should be ignored since no caregiverProfile
      }),
    });

    const response = await PUT(request);
    const data = await response.json();

    // Verify caregiverProfile was checked
    expect(mockPrisma.caregiverProfile.findUnique).toHaveBeenCalledWith({
      where: { id: regularOwnerId },
    });

    // Verify only user was updated, not caregiverProfile
    expect(mockPrisma.user.update).toHaveBeenCalled();
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    expect(data.user.caregiverProfile).toBeUndefined();
  });
});
