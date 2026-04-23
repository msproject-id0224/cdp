import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-3 py-5 text-xs font-semibold transition-colors duration-150 focus:outline-none border-b-2 ' +
                (active
                    ? 'border-[#dc2626] text-[#0c4a6e] dark:text-white'
                    : 'border-transparent text-[#1e6a9e]/70 dark:text-gray-400 hover:text-[#0c4a6e] dark:hover:text-gray-200 hover:border-[#0c4a6e]/30') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
