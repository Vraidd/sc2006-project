import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditCaregiverProfile from './page';

jest.mock('../../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ fireToast: jest.fn() }),
}));
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

describe('EditCaregiverProfile - Pet Preferences', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        id: 'caregiver-1',
        email: 'caregiver@example.com',
        name: 'Sarah Johnson',
        phone: '1234567890',
        location: 'Singapore',
        latitude: '1.3521',
        longitude: '103.8198',
        biography: 'Experienced pet care professional',
        avatar: null,
        caregiverProfile: {
          dailyRate: 50,
          experienceYears: 5,
          isAcceptingRequests: true,
          verified: true,
          petPreferences: ['DOG', 'CAT'],
          dogSizes: ['SMALL', 'MEDIUM'],
          services: ['BOARDING', 'WALKING', 'BATHING'],
        },
      },
      loading: false,
    });

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url === '/api/onemap/search?q=Singapore') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            options: [
              {
                label: 'Singapore',
                value: 'Singapore',
                lat: 1.3521,
                lng: 103.8198,
              },
            ],
          }),
        } as Response);
      }

      if (url === '/api/profile' && fetchMock.mock.calls.some(call => String(call[0]) === '/api/profile')) {
        const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
        const options = lastCall[1] as RequestInit;
        
        if (options.method === 'PUT') {
          const body = JSON.parse(options.body as string);
          return Promise.resolve({
            ok: true,
            json: async () => ({
              user: {
                id: 'caregiver-1',
                email: 'caregiver@example.com',
                name: body.name,
                phone: body.phone,
                location: body.location,
                latitude: body.latitude,
                longitude: body.longitude,
                biography: body.biography,
                avatar: null,
                caregiverProfile: {
                  dailyRate: body.dailyRate,
                  experienceYears: body.experience,
                  isAcceptingRequests: body.isAcceptingRequests,
                  verified: true,
                  petPreferences: body.selectedPets || [],
                  dogSizes: body.selectedSizes || [],
                  services: body.selectedServices || [],
                },
              },
            }),
          } as Response);
        }
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    });

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('saves pet preferences to the caregiver profile', async () => {
    const user = userEvent.setup();
    render(<EditCaregiverProfile />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Sarah Johnson')).toBeInTheDocument();
    });

    // Verify initial pet preferences are loaded
    const dogCheckbox = screen.getByRole('checkbox', { name: /Dogs/i });
    const catCheckbox = screen.getByRole('checkbox', { name: /Cats/i });
    expect(dogCheckbox).toBeChecked();
    expect(catCheckbox).toBeChecked();

    // Uncheck Dogs to change the selection
    await user.click(dogCheckbox);

    // Add Birds (which wasn't previously selected)
    const birdCheckbox = screen.getByRole('checkbox', { name: /Birds/i });
    await user.click(birdCheckbox);

    // Save the profile
    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(saveButton);

    // Wait for the save to complete
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/profile',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"selectedPets":["CAT","BIRD"]'),
        })
      );
    });

    // Verify the updated preferences are reflected in the state
    // After save, the checkboxes should reflect the newly saved state
    const dogCheckboxAfterSave = screen.getByRole('checkbox', { name: /Dogs/i });
    const catCheckboxAfterSave = screen.getByRole('checkbox', { name: /Cats/i });
    const birdCheckboxAfterSave = screen.getByRole('checkbox', { name: /Birds/i });

    expect(dogCheckboxAfterSave).not.toBeChecked();
    expect(catCheckboxAfterSave).toBeChecked();
    expect(birdCheckboxAfterSave).toBeChecked();
  });
});
