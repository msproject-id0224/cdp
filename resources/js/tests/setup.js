import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Ziggy route function
global.route = vi.fn((name, params) => {
    return `http://localhost/${name}${params ? '?' + new URLSearchParams(params).toString() : ''}`;
});
