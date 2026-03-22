import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '@/Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Child Development Program';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

// Keep window.translations in sync on every Inertia navigation
router.on('navigate', (event) => {
    const translations = event.detail.page.props.translations;
    if (translations) {
        window.translations = translations;
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const Page = module.default;
            Page.layout = Page.layout;
            return Page;
        }),
    setup({ el, App, props }) {
        if (props.initialPage.props.translations) {
            window.translations = props.initialPage.props.translations;
        }
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
