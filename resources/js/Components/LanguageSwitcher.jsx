import { usePage, router } from '@inertiajs/react';

export default function LanguageSwitcher({ className = '' }) {
    const { locale } = usePage().props;

    const switchLanguage = (newLocale) => {
        router.post(route('language.switch', newLocale), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <button
                onClick={() => switchLanguage('id')}
                className={`text-sm font-medium transition-colors duration-150 ${
                    locale === 'id' 
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold underline decoration-2 underline-offset-4' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
                ID
            </button>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
                onClick={() => switchLanguage('en')}
                className={`text-sm font-medium transition-colors duration-150 ${
                    locale === 'en' 
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold underline decoration-2 underline-offset-4' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
                EN
            </button>
        </div>
    );
}
