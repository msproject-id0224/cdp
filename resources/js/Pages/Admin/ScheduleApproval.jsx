import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import axios from 'axios';

const AGENDA_LABELS = {
    pengisian_rmd: 'Pengisian RMD',
    pertemuan_umum: 'Pertemuan Umum',
    rapat_youth:    'Rapat Youth',
    lainnya:        'Lainnya',
};

export default function ScheduleApproval({ auth }) {
    const [schedules, setSchedules]               = useState({ data: [], meta: {} });
    const [calendarSchedules, setCalendarSchedules] = useState([]);
    const [loading, setLoading]                   = useState(true);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [showBanner, setShowBanner]             = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        start_date: '',
        end_date: '',
        sort_by: 'created_at',
        sort_order: 'desc',
    });
    const [modal, setModal]         = useState({ show: false, type: '', data: null });
    const [reason, setReason]       = useState('');
    const [processing, setProcessing] = useState(false);
    const [notification, setNotification] = useState(null);
    const tableRef = useRef(null);

    // Deletion requests state
    const [deletionRequests, setDeletionRequests] = useState({ data: [], total: 0 });
    const [deletionLoading, setDeletionLoading]   = useState(true);

    // Fetch all pending for calendar (high per_page, no filters)
    const fetchCalendarSchedules = async () => {
        try {
            const response = await axios.get(route('api.admin.schedules.pending'), {
                params: { per_page: 500, sort_by: 'scheduled_at', sort_order: 'asc' }
            });
            setCalendarSchedules(response.data.data || []);
        } catch (error) {
            console.error('Error fetching calendar schedules:', error);
        }
    };

    // Fetch paginated list for table
    const fetchSchedules = async (page = 1) => {
        setLoading(true);
        try {
            const params = { ...filters, page };
            const response = await axios.get(route('api.admin.schedules.pending'), { params });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch deletion requests
    const fetchDeletionRequests = async () => {
        setDeletionLoading(true);
        try {
            const response = await axios.get(route('api.admin.schedules.deletion-requests'), {
                params: { per_page: 50 }
            });
            setDeletionRequests(response.data);
        } catch (error) {
            console.error('Error fetching deletion requests:', error);
        } finally {
            setDeletionLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarSchedules();
        fetchDeletionRequests();
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [filters]);

    // Refresh all after an action
    const refreshAll = () => {
        fetchCalendarSchedules();
        fetchSchedules();
        fetchDeletionRequests();
    };

    // Calendar events derived from all pending schedules
    const calendarEvents = calendarSchedules.map(s => ({
        id: `pending-${s.id}`,
        title: `${s.mentor?.name ?? __('Mentor')} — ${AGENDA_LABELS[s.agenda_type] ?? s.agenda ?? __('Meeting')}`,
        start: s.scheduled_at,
        end:   s.end_time,
        backgroundColor: '#F59E0B',
        borderColor:     '#D97706',
        textColor:       '#1C1917',
        extendedProps:   { schedule: s },
    }));

    const handleCalendarEventClick = ({ event }) => {
        openModal('preview', event.extendedProps.schedule);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectSchedule = (id) => {
        setSelectedSchedules(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedSchedules(e.target.checked ? schedules.data.map(s => s.id) : []);
    };

    const openModal = (type, data = null) => {
        setModal({ show: true, type, data });
        setReason('');
    };

    const closeModal = () => {
        setModal({ show: false, type: '', data: null });
        setReason('');
    };

    const handleAction = async () => {
        setProcessing(true);
        try {
            if (modal.type === 'approve') {
                await axios.post(route('api.admin.schedules.approve', modal.data.id));
            } else if (modal.type === 'reject') {
                await axios.post(route('api.admin.schedules.reject', modal.data.id), { reason });
            } else if (modal.type === 'request_modification') {
                await axios.post(route('api.admin.schedules.request-modification', modal.data.id), { reason });
            } else if (modal.type === 'bulk_approve') {
                await axios.post(route('api.admin.schedules.bulk-approve'), { ids: selectedSchedules });
                setSelectedSchedules([]);
            } else if (modal.type === 'bulk_reject') {
                await axios.post(route('api.admin.schedules.bulk-reject'), { ids: selectedSchedules, reason });
                setSelectedSchedules([]);
            } else if (modal.type === 'approve_deletion') {
                await axios.post(route('api.admin.schedules.approve-deletion', modal.data.id));
            } else if (modal.type === 'reject_deletion') {
                await axios.post(route('api.admin.schedules.reject-deletion', modal.data.id), { reason });
            }

            closeModal();
            refreshAll();
            const successMessages = {
                approve:           __('Schedule approved successfully.'),
                reject:            __('Schedule rejected successfully.'),
                request_modification: __('Modification requested successfully.'),
                bulk_approve:      __('Schedules approved successfully.'),
                bulk_reject:       __('Schedules rejected successfully.'),
                approve_deletion:  __('Meeting deleted successfully.'),
                reject_deletion:   __('Deletion request rejected. Meeting has been restored.'),
            };
            showNotification('success', successMessages[modal.type] ?? __('Action completed successfully.'));
        } catch (error) {
            console.error('Error performing action:', error);
            showNotification('error', __('An error occurred. Please try again.'));
        } finally {
            setProcessing(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3500);
    };

    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sort_by: field,
            sort_order: prev.sort_by === field && prev.sort_order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const renderSortIcon = (field) => {
        if (filters.sort_by !== field) return null;
        return filters.sort_order === 'asc' ? ' ↑' : ' ↓';
    };

    const pendingCount = calendarSchedules.length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {__('Schedule Approval Dashboard')}
                    </h2>
                    {pendingCount > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            {pendingCount} {__('pending')}
                        </span>
                    )}
                </div>
            }
        >
            <Head title={__('Schedule Approval')} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* ── Pending Approval Banner ── */}
                    {showBanner && pendingCount > 0 && (
                        <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-300 rounded-xl shadow-sm">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-amber-800">
                                    {pendingCount === 1
                                        ? __('There is 1 mentor schedule waiting for your approval.')
                                        : __('There are :count mentor schedules waiting for your approval.').replace(':count', pendingCount)}
                                </p>
                                <p className="text-xs text-amber-600 mt-0.5">
                                    {__('Review the calendar below and approve or reject each schedule.')}
                                </p>
                                <button
                                    onClick={() => tableRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="mt-2 text-xs font-semibold text-amber-700 underline hover:text-amber-900"
                                >
                                    {__('Go to schedule list →')}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowBanner(false)}
                                className="flex-shrink-0 text-amber-500 hover:text-amber-700 p-1 rounded"
                                title={__('Dismiss')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* ── Calendar View ── */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {__('Pending Meeting Calendar')}
                            <span className="ml-auto flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>
                                {__('Pending Approval')}
                            </span>
                        </h3>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            locale={idLocale}
                            headerToolbar={{
                                left:   'prev,next today',
                                center: 'title',
                                right:  '',
                            }}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            eventClick={handleCalendarEventClick}
                            dayMaxEvents={3}
                            height="auto"
                            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                            dayCellClassNames={(arg) => {
                                const dateStr = arg.date.toISOString().split('T')[0];
                                const hasPending = calendarSchedules.some(s =>
                                    s.scheduled_at && s.scheduled_at.startsWith(dateStr)
                                );
                                return hasPending ? ['fc-day-pending'] : [];
                            }}
                        />
                        <style>{`
                            .fc-day-pending { background-color: #FFFBEB !important; }
                            .fc-day-pending .fc-daygrid-day-number { color: #B45309; font-weight: 700; }
                            .fc-event { cursor: pointer; border-radius: 4px; font-size: 0.75rem; }
                        `}</style>
                    </div>

                    {/* ── Filters & Table ── */}
                    <div ref={tableRef} className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6">

                        {/* Filters & Actions Toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                <input
                                    type="text"
                                    name="search"
                                    placeholder={__('Search mentor or agenda...')}
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                />
                                <input
                                    type="date"
                                    name="start_date"
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={filters.start_date}
                                    onChange={handleFilterChange}
                                />
                                <input
                                    type="date"
                                    name="end_date"
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={filters.end_date}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="flex gap-2">
                                {selectedSchedules.length > 0 && (
                                    <>
                                        <button
                                            onClick={() => openModal('bulk_approve')}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition"
                                        >
                                            {__('Approve')} ({selectedSchedules.length})
                                        </button>
                                        <button
                                            onClick={() => openModal('bulk_reject')}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition"
                                        >
                                            {__('Reject')} ({selectedSchedules.length})
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={refreshAll}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition"
                                >
                                    {__('Refresh')}
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-amber-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={schedules.data.length > 0 && selectedSchedules.length === schedules.data.length}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            />
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100"
                                            onClick={() => handleSort('mentor.name')}
                                        >
                                            {__('Mentor')} {renderSortIcon('mentor.name')}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100"
                                            onClick={() => handleSort('agenda')}
                                        >
                                            {__('Agenda')} {renderSortIcon('agenda')}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-amber-100"
                                            onClick={() => handleSort('scheduled_at')}
                                        >
                                            {__('Date & Time')} {renderSortIcon('scheduled_at')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {__('Participants')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                {__('Loading schedules...')}
                                            </td>
                                        </tr>
                                    ) : schedules.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                <svg className="mx-auto h-10 w-10 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {__('No pending schedules found.')}
                                            </td>
                                        </tr>
                                    ) : (
                                        schedules.data.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-amber-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSchedules.includes(schedule.id)}
                                                        onChange={() => handleSelectSchedule(schedule.id)}
                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {schedule.mentor ? schedule.mentor.name : __('Unknown')}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {schedule.mentor ? schedule.mentor.email : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule.agenda_type && (
                                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 mb-1">
                                                            {AGENDA_LABELS[schedule.agenda_type] ?? schedule.agenda_type}
                                                        </span>
                                                    )}
                                                    {schedule.agenda && (
                                                        <div className="text-sm text-gray-900">{schedule.agenda}</div>
                                                    )}
                                                    {schedule.notes && (
                                                        <div className="text-xs text-gray-500 truncate max-w-xs" title={schedule.notes}>
                                                            {schedule.notes}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(schedule.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(schedule.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} –
                                                        {new Date(schedule.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {schedule.participants && schedule.participants.slice(0, 3).map((p) => (
                                                            <div key={p.id} className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-indigo-200 items-center justify-center text-xs font-bold text-indigo-700" title={p.name}>
                                                                {p.name?.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {schedule.participants && schedule.participants.length > 3 && (
                                                            <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500">
                                                                +{schedule.participants.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(!schedule.participants || schedule.participants.length === 0) && (
                                                        <span className="text-xs text-gray-400">{__('No participants')}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => openModal('preview', schedule)} className="text-indigo-600 hover:text-indigo-900">{__('Preview')}</button>
                                                    <button onClick={() => openModal('approve', schedule)} className="text-green-600 hover:text-green-900">{__('Approve')}</button>
                                                    <button onClick={() => openModal('request_modification', schedule)} className="text-yellow-600 hover:text-yellow-900">{__('Modify')}</button>
                                                    <button onClick={() => openModal('reject', schedule)} className="text-red-600 hover:text-red-900">{__('Reject')}</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {(schedules.next_page_url || schedules.prev_page_url) && (
                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    onClick={() => fetchSchedules(schedules.current_page - 1)}
                                    disabled={!schedules.prev_page_url}
                                    className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {__('Previous')}
                                </button>
                                <span className="text-sm text-gray-700">
                                    {__('Page')} {schedules.current_page} {__('of')} {schedules.last_page}
                                </span>
                                <button
                                    onClick={() => fetchSchedules(schedules.current_page + 1)}
                                    disabled={!schedules.next_page_url}
                                    className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {__('Next')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Deletion Requests ── */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {__('Deletion Requests')}
                            {(deletionRequests.total ?? 0) > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                                    {deletionRequests.total} {__('pending')}
                                </span>
                            )}
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-red-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Mentor')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Agenda')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Date & Time')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Participants')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{__('Actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deletionLoading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">{__('Loading...')}</td>
                                        </tr>
                                    ) : (deletionRequests.data ?? []).length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                <svg className="mx-auto h-10 w-10 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                {__('No pending deletion requests.')}
                                            </td>
                                        </tr>
                                    ) : (
                                        (deletionRequests.data ?? []).map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-red-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {schedule.mentor
                                                            ? (`${schedule.mentor.first_name ?? ''} ${schedule.mentor.last_name ?? ''}`.trim() || __('Unknown'))
                                                            : __('Unknown')}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{schedule.mentor?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {schedule.agenda_type && (
                                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700 mb-1">
                                                            {AGENDA_LABELS[schedule.agenda_type] ?? schedule.agenda_type}
                                                        </span>
                                                    )}
                                                    <div className="text-sm text-gray-900">{schedule.agenda}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {new Date(schedule.scheduled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(schedule.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} –{' '}
                                                        {new Date(schedule.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {(schedule.participants ?? []).slice(0, 3).map((p) => (
                                                            <div key={p.id} className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-indigo-200 items-center justify-center text-xs font-bold text-indigo-700" title={p.name}>
                                                                {p.name?.charAt(0)}
                                                            </div>
                                                        ))}
                                                        {(schedule.participants ?? []).length > 3 && (
                                                            <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500">
                                                                +{schedule.participants.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!(schedule.participants ?? []).length && (
                                                        <span className="text-xs text-gray-400">{__('No participants')}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => openModal('approve_deletion', schedule)}
                                                        className="text-red-600 hover:text-red-900 font-semibold"
                                                    >
                                                        {__('Approve Deletion')}
                                                    </button>
                                                    <button
                                                        onClick={() => openModal('reject_deletion', schedule)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        {__('Reject')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[200] px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.message}
                </div>
            )}

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {modal.type === 'approve'             && __('Approve Schedule')}
                                            {modal.type === 'reject'              && __('Reject Schedule')}
                                            {modal.type === 'request_modification' && __('Request Modification')}
                                            {modal.type === 'bulk_approve'        && __('Bulk Approve Schedules')}
                                            {modal.type === 'bulk_reject'         && __('Bulk Reject Schedules')}
                                            {modal.type === 'preview'             && __('Schedule Details')}
                                            {modal.type === 'approve_deletion'    && __('Approve Deletion')}
                                            {modal.type === 'reject_deletion'     && __('Reject Deletion Request')}
                                        </h3>
                                        <div className="mt-2">
                                            {modal.type === 'preview' ? (
                                                <div className="text-sm text-gray-500 space-y-2">
                                                    <p><strong>{__('Mentor')}:</strong> {modal.data.mentor?.name}</p>
                                                    {modal.data.agenda_type && (
                                                        <p>
                                                            <strong>{__('Agenda Type')}:</strong>{' '}
                                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                                                                {AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda_type}
                                                            </span>
                                                        </p>
                                                    )}
                                                    {modal.data.agenda && (
                                                        <p><strong>{__('Agenda')}:</strong> {modal.data.agenda}</p>
                                                    )}
                                                    {modal.data.tools_materials && (
                                                        <p><strong>{__('Tools & Materials')}:</strong> {modal.data.tools_materials}</p>
                                                    )}
                                                    <p><strong>{__('Date')}:</strong> {new Date(modal.data.scheduled_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    <p><strong>{__('Time')}:</strong> {new Date(modal.data.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} – {new Date(modal.data.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p><strong>{__('Location')}:</strong> {modal.data.location || __('N/A')}</p>
                                                    {modal.data.meeting_link && (
                                                        <p><strong>{__('Meeting Link')}:</strong> <a href={modal.data.meeting_link} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{modal.data.meeting_link}</a></p>
                                                    )}
                                                    <p><strong>{__('Notes')}:</strong> {modal.data.notes || __('N/A')}</p>
                                                    <p><strong>{__('Participants')}:</strong></p>
                                                    <ul className="list-disc pl-5">
                                                        {modal.data.participants && modal.data.participants.map(p => (
                                                            <li key={p.id}>{p.name}</li>
                                                        ))}
                                                    </ul>

                                                    {/* Quick-approve buttons inside preview */}
                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                                        <button onClick={() => { closeModal(); openModal('approve', modal.data); }} className="px-3 py-1.5 text-xs font-semibold bg-green-100 text-green-700 rounded hover:bg-green-200 transition">{__('Approve')}</button>
                                                        <button onClick={() => { closeModal(); openModal('request_modification', modal.data); }} className="px-3 py-1.5 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">{__('Modify')}</button>
                                                        <button onClick={() => { closeModal(); openModal('reject', modal.data); }} className="px-3 py-1.5 text-xs font-semibold bg-red-100 text-red-700 rounded hover:bg-red-200 transition">{__('Reject')}</button>
                                                    </div>
                                                </div>
                                            ) : modal.type === 'approve_deletion' ? (
                                                <div className="text-sm text-gray-500 space-y-2">
                                                    <p className="text-red-600 font-medium">{__('This will permanently delete the meeting. This action cannot be undone.')}</p>
                                                    <p><strong>{__('Mentor')}:</strong> {modal.data?.mentor ? `${modal.data.mentor.first_name ?? ''} ${modal.data.mentor.last_name ?? ''}`.trim() : __('Unknown')}</p>
                                                    <p><strong>{__('Agenda')}:</strong> {modal.data?.agenda}</p>
                                                    <p><strong>{__('Date')}:</strong> {modal.data?.scheduled_at && new Date(modal.data.scheduled_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            ) : modal.type === 'reject_deletion' ? (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {__('Provide a reason for rejecting the deletion request. The meeting will be restored to scheduled.')}
                                                    </p>
                                                    <textarea
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        rows="3"
                                                        placeholder={__('Enter reason...')}
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                    />
                                                </>
                                            ) : modal.type === 'bulk_approve' ? (
                                                <p className="text-sm text-gray-500">
                                                    {__('Are you sure you want to approve :count selected schedules?').replace(':count', selectedSchedules.length)}
                                                </p>
                                            ) : modal.type === 'bulk_reject' ? (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {__('Are you sure you want to reject :count selected schedules?').replace(':count', selectedSchedules.length)}
                                                    </p>
                                                    <textarea
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        rows="4"
                                                        placeholder={__('Enter reason for rejection...')}
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {modal.type === 'approve'             && __('Are you sure you want to approve ":agenda"?').replace(':agenda', AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? '')}
                                                        {modal.type === 'reject'              && __('Please provide a reason for rejecting ":agenda".').replace(':agenda', AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? '')}
                                                        {modal.type === 'request_modification' && __('Please provide feedback for ":agenda".').replace(':agenda', AGENDA_LABELS[modal.data.agenda_type] ?? modal.data.agenda ?? '')}
                                                    </p>
                                                    {(modal.type === 'reject' || modal.type === 'request_modification') && (
                                                        <textarea
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            rows="4"
                                                            placeholder={__('Enter reason or feedback...')}
                                                            value={reason}
                                                            onChange={(e) => setReason(e.target.value)}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {modal.type !== 'preview' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleAction}
                                            disabled={processing || ((modal.type === 'reject' || modal.type === 'bulk_reject' || modal.type === 'request_modification' || modal.type === 'reject_deletion') && !reason.trim())}
                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                                                modal.type === 'reject' || modal.type === 'bulk_reject' || modal.type === 'approve_deletion' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                                                modal.type === 'request_modification' || modal.type === 'reject_deletion'                    ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                                                'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            } disabled:opacity-50`}
                                        >
                                            {processing ? __('Processing...') : __('Confirm')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            {__('Cancel')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {__('Close')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
