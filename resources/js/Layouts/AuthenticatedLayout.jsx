import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import ChatWidget from '@/Components/ChatWidget';
import AdminNotificationComponent from '@/Components/AdminNotification';
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

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
            <nav className="border-b border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
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
                                {user.role === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('schedule.index')}
                                            active={route().current('schedule.index')}
                                        >
                                            {__('Schedule')}
                                        </NavLink>
                                    </>
                                )}
                                {user.role === 'mentor' && (
                                    <NavLink
                                        href={route('mentor.schedule')}
                                        active={route().current('mentor.schedule')}
                                    >
                                        {__('Schedule')}
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
                                        href={route('rmd-report.index')}
                                        active={route().current('rmd-report.index')}
                                    >
                                        {__('RMD Report')}
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {(user.role === 'admin' || user.role === 'mentor') && <AdminNotificationComponent />}
                            
                            {/* Theme Switcher */}
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="ms-3" />

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <div className="flex items-center">
                                                    <ProfilePhoto 
                                                        src={user.profile_photo_url} 
                                                        alt={user.name} 
                                                        className="h-8 w-8 rounded-full object-cover mr-2" 
                                                        fallbackClassName="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 mr-2 text-xs font-bold"
                                                        fallback={(user.first_name_display || user.name || 'U').charAt(0)}
                                                    />
                                                    {user?.first_name_display || user?.name || __('User')}
                                                </div>

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
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
                                        </span>
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
                                            preserveState
                                            preserveScroll
                                            onClick={() => localStorage.setItem('locale', 'id')}
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
                                            preserveState
                                            preserveScroll
                                            onClick={() => localStorage.setItem('locale', 'en')}
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
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="me-3" />
                            
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
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
                        ' sm:hidden'
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
                            <>
                                <ResponsiveNavLink
                                    href={route('schedule.index')}
                                    active={route().current('schedule.index')}
                                >
                                    {__('Schedule')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('communication.index')}
                                    active={route().current('communication.index')}
                                >
                                    {__('Communication')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('rmd-report.index')}
                                    active={route().current('rmd-report.index')}
                                >
                                    {__('RMD Report')}
                                </ResponsiveNavLink>
                            </>
                        )}
                        {user.role === 'mentor' && (
                            <ResponsiveNavLink
                                href={route('mentor.schedule')}
                                active={route().current('mentor.schedule')}
                            >
                                {__('Schedule')}
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.first_name_display || user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {user.email}
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
        </div>
    );
}
