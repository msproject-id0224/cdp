import { useState, useEffect, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
import { useTrans } from '@/Utils/lang';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import SelectInput from '@/Components/SelectInput';

const STATUS_BADGE = {
    pending:                'bg-orange-100 text-orange-700',
    scheduled:              'bg-green-100 text-green-700',
    confirmed:              'bg-blue-100 text-blue-700',
    rejected:               'bg-red-100 text-red-700',
    modification_requested: 'bg-yellow-100 text-yellow-700',
    completed:              'bg-gray-100 text-gray-700',
};

export default function ScheduleTab() {
    const __ = useTrans();
    const { locale } = usePage().props;

    const AGENDA_LABELS = {
        pengisian_rmd:  __('Pengisian RMD'),
        pertemuan_umum: __('Pertemuan Umum'),
        rapat_youth:    __('Rapat Youth'),
        lainnya:        __('Others'),
    };

    const STATUS_LABELS = {
        pending:                __('Pending Approval'),
        scheduled:              __('Scheduled'),
        confirmed:              __('Confirmed'),
        rejected:               __('Rejected'),
        modification_requested: __('Modification Requested'),
        completed:              __('Completed'),
    };
    // ── Admin Schedule Table state (existing) ──────────────────────────────
    const [schedules, setSchedules]     = useState([]);
    const [loading, setLoading]         = useState(false);
    const [pagination, setPagination]   = useState({});
    const [filters, setFilters]         = useState({
        search: '', status: 'all', date: '', priority: 'all', page: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode]     = useState('add');
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '', date: '', start_time: '', end_time: '', all_day: false,
        description: '', priority: 'medium', pic: '', location: '', status: 'scheduled',
        notify_target: 'all_user',
    });

    // ── Mentor Meetings calendar state ─────────────────────────────────────
    const [mentorMeetings, setMentorMeetings]       = useState([]);
    const [showBanner, setShowBanner]               = useState(true);
    const [dayModal, setDayModal]                   = useState({ show: false, date: '', meetings: [] });
    const [generalMeetingDates, setGeneralMeetingDates] = useState(new Set());
    const [detailModal, setDetailModal]             = useState({ show: false, meeting: null, loading: false });

    // ── Fetch admin schedules (existing) ──────────────────────────────────
    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const params = { ...filters };
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === 'all') delete params[key];
            });
            const response = await window.axios.get(route('api.schedules'), { params });
            setSchedules(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchSchedules(), 300);
        return () => clearTimeout(timer);
    }, [filters]);

    // ── Fetch all mentor meetings for calendar ────────────────────────────
    const fetchMentorMeetings = async () => {
        try {
            const res = await window.axios.get(route('api.admin.schedules.all'));
            setMentorMeetings(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error('Error fetching mentor meetings:', e);
        }
    };

    useEffect(() => {
        fetchMentorMeetings();
        fetchGeneralMeetingDates();
    }, []);

    const fetchGeneralMeetingDates = async () => {
        try {
            const res = await window.axios.get(route('api.general-meeting-dates'));
            setGeneralMeetingDates(new Set(res.data));
        } catch (e) {
            console.error('Error fetching general meeting dates:', e);
        }
    };

    const toggleGeneralMeetingDate = async (dateStr, e) => {
        e.stopPropagation();
        try {
            const res = await window.axios.post(route('api.admin.general-meeting-dates.toggle'), { date: dateStr });
            setGeneralMeetingDates(prev => {
                const next = new Set(prev);
                res.data.enabled ? next.add(dateStr) : next.delete(dateStr);
                return next;
            });
        } catch (e) {
            console.error('Error toggling general meeting date:', e);
        }
    };

    const openMeetingDetail = async (meetingId) => {
        setDetailModal({ show: true, meeting: null, loading: true });
        try {
            const res = await window.axios.get(route('api.admin.schedules.details', meetingId));
            setDetailModal({ show: true, meeting: res.data, loading: false });
        } catch (e) {
            console.error('Error fetching meeting details:', e);
            setDetailModal({ show: false, meeting: null, loading: false });
        }
    };

    // ── Compute date → meetings map (treat stored times as UTC, same as MentorScheduleTab) ──
    const dateMeetingMap = useMemo(() => {
        const map = {};
        mentorMeetings.forEach(m => {
            const raw = m.scheduled_at || '';
            if (!raw) return;
            const utc = raw.endsWith('Z') ? raw : raw + 'Z';
            const dateStr = new Date(utc).toLocaleDateString('en-CA');
            if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0, meetings: [] };
            map[dateStr].total++;
            if (['pending', 'modification_requested'].includes(m.status)) map[dateStr].pending++;
            else if (['scheduled', 'confirmed'].includes(m.status))       map[dateStr].approved++;
            map[dateStr].meetings.push(m);
        });
        return map;
    }, [mentorMeetings]);

    const pendingMeetingsCount = useMemo(
        () => mentorMeetings.filter(m => m.status === 'pending').length,
        [mentorMeetings],
    );

    // ── Calendar events (treat stored times as UTC, same as MentorScheduleTab) ──
    const calendarEvents = useMemo(() =>
        mentorMeetings.map(m => {
            const raw = m.scheduled_at || '';
            const start = raw ? (raw.endsWith('Z') ? raw : raw + 'Z') : null;
            const rawEnd = m.end_time || '';
            const end   = rawEnd ? (rawEnd.endsWith('Z') ? rawEnd : rawEnd + 'Z') : null;
            const isPending = ['pending', 'modification_requested'].includes(m.status);
            return {
                id:              `meeting-${m.id}`,
                title:           `${m.mentor?.name ?? __('Mentor')} — ${AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __('Meeting')}`,
                start,
                end,
                backgroundColor: isPending ? '#F97316' : '#22C55E',
                borderColor:     isPending ? '#EA580C' : '#16A34A',
                textColor:       '#ffffff',
                extendedProps:   { meeting: m },
            };
        }),
    [mentorMeetings]);

    // ── Calendar date-cell class names ────────────────────────────────────
    const dayCellClassNames = (arg) => {
        const dateStr = arg.date.toLocaleDateString('en-CA');
        const dayData = dateMeetingMap[dateStr];
        const classes = [];
        if (generalMeetingDates.has(dateStr)) classes.push('fc-day-general-meeting');
        if (dayData?.pending > 0) classes.push('fc-day-mentor-pending');
        else if (dayData?.total > 0) classes.push('fc-day-mentor-approved');
        return classes;
    };

    // ── Calendar date-cell content (with General Meeting checkbox) ────────
    const dayCellContent = (arg) => {
        const dateStr = arg.date.toLocaleDateString('en-CA');
        const isGM = generalMeetingDates.has(dateStr);
        return (
            <div className="fc-daygrid-day-top-inner w-full">
                <span className="fc-daygrid-day-number">{arg.dayNumberText}</span>
                <label
                    className="flex items-center gap-0.5 cursor-pointer mt-0.5 select-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="checkbox"
                        checked={isGM}
                        onChange={(e) => toggleGeneralMeetingDate(dateStr, e)}
                        className="w-3 h-3 accent-green-600 cursor-pointer"
                    />
                    <span className={`text-[9px] font-bold leading-tight ${isGM ? 'text-green-700' : 'text-red-500'}`}>
                        {isGM ? 'A' : 'N'}
                    </span>
                </label>
            </div>
        );
    };

    // ── Handle date cell click ─────────────────────────────────────────────
    const handleDateClick = (info) => {
        const dayData = dateMeetingMap[info.dateStr];
        if (dayData && dayData.total > 0) {
            setDayModal({ show: true, date: info.dateStr, meetings: dayData.meetings });
        }
    };

    // ── Handle calendar event click ────────────────────────────────────────
    const handleEventClick = ({ event }) => {
        const m = event.extendedProps.meeting;
        const raw = m.scheduled_at || '';
        const utc = raw ? (raw.endsWith('Z') ? raw : raw + 'Z') : '';
        const dateStr = utc ? new Date(utc).toLocaleDateString('en-CA') : '';
        const dayData = dateMeetingMap[dateStr];
        if (dayData) setDayModal({ show: true, date: dateStr, meetings: dayData.meetings });
    };

    // ── Existing modal helpers ────────────────────────────────────────────
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (url) => {
        if (!url) return;
        const urlParams = new URL(url).searchParams;
        setFilters(prev => ({ ...prev, page: urlParams.get('page') }));
    };

    const openModal = (mode, schedule = null) => {
        setModalMode(mode);
        setSelectedSchedule(schedule);
        clearErrors();
        if (mode === 'edit' && schedule) {
            setData({
                name:          schedule.name,
                date:          schedule.date,
                all_day:       schedule.start_time === '00:00:00' && schedule.end_time === '23:59:00',
                start_time:    schedule.start_time ? schedule.start_time.substring(0, 5) : '',
                end_time:      schedule.end_time ? schedule.end_time.substring(0, 5) : '',
                description:   schedule.description || '',
                priority:      schedule.priority,
                pic:           schedule.pic,
                location:      schedule.location || '',
                status:        schedule.status || 'scheduled',
                notify_target: schedule.notify_target || 'all_user',
            });
        } else {
            reset();
            setData('date', new Date().toISOString().split('T')[0]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); reset(); };

    const submit = (e) => {
        e.preventDefault();
        const action = modalMode === 'add'
            ? route('schedule.store')
            : route('schedule.update', selectedSchedule.id);
        const method = modalMode === 'add' ? post : patch;
        method(action, { onSuccess: () => { closeModal(); fetchSchedules(); } });
    };

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this activity?'))) {
            destroy(route('schedule.destroy', selectedSchedule.id), {
                onSuccess: () => { closeModal(); fetchSchedules(); },
            });
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':   return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-blue-100 text-blue-800';
            case 'low':    return 'bg-green-100 text-green-800';
            default:       return 'bg-gray-100 text-gray-800';
        }
    };

    const fmtDate = (dateStr) =>
        dateStr ? new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        }) : '';

    const fmtTime = (dt) =>
        dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Pending Banner ────────────────────────────────────────── */}
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
                            {__('Click an orange date cell in the calendar below to review and approve.')}
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

            {/* ── Mentor Meetings Calendar ──────────────────────────────── */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2 flex-wrap">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {__('Mentor Meeting Calendar')}
                    <span className="ml-auto flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-orange-600">
                            <span className="w-3 h-3 rounded-sm bg-orange-400 inline-block"></span>
                            {__('Pending Approval')}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                            <span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span>
                            {__('All Approved')}
                        </span>
                        <span className="flex items-center gap-1 text-green-700">
                            <span className="w-3 h-3 rounded-sm bg-green-300 inline-block"></span>
                            {__('General Meeting')}
                        </span>
                    </span>
                </h3>

                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    locale={locale === 'id' ? idLocale : 'en'}
                    headerToolbar={{
                        left:   'prev,next today',
                        center: 'title',
                        right:  '',
                    }}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    dayCellClassNames={dayCellClassNames}
                    dayCellContent={dayCellContent}
                    dayMaxEvents={3}
                    height="auto"
                    eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                />

                <style>{`
                    .fc-day-general-meeting { background-color: #DCFCE7 !important; }
                    .fc-day-general-meeting .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-mentor-pending { background-color: #FED7AA !important; }
                    .fc-day-mentor-pending .fc-daygrid-day-number { color: #C2410C; font-weight: 700; }
                    .fc-day-mentor-approved { background-color: #BBF7D0 !important; cursor: pointer; }
                    .fc-day-mentor-approved .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-mentor-pending:hover, .fc-day-mentor-approved:hover { filter: brightness(0.94); }
                    .fc-daygrid-day-top-inner { display: flex; flex-direction: column; align-items: flex-end; padding: 2px 4px; }
                    .fc-event { cursor: pointer; border-radius: 4px; font-size: 0.72rem; }

                    /* ── Dark mode ── */
                    .dark .fc { color: #e5e7eb; }
                    .dark .fc-toolbar-title { color: #f3f4f6 !important; }
                    .dark .fc th,
                    .dark .fc td,
                    .dark .fc-scrollgrid,
                    .dark .fc-scrollgrid-section > td { border-color: #374151 !important; }
                    .dark .fc .fc-col-header-cell { background-color: #1f2937; }
                    .dark .fc .fc-col-header-cell-cushion { color: #9ca3af !important; }
                    .dark .fc .fc-daygrid-day { background-color: #1f2937; }
                    .dark .fc .fc-daygrid-day-number { color: #d1d5db !important; }
                    .dark .fc .fc-day-other .fc-daygrid-day-number { color: #6b7280 !important; }
                    .dark .fc .fc-day-today { background-color: #312e81 !important; }
                    .dark .fc .fc-day-today .fc-daygrid-day-number { color: #a5b4fc !important; }
                    .dark .fc .fc-daygrid-more-link { color: #818cf8 !important; }
                    .dark .fc .fc-button {
                        background-color: #374151 !important;
                        border-color: #4b5563 !important;
                        color: #e5e7eb !important;
                    }
                    .dark .fc .fc-button:hover {
                        background-color: #4b5563 !important;
                        border-color: #6b7280 !important;
                    }
                    .dark .fc .fc-button:not(:disabled):active,
                    .dark .fc .fc-button-active {
                        background-color: #4f46e5 !important;
                        border-color: #4338ca !important;
                    }
                    .dark .fc-day-general-meeting { background-color: #14532d !important; }
                    .dark .fc-day-general-meeting .fc-daygrid-day-number { color: #86efac !important; }
                    .dark .fc-day-mentor-pending  { background-color: #7c2d12 !important; }
                    .dark .fc-day-mentor-pending  .fc-daygrid-day-number { color: #fdba74 !important; }
                    .dark .fc-day-mentor-approved { background-color: #14532d !important; }
                    .dark .fc-day-mentor-approved .fc-daygrid-day-number { color: #86efac !important; }

                    @media (max-width: 640px) {
                        .fc .fc-toolbar {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 4px;
                            align-items: center;
                        }
                        .fc .fc-toolbar-chunk:nth-child(2) {
                            order: -1;
                            width: 100%;
                            text-align: center;
                        }
                        .fc .fc-toolbar-title { font-size: 1.1rem; }
                        .fc .fc-button {
                            padding: 0.2rem 0.45rem;
                            font-size: 0.7rem;
                        }
                        .fc .fc-button .fc-icon { font-size: 0.9rem; }

                        .fc .fc-daygrid-day-frame {
                            min-height: unset !important;
                            aspect-ratio: 1 / 1;
                            overflow: hidden;
                        }
                        .fc .fc-daygrid-day-number {
                            font-size: 0.65rem;
                            padding: 2px 3px !important;
                        }
                        .fc .fc-daygrid-event {
                            height: 5px;
                            border-radius: 3px;
                            margin: 1px 2px !important;
                        }
                        .fc .fc-event-title,
                        .fc .fc-event-time { display: none; }
                        .fc .fc-daygrid-more-link { font-size: 0.6rem; }
                    }
                `}</style>
            </div>

            {/* ── Admin Schedule Filters & Table ────────────────────────── */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <TextInput
                            placeholder={__('Search schedules...')}
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full sm:w-64"
                        />
                        <SelectInput
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full sm:w-40"
                        >
                            <option value="all">{__('All Status')}</option>
                            <option value="scheduled">{__('Scheduled')}</option>
                            <option value="ongoing">{__('Ongoing')}</option>
                            <option value="completed">{__('Completed')}</option>
                            <option value="cancelled">{__('Cancelled')}</option>
                        </SelectInput>
                        <TextInput
                            type="date"
                            value={filters.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                            className="w-full sm:w-40"
                        />
                    </div>
                    <PrimaryButton onClick={() => openModal('add')}>
                        {__('Add Schedule')}
                    </PrimaryButton>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Activity')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Date & Time')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Priority')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Notify To')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('PIC')}</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Status')}</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">{__('Loading...')}</td>
                                    </tr>
                                ) : schedules.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">{__('No schedules found.')}</td>
                                    </tr>
                                ) : (
                                    schedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                                                {schedule.location && <div className="text-xs text-gray-500">{schedule.location}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(schedule.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {schedule.start_time?.substring(0, 5) || '-'} – {schedule.end_time?.substring(0, 5) || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                                                    {__(schedule.priority)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    {schedule.notify_target === 'all_user'        ? __('All Users')
                                                    : schedule.notify_target === 'mentor_only'    ? __('Mentor Only')
                                                    : schedule.notify_target === 'participant_only' ? __('Participant Only')
                                                    : schedule.notify_target === 'staff_only'     ? __('Staff Only')
                                                    : __('All Users')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.pic}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                                                    {__(schedule.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openModal('edit', schedule)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {__('Edit')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagination.links && pagination.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-sm text-gray-700">
                                    {__('Showing')} {pagination.from} {__('to')} {pagination.to} {__('of')} {pagination.total} {__('results')}
                                </div>
                                <div className="flex gap-1">
                                    {pagination.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(link.url)}
                                            disabled={!link.url || link.active}
                                            className={`px-3 py-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : !link.url
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Day Modal (click on a date cell) ─────────────────────── */}
            {dayModal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setDayModal({ show: false, date: '', meetings: [] })} />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-6 pt-5 pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {__('Mentor Schedules')} — {fmtDate(dayModal.date)}
                                    </h3>
                                    <button
                                        onClick={() => setDayModal({ show: false, date: '', meetings: [] })}
                                        className="text-gray-400 hover:text-gray-600"
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
                                            className={`p-3 rounded-lg border ${m.status === 'pending' ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {m.mentor?.name ?? __('Mentor')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {AGENDA_LABELS[m.agenda_type] ?? m.agenda ?? __('Meeting')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {fmtTime(m.scheduled_at)} – {fmtTime(m.end_time)}
                                                        {m.location ? ` · ${m.location}` : ''}
                                                    </p>
                                                </div>
                                                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[m.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                    {STATUS_LABELS[m.status] ?? m.status}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    onClick={() => openMeetingDetail(m.id)}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline"
                                                >
                                                    {__('View Details')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {dayModal.meetings.some(m => m.status === 'pending') && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
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
                            </div>
                            <div className="bg-gray-50 px-6 py-3 flex justify-end">
                                <button
                                    onClick={() => setDayModal({ show: false, date: '', meetings: [] })}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
                                >
                                    {__('Close')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Meeting Detail Modal ──────────────────────────────────── */}
            {detailModal.show && (
                <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" onClick={() => setDetailModal({ show: false, meeting: null, loading: false })} />
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            {detailModal.loading ? (
                                <div className="px-6 py-10 flex items-center justify-center">
                                    <svg className="animate-spin h-6 w-6 text-indigo-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    <span className="text-sm text-gray-500">{__('Loading')}…</span>
                                </div>
                            ) : detailModal.meeting && (() => {
                                const m = detailModal.meeting;
                                const mentorName = m.mentor ? `${m.mentor.first_name ?? ''} ${m.mentor.last_name ?? ''}`.trim() : __('Mentor');
                                const approverName = m.approved_by ? (m.approved_by_user ? `${m.approved_by_user.first_name ?? ''} ${m.approved_by_user.last_name ?? ''}`.trim() : String(m.approved_by)) : null;
                                const approvedByUser = m.approvedBy ?? null;
                                const approvedByName = approvedByUser ? `${approvedByUser.first_name ?? ''} ${approvedByUser.last_name ?? ''}`.trim() : null;
                                return (
                                    <>
                                        <div className="bg-white px-6 pt-5 pb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base font-semibold text-gray-900">
                                                    {__('Meeting Details')}
                                                </h3>
                                                <button
                                                    onClick={() => setDetailModal({ show: false, meeting: null, loading: false })}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                                {/* Mentor */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Mentor')}</p>
                                                    <p className="mt-0.5 text-gray-800 font-medium">{mentorName}</p>
                                                    {m.mentor?.email && <p className="text-xs text-gray-500">{m.mentor.email}</p>}
                                                </div>

                                                {/* Status */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Status')}</p>
                                                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[m.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                        {STATUS_LABELS[m.status] ?? m.status}
                                                    </span>
                                                </div>

                                                {/* Agenda Type */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Agenda Type')}</p>
                                                    <p className="mt-0.5 text-gray-800">{AGENDA_LABELS[m.agenda_type] ?? m.agenda_type ?? '—'}</p>
                                                </div>

                                                {/* Date & Time */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Date & Time')}</p>
                                                    <p className="mt-0.5 text-gray-800">{fmtDate(m.scheduled_at)} {fmtTime(m.scheduled_at)} – {fmtTime(m.end_time)}</p>
                                                </div>

                                                {/* Location */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Location')}</p>
                                                    <p className="mt-0.5 text-gray-800">{m.location || '—'}</p>
                                                </div>

                                                {/* Meeting Link */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Meeting Link')}</p>
                                                    {m.meeting_link
                                                        ? <a href={m.meeting_link} target="_blank" rel="noopener noreferrer" className="mt-0.5 text-indigo-600 underline break-all">{m.meeting_link}</a>
                                                        : <p className="mt-0.5 text-gray-800">—</p>}
                                                </div>

                                                {/* Max Participants */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Max Participants')}</p>
                                                    <p className="mt-0.5 text-gray-800">{m.max_participants ?? '—'}</p>
                                                </div>

                                                {/* Approved By */}
                                                {m.approved_at && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Approved By')}</p>
                                                        <p className="mt-0.5 text-gray-800">{approvedByName ?? '—'}</p>
                                                        <p className="text-xs text-gray-500">{fmtDate(m.approved_at)}</p>
                                                    </div>
                                                )}

                                                {/* Agenda (full width) */}
                                                {m.agenda && (
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Agenda')}</p>
                                                        <p className="mt-0.5 text-gray-800 whitespace-pre-wrap">{m.agenda}</p>
                                                    </div>
                                                )}

                                                {/* Tools & Materials */}
                                                {m.tools_materials && (
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Tools & Materials')}</p>
                                                        <p className="mt-0.5 text-gray-800 whitespace-pre-wrap">{m.tools_materials}</p>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {m.notes && (
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{__('Notes')}</p>
                                                        <p className="mt-0.5 text-gray-800 whitespace-pre-wrap">{m.notes}</p>
                                                    </div>
                                                )}

                                                {/* Rejection Reason */}
                                                {m.rejection_reason && (
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">{__('Rejection / Modification Reason')}</p>
                                                        <p className="mt-0.5 text-red-700 whitespace-pre-wrap">{m.rejection_reason}</p>
                                                    </div>
                                                )}

                                                {/* Participants */}
                                                {m.participants && m.participants.length > 0 && (
                                                    <div className="sm:col-span-2">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{__('Participants')} ({m.participants.length})</p>
                                                        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                                                            {m.participants.map(p => (
                                                                <li key={p.id} className="flex items-center justify-between px-3 py-1.5 bg-white">
                                                                    <span className="text-sm text-gray-800">{`${p.first_name ?? ''} ${p.last_name ?? ''}`.trim()}</span>
                                                                    {p.pivot?.status && (
                                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.pivot.status === 'confirmed' ? 'bg-green-100 text-green-700' : p.pivot.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                            {p.pivot.status}
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-6 py-3 flex justify-end">
                                            <button
                                                onClick={() => setDetailModal({ show: false, meeting: null, loading: false })}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
                                            >
                                                {__('Close')}
                                            </button>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Admin Schedule CRUD Modal ─────────────────────────────── */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        {modalMode === 'add' ? __('Add Schedule') : __('Edit Schedule')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value={__('Activity Name')} />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="date" value={__('Date')} />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="status" value={__('Status')} />
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="scheduled">{__('Scheduled')}</option>
                                    <option value="ongoing">{__('Ongoing')}</option>
                                    <option value="completed">{__('Completed')}</option>
                                    <option value="cancelled">{__('Cancelled')}</option>
                                </SelectInput>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.all_day}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setData(d => ({
                                            ...d,
                                            all_day: checked,
                                            start_time: checked ? '00:00' : '',
                                            end_time: checked ? '23:59' : '',
                                        }));
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {__('All Day')} <span className="text-gray-400 font-normal">(24 {__('hours')})</span>
                                </span>
                            </label>

                            {!data.all_day && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="start_time" value={__('Start Time')} />
                                        <TextInput
                                            id="start_time"
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.start_time} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="end_time" value={__('End Time')} />
                                        <TextInput
                                            id="end_time"
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.end_time} className="mt-2" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="location" value={__('Location')} />
                            <TextInput
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.location} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="priority" value={__('Priority')} />
                                <SelectInput
                                    id="priority"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="low">{__('Low')}</option>
                                    <option value="medium">{__('Medium')}</option>
                                    <option value="high">{__('High')}</option>
                                </SelectInput>
                                <InputError message={errors.priority} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="pic" value={__('PIC')} />
                                <TextInput
                                    id="pic"
                                    value={data.pic}
                                    onChange={(e) => setData('pic', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.pic} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value={__('Description')} />
                            <TextInput
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notify_target" value={__('Notify To')} />
                            <SelectInput
                                id="notify_target"
                                value={data.notify_target}
                                onChange={(e) => setData('notify_target', e.target.value)}
                                className="mt-1 block w-full"
                            >
                                <option value="all_user">{__('All Users')}</option>
                                <option value="mentor_only">{__('Mentor Only')}</option>
                                <option value="participant_only">{__('Participant Only')}</option>
                                <option value="staff_only">{__('Staff Only')}</option>
                            </SelectInput>
                            <InputError message={errors.notify_target} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        {modalMode === 'edit' ? (
                            <DangerButton type="button" onClick={handleDelete} disabled={processing}>
                                {__('Delete')}
                            </DangerButton>
                        ) : <div />}
                        <div className="flex gap-3">
                            <SecondaryButton onClick={closeModal}>{__('Cancel')}</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {modalMode === 'add' ? __('Create') : __('Update')}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
