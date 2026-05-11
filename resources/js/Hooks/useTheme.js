import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.add('light');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (specificTheme) => {
        if (typeof specificTheme === 'string' && (specificTheme === 'light' || specificTheme === 'dark')) {
            setTheme(specificTheme);
        } else {
            setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        }
    };

    return { theme, toggleTheme };
}
