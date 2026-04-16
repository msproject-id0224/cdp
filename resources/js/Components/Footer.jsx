import { __ } from '@/Utils/lang'

export default function Footer ({ transparent = true }) {
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
                    className={`flex flex-col items-center justify-center text-xs text-center text-gray-200 dark:text-gray-300`}
                >
                    &copy; {new Date().getFullYear()}
                    {' MSProject & '}
                    {__('CDP Development Team')}. {__('All rights reserved.')}
                </div>
            </div>
        </footer>
    )
}
