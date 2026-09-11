import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                xs: ['0.8125rem', { lineHeight: '1.125rem' }],
                sm: ['1rem', { lineHeight: '1.375rem' }],
                base: ['1.125rem', { lineHeight: '1.75rem' }],
                lg: ['1.25rem', { lineHeight: '1.875rem' }],
                xl: ['1.375rem', { lineHeight: '1.875rem' }],
                '2xl': ['1.625rem', { lineHeight: '2.125rem' }],
                '3xl': ['2rem', { lineHeight: '2.375rem' }],
                '4xl': ['2.5rem', { lineHeight: '2.75rem' }],
                '5xl': ['3.25rem', { lineHeight: '1' }],
                '6xl': ['4rem', { lineHeight: '1' }],
            },
        },
    },

    plugins: [forms],
};
