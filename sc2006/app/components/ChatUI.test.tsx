import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatUI from './ChatUI';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('../context/ToastContext', () => ({
  useToast: jest.fn(),
}));

const mockUseToast = jest.requireMock('../context/ToastContext').useToast as jest.Mock;

class MockEventSource {
  url: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  close = jest.fn();

  constructor(url: string) {
    this.url = url;
  }
}

describe('ChatUI', () => {
  const fireToast = jest.fn();
  let activeRole: 'OWNER' | 'CAREGIVER' = 'OWNER';

  beforeEach(() => {
    jest.clearAllMocks();
    activeRole = 'OWNER';
    mockUseToast.mockReturnValue({ fireToast });
    (global as any).EventSource = MockEventSource;
    Element.prototype.scrollIntoView = jest.fn();

    global.fetch = jest.fn((input: RequestInfo | URL) => {
      const url = String(input);

      if (url === '/api/auth/me') {
        return Promise.resolve({ ok: true, json: async () => ({ user: { id: 'user-1', role: activeRole, name: 'Owner One' } }) } as Response);
      }

      if (url === '/api/chats') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            conversations: [
              { id: 'chat-1', name: 'Sarah Johnson', initial: 'S', avatar: null, otherId: 'caregiver-1', lastMessage: 'Hello', date: 'Now' },
              { id: 'chat-2', name: 'Lisa Anderson', initial: 'L', avatar: null, otherId: 'caregiver-2', lastMessage: 'Hi', date: 'Yesterday' },
            ],
          }),
        } as Response);
      }

      if (url.startsWith('/api/messages?')) {
        return Promise.resolve({ ok: true, json: async () => ({ messages: [] }) } as Response);
      }

      if (url.startsWith('/api/chats/report')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) } as Response);
      }

      return Promise.resolve({ ok: true, json: async () => ({}) } as Response);
    }) as typeof fetch;
  });

  it('shows report button for owner and allows keyboard row selection', async () => {
    activeRole = 'OWNER';
    render(<ChatUI />);

    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());

    expect(screen.getByTitle('Report Sarah Johnson')).toBeInTheDocument();

    const secondRow = screen.getByText('Lisa Anderson').closest('[role="button"]') as HTMLElement;
    secondRow.focus();
    fireEvent.keyDown(secondRow, { key: 'Enter' });

    await waitFor(() => expect(secondRow.className).toContain('bg-teal-50/50'));
  });

  it('hides report button for caregiver', async () => {
    activeRole = 'CAREGIVER';
    render(<ChatUI />);

    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());

    expect(screen.queryByRole('button', { name: /^report$/i })).toBeNull();
  });

  it('rejects invalid report attachment for owner', async () => {
    activeRole = 'OWNER';
    render(<ChatUI />);

    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());

    await userEvent.click(screen.getByTitle('Report Sarah Johnson'));
    await waitFor(() => expect(screen.getByText('Report User')).toBeInTheDocument());

    const attachmentLabel = screen.getByText('Attach a photo or video').closest('label') as HTMLLabelElement;
    const fileInput = attachmentLabel.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fireToast).toHaveBeenCalledWith('danger', 'Invalid File', 'Attachment must be an image or video.');
  });

  it('blocks submitting a blank report description', async () => {
    activeRole = 'OWNER';
    render(<ChatUI />);

    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());

    await userEvent.click(screen.getByTitle('Report Sarah Johnson'));
    await waitFor(() => expect(screen.getByText('Report User')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /submit report/i }));

    expect(fireToast).toHaveBeenCalledWith('danger', 'Report Not Sent', 'Please enter at least 10 characters.');
  });

  it('submits a report with a valid attachment', async () => {
    activeRole = 'OWNER';
    render(<ChatUI />);

    await waitFor(() => expect(screen.getByText('Sarah Johnson')).toBeInTheDocument());

    await userEvent.click(screen.getByTitle('Report Sarah Johnson'));
    await waitFor(() => expect(screen.getByText('Report User')).toBeInTheDocument());

    const attachmentLabel = screen.getByText('Attach a photo or video').closest('label') as HTMLLabelElement;
    const fileInput = attachmentLabel.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['image-bytes'], 'evidence.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await userEvent.type(screen.getByPlaceholderText(/describe the issue/i), 'This report has enough detail to submit.');
    await userEvent.click(screen.getByRole('button', { name: /submit report/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/chats/report', expect.objectContaining({ method: 'POST' })));
    expect(fireToast).toHaveBeenCalledWith('success', 'Report Submitted', 'Your report was sent to admin for review.');
  });
});