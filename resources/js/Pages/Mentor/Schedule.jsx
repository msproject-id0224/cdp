import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MentorScheduleTab from '@/Components/Dashboard/MentorScheduleTab';
import { __ } from '@/Utils/lang';

const PRIORITY_STYLES = {
    high:   { bg: 'bg-red-500',     badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
    medium: { bg: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    low:    { bg: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
};

export default function Schedule({ auth, adminSchedules = [] }) {
    const [selected, setSelected] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Schedule Management')}
                </h2>
            }
        >
            <Head title={__('Schedule Management')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* ── Program Activities from Admin ── */}
                    {adminSchedules.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    {__('Program Activities')}
                                    <span className="ml-2 text-xs font-normal text-gray-400">({adminSchedules.length})</span>
                                </h3>
                                <div className="space-y-2">
                                    {[...adminSchedules]
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .map(s => {
                                            const ps = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.medium;
                                            return (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setSelected(s)}
                                                    className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                                >
                                                    <div className={`w-1 self-stretch rounded-full shrink-0 ${ps.bg}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{s.name}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ps.badge}`}>
                                                                {s.priority}
                                                            </span>
                                                        </div>
                                                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(s.date + 'T00:00:00').toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                            {s.start_time && ` · ${s.start_time.substring(0, 5)}`}
                                                            {s.end_time && `–${s.end_time.substring(0, 5)}`}
                                                            {s.location && ` · ${s.location}`}
                                                        </div>
                                                        {s.description && (
                                                            <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">{s.description}</div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Mentor schedule tab ── */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <MentorScheduleTab />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Activity Detail Modal ── */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${(PRIORITY_STYLES[selected.priority] || PRIORITY_STYLES.medium).badge}`}>
                            {selected.priority}
                        </span>
                        <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">{selected.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(selected.date + 'T00:00:00').toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-4 space-y-3 text-sm">
                            {selected.start_time && (
                                <div className="flex gap-3">
                                    <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{__('Time')}</span>
                                    <span className="text-gray-800 dark:text-gray-100">
                                        {selected.start_time.substring(0, 5)}{selected.end_time ? `–${selected.end_time.substring(0, 5)}` : ''}
                                    </span>
                                </div>
                            )}
                            {selected.location && (
                                <div className="flex gap-3">
                                    <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{__('Location')}</span>
                                    <span className="text-gray-800 dark:text-gray-100">{selected.location}</span>
                                </div>
                            )}
                            {selected.pic && (
                                <div className="flex gap-3">
                                    <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{__('PIC')}</span>
                                    <span className="text-gray-800 dark:text-gray-100">{selected.pic}</span>
                                </div>
                            )}
                            {selected.description && (
                                <div className="flex gap-3">
                                    <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{__('Description')}</span>
                                    <span className="text-gray-800 dark:text-gray-100 break-words">{selected.description}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
