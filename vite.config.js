import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react':       ['react', 'react-dom', '@inertiajs/react'],
                    'vendor-ui':          ['@headlessui/react', '@heroicons/react', 'react-easy-crop'],
                    'vendor-fullcalendar': [
                        '@fullcalendar/core',
                        '@fullcalendar/react',
                        '@fullcalendar/daygrid',
                        '@fullcalendar/timegrid',
                        '@fullcalendar/list',
                        '@fullcalendar/interaction',
                    ],
                    'vendor-charts':  ['chart.js', 'react-chartjs-2'],
                    'vendor-export':  ['jspdf', 'jspdf-autotable'],
                    'vendor-qr':      ['html5-qrcode', 'qrcode.react'],
                    'vendor-realtime': ['laravel-echo', 'pusher-js'],
                },
            },
        },
    },
});
