import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Transactions from './page';
import { encodePaymentRequestContent } from '../../lib/paymentRequestMessage';

jest.mock('../../components/Navbar', () => () => <div data-testid="navbar" />);
jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({ fireToast: jest.fn() }),
}));

describe('OwnerTransactions page', () => {
  const fetchMock = jest.fn();

  function mockJsonResponse(body: unknown, ok = true) {
    return Promise.resolve({
      ok,
      json: async () => body,
    } as Response);
  }

  beforeEach(() => {
    jest.clearAllMocks();

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url === '/api/auth/me') {
        return mockJsonResponse({ user: { id: 'owner-1', role: 'OWNER' } });
      }

      if (url === '/api/payment') {
        return mockJsonResponse({
          transactions: [
            {
              id: 'payment-1',
              bookingId: 'booking-1',
              caregiverId: 'caregiver-1',
              date: '2026-04-08T10:00:00.000Z',
              pet: 'Buddy',
              caretaker: 'Sarah Johnson',
              amount: 250,
              fee: 12.5,
              total: 262.5,
              status: 'Pending',
            },
          ],
        });
      }

      if (url === '/api/chats?ownerId=owner-1&caregiverId=caregiver-1') {
        return mockJsonResponse({ chatId: 'chat-1', isNew: false });
      }

      if (url === '/api/messages?chatId=chat-1') {
        return mockJsonResponse({
          messages: [
            {
              id: 'message-1',
              content: encodePaymentRequestContent({
                bookingId: 'booking-1',
                petName: 'Buddy',
                amount: 250,
                status: 'PAID',
              }),
            },
          ],
        });
      }

      return mockJsonResponse({});
    });

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('marks a pending transaction as paid when the linked payment message is already completed', async () => {
    render(<Transactions />);

    await waitFor(() => expect(screen.getByText('Paid')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /^pay$/i })).not.toBeInTheDocument();
  });
});
