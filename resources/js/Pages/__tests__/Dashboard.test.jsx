import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from '../Dashboard';

// Mock dependencies
vi.mock('@inertiajs/react', () => ({
    Head: ({ title }) => <div data-testid="head">{title}</div>,
    Link: ({ children }) => <a>{children}</a>,
    usePage: () => ({
        props: {
            auth: {
                user: { name: 'Test User' }
            }
        }
    })
}));

vi.mock('@/Layouts/AuthenticatedLayout', () => ({
    default: ({ children, header }) => (
        <div data-testid="layout">
            <div data-testid="header">{header}</div>
            {children}
        </div>
    ),
}));

vi.mock('@/Components/MentorScheduleTable', () => ({
    default: () => <div data-testid="mentor-schedule-table">Schedule Table</div>,
}));

vi.mock('@/Components/Dashboard/ScheduleTab', () => ({
    default: () => <div data-testid="schedule-tab">Schedule Tab</div>,
}));

vi.mock('@/Components/Dashboard/PhotoRequestsTab', () => ({
    default: () => <div data-testid="photo-requests-tab">Photo Requests Tab</div>,
}));

vi.mock('@/Utils/lang', () => ({
    __: (key) => key,
}));

describe('Dashboard Component', () => {
    const validUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        profile_photo_url: null,
        profile_photo_status: 'active',
    };

    it('renders correctly with valid admin user', () => {
        render(<Dashboard auth={{ user: validUser }} schedules={[]} photoRequests={[]} />);
        
        expect(screen.getByTestId('layout')).toBeInTheDocument();
        expect(screen.getByText('Admin User')).toBeInTheDocument();
        // Check for Admin specific tabs
        expect(screen.getByText('Overview')).toBeInTheDocument();
    });

    it('handles user with missing name (uses fallback)', () => {
        const userWithoutName = {
            ...validUser,
            name: null,
            first_name: null,
        };
        
        render(<Dashboard auth={{ user: userWithoutName }} schedules={[]} photoRequests={[]} />);
        
        expect(screen.getByText('User')).toBeInTheDocument(); // Default fallback
    });

    it('handles user with missing role (defaults to participant)', () => {
        const userWithoutRole = {
            ...validUser,
            role: null, // This caused charAt error before fix
        };
        
        render(<Dashboard auth={{ user: userWithoutRole }} schedules={[]} photoRequests={[]} />);
        
        // Should not crash and should show User
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('handles user with non-string role (converts to string)', () => {
        const userWithObjRole = {
            ...validUser,
            role: 123, // This caused charAt error before fix
        };
        
        render(<Dashboard auth={{ user: userWithObjRole }} schedules={[]} photoRequests={[]} />);
        
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('returns null if auth.user is missing', () => {
        const { container } = render(<Dashboard auth={{ user: null }} schedules={[]} photoRequests={[]} />);
        
        expect(container).toBeEmptyDOMElement();
    });
});
