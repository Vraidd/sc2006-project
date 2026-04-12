import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CaretakerProfile from './page';

jest.mock('../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = jest.requireMock('@/hooks/useAuth').useAuth as jest.Mock;

describe('CaretakerProfile - Pet Preferences Display', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        id: 'caregiver-1',
        email: 'caregiver@example.com',
        name: 'Sarah Johnson',
        location: 'Singapore',
        biography: 'Experienced pet care professional',
        avatar: null,
        caregiverProfile: {
          dailyRate: 50,
          experienceYears: 5,
          isAcceptingRequests: true,
          verified: true,
          // Pet preferences stored as enum values from database
          petPreferences: ['DOG', 'CAT', 'BIRD'],
          dogSizes: ['SMALL', 'MEDIUM'],
          services: ['BOARDING', 'WALKING'],
        },
      },
      loading: false,
    });

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes('/api/reviews')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            reviews: [
              {
                id: 'review-1',
                rating: 5,
                comment: 'Great service!',
                createdAt: '2026-04-01T00:00:00Z',
                fromUser: { id: 'user-1', name: 'James Tan' },
              },
            ],
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    });

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('displays pet preferences from the database with correct icons and labels', async () => {
    render(<CaretakerProfile />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    // Verify pet preferences are displayed with correct labels
    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('Cats')).toBeInTheDocument();
    expect(screen.getByText('Birds')).toBeInTheDocument();

    // Ensure incorrect labels are not displayed
    expect(screen.queryByText('Reptiles')).not.toBeInTheDocument();
    expect(screen.queryByText('Fish')).not.toBeInTheDocument();
  });

  it('displays all database service types correctly', async () => {
    render(<CaretakerProfile />);

    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });

    // Click on Services tab
    const servicesTab = screen.getByRole('button', { name: /Services/i });
    servicesTab.click();

    await waitFor(() => {
      // Verify services from database are displayed
      expect(screen.getByText('Pet Boarding')).toBeInTheDocument();
      expect(screen.getByText('Dog Walking')).toBeInTheDocument();
      
      // Verify non-selected services are not displayed
      expect(screen.queryByText('Bathing & Brushing')).not.toBeInTheDocument();
    });
  });

  it('handles empty pet preferences gracefully', async () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 'caregiver-2',
        email: 'caregiver2@example.com',
        name: 'Jane Doe',
        location: 'Singapore',
        biography: 'No pets specialization yet',
        avatar: null,
        caregiverProfile: {
          dailyRate: 30,
          experienceYears: 1,
          isAcceptingRequests: true,
          verified: false,
          petPreferences: [],
          dogSizes: [],
          services: [],
        },
      },
      loading: false,
    });

    render(<CaretakerProfile />);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    // Should not display any pet badges
    const petBadges = document.querySelectorAll('[class*="bg-white/10"]');
    // Filter to only pet preference badges (they contain icons)
    const petPreferenceBadges = Array.from(petBadges).filter(el => 
      el.textContent && (el.textContent.includes('Dog') || el.textContent.includes('Cat'))
    );
    expect(petPreferenceBadges.length).toBe(0);
  });
});
