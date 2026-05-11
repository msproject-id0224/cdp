import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfilePhoto from './ProfilePhoto';
import React from 'react';

describe('ProfilePhoto Component', () => {
    it('renders the image when src is valid', () => {
        render(<ProfilePhoto src="valid-image.jpg" alt="Test User" className="w-10 h-10" />);
        const img = screen.getByRole('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'valid-image.jpg');
        expect(img).toHaveAttribute('alt', 'Test User');
    });

    it('renders the fallback when onError is triggered', () => {
        render(<ProfilePhoto src="invalid-image.jpg" alt="Test User" className="w-10 h-10" />);
        const img = screen.getByRole('img');
        fireEvent.error(img);
        
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('renders the fallback immediately if src is missing', () => {
        render(<ProfilePhoto src={null} alt="Test User" className="w-10 h-10" />);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('uses custom fallback content if provided', () => {
        const customFallback = <span data-testid="custom-fallback">Custom</span>;
        render(<ProfilePhoto src={null} alt="Test User" fallback={customFallback} />);
        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });
});
