import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { __ } from '@/Utils/lang';

const STATUS_STYLES = {
    scheduled:              { bg: 'bg-blue-500',   text: 'text-white', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    pending:                { bg: 'bg-yellow-400', text: 'text-gray-900', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    rejected:               { bg: 'bg-red-500',    text: 'text-white', badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
    modification_requested: { bg: 'bg-orange-400', text: 'text-white', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
};

function statusStyle(status) {
    return STATUS_STYLES[status] || STATUS_STYLES.pending;
}

function statusLabel(status) {
    const labels = {
        scheduled:              __('Scheduled'),
        pending:                __('Pending'),
        rejected:               __('Rejected'),
        modification_requested: __('Modification Requested'),
    };
    return labels[status] || status;
}

function formatTime(dt) {
    if (!dt) return '';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
}

const PRIORITY_STYLES = {
    high:   { bg: 'bg-red-500',     badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
    medium: { bg: 'bg-blue-500',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    low:    { bg: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' },
};

function priorityStyle(priority) {
    return PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
}

export default function Schedule({ auth, meetings = [], adminSchedules = [] }) {
    const today = new Date();
    const [currentYear, setCurrentYear]   = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
    const [selected, setSelected]         = useState(null); // selected meeting for detail modal
    const [selectedAdmin, setSelectedAdmin] = useState(null); // selected admin schedule for detail modal

    // ── calendar math ──────────────────────────────────────────────
    const firstDay  = new Date(currentYear, currentMonth, 1);
    const lastDay   = new Date(currentYear, currentMonth + 1, 0);
    const startPad  = firstDay.getDay(); // 0 = Sunday
    const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7;

    const monthName = firstDay.toLocaleDateString([], { month: 'long', year: 'numeric' });
    const dayNames  = [__('Sun'), __('Mon'), __('Tue'), __('Wed'), __('Thu'), __('Fri'), __('Sat')];

    function prevMonth() {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    }
    function nextMonth() {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    }
    function goToday() {
        setCurrentYear(today.getFullYear());
        setCurrentMonth(today.getMonth());
    }

    // ── group meetings by date ──────────────────────────────────────
    function meetingsForDate(date) {
        return meetings.filter(m => {
            if (!m.scheduled_at) return false;
            return sameDay(new Date(m.scheduled_at), date);
        });
    }

    function adminSchedulesForDate(date) {
        return adminSchedules.filter(s => {
            if (!s.date) return false;
            return sameDay(new Date(s.date + 'T00:00:00'), date);
        });
    }

    // ── build cells array ───────────────────────────────────────────
    const cells = Array.from({ length: totalCells }, (_, i) => {
        const dayNum = i - startPad + 1;
        if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
        const date = new Date(currentYear, currentMonth, dayNum);
        return { date, dayNum, events: meetingsForDate(date), adminEvents: adminSchedulesForDate(date) };
    });

    const mentorName = (m) => {
        if (!m.mentor) return '-';
        return [m.mentor.first_name, m.mentor.last_name].filter(Boolean).join(' ');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {__('My Schedule')}
                </h2>
            }
        >
            <Head title={__('My Schedule')} />

            <div className="py-8">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-4">

                    {/* ── Legend ── */}
                    <div className="flex flex-wrap gap-3 text-xs">
                        {Object.entries(STATUS_STYLES).map(([key, s]) => (
                            <span key={key} className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${s.badge}`}>
                                <span className={`w-2 h-2 rounded-full ${s.bg}`} />
                                {statusLabel(key)}
                            </span>
                        ))}
                    </div>

                    {/* ── Calendar card ── */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl overflow-hidden">

                        {/* Header nav */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevMonth}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    aria-label={__('Previous month')}
                                >
                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize min-w-[180px] text-center">
                                    {monthName}
                                </h3>
                                <button
                                    onClick={nextMonth}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    aria-label={__('Next month')}
                                >
                                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={goToday}
                                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                                {__('Today')}
                            </button>
                        </div>

                        {/* Day-name header row */}
                        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
                            {dayNames.map(d => (
                                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 dark:divide-gray-700">
                            {cells.map((cell, idx) => {
                                if (!cell) {
                                    return (
                                        <div
                                            key={`empty-${idx}`}
                                            className="min-h-[42px] sm:min-h-[90px] bg-gray-50 dark:bg-gray-900/30"
                                        />
                                    );
                                }

                                const isToday = sameDay(cell.date, today);
                                const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6;

                                return (
                                    <div
                                        key={cell.dayNum}
                                        className={`min-h-[42px] sm:min-h-[90px] p-1 sm:p-1.5 flex flex-col gap-0.5 sm:gap-1 ${
                                            isWeekend ? 'bg-gray-50/60 dark:bg-gray-900/20' : ''
                                        }`}
                                    >
                                        {/* Date number */}
                                        <span className={`text-[10px] sm:text-xs font-medium w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full self-end ${
                                            isToday
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                            {cell.dayNum}
                                        </span>

                                        {/* Mobile: colored dots only */}
                                        <div className="flex flex-wrap gap-0.5 sm:hidden">
                                            {cell.events.map(event => {
                                                const s = statusStyle(event.status);
                                                return (
                                                    <button
                                                        key={event.id}
                                                        onClick={() => setSelected(event)}
                                                        className={`w-1.5 h-1.5 rounded-full ${s.bg} hover:opacity-80`}
                                                        title={event.agenda || mentorName(event)}
                                                    />
                                                );
                                            })}
                                            {cell.adminEvents.map(s => {
                                                const ps = priorityStyle(s.priority);
                                                return (
                                                    <button
                                                        key={`admin-${s.id}`}
                                                        onClick={() => setSelectedAdmin(s)}
                                                        className={`w-1.5 h-1.5 rounded-full ${ps.bg} hover:opacity-80`}
                                                        title={s.name}
                                                    />
                                                );
                                            })}
                                        </div>

                                        {/* Desktop: full event chips */}
                                        <div className="hidden sm:flex sm:flex-col sm:gap-1">
                                            {cell.events.map(event => {
                                                const s = statusStyle(event.status);
                                                return (
                                                    <button
                                                        key={event.id}
                                                        onClick={() => setSelected(event)}
                                                        className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded ${s.bg} ${s.text} font-medium truncate hover:opacity-80 transition`}
                                                        title={event.agenda || mentorName(event)}
                                                    >
                                                        {formatTime(event.scheduled_at)} {mentorName(event)}
                                                    </button>
                                                );
                                            })}
                                            {cell.adminEvents.map(s => {
                                                const ps = priorityStyle(s.priority);
                                                return (
                                                    <button
                                                        key={`admin-${s.id}`}
                                                        onClick={() => setSelectedAdmin(s)}
                                                        className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded ${ps.bg} text-white font-medium truncate hover:opacity-80 transition`}
                                                        title={s.name}
                                                    >
                                                        {s.start_time ? s.start_time.substring(0, 5) + ' ' : ''}{s.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Admin schedule list ── */}
                    {adminSchedules.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl p-5">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                {__('Program Activities')}
                                <span className="ml-2 text-xs font-normal text-gray-400">({adminSchedules.length})</span>
                            </h4>
                            <div className="space-y-2">
                                {[...adminSchedules]
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .map(s => {
                                        const ps = priorityStyle(s.priority);
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => setSelectedAdmin(s)}
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
                    )}

                    {/* ── Meeting list below calendar ── */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {__('All Meetings')}
                            <span className="ml-2 text-xs font-normal text-gray-400">({meetings.length})</span>
                        </h4>

                        {meetings.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">{__('No meetings yet.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {[...meetings]
                                    .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))
                                    .map(m => {
                                        const s = statusStyle(m.status);
                                        return (
                                            <button
                                                key={m.id}
                                                onClick={() => setSelected(m)}
                                                className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                            >
                                                {/* Color strip */}
                                                <div className={`w-1 self-stretch rounded-full shrink-0 ${s.bg}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                                            {formatFullDate(m.scheduled_at)}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.badge}`}>
                                                            {statusLabel(m.status)}
                                                        </span>
                                                    </div>
                                                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                        {formatTime(m.scheduled_at)}
                                                        {m.end_time && ` – ${formatTime(m.end_time)}`}
                                                        {m.location && ` · ${m.location}`}
                                                    </div>
                                                    {m.agenda && (
                                                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300 truncate">{m.agenda}</div>
                                                    )}
                                                    <div className="mt-0.5 text-[11px] text-gray-400">
                                                        {__('Mentor')}: {mentorName(m)}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Admin Schedule Detail Modal ── */}
            {selectedAdmin && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setSelectedAdmin(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedAdmin(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityStyle(selectedAdmin.priority).badge}`}>
                            {selectedAdmin.priority}
                        </span>
                        <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">{selectedAdmin.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(selectedAdmin.date + 'T00:00:00').toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-4 space-y-3 text-sm">
                            {selectedAdmin.start_time && (
                                <Row label={__('Time')} value={`${selectedAdmin.start_time.substring(0, 5)}–${selectedAdmin.end_time ? selectedAdmin.end_time.substring(0, 5) : ''}`} />
                            )}
                            {selectedAdmin.location && <Row label={__('Location')} value={selectedAdmin.location} />}
                            {selectedAdmin.pic && <Row label={__('PIC')} value={selectedAdmin.pic} />}
                            {selectedAdmin.description && <Row label={__('Description')} value={selectedAdmin.description} />}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Detail Modal ── */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Status badge */}
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusStyle(selected.status).badge}`}>
                            {statusLabel(selected.status)}
                        </span>

                        {/* Title / date */}
                        <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                            {formatFullDate(selected.scheduled_at)}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(selected.scheduled_at)}
                            {selected.end_time && ` – ${formatTime(selected.end_time)}`}
                        </p>

                        {/* Details grid */}
                        <div className="mt-4 space-y-3 text-sm">
                            <Row label={__('Mentor')} value={mentorName(selected)} />
                            {selected.location && <Row label={__('Location')} value={selected.location} />}
                            {selected.meeting_link && (
                                <Row
                                    label={__('Meeting Link')}
                                    value={
                                        <a
                                            href={selected.meeting_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-indigo-600 dark:text-indigo-400 underline break-all"
                                        >
                                            {selected.meeting_link}
                                        </a>
                                    }
                                />
                            )}
                            {selected.agenda && <Row label={__('Agenda')} value={selected.agenda} />}
                            {selected.notes && <Row label={__('Notes')} value={selected.notes} />}
                        </div>

                        {selected.status === 'rejected' && selected.rejection_reason && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-700 dark:text-red-300">
                                <span className="font-semibold">{__('Rejection Reason')}: </span>
                                {selected.rejection_reason}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex gap-3">
            <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{label}</span>
            <span className="text-gray-800 dark:text-gray-100 break-words">{value}</span>
        </div>
    );
}
