import { Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} {__('Child Development Program')}. {__('All rights reserved.')}
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                            {__('Home')}
                        </Link>
                        {/* Add more footer links here as needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
