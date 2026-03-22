import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import ChatWidget from '@/Components/ChatWidget';
import NotificationBell from '@/Components/NotificationBell';
import Modal from '@/Components/Modal';
import ProfilePhotoUpdateModal from '@/Components/ProfilePhotoUpdateModal';
import ProfilePhoto from '@/Components/ProfilePhoto';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Footer from '@/Components/Footer';
import { useTheme } from '@/Hooks/useTheme';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { __ } from '@/Utils/lang';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, locale } = usePage().props;
    const user = auth?.user || {};
    const role = user?.role || 'participant';
    const [showFlash, setShowFlash] = useState(true);
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const [showingPhotoModal, setShowingPhotoModal] = useState(false);

    useEffect(() => {
        setShowFlash(true);
        const timer = setTimeout(() => setShowFlash(false), 5000);
        return () => clearTimeout(timer);
    }, [flash]);

    const confirmLogout = (e) => {
        e.preventDefault();
        setConfirmingLogout(true);
    };

    const logout = () => {
        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Close modal
        setConfirmingLogout(false);

        // Perform logout request
        router.post(route('logout'));
    };

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showingPhotoPreview, setShowingPhotoPreview] = useState(false);

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
            <nav className="shadow-md bg-[#E6F5FC] dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-16 justify-between items-stretch">
                        <div className="flex items-end flex-wrap gap-y-0">
                            <div className="flex shrink-0 items-center self-center pr-2">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-[#0c4a6e]" />
                                </Link>
                            </div>

                            <div className="hidden sm:flex sm:ms-4 sm:items-end sm:flex-wrap sm:gap-y-0">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    {__('Dashboard')}
                                </NavLink>
                                {user.role === 'participant' && (
                                    <>
                                        <NavLink
                                            href={route('rmd.index')}
                                            active={route().current('rmd.*')}
                                        >
                                            {__('RMD')}
                                        </NavLink>
                                        <NavLink
                                            href={route('participant.schedule')}
                                            active={route().current('participant.schedule')}
                                        >
                                            {__('My Schedule')}
                                        </NavLink>
                                        <NavLink
                                            href={route('participant.notes')}
                                            active={route().current('participant.notes')}
                                        >
                                            {__('Notes')}
                                        </NavLink>
                                    </>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('mentors.index')}
                                        active={route().current('mentors.index')}
                                    >
                                        {__('Mentors')}
                                    </NavLink>
                                )}
                                {(user.role === 'admin' || user.role === 'mentor') && (
                                    <NavLink
                                        href={route('participants.index')}
                                        active={route().current('participants.index')}
                                    >
                                        {__('Participants')}
                                    </NavLink>
                                )}
                                {user.role === 'mentor' && (
                                    <NavLink
                                        href={route('mentor.schedule')}
                                        active={route().current('mentor.schedule')}
                                    >
                                        {__('Schedule')}
                                    </NavLink>
                                )}
                                {user.role === 'mentor' && (
                                    <NavLink
                                        href={route('attendance.index')}
                                        active={route().current('attendance.index')}
                                    >
                                        {__('Attendance')}
                                    </NavLink>
                                )}
                                {(user.role === 'admin' || user.role === 'mentor') && (
                                    <NavLink
                                        href={route('communication.index')}
                                        active={route().current('communication.index')}
                                    >
                                        {__('Communication')}
                                    </NavLink>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('rmd.dashboard')}
                                        active={route().current('rmd.dashboard')}
                                    >
                                        {__('RMD Dashboard')}
                                    </NavLink>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('rmd-report.index')}
                                        active={route().current('rmd-report.index')}
                                    >
                                        {__('RMD Report')}
                                    </NavLink>
                                )}
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.mentor-performance.index')}
                                        active={route().current('admin.mentor-performance.index')}
                                    >
                                        {__('Mentor Performance')}
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:self-stretch shrink-0 px-4">
                            <div className="relative flex items-center gap-3">
                                {/* Notification Bell for all roles */}
                                <NotificationBell />
                                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c4a6e] hover:opacity-70 focus:outline-none transition duration-150 ease-in-out"
                                        >
                                            <span
                                                onClick={(e) => { e.stopPropagation(); setShowingPhotoPreview(true); }}
                                                className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-[#0c4a6e]/40 transition"
                                            >
                                                <ProfilePhoto
                                                    src={user.profile_photo_url}
                                                    alt={user.name}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    fallbackClassName="h-8 w-8 rounded-full bg-[#0c4a6e]/20 flex items-center justify-center text-[#0c4a6e] text-xs font-bold"
                                                    fallback={(user.first_name_display || user.name || 'U').charAt(0)}
                                                />
                                            </span>
                                            {user?.first_name_display || user?.name || __('User')}
                                            <svg
                                                className="h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="block px-4 py-2 text-xs text-gray-400">
                                            {__('Manage Account')}
                                        </div>

                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            {__('Profile')}
                                        </Dropdown.Link>

                                        {(role === 'mentor' || role === 'participant') && (
                                            <button
                                                type="button"
                                                className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                                                onClick={() => setShowingPhotoModal(true)}
                                            >
                                                {__('Change Profile Photo')}
                                            </button>
                                        )}

                                        <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                                        
                                        <div className="block px-4 py-2 text-xs text-gray-400">
                                            {__('Language')}
                                        </div>

                                        <Dropdown.Link
                                            as="button"
                                            href={route('language.switch', 'id')}
                                            method="post"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{__('Bahasa')}</span>
                                                {locale === 'id' && (
                                                    <span className="text-green-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            as="button"
                                            href={route('language.switch', 'en')}
                                            method="post"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{__('English')}</span>
                                                {locale === 'en' && (
                                                    <span className="text-green-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </div>
                                        </Dropdown.Link>

                                        <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>

                                        <Dropdown.Link
                                            as="button"
                                            type="button"
                                            onClick={confirmLogout}
                                        >
                                            {__('Log Out')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            {/* Theme Switcher Mobile */}
                            <NotificationBell />
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="me-3" />
                            
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-[#0c4a6e] transition duration-150 ease-in-out hover:bg-[#0c4a6e]/10 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-[#E6F5FC] dark:bg-gray-900'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            {__('Dashboard')}
                        </ResponsiveNavLink>
                        {user.role === 'participant' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('rmd.index')}
                                    active={route().current('rmd.*')}
                                >
                                    {__('RMD')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('participant.schedule')}
                                    active={route().current('participant.schedule')}
                                >
                                    {__('My Schedule')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('participant.notes')}
                                    active={route().current('participant.notes')}
                                >
                                    {__('Notes')}
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('mentors.index')}
                                active={route().current('mentors.index')}
                            >
                                {__('Mentors')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.schedule-approval.index')}
                                active={route().current('admin.schedule-approval.index')}
                            >
                                {__('Schedule Approval')}
                            </ResponsiveNavLink>
                        )}
                        {(user.role === 'admin' || user.role === 'mentor') && (
                            <ResponsiveNavLink
                                href={route('participants.index')}
                                active={route().current('participants.index')}
                            >
                                {__('Participants')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('communication.index')}
                                active={route().current('communication.index')}
                            >
                                {__('Communication')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('rmd.dashboard')}
                                active={route().current('rmd.dashboard')}
                            >
                                {__('RMD Dashboard')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('rmd-report.index')}
                                active={route().current('rmd-report.index')}
                            >
                                {__('RMD Report')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'admin' && (
                            <ResponsiveNavLink
                                href={route('admin.mentor-performance.index')}
                                active={route().current('admin.mentor-performance.index')}
                            >
                                {__('Mentor Performance')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'mentor' && (
                            <ResponsiveNavLink
                                href={route('mentor.schedule')}
                                active={route().current('mentor.schedule')}
                            >
                                {__('Schedule')}
                            </ResponsiveNavLink>
                        )}
                        {user.role === 'mentor' && (
                            <ResponsiveNavLink
                                href={route('attendance.index')}
                                active={route().current('attendance.index')}
                            >
                                {__('Attendance')}
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-white/30 pb-1 pt-4 bg-black/10">
                        <div className="px-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowingPhotoPreview(true)}
                                className="shrink-0 rounded-full ring-2 ring-transparent hover:ring-[#0c4a6e]/40 transition focus:outline-none"
                            >
                                <ProfilePhoto
                                    src={user.profile_photo_url}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                    fallbackClassName="h-10 w-10 rounded-full bg-[#0c4a6e]/20 flex items-center justify-center text-[#0c4a6e] text-sm font-bold"
                                    fallback={(user.first_name_display || user.name || 'U').charAt(0)}
                                />
                            </button>
                            <div>
                                <div className="text-base font-semibold text-[#0c4a6e]">
                                    {user.first_name_display || user.name}
                                </div>
                                <div className="text-sm font-medium text-[#1e6a9e]">
                                    {user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                {__('Profile')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                as="button"
                                type="button"
                                onClick={confirmLogout}
                            >
                                {__('Log Out')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 transition-colors duration-200">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {showFlash && flash?.success && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative dark:bg-green-800 dark:text-green-100 dark:border-green-600" role="alert">
                        <span className="block sm:inline">{flash.success}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowFlash(false)}>
                            <svg className="fill-current h-6 w-6 text-green-500 dark:text-green-300" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{__('Close')}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                </div>
            )}

            {showFlash && flash?.error && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-800 dark:text-red-100 dark:border-red-600" role="alert">
                        <span className="block sm:inline">{flash.error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowFlash(false)}>
                            <svg className="fill-current h-6 w-6 text-red-500 dark:text-red-300" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>{__('Close')}</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
                    </div>
                </div>
            )}

            <main>{children}</main>

            <Footer />

            <ChatWidget user={user} />

            <Modal show={confirmingLogout} onClose={() => setConfirmingLogout(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Are you sure you want to log out?')}
                    </h2>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingLogout(false)}>
                            {__('Cancel')}
                        </SecondaryButton>
                        <DangerButton className="ms-3" onClick={logout}>
                            {__('Yes, Log Out')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
            
            <ProfilePhotoUpdateModal
                show={showingPhotoModal}
                onClose={() => setShowingPhotoModal(false)}
            />

            {/* Photo Preview Overlay */}
            {showingPhotoPreview && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={() => setShowingPhotoPreview(false)}
                >
                    <div
                        className="relative flex flex-col items-center gap-3 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowingPhotoPreview(false)}
                            className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {user.profile_photo_url ? (
                            <img
                                src={user.profile_photo_url}
                                alt={user.name}
                                className="w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover shadow-2xl ring-4 ring-white/30"
                            />
                        ) : (
                            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#0c4a6e]/80 flex items-center justify-center text-white text-7xl font-bold shadow-2xl ring-4 ring-white/30">
                                {(user.first_name_display || user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}
                        <p className="text-white font-semibold text-lg drop-shadow">
                            {user.first_name_display || user.name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
