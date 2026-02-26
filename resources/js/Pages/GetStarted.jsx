import { Head, Link, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Dropdown from '@/Components/Dropdown';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function GetStarted({ locale = 'ID' }) {
    return (
        <>
            <Head title={__('Get Started')} />
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: "url('/assets/img/background.webp')"}}
            >
                {/* White Overlay 40% */}
                <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>
                            

                {/* Language Dropdown */}
                <div className="absolute top-4 right-4 z-20">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none">
                                <ProfilePhoto 
                                    src="/assets/img/globe.png" 
                                    alt={__('Language')} 
                                    className="h-8 w-8 object-contain drop-shadow-md hover:scale-110 transition-transform duration-200"
                                    fallbackClassName="h-8 w-8 bg-white/50 rounded-full flex items-center justify-center text-xs"
                                    fallback="🌐"
                                />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('language.switch', 'id')} method="post" as="button">
                                {__('Bahasa')}
                            </Dropdown.Link>
                            <Dropdown.Link href={route('language.switch', 'en')} method="post" as="button">
                                {__('English')}
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                {/* Logo & Title */}
                <div className="flex flex-col items-center mb-12 relative z-10">
                    <ProfilePhoto 
                        src="/assets/img/logo-rmd.png" 
                        alt={__('Logo RMD')}
                        className="h-32 w-auto mb-6 object-contain"
                        fallbackClassName="h-32 w-32 mb-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-2xl rounded-lg shadow-lg"
                        fallback="RMD"
                    />
                    <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-sm uppercase tracking-widest relative z-10">
                        {__('Child Development Program')}
                    </h1>
                </div>

                {/* Action */}
                <div className="text-center relative z-10">
                    <div className="flex gap-4 justify-center">
                        <Link
                            href={route('login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
                        >
                            {__('Get Started')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
