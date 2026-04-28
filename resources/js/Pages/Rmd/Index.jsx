import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';

export default function RmdIndex({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD (My Future Plan)')}</h2>}
        >
            <Head title="RMD" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WELCOME_TEXT_1')}
                                </p>
                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WELCOME_TEXT_2')}
                                </p>
                                <p className="mb-8 text-lg leading-relaxed">
                                    {__('RMD_WELCOME_TEXT_3')}
                                </p>
                                
                                <div className="mt-8 flex justify-center">
                                    <Link
                                        href={route('rmd.intro')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    >
                                        {__('RMD Introduction')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
