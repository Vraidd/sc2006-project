import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CaregiverDashboard from './page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../components/CaregiverAvailabilityModal', () => () => null);
jest.mock('../components/WindowDialog', () => ({
  title,
  subtitle,
  description,
  buttons,
}: {
  title: string;
  subtitle: string;
  description: string;
  buttons: Array<{ label: string; onClick: () => void }>;
}) => (
  <div data-testid="window-dialog">
    <h2>{title}</h2>
    <p>{subtitle}</p>
    <p>{description}</p>
    <div>
      {buttons.map((button) => (
        <button key={button.label} onClick={button.onClick}>
          {button.label}
        </button>
      ))}
    </div>
  </div>
));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/hooks/useBooking', () => ({
  useBooking: jest.fn(),
}));
jest.mock('@/app/context/ToastContext', () => ({
  useToast: () => ({ fireToast: jest.fn() }),
}));

const mockUseAuth = jest.requireMock('@/hooks/useAuth').useAuth as jest.Mock;
const mockUseBooking = jest.requireMock('@/hooks/useBooking').useBooking as jest.Mock;

describe('CaregiverDashboard', () => {
  const fetchBooking = jest.fn();
  const updateBookingStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 'caregiver-1', name: 'Caretaker One' },
      loading: false,
    });

    mockUseBooking.mockReturnValue({
      fetchBooking,
      updateBookingStatus,
      loading: false,
      error: null,
    });

    fetchBooking.mockResolvedValue([
      {
        id: 'booking-1',
        status: 'IN_PROGRESS',
        startDate: '2026-04-01T00:00:00.000Z',
        endDate: '2026-04-03T00:00:00.000Z',
        totalPrice: 120,
        caregiver: {
          id: 'caregiver-1',
          name: 'Caretaker One',
          avatar: null,
          email: 'caregiver@example.com',
          caregiverProfile: { dailyRate: 40 },
        },
        owner: { id: 'owner-1', name: 'Owner One', avatar: null, email: 'owner@example.com' },
        pet: { id: 'pet-1', name: 'Milo', type: 'CAT', breed: null },
        payment: null,
      },
    ]);

    updateBookingStatus.mockResolvedValue({
      success: true,
      booking: { id: 'booking-1', status: 'COMPLETED' },
    });
  });

  it('allows caregiver to end an active booking', async () => {
    render(<CaregiverDashboard />);

    await waitFor(() => expect(fetchBooking).toHaveBeenCalledWith({ caregiverId: 'caregiver-1' }));
    const endBookingButton = await screen.findByRole('button', { name: /^end booking$/i });
    await userEvent.click(endBookingButton);
    expect(await screen.findByTestId('window-dialog')).toBeInTheDocument();

    await userEvent.click(within(screen.getByTestId('window-dialog')).getByRole('button', { name: /end booking/i }));

    await waitFor(() => expect(updateBookingStatus).toHaveBeenCalledWith('booking-1', 'COMPLETED'));
  });
});