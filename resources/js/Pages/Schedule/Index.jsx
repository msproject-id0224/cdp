import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ScheduleApprovalList from '@/Components/ScheduleApprovalList';

const AGENDA_LABELS = {
    pengisian_rmd:  'Pengisian RMD',
    pertemuan_umum: 'Pertemuan Umum',
    rapat_youth:    'Rapat Youth',
    lainnya:        'Lainnya',
};

const STATUS_BADGE = {
    pending:                'bg-orange-100 text-orange-700 border-orange-200',
    scheduled:              'bg-green-100 text-green-700 border-green-200',
    confirmed:              'bg-blue-100 text-blue-700 border-blue-200',
    rejected:               'bg-red-100 text-red-700 border-red-200',
    modification_requested: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    completed:              'bg-gray-100 text-gray-700 border-gray-200',
    deletion_requested:     'bg-red-100 text-red-700 border-red-300',
};

const STATUS_LABELS = {
    pending:                __('Pending Approval'),
    scheduled:              __('Scheduled'),
    confirmed:              __('Confirmed'),
    rejected:               __('Rejected'),
    modification_requested: __('Modification Requested'),
    completed:              __('Completed'),
    deletion_requested:     __('Deletion Requested'),
};

export default function ScheduleIndex({ auth, schedules }) {
    const { locale } = usePage().props;

    // ── Calendar navigation state ──────────────────────────────────────────
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode]     = useState('add');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [activeTab, setActiveTab]     = useState('details');
    const [messages, setMessages]       = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // ── Mentor meetings state ──────────────────────────────────────────────
    const [mentorMeetings, setMentorMeetings] = useState([]);
    const [showBanner, setShowBanner]         = useState(true);
    const [dayModal, setDayModal]             = useState({ show: false, date: '', meetings: [] });
    const [deletionLoading, setDeletionLoading] = useState({});

    // ── Form ───────────────────────────────────────────────────────────────
    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '', date: '', start_time: '', end_time: '',
        description: '', priority: 'medium', pic: '', location: '', status: 'scheduled',
        notify_target: 'all_user',
    });

    // ── Fetch mentor meetings ──────────────────────────────────────────────
    const fetchMentorMeetings = async () => {
        try {
            const res = await window.axios.get(route('api.admin.schedules.all'));
            setMentorMeetings(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching mentor meetings:', e);
        }
    };

    useEffect(() => { fetchMentorMeetings(); }, []);

    // ── Build date → mentor meetings map ──────────────────────────────────
    const dateMeetingMap = useMemo(() => {
        const map = {};
        mentorMeetings.forEach(m => {
            const dateStr = (m.scheduled_at || '').substring(0, 10);
            if (!dateStr) return;
            if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0, deletion_requested: 0, meetings: [] };
            map[dateStr].total++;
            if (m.status === 'pending') map[dateStr].pending++;
            else if (m.status === 'scheduled') map[dateStr].approved++;
            else if (m.status === 'deletion_requested') map[dateStr].deletion_requested++;
            map[dateStr].meetings.push(m);
        });
        return map;
    }, [mentorMeetings]);

    const pendingMeetingsCount = useMemo(
        () => mentorMeetings.filter(m => m.status === 'pending').length,
        [mentorMeetings],
    );

    // ── Open day modal from meeting_id URL param (deletion request click) ──
    useEffect(() => {
        if (mentorMeetings.length === 0) return;
        const params = new URLSearchParams(window.location.search);
        const meetingId = params.get('meeting_id');
        if (!meetingId) return;
        const meeting = mentorMeetings.find(m => m.id === parseInt(meetingId));
        if (!meeting) return;
        const dateStr = (meeting.scheduled_at || '').substring(0, 10);
        if (!dateStr) return;
        const meetingDate = new Date(dateStr + 'T00:00:00');
        setCurrentDate(new Date(meetingDate.getFullYear(), meetingDate.getMonth(), 1));
        const dayMeetings = mentorMeetings.filter(m => (m.scheduled_at || '').substring(0, 10) === dateStr);
        setDayModal({ show: true, date: dateStr, meetings: dayMeetings });
        window.history.replaceState({}, document.title, window.location.pathname);
    }, [mentorMeetings]);

    // ── Open modal from URL param ──────────────────────────────────────────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const scheduleId = params.get('schedule_id');
        if (scheduleId && schedules.length > 0) {
            const schedule = schedules.find(s => s.id === parseInt(scheduleId));
            if (schedule) {
                reset();
                clearErrors();
                setData({
                    name:          schedule.name,
                    date:          schedule.date,
                    start_time:    schedule.start_time ? schedule.start_time.substring(0, 5) : '',
                    end_time:      schedule.end_time ? schedule.end_time.substring(0, 5) : '',
                    description:   schedule.description,
                    priority:      schedule.priority,
                    pic:           schedule.pic,
                    location:      schedule.location || '',
                    status:        schedule.status || 'scheduled',
                    notify_target: schedule.notify_target || 'all_user',
                });
                setSelectedSchedule(schedule);
                setModalMode('edit');
                setActiveTab('messages');
                setIsModalOpen(true);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [schedules]);

    // ── Calendar helpers ───────────────────────────────────────────────────
    const getDaysInMonth    = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const year       = currentDate.getFullYear();
    const month      = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay   = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const makeDateStr = (day) =>
        `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // ── Cell styling helpers ───────────────────────────────────────────────
    const getCellBg = (day) => {
        const dayData = dateMeetingMap[makeDateStr(day)];
        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
        if (dayData?.deletion_requested > 0) return 'bg-red-200 dark:bg-red-800/50 border-red-400 dark:border-red-600';
        if (dayData?.pending > 0) return 'bg-orange-200 dark:bg-orange-800/50 border-orange-400 dark:border-orange-600';
        if (dayData?.total > 0)   return 'bg-green-200 dark:bg-green-800/50 border-green-400 dark:border-green-600';
        if (isToday)               return 'bg-blue-50 dark:bg-blue-900/20 border-gray-200 dark:border-gray-700';
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    };

    const getDayNumberColor = (day) => {
        const dayData = dateMeetingMap[makeDateStr(day)];
        const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
        if (dayData?.deletion_requested > 0) return 'text-red-600 font-bold';
        if (dayData?.pending > 0) return 'text-orange-600 font-bold';
        if (dayData?.total > 0)   return 'text-green-600 dark:text-green-400 font-bold';
        if (isToday)               return 'text-blue-600 dark:text-blue-400 font-semibold';
        return 'text-gray-700 dark:text-gray-300';
    };

    // ── Date click: if mentor meetings → show day modal, else → add form ──
    const handleDateClick = (day) => {
        const dateStr = makeDateStr(day);
        const dayData = dateMeetingMap[dateStr];
        if (dayData && dayData.total > 0) {
            setDayModal({ show: true, date: dateStr, meetings: dayData.meetings });
            return;
        }
        // No mentor meetings → open "Add Activity" form
        reset();
        clearErrors();
        setData({
            name: '', date: dateStr, start_time: '', end_time: '',
            description: '', priority: 'medium', pic: auth.user.name,
            location: '', status: 'scheduled', notify_target: 'all_user',
        });
        setModalMode('add');
        setActiveTab('details');
        setSelectedSchedule(null);
        setIsModalOpen(true);
    };

    const handleEventClick = (e, schedule) => {
        e.stopPropagation();
        reset();
        clearErrors();
        setData({
            name:          schedule.name,
            date:          schedule.date,
            start_time:    schedule.start_time ? schedule.start_time.substring(0, 5) : '',
            end_time:      schedule.end_time ? schedule.end_time.substring(0, 5) : '',
            description:   schedule.description,
            priority:      schedule.priority,
            pic:           schedule.pic,
            location:      schedule.location || '',
            status:        schedule.status || 'scheduled',
            notify_target: schedule.notify_target || 'all_user',
        });
        setModalMode('edit');
        setActiveTab('details');
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    // ── Messages ───────────────────────────────────────────────────────────
    const fetchMessages = async (scheduleId) => {
        setLoadingMessages(true);
        try {
            const response = await window.axios.get(route('api.schedules.messages', scheduleId));
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleArchiveMessage = async (messageId) => {
        try {
            await window.axios.patch(route('api.admin.schedule-messages.archive', messageId));
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeTab === 'messages' && selectedSchedule) {
            fetchMessages(selectedSchedule.id);
        }
    }, [activeTab, selectedSchedule]);

    // ── Deletion request approve / reject ──────────────────────────────────
    const handleApproveDeletion = async (meeting) => {
        setDeletionLoading(p => ({ ...p, [meeting.id]: 'approve' }));
        try {
            await window.axios.post(route('api.admin.schedules.approve-deletion', meeting.id));
            await fetchMentorMeetings();
            setDayModal(prev => ({
                ...prev,
                meetings: prev.meetings.filter(m => m.id !== meeting.id),
            }));
        } catch (e) {
            console.error('Approve deletion failed', e);
        } finally {
            setDeletionLoading(p => ({ ...p, [meeting.id]: null }));
        }
    };

    const handleRejectDeletion = async (meeting) => {
        setDeletionLoading(p => ({ ...p, [meeting.id]: 'reject' }));
        try {
            await window.axios.post(route('api.admin.schedules.reject-deletion', meeting.id));
            await fetchMentorMeetings();
            setDayModal(prev => ({
                ...prev,
                meetings: prev.meetings.map(m =>
                    m.id === meeting.id ? { ...m, status: 'scheduled' } : m
                ),
            }));
        } catch (e) {
            console.error('Reject deletion failed', e);
        } finally {
            setDeletionLoading(p => ({ ...p, [meeting.id]: null }));
        }
    };

    // ── Admin schedule helpers ─────────────────────────────────────────────
    const closeModal = () => { setIsModalOpen(false); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('schedule.store'), { onSuccess: () => closeModal() });
        } else {
            patch(route('schedule.update', selectedSchedule.id), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this activity?'))) {
            destroy(route('schedule.destroy', selectedSchedule.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const currentMonthSchedules = schedules.filter(s => {
        const sDate = new Date(s.date);
        return sDate.getMonth() === month && sDate.getFullYear() === year;
    });

    const getSchedulesForDay = (day) =>
        currentMonthSchedules.filter(s => new Date(s.date).getDate() === day);

    const fmtTime = (dt) =>
        dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

    // ── Calendar grid render ───────────────────────────────────────────────
    const renderCalendarGrid = () => {
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="h-28 sm:h-36 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700" />
            );
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dailySchedules = getSchedulesForDay(day);
            const dateStr = makeDateStr(day);
            const dayData = dateMeetingMap[dateStr];

            days.push(
                <div
                    key={day}
                    className={`h-28 sm:h-36 border p-1 transition duration-150 ease-in-out hover:brightness-95 cursor-pointer overflow-y-auto relative ${getCellBg(day)}`}
                    onClick={() => handleDateClick(day)}
                >
                    {/* Day number */}
                    <div className={`text-right text-sm mb-1 ${getDayNumberColor(day)}`}>
                        {day}
                        {/* Status indicator dot */}
                        {dayData?.pending > 0 && (
                            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 align-middle" title={__('Pending Approval')} />
                        )}
                        {!dayData?.pending && dayData?.total > 0 && (
                            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle" title={__('All Approved')} />
                        )}
                    </div>

                    {/* Admin schedule events */}
                    <div className="space-y-0.5">
                        {dailySchedules.slice(0, 2).map(schedule => (
                            <div
                                key={schedule.id}
                                onClick={(e) => handleEventClick(e, schedule)}
                                className={`text-xs px-1 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 ${
                                    schedule.priority === 'high'   ? 'bg-red-500' :
                                    schedule.priority === 'medium' ? 'bg-blue-500' : 'bg-emerald-500'
                                }`}
                                title={`${schedule.start_time} - ${schedule.name}`}
                            >
                                {schedule.start_time && <span className="mr-1">{schedule.start_time.substring(0, 5)}</span>}
                                {schedule.name}
                            </div>
                        ))}
                        {dailySchedules.length > 2 && (
                            <div className="text-xs text-gray-400 pl-1">+{dailySchedules.length - 2}</div>
                        )}

                        {/* Mentor meeting chips */}
                        {dayData?.meetings?.slice(0, 2).map(m => (
                            <div
                                key={`meeting-${m.id}`}
                                onClick={(e) => { e.stopPropagation(); setDayModal({ show: true, date: dateStr, meetings: dayData.meetings }); }}
                                className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 font-medium border ${
                                    m.status === 'deletion_requested'
                                        ? 'bg-red-100 text-red-700 border-red-300'
                                        : m.status === 'pending'
                                        ? 'bg-orange-100 text-orange-700 border-orange-300'
                                        : 'bg-green-100 text-green-700 border-green-300'
                                }`}
                                title={`${m.mentor?.name} — ${AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __('Meeting')}`}
                            >
                                🧑‍🏫 {m.mentor?.name?.split(' ')[0] ?? __('Mentor')}
                            </div>
                        ))}
                        {dayData && dayData.total > 2 + (dayData.meetings?.length > 2 ? 0 : 0) && dayData.meetings?.length > 2 && (
                            <div className="text-xs text-orange-400 pl-1">+{dayData.meetings.length - 2} mentor</div>
                        )}
                    </div>
                </div>
            );
        }
        return days;
    };

    // ─────────────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {__('Schedule')}
                    </h2>
                    {pendingMeetingsCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                            {pendingMeetingsCount} {__('pending')}
                        </span>
                    )}
                </div>
            }
        >
            <Head title={__('Schedule')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">

                    {/* ── Pending Banner ───────────────────────────────── */}
                    {showBanner && pendingMeetingsCount > 0 && (
                        <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-300 rounded-xl shadow-sm">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-orange-800">
                                    {pendingMeetingsCount === 1
                                        ? __('There is 1 mentor schedule waiting for your approval.')
                                        : __('There are :count mentor schedules waiting for your approval.').replace(':count', pendingMeetingsCount)}
                                </p>
                                <p className="text-xs text-orange-600 mt-0.5">
                                    {__('Orange cells = pending approval. Green cells = all approved. Click to view details.')}
                                </p>
                                <a
                                    href={route('admin.schedule-approval.index')}
                                    className="mt-2 inline-block text-xs font-semibold text-orange-700 underline hover:text-orange-900"
                                >
                                    {__('Go to Schedule Approval →')}
                                </a>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="flex-shrink-0 text-orange-400 hover:text-orange-600 p-1 rounded"
                                title={__('Dismiss')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* ── Calendar Card ─────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* Calendar Controls */}
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-xl font-bold">
                                    {new Date(year, month).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long' })} {year}
                                </h3>
                                <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-0 mb-2 text-center font-bold text-gray-600 dark:text-gray-400">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i}>
                                        {new Date(2024, 0, 7 + i).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { weekday: 'short' })}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-0">
                                {renderCalendarGrid()}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-200 border border-red-400 rounded" />
                                    <span className="text-red-700 font-medium">{__('Deletion Requested')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-orange-200 border border-orange-400 rounded" />
                                    <span className="text-orange-700 font-medium">{__('Pending Mentor Schedule')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-green-200 border border-green-400 rounded" />
                                    <span className="text-green-700 font-medium">{__('All Mentor Schedules Approved')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded" />
                                    <span>{__('High Priority')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded" />
                                    <span>{__('Medium Priority')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded" />
                                    <span>{__('Low Priority')}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {auth.user.role === 'admin' && (
                        <ScheduleApprovalList />
                    )}
                </div>
            </div>

            {/* ── Day Detail Modal (mentor meetings) ─────────────────────── */}
            {dayModal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setDayModal({ show: false, date: '', meetings: [] })}
                        />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="px-6 pt-5 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                        {__('Mentor Schedules')} —{' '}
                                        {new Date(dayModal.date + 'T00:00:00').toLocaleDateString('id-ID', {
                                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                        })}
                                    </h3>
                                    <button
                                        onClick={() => setDayModal({ show: false, date: '', meetings: [] })}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {dayModal.meetings.map(m => (
                                        <div
                                            key={m.id}
                                            className={`p-3 rounded-lg border ${
                                                m.status === 'deletion_requested'
                                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                                                    : m.status === 'pending'
                                                    ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700'
                                                    : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {m.mentor?.name ?? __('Mentor')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __('Meeting')}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                        {fmtTime(m.scheduled_at)} – {fmtTime(m.end_time)}
                                                        {m.location ? ` · ${m.location}` : ''}
                                                    </p>
                                                </div>
                                                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_BADGE[m.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    {STATUS_LABELS[m.status] ?? m.status}
                                                </span>
                                            </div>
                                            {m.status === 'deletion_requested' && (
                                                <div className="flex gap-2 mt-2 pt-2 border-t border-red-200 dark:border-red-700">
                                                    <button
                                                        onClick={() => handleApproveDeletion(m)}
                                                        disabled={!!deletionLoading[m.id]}
                                                        className="flex-1 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-md transition"
                                                    >
                                                        {deletionLoading[m.id] === 'approve' ? __('Deleting…') : __('Approve Deletion')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectDeletion(m)}
                                                        disabled={!!deletionLoading[m.id]}
                                                        className="flex-1 px-3 py-1.5 text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 border border-gray-300 rounded-md transition dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                                    >
                                                        {deletionLoading[m.id] === 'reject' ? __('Rejecting…') : __('Reject Deletion')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pending CTA */}
                                {dayModal.meetings.some(m => m.status === 'pending' || m.status === 'deletion_requested') && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <a
                                            href={route('admin.schedule-approval.index')}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700 hover:text-orange-900 underline"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            {__('Review pending schedules →')}
                                        </a>
                                    </div>
                                )}

                                {/* Also allow adding admin schedule for this date */}
                                <div className="mt-3">
                                    <button
                                        onClick={() => {
                                            setDayModal({ show: false, date: '', meetings: [] });
                                            reset();
                                            clearErrors();
                                            setData({
                                                name: '', date: dayModal.date, start_time: '', end_time: '',
                                                description: '', priority: 'medium', pic: auth.user.name,
                                                location: '', status: 'scheduled', notify_target: 'all_user',
                                            });
                                            setModalMode('add');
                                            setActiveTab('details');
                                            setSelectedSchedule(null);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                                    >
                                        {__('+ Add activity for this date')}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end">
                                <button
                                    onClick={() => setDayModal({ show: false, date: '', meetings: [] })}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 shadow-sm"
                                >
                                    {__('Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Activity CRUD Modal ───────────────────────────────────── */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {modalMode === 'add' ? __('Add Activity') : __('Edit Activity')}
                    </h2>

                    {modalMode === 'edit' && (
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                            {['details', 'messages'].map(tab => (
                                <button
                                    key={tab}
                                    className={`py-2 px-4 text-sm font-medium ${
                                        activeTab === tab
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'details' ? __('Details') : __('Communication')}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'details' ? (
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value={__('Activity Name')} />
                                <TextInput id="name" className="mt-1 block w-full" value={data.name}
                                    onChange={(e) => setData('name', e.target.value)} required isFocused />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="date" value={__('Date')} />
                                    <TextInput id="date" type="date" className="mt-1 block w-full" value={data.date}
                                        onChange={(e) => setData('date', e.target.value)} required />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="priority" value={__('Priority')} />
                                    <select id="priority"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.priority} onChange={(e) => setData('priority', e.target.value)}>
                                        <option value="low">{__('Low')}</option>
                                        <option value="medium">{__('Medium')}</option>
                                        <option value="high">{__('High')}</option>
                                    </select>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="start_time" value={__('Start Time')} />
                                    <TextInput id="start_time" type="time" className="mt-1 block w-full" value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)} required />
                                    <InputError message={errors.start_time} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="end_time" value={__('End Time')} />
                                    <TextInput id="end_time" type="time" className="mt-1 block w-full" value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)} required />
                                    <InputError message={errors.end_time} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="location" value={__('Location')} />
                                    <TextInput id="location" className="mt-1 block w-full" value={data.location}
                                        onChange={(e) => setData('location', e.target.value)} />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="status" value={__('Status')} />
                                    <select id="status"
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        <option value="scheduled">{__('Scheduled')}</option>
                                        <option value="ongoing">{__('Ongoing')}</option>
                                        <option value="completed">{__('Completed')}</option>
                                        <option value="cancelled">{__('Cancelled')}</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="notify_target" value={__('Notify To')} />
                                <select id="notify_target"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.notify_target} onChange={(e) => setData('notify_target', e.target.value)}>
                                    <option value="all_user">{__('All Users')}</option>
                                    <option value="mentor_only">{__('Mentor Only')}</option>
                                    <option value="participant_only">{__('Participant Only')}</option>
                                    <option value="staff_only">{__('Staff Only')}</option>
                                </select>
                                <InputError message={errors.notify_target} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value={__('Description')} />
                                <textarea id="description" rows="3"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="pic" value={__('PIC')} />
                                <TextInput id="pic" className="mt-1 block w-full" value={data.pic}
                                    onChange={(e) => setData('pic', e.target.value)} required />
                                <InputError message={errors.pic} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-6">
                                {modalMode === 'edit' && (
                                    <DangerButton type="button" onClick={handleDelete} className="mr-auto" disabled={processing}>
                                        {__('Delete')}
                                    </DangerButton>
                                )}
                                <SecondaryButton onClick={closeModal} className="mr-3">{__('Cancel')}</SecondaryButton>
                                <PrimaryButton disabled={processing}>
                                    {modalMode === 'add' ? __('Add') : __('Save Changes')}
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {loadingMessages ? (
                                <div className="text-center py-4 text-gray-500">{__('Loading messages...')}</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">{__('No messages found.')}</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                    {msg.user?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(msg.created_at).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {msg.message}
                                            </div>
                                            <div className="mt-2 flex justify-end">
                                                <button onClick={() => handleArchiveMessage(msg.id)}
                                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 font-medium">
                                                    {__('Archive')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end mt-6">
                                <SecondaryButton onClick={closeModal}>{__('Close')}</SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
