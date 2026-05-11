import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminNotificationComponent from '../AdminNotification';

// Mock window.axios
window.axios = {
    get: vi.fn(),
    patch: vi.fn(),
};

// Mock route helper
global.route = vi.fn((name) => {
    if (name === 'api.admin.schedule-messages.unread') {
        return '/api/admin/schedule-messages/unread';
    }
    if (name === 'api.admin.profile-photos.pending') {
        return '/api/admin/profile-photos/pending';
    }
    return '/mock-route';
});

// Mock Inertia router
vi.mock('@inertiajs/react', () => ({
    router: {
        visit: vi.fn(),
    },
}));

// Mock Echo
window.Echo = {
    private: vi.fn(() => ({
        listen: vi.fn(),
    })),
    leave: vi.fn(),
};

describe('AdminNotificationComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.axios.get.mockResolvedValue({ data: [] });
    });

    it('fetches unread messages AND pending photo requests on mount (fix)', async () => {
        // Setup mock for messages
        window.axios.get.mockImplementation((url) => {
            if (url === '/api/admin/schedule-messages/unread') {
                return Promise.resolve({ data: [{ id: 1, content: 'Message 1' }] });
            }
            if (url === '/api/admin/profile-photos/pending') {
                return Promise.resolve({ data: [{ id: 101, status: 'pending' }] });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<AdminNotificationComponent />);

        // Verify axios call for messages
        await waitFor(() => {
            expect(window.axios.get).toHaveBeenCalledWith('/api/admin/schedule-messages/unread');
            expect(window.axios.get).toHaveBeenCalledWith('/api/admin/profile-photos/pending');
        });

        // Count should reflect messages (1) + photo requests (1) = 2
        const badge = await screen.findByText('2');
        expect(badge).toBeInTheDocument();
    });
});
