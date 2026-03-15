import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from '@/Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Child Development Program';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => {
            const Page = module.default;
            const WrappedPage = (props) => {
                if (props.translations) {
                    window.translations = props.translations;
                }
                return <Page {...props} />;
            };
            WrappedPage.layout = Page.layout;
            return WrappedPage;
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
