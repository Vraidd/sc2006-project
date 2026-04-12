import React from 'react';
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchCaregivers from './page';

jest.mock('next/dynamic', () => () => () => <div data-testid="map-component" />);
jest.mock('../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../../components/CaretakerCard', () => ({ name, rating }: { name: string; rating: number }) => (
  <div data-testid="caretaker-card">{name} - {rating}</div>
));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/hooks/useUsers', () => ({
  useUsers: jest.fn(),
}));

const mockUseAuth = jest.requireMock('@/hooks/useAuth').useAuth as jest.Mock;
const mockUseUsers = jest.requireMock('@/hooks/useUsers').useUsers as jest.Mock;

describe('SearchCaregivers page', () => {
  const fetchCaregivers = jest.fn();
  const oneMapFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({ user: { id: 'owner-1' }, loading: false });
    mockUseUsers.mockReturnValue({ fetchCaregivers });
    fetchCaregivers.mockResolvedValue([
      { id: 'cg-1', name: 'Alpha Caregiver', location: 'A', dailyRate: 10, verified: true, rating: 3.5, reviews: 2, experience: 1, imageUrl: null, petsHandled: ['DOG'], locationCoords: [1.3, 103.8] },
      { id: 'cg-2', name: 'Bravo Caregiver', location: 'B', dailyRate: 12, verified: true, rating: 4.9, reviews: 10, experience: 3, imageUrl: null, petsHandled: ['DOG'], locationCoords: [1.31, 103.81] },
      { id: 'cg-3', name: 'Charlie Caregiver', location: 'C', dailyRate: 11, verified: true, rating: 4.2, reviews: 8, experience: 4, imageUrl: null, petsHandled: ['DOG'], locationCoords: [1.32, 103.82] },
      { id: 'cg-4', name: 'Delta Caregiver', location: 'D', dailyRate: 9, verified: true, rating: 4.7, reviews: 5, experience: 2, imageUrl: null, petsHandled: ['DOG'], locationCoords: [1.33, 103.83] },
      { id: 'cg-5', name: 'Echo Caregiver', location: 'E', dailyRate: 8, verified: true, rating: 2.1, reviews: 1, experience: 1, imageUrl: null, petsHandled: ['DOG'], locationCoords: [1.3692, 103.8455] },
      { id: 'cg-6', name: 'Foxtrot Caregiver', location: 'F', dailyRate: 15, verified: true, rating: 1.8, reviews: 1, experience: 2, imageUrl: null, petsHandled: ['DOG'] },
    ]);

    oneMapFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.startsWith('/api/onemap/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ options: [{ label: 'Ang Mo Kio Ave 6', value: '560123', lat: 1.3691, lng: 103.8454 }] }),
        } as Response);
      }

      return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
    });

    global.fetch = oneMapFetch as unknown as typeof fetch;
  });

  it('shows top 3 caregivers in descending rating order', async () => {
    render(<SearchCaregivers />);

    await waitFor(() => expect(fetchCaregivers).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const input = screen.getByPlaceholderText(/search by location, postal code, or caretaker name/i);
    await userEvent.click(input);

    const heading = screen.getByText('Top Caretakers');
    const section = heading.parentElement as HTMLElement;
    const items = within(section).getAllByText(/^(Bravo|Delta|Charlie) Caregiver$/);

    expect(items[0]).toHaveTextContent('Bravo Caregiver');
    expect(items[1]).toHaveTextContent('Delta Caregiver');
    expect(items[2]).toHaveTextContent('Charlie Caregiver');
  });

  it('fetches OneMap suggestions after debounce and shows result', async () => {
    render(<SearchCaregivers />);

    await waitFor(() => expect(fetchCaregivers).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const input = screen.getByPlaceholderText(/search by location, postal code, or caretaker name/i);
    await userEvent.type(input, 'Ang Mo Kio');

    expect(await screen.findByText('Ang Mo Kio Ave 6')).toBeInTheDocument();
    expect(oneMapFetch).toHaveBeenCalledWith('/api/onemap/search?q=Ang%20Mo%20Kio');

    await userEvent.click(screen.getByText('Ang Mo Kio Ave 6'));

    expect(screen.getByDisplayValue('Ang Mo Kio Ave 6')).toBeInTheDocument();
    expect(screen.getByText('2 Caretakers available')).toBeInTheDocument();
  });
});