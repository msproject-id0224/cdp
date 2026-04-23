import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'
import { useTrans } from '@/Utils/lang'
import { useState } from 'react'
import PhotoRequestsTab from '@/Components/Dashboard/PhotoRequestsTab'
import ProfilePhoto from '@/Components/ProfilePhoto'
import ScheduleTab from '@/Components/Dashboard/ScheduleTab'
import LetterHistory from '@/Components/Dashboard/LetterHistory'
import GiftHistory from '@/Components/Dashboard/GiftHistory'

const PERF_CRITERIA_KEYS = [
    { key: 'jadwal',      labelKey: 'Jadwal',    descKey: 'Schedule criteria desc' },
    { key: 'kehadiran',   labelKey: 'Kehadiran', descKey: 'Attendance criteria desc' },
    { key: 'surat',       labelKey: 'Surat',     descKey: 'Letter criteria desc' },
    { key: 'gift',        labelKey: 'Gift',      descKey: 'Gift criteria desc' },
    { key: 'update_anak', labelKey: 'Update',    descKey: 'Child Update criteria desc' },
]

function PerfBar ({ value }) {
    const pct   = Math.min((value / 10) * 100, 100)
    const color = value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-400' : 'bg-red-500'
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
    )
}

export default function Dashboard ({ auth, photoRequests, letters, gifts, filters, mentorPerformance }) {
    const __ = useTrans()
    const user = auth.user
    const role = user?.role ? String(user.role) : 'participant'
    const PERF_CRITERIA = PERF_CRITERIA_KEYS.map(c => ({
        key: c.key,
        label: __(c.labelKey),
        desc: __(c.descKey),
    }))
    const [activeTab, setActiveTab] = useState(() => {
        try {
            // Check if active_tab is passed from backend (via filters)
            const urlParams = new URLSearchParams(window.location.search);
            const tabParam = urlParams.get('active_tab');
            if (tabParam) return tabParam;

            return localStorage.getItem('dashboard_tab') ?? 'overview'
        } catch {
            return 'overview'
        }
    })

    const changeTab = tab => {
        setActiveTab(tab)
        try {
            localStorage.setItem('dashboard_tab', tab)
        } catch {}
    }

    // Safe access helpers
    const getUserName = () => user?.name || user?.first_name || __('User')
    const getUserInitials = () => getUserName().charAt(0).toUpperCase()
    const getRoleDisplay = () => role.charAt(0).toUpperCase() + role.slice(1)

    if (!user) {
        return null // or loading spinner, though auth middleware prevents this
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className='text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200'>
                    {__('Dashboard')} {__(user?.role)}
                </h2>
            }
        >
            <Head title={__('Dashboard')} />

            <div className='py-6 sm:py-12'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800'>
                        <div className='p-6 text-gray-900 dark:text-gray-100'>
                            {/* Profile Photo Section */}
                            <div className='mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6'>
                                    <div className='relative'>
                                        <ProfilePhoto
                                            src={user.profile_photo_url}
                                            alt={getUserName()}
                                            className='w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md'
                                            fallbackClassName='w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-md'
                                            fallback={getUserInitials()}
                                        />
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${
                                                user.profile_photo_status ===
                                                'active'
                                                    ? 'bg-green-500'
                                                    : user.profile_photo_status ===
                                                      'pending'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                            title={`${__('Photo Status')}: ${__(
                                                user.profile_photo_status
                                            )}`}
                                        ></div>
                                    </div>

                                    <div className='flex-1 text-center md:text-left'>
                                        <h4 className='text-lg font-semibold'>
                                            {getUserName()}
                                        </h4>
                                        {user.role === 'participant' && user.id_number && (
                                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                                ID: {user.id_number}
                                            </p>
                                        )}
                                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                                            {user.email}
                                        </p>
                                        <div className='flex flex-wrap justify-center md:justify-start gap-2'>
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full ${
                                                    user.profile_photo_status ===
                                                    'active'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : user.profile_photo_status ===
                                                          'pending'
                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {__('Photo Status')}:{' '}
                                                <span className='capitalize'>
                                                    {__(
                                                        user.profile_photo_status
                                                    )}
                                                </span>
                                            </span>
                                            <span className='px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize'>
                                                {__(user.role)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                    {/* Tabs Navigation */}
                                    <div className='border-b border-gray-200 dark:border-gray-700 mb-6'>
                                        <nav className='-mb-px flex space-x-8 overflow-x-auto'>
                                            <button
                                                onClick={() =>
                                                    changeTab('overview')
                                                }
                                                className={`${
                                                    activeTab === 'overview'
                                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                            >
                                                {__('Overview')}
                                            </button>
                                            {role === 'participant' && (
                                                <>
                                                    <button
                                                        onClick={() => changeTab('letters')}
                                                        className={`${
                                                            activeTab === 'letters'
                                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                                    >
                                                        {__('Letter History')}
                                                    </button>
                                                    <button
                                                        onClick={() => changeTab('gifts')}
                                                        className={`${
                                                            activeTab === 'gifts'
                                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                                    >
                                                        {__('Gift History')}
                                                    </button>
                                                </>
                                            )}
                                            {user.role === 'admin' && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            changeTab('schedule')
                                                        }
                                                        className={`${
                                                            activeTab === 'schedule'
                                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                                    >
                                                        {__('Schedule')}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            changeTab('photos')
                                                        }
                                                        className={`${
                                                            activeTab === 'photos'
                                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                                    >
                                                        {__('Photo Requests')}
                                                        {photoRequests &&
                                                            photoRequests.length >
                                                                0 && (
                                                                <span className='ml-2 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 py-0.5 px-2 rounded-full text-xs'>
                                                                    {
                                                                        photoRequests.length
                                                                    }
                                                                </span>
                                                            )}
                                                    </button>
                                                </>
                                            )}
                                            {(role === 'admin' || role === 'mentor') && (
                                                <Link
                                                    href={route('health-screenings.index')}
                                                    className={`border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                                                >
                                                    <span>{__('Pemeriksaan Kesehatan')}</span>
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </nav>
                                    </div>

                                    {/* Tab Content */}
                                    {activeTab === 'overview' && (
                                        <div className='animate-fade-in'>
                                            <h3 className='text-lg font-bold mb-4'>
                                                {role === 'admin' ? __('Admin Panel') : role === 'mentor' ? __('Mentor Panel') : __('Participant Panel')}
                                            </h3>
                                            <p className='mb-6'>
                                                {role === 'admin' 
                                                    ? __('Welcome, Administrator. You have full access to the system.')
                                                    : role === 'mentor'
                                                    ? __('Welcome, Mentor. You can manage participants and health checks.')
                                                    : __('Welcome to the Child Development Program. Please check your schedule.', { nickname: user.nickname || user.first_name })
                                                }
                                            </p>

                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route(
                                                            'mentors.index'
                                                        )}
                                                        className='p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition shadow-sm dark:bg-blue-900/20 dark:border-blue-800 dark:hover:bg-blue-900/30'
                                                    >
                                                        <h4 className='font-semibold text-blue-700 dark:text-blue-400'>
                                                            {__('Mentor List')}
                                                        </h4>
                                                        <p className='text-sm text-blue-600 mt-2 dark:text-blue-500'>
                                                            {__(
                                                                'Manage and view all registered mentors.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route(
                                                            'participants.index'
                                                        )}
                                                        className='p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30'
                                                    >
                                                        <h4 className='font-semibold text-green-700 dark:text-green-400'>
                                                            {__('Participant List')}
                                                        </h4>
                                                        <p className='text-sm text-green-600 mt-2 dark:text-green-500'>
                                                            {__(
                                                                'Manage and view all registered participants.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route('profile.edit')}
                                                        className='p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition shadow-sm dark:bg-indigo-900/20 dark:border-indigo-800 dark:hover:bg-indigo-900/30'
                                                    >
                                                        <h4 className='font-semibold text-indigo-700 dark:text-indigo-400'>
                                                            {__('Admin List')}
                                                        </h4>
                                                        <p className='text-sm text-indigo-600 mt-2 dark:text-indigo-500'>
                                                            {__('Manage registered administrators.')}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'mentor' && (
                                                    <Link
                                                        href={route('participants.index')}
                                                        className='p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition shadow-sm dark:bg-green-900/20 dark:border-green-800 dark:hover:bg-green-900/30'
                                                    >
                                                        <h4 className='font-semibold text-green-700 dark:text-green-400'>
                                                            {__('Participant List')}
                                                        </h4>
                                                        <p className='text-sm text-green-600 mt-2 dark:text-green-500'>
                                                            {__(
                                                                'View your assigned participants.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}

                                                {/* ── Mentor Performance Score Card ── */}
                                                {user.role === 'mentor' && mentorPerformance && (
                                                    <div className='col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 shadow-sm'>
                                                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5'>
                                                            <div>
                                                                <h4 className='font-bold text-indigo-700 dark:text-indigo-300 text-base'>
                                                                    {__('My Performance Assessment')}
                                                                </h4>
                                                                <p className='text-xs text-indigo-500 dark:text-indigo-400 mt-0.5'>
                                                                    {__('Score range 1–10 points per criteria')}
                                                                </p>
                                                            </div>
                                                            {/* Total badge */}
                                                            <div className='flex items-center gap-3'>
                                                                <div className='text-right'>
                                                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{__('Total Points')}</div>
                                                                    <div className={`text-3xl font-black tabular-nums ${
                                                                        mentorPerformance.total >= 8 ? 'text-green-600 dark:text-green-400'
                                                                        : mentorPerformance.total >= 5 ? 'text-yellow-600 dark:text-yellow-400'
                                                                        : 'text-red-600 dark:text-red-400'
                                                                    }`}>
                                                                        {mentorPerformance.total.toFixed(2)}
                                                                        <span className='text-base font-normal text-gray-400'>/10</span>
                                                                    </div>
                                                                    <div className={`text-xs font-semibold mt-0.5 ${
                                                                        mentorPerformance.total >= 8 ? 'text-green-600 dark:text-green-400'
                                                                        : mentorPerformance.total >= 5 ? 'text-yellow-600 dark:text-yellow-400'
                                                                        : 'text-red-600 dark:text-red-400'
                                                                    }`}>
                                                                        {mentorPerformance.total >= 8 ? __('Good Performance')
                                                                        : mentorPerformance.total >= 5 ? __('Fair Performance')
                                                                        : __('Needs Improvement')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Criteria grid */}
                                                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                                                            {PERF_CRITERIA.map(c => {
                                                                const val = mentorPerformance[c.key] ?? 0
                                                                return (
                                                                    <div key={c.key} className='bg-white dark:bg-gray-800/60 rounded-lg p-3 shadow-sm'>
                                                                        <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>{c.label}</div>
                                                                        <div className={`text-xl font-black tabular-nums ${
                                                                            val >= 8 ? 'text-green-600 dark:text-green-400'
                                                                            : val >= 5 ? 'text-yellow-600 dark:text-yellow-400'
                                                                            : 'text-red-600 dark:text-red-400'
                                                                        }`}>
                                                                            {val.toFixed(2)}
                                                                        </div>
                                                                        <PerfBar value={val} />
                                                                        <div className='text-[10px] text-gray-400 mt-1.5 leading-tight'>{c.desc}</div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route('participants.update-log')}
                                                        className='p-6 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition shadow-sm dark:bg-teal-900/20 dark:border-teal-800 dark:hover:bg-teal-900/30'
                                                    >
                                                        <h4 className='font-semibold text-teal-700 dark:text-teal-400'>
                                                            {__('Daftar Pembaruan Partisipan')}
                                                        </h4>
                                                        <p className='text-sm text-teal-600 mt-2 dark:text-teal-500'>
                                                            {__('View participants sorted by latest update.')}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route(
                                                            'gifts.index'
                                                        )}
                                                        className='p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition shadow-sm dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30'
                                                    >
                                                        <h4 className='font-semibold text-yellow-700 dark:text-yellow-400'>
                                                            {__('Gift Recipients List')}
                                                        </h4>
                                                        <p className='text-sm text-yellow-600 mt-2 dark:text-yellow-500'>
                                                            {__(
                                                                'Manage gift recipients list.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'mentor' && (
                                                    <Link
                                                        href={route('gifts.index')}
                                                        className='p-6 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition shadow-sm dark:bg-yellow-900/20 dark:border-yellow-800 dark:hover:bg-yellow-900/30'
                                                    >
                                                        <h4 className='font-semibold text-yellow-700 dark:text-yellow-400'>
                                                            {__('Gift Recipients List')}
                                                        </h4>
                                                        <p className='text-sm text-yellow-600 mt-2 dark:text-yellow-500'>
                                                            {__(
                                                                'View gifts received by your participants.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}

                                                {user.role === 'admin' && (
                                                    <Link
                                                        href={route(
                                                            'admin.attendance.monitor'
                                                        )}
                                                        className='p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition shadow-sm dark:bg-purple-900/20 dark:border-purple-800 dark:hover:bg-purple-900/30'
                                                    >
                                                        <h4 className='font-semibold text-purple-700 dark:text-purple-400'>
                                                            {__(
                                                                'Attendance Monitor'
                                                            )}
                                                        </h4>
                                                        <p className='text-sm text-purple-600 mt-2 dark:text-purple-500'>
                                                            {__(
                                                                'Monitor mentor attendance and QR codes.'
                                                            )}
                                                        </p>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'schedule' && user.role === 'admin' && (
                                        <div className='animate-fade-in'>
                                            <ScheduleTab />
                                        </div>
                                    )}

                                    {activeTab === 'photos' && user.role === 'admin' && (
                                        <div className='animate-fade-in'>
                                            <PhotoRequestsTab
                                                initialRequests={photoRequests}
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'letters' && role === 'participant' && (
                                        <div className='animate-fade-in'>
                                            <LetterHistory letters={letters} filters={filters} />
                                        </div>
                                    )}

                                    {activeTab === 'gifts' && role === 'participant' && (
                                        <div className='animate-fade-in'>
                                            <GiftHistory gifts={gifts} filters={filters} />
                                        </div>
                                    )}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
