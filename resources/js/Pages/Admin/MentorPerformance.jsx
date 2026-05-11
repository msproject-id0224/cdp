import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { __ } from '@/Utils/lang'
import ProfilePhoto from '@/Components/ProfilePhoto'

const CRITERIA = [
    { key: 'jadwal',      label: 'Schedule Assessment',          short: 'Jadwal' },
    { key: 'kehadiran',   label: 'Attendance Assessment',        short: 'Kehadiran' },
    { key: 'surat',       label: 'Letter Writing Assessment',    short: 'Surat' },
    { key: 'gift',        label: 'Gift Mentoring Assessment',    short: 'Gift' },
    { key: 'update_anak', label: 'Child Update Assessment',      short: 'Update Anak' },
]

function ScoreBadge({ value }) {
    const color =
        value >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
        : value >= 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'

    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${color}`}>
            {value.toFixed(2)}
        </span>
    )
}

function ScoreBar({ value }) {
    const pct   = Math.min((value / 10) * 100, 100)
    const color =
        value >= 8 ? 'bg-green-500'
        : value >= 5 ? 'bg-yellow-400'
        : 'bg-red-500'

    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
            <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
    )
}

function TotalBadge({ value }) {
    const color =
        value >= 8 ? 'bg-green-600 text-white'
        : value >= 5 ? 'bg-yellow-500 text-white'
        : 'bg-red-600 text-white'

    const label =
        value >= 8 ? __('Good')
        : value >= 5 ? __('Fair')
        : __('Needs Improvement')

    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-xl font-black tabular-nums px-3 py-1 rounded-lg ${color}`}>
                {value.toFixed(2)}
            </span>
            <span className={`text-xs font-semibold ${
                value >= 8 ? 'text-green-600 dark:text-green-400'
                : value >= 5 ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400'
            }`}>{label}</span>
        </div>
    )
}

export default function MentorPerformance({ performances }) {
    const sorted = [...performances].sort((a, b) => b.total - a.total)

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Mentor Performance Assessment')}
                </h2>
            }
        >
            <Head title={__('Mentor Performance Assessment')} />

            <div className="py-6 sm:py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Legend */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">
                            {__('Scoring Criteria')} — {__('Score range 1–10 points per criteria')}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex gap-2"><span className="font-bold text-blue-600">{__('Schedule')}</span><span>{__('Schedule criteria desc')}</span></div>
                            <div className="flex gap-2"><span className="font-bold text-blue-600">{__('Attendance')}</span><span>{__('Attendance criteria desc')}</span></div>
                            <div className="flex gap-2"><span className="font-bold text-blue-600">{__('Letter')}</span><span>{__('Letter criteria desc')}</span></div>
                            <div className="flex gap-2"><span className="font-bold text-blue-600">{__('Gift')}</span><span>{__('Gift criteria desc')}</span></div>
                            <div className="flex gap-2"><span className="font-bold text-blue-600">{__('Child Update')}</span><span>{__('Child Update criteria desc')}</span></div>
                        </div>
                        <div className="flex gap-4 mt-4 text-xs font-medium">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> ≥ 8 {__('Good')}</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 5–7.99 {__('Fair')}</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> &lt; 5 {__('Needs Improvement')}</span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{performances.length}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{__('Total Active Mentors')}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <div className="text-2xl font-black text-green-600">
                                {performances.filter(p => p.total >= 8).length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{__('Good Performance (≥8)')}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <div className="text-2xl font-black text-yellow-500">
                                {performances.filter(p => p.total >= 5 && p.total < 8).length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{__('Fair Performance (5–8)')}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
                            <div className="text-2xl font-black text-red-600">
                                {performances.filter(p => p.total < 5).length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{__('Needs Improvement')}</div>
                        </div>
                    </div>

                    {/* Main Table — Desktop */}
                    <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-8">#</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">{__('Mentor Name')}</th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">{__('Participants')}</th>
                                    {CRITERIA.map(c => (
                                        <th key={c.key} className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 min-w-[110px]">
                                            <span title={__(c.label)}>{__(c.short)}</span>
                                            <div className="text-[10px] font-normal text-gray-400">{__('max. 10')}</div>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">{__('Total Points')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {sorted.map((p, idx) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <ProfilePhoto
                                                    src={p.photo}
                                                    alt={p.name}
                                                    className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                                                    fallbackClassName="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-bold flex-shrink-0"
                                                    fallback={p.name.charAt(0)}
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{p.name}</div>
                                                    <div className="text-xs text-gray-400">{p.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{p.participants_count}</td>
                                        {CRITERIA.map(c => (
                                            <td key={c.key} className="px-3 py-3 text-center">
                                                <ScoreBadge value={p.scores[c.key]} />
                                                <ScoreBar value={p.scores[c.key]} />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <TotalBadge value={p.total} />
                                        </td>
                                    </tr>
                                ))}
                                {sorted.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                                            {__('No active mentor data yet.')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile / Tablet — Card list */}
                    <div className="lg:hidden space-y-4">
                        {sorted.map((p, idx) => (
                            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs text-gray-400 w-5">{idx + 1}</span>
                                    <ProfilePhoto
                                        src={p.photo}
                                        alt={p.name}
                                        className="h-11 w-11 rounded-full object-cover"
                                        fallbackClassName="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold"
                                        fallback={p.name.charAt(0)}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{p.email}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.participants_count} {__('participants')}</div>
                                    </div>
                                    <TotalBadge value={p.total} />
                                </div>

                                {/* Scores grid */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {CRITERIA.map(c => (
                                        <div key={c.key} className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-2">
                                            <div className="text-[10px] text-gray-400 mb-1 font-medium">{__(c.short)}</div>
                                            <ScoreBadge value={p.scores[c.key]} />
                                            <ScoreBar value={p.scores[c.key]} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {sorted.length === 0 && (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                {__('No active mentor data yet.')}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    )
}
