import { Head, Link, router } from '@inertiajs/react'
import { __ } from '@/Utils/lang'
import Dropdown from '@/Components/Dropdown'
import ProfilePhoto from '@/Components/ProfilePhoto'
import Footer from '@/Components/Footer'

export default function GetStarted () {
    const title = __('Child Development Program')

    const switchLanguage = locale => {
        router.post(
            route('language.switch', locale),
            {},
            { preserveScroll: true }
        )
    }

    return (
        <>
            <Head title={__('Get Started')} />

            <style>{`
                @keyframes kenburns {
                    0%   { transform: scale(1)    translateX(0)    translateY(0); }
                    25%  { transform: scale(1.08) translateX(-1%)  translateY(-1%); }
                    50%  { transform: scale(1.12) translateX(1%)   translateY(-2%); }
                    75%  { transform: scale(1.08) translateX(-1%)  translateY(1%); }
                    100% { transform: scale(1)    translateX(0)    translateY(0); }
                }
                @keyframes fadeInUp {
                    0%   { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes titleGlow {
                    0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.4); }
                    50%      { text-shadow: 0 0 40px rgba(255,255,255,1),   0 4px 32px rgba(0,0,0,0.5); }
                }
                @keyframes floatLogo {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                .bg-kenburns {
                    animation: kenburns 20s ease-in-out infinite;
                    will-change: transform;
                }
                .title-glow {
                    animation: titleGlow 3s ease-in-out infinite, fadeInUp 0.8s ease-out both;
                }
                .logo-float {
                    animation: floatLogo 4s ease-in-out infinite, fadeInUp 0.6s ease-out both;
                }
                .btn-fade {
                    animation: fadeInUp 1s ease-out 0.4s both;
                }
            `}</style>

            <div className='relative min-h-screen overflow-hidden flex flex-col'>
                {/* Animated Background */}
                <div
                    className='absolute inset-0 bg-kenburns bg-cover bg-center'
                    style={{ backgroundImage: "url('/assets/img/background.webp')" }}
                />

                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none' />

                {/* Language Dropdown */}
                <div className='absolute top-4 right-4 z-20'>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className='flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none'>
                                <ProfilePhoto
                                    src='/assets/img/globe.png'
                                    alt={__('Language')}
                                    className='h-8 w-8 object-contain drop-shadow-md hover:scale-110 transition-transform duration-200'
                                    fallbackClassName='h-8 w-8 bg-white/50 rounded-full flex items-center justify-center text-xs'
                                    fallback='🌐'
                                />
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <button
                                onClick={() => switchLanguage('id')}
                                className='block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition'
                            >
                                {__('Bahasa')}
                            </button>
                            <button
                                onClick={() => switchLanguage('en')}
                                className='block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition'
                            >
                                {__('English')}
                            </button>
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                {/* Main content — flex-grow, centered */}
                <div className='flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-16 pb-6'>
                    {/* Logo */}
                    <ProfilePhoto
                        src='/assets/img/logo-rmd.png'
                        alt={__('Logo RMD')}
                        className='h-28 sm:h-36 w-auto mb-6 object-contain drop-shadow-2xl logo-float'
                        fallbackClassName='h-28 sm:h-36 w-28 sm:w-36 mb-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-2xl rounded-lg shadow-lg logo-float'
                        fallback='RMD'
                    />

                    {/* Decorative line */}
                    <div className='w-20 h-1 bg-white/70 rounded-full mb-5' style={{ animation: 'fadeInUp 0.7s ease-out 0.2s both' }} />

                    <h1
                        className='title-glow text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center uppercase leading-tight w-full max-w-sm sm:max-w-xl'
                        style={{ letterSpacing: '0.07em' }}
                    >
                        {title}
                    </h1>

                    {/* Decorative line */}
                    <div className='w-20 h-1 bg-white/70 rounded-full mt-5 mb-8' style={{ animation: 'fadeInUp 0.7s ease-out 0.3s both' }} />

                    {/* Action button */}
                    <div className='btn-fade'>
                        <Link
                            href={route('login')}
                            className='inline-block bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-10 sm:px-12 rounded-full transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 text-base sm:text-lg tracking-wide'
                        >
                            {__('Get Started')}
                        </Link>
                    </div>
                </div>

                {/* Footer — natural flow, tidak menimpa konten */}
                <div className='relative z-10'>
                    <Footer transparent />
                </div>
            </div>
        </>
    )
}
