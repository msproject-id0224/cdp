import { __ } from '@/Utils/lang'

export default function Footer ({ transparent = false }) {
    return (
        <footer className={transparent
            ? 'w-full bg-transparent'
            : 'bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-auto'
        }>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6'>
                <div className={`flex flex-col items-center justify-center text-sm text-center ${transparent ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    Hak Cipta &copy; {new Date().getFullYear()}
                    {' jamiemax & team '}
                    {__('Child Development Program')}.{' '}
                    {__('All rights reserved.')}
                </div>
            </div>
        </footer>
    )
}
