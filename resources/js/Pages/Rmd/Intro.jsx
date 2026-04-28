import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';

export default function RmdIntro({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_INTRO_TITLE')}</h2>}
        >
            <Head title={__('RMD_INTRO_TITLE')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-2xl font-bold mb-6 text-center">{__('WHAT IS MY FUTURE PLAN BOOK')}</h3>
                                
                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WHAT_IS_TEXT_1')}
                                </p>
                                
                                <div className="my-6 pl-4 border-l-4 border-blue-500 italic text-gray-700 dark:text-gray-300">
                                    <p className="font-semibold">{__('RMD_WHAT_IS_QUOTE_TITLE')}</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>{__('RMD_WHAT_IS_LIST_1')}</li>
                                        <li>{__('RMD_WHAT_IS_LIST_2')}</li>
                                        <li>{__('RMD_WHAT_IS_LIST_3')}</li>
                                        <li>{__('RMD_WHAT_IS_LIST_4')}</li>
                                    </ul>
                                </div>

                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WHAT_IS_TEXT_2')}
                                </p>

                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WHAT_IS_TEXT_3')}
                                </p>

                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WHAT_IS_TEXT_4')}
                                </p>

                                <p className="mb-4 text-lg leading-relaxed">
                                    {__('RMD_WHAT_IS_TEXT_5')}
                                </p>

                                <p className="mb-8 text-lg leading-relaxed font-medium">
                                    {__('RMD_WHAT_IS_TEXT_6')}
                                </p>
                                
                                <div className="mt-8 flex justify-center">
                                    <Link
                                        href={route('rmd.profile')}
                                        className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-md font-bold text-base text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    >
                                        {__('RMD_READY_BTN')}
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
