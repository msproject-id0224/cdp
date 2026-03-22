import { Link } from '@inertiajs/react';

const activeStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.1) 100%), #dc2626',
    boxShadow: '0 -2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
    borderRadius: '8px 8px 0 0',
};

const inactiveStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.12) 100%), #3b82f6',
    boxShadow: '0 -1px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
    borderRadius: '8px 8px 0 0',
};

const hoverStyle = {
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 50%, rgba(0,0,0,0.12) 100%), #60a5fa',
    boxShadow: '0 -2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.35)',
    borderRadius: '8px 8px 0 0',
};

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            style={active ? activeStyle : inactiveStyle}
            onMouseEnter={e => { if (!active) Object.assign(e.currentTarget.style, hoverStyle); }}
            onMouseLeave={e => { if (!active) Object.assign(e.currentTarget.style, inactiveStyle); }}
            className={
                'inline-flex items-center self-end px-4 py-2 text-sm font-semibold text-white focus:outline-none ' +
                className
            }
        >
            {children}
        </Link>
    );
}
