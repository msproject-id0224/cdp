import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';

export default function GodsPurpose({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_GODS_PURPOSE_TITLE')}</h2>}
        >
            <Head title={__('RMD_GODS_PURPOSE_TITLE')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 space-y-8">
                            
                            {/* Header Section */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{__('RMD_GODS_PURPOSE_TITLE').toUpperCase()}</h3>
                                <div className="w-24 h-1 bg-indigo-500 mx-auto rounded"></div>
                            </div>

                            {/* Pembuka Section */}
                            <section className="prose dark:prose-invert max-w-none">
                                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{__('RMD_OPENING_TITLE')}</h4>
                                <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner mb-6">
                                    <p className="mb-4 leading-relaxed">
                                        {__('RMD_GODS_PURPOSE_TEXT_1')}
                                    </p>
                                    <p className="mb-4 leading-relaxed">
                                        {__('RMD_GODS_PURPOSE_TEXT_2')}
                                    </p>
                                </div>
                                
                                <p className="mb-4 leading-relaxed">
                                    {__('RMD_GODS_PURPOSE_TEXT_3')}
                                </p>
                                <p className="mb-4 leading-relaxed">
                                    {__('RMD_GODS_PURPOSE_TEXT_4')}
                                </p>
                                <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6">
                                    {__('RMD_GODS_PURPOSE_QUOTE')}
                                </blockquote>
                            </section>

                            {/* Pentingnya Tujuan Hidup Section */}
                            <section className="prose dark:prose-invert max-w-none">
                                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{__('RMD_IMPORTANCE_TITLE')}</h4>
                                
                                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                                    <div className="flex-1">
                                        <p className="mb-4 leading-relaxed">
                                            {__('RMD_THOMAS_CARLYLE_QUOTE')}
                                        </p>
                                        <p className="mb-4 leading-relaxed">
                                            {__('RMD_IMPORTANCE_TEXT_1')}
                                        </p>
                                    </div>
                                    <div className="md:w-1/3 flex justify-center">
                                        <div className="text-9xl text-indigo-200 dark:text-indigo-900">
                                            🧭
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                                    <p className="leading-relaxed">
                                        {__('RMD_IMPORTANCE_TEXT_2')}
                                    </p>
                                </div>
                            </section>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('rmd.profile')}
                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    &laquo; {__('RMD_BACK_TO_PROFILE')}
                                </Link>
                                
                                <Link href={route('rmd.what-the-bible-says')}>
                                    <PrimaryButton>
                                        {__('RMD_NEXT_BIBLE_SAYS')} &raquo;
                                    </PrimaryButton>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
