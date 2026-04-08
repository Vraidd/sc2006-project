import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminRefunds from './page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

jest.mock('../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../../components/Pagination', () => ({
  __esModule: true,
  default: ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button type="button" onClick={() => onPageChange(currentPage + 1)}>
          Next Page
        </button>
      )}
    </div>
  ),
}));

describe('AdminRefunds page', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url === '/api/admin/refunds' && (!init || init.method === undefined)) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            requests: [
              {
                id: 'refund-1',
                incidentId: 'incident-1',
                bookingId: 'booking-1',
                owner: 'owner@example.com',
                ownerName: 'Owner One',
                caretaker: 'Caregiver One',
                amount: 42.5,
                reason: 'Needs refund',
                status: 'Pending',
                datetime: '2026-04-01T00:00:00.000Z',
                transactionId: 'pay-1',
              },
              {
                id: 'refund-2',
                incidentId: 'incident-2',
                bookingId: 'booking-2',
                owner: 'other@example.com',
                ownerName: 'Owner Two',
                caretaker: 'Caregiver Two',
                amount: 18,
                reason: 'Second refund request',
                status: 'Rejected',
                datetime: '2026-04-02T00:00:00.000Z',
                transactionId: 'pay-2',
              },
              {
                id: 'refund-3',
                incidentId: 'incident-3',
                bookingId: 'booking-3',
                owner: 'third@example.com',
                ownerName: 'Owner Three',
                caretaker: 'Caregiver Three',
                amount: 12,
                reason: 'Third refund request',
                status: 'Pending',
                datetime: '2026-04-03T00:00:00.000Z',
                transactionId: 'pay-3',
              },
              {
                id: 'refund-4',
                incidentId: 'incident-4',
                bookingId: 'booking-4',
                owner: 'fourth@example.com',
                ownerName: 'Owner Four',
                caretaker: 'Caregiver Four',
                amount: 15,
                reason: 'Fourth refund request',
                status: 'Approved',
                datetime: '2026-04-04T00:00:00.000Z',
                transactionId: 'pay-4',
              },
              {
                id: 'refund-5',
                incidentId: 'incident-5',
                bookingId: 'booking-5',
                owner: 'fifth@example.com',
                ownerName: 'Owner Five',
                caretaker: 'Caregiver Five',
                amount: 22,
                reason: 'Fifth refund request',
                status: 'Rejected',
                datetime: '2026-04-05T00:00:00.000Z',
                transactionId: 'pay-5',
              },
              {
                id: 'refund-6',
                incidentId: 'incident-6',
                bookingId: 'booking-6',
                owner: 'sixth@example.com',
                ownerName: 'Owner Six',
                caretaker: 'Caregiver Six',
                amount: 30,
                reason: 'Sixth refund request',
                status: 'Pending',
                datetime: '2026-04-06T00:00:00.000Z',
                transactionId: 'pay-6',
              },
            ],
            stats: {
              pendingCount: 3,
              approvedCount: 1,
              rejectedCount: 2,
              totalPendingAmount: 84.5,
            },
          }),
        } as Response);
      }

      if (url === '/api/admin/refunds' && init?.method === 'PATCH') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      } as Response);
    });

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('opens the dismiss confirmation modal for a pending request', async () => {
    render(<AdminRefunds />);

    await waitFor(() => expect(screen.getByText('refund-1')).toBeInTheDocument());

    await userEvent.click(screen.getAllByRole('button', { name: /dismiss/i })[0]);

    expect(screen.getByText('Dismiss Refund Request')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to dismiss this refund request from/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm dismiss/i })).toBeInTheDocument();
  });

  it('filters refund requests by search text', async () => {
    render(<AdminRefunds />);

    await waitFor(() => expect(screen.getByText('refund-1')).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/search id, booking, owner or caretaker/i), 'booking-2');

    expect(screen.queryByText('refund-1')).not.toBeInTheDocument();
    expect(screen.getByText('refund-2')).toBeInTheDocument();
  });

  it('paginates refund requests across pages', async () => {
    render(<AdminRefunds />);

    await waitFor(() => expect(screen.getByText('refund-1')).toBeInTheDocument());

    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1 of 2');
    await userEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 2 of 2');
    expect(screen.queryByText('refund-1')).not.toBeInTheDocument();
    expect(screen.getByText('refund-6')).toBeInTheDocument();
  });
});