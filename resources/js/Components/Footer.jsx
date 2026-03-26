import { __ } from '@/Utils/lang'

export default function Footer ({ transparent = false }) {
    return (
        <footer
            className={
                transparent
                    ? 'w-full bg-transparent'
                    : 'bg-white dark:bg-gray-800 mt-auto'
            }
        >
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 py-5 sm:py-5'>
                <div
                    className={`flex flex-col items-center justify-center text-base sm:text-sm text-center ${
                        transparent
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                    }`}
                >
                    &copy; {new Date().getFullYear()}
                    {' jamiemax & '}
                    {__('CDP Dev/Team')}. {__('All rights reserved.')}
                </div>
            </div>
        </footer>
    )
}
