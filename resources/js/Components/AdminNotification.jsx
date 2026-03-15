import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { __ } from '@/Utils/lang';
import { router } from '@inertiajs/react';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function AdminNotificationComponent() {
    const [messages, setMessages] = useState([]);
    const [photoRequests, setPhotoRequests] = useState([]);
    const [pendingSchedules, setPendingSchedules] = useState([]);
    const [pendingTotal, setPendingTotal] = useState(0);
    const [deletionRequests, setDeletionRequests] = useState([]);
    const [deletionTotal, setDeletionTotal] = useState(0);

    const unreadCount = messages.length + photoRequests.length + pendingTotal + deletionTotal;

    const fetchAll = async () => {
        try {
            const [messagesRes, photosRes, pendingRes, deletionRes] = await Promise.all([
                window.axios.get(route('api.admin.schedule-messages.unread')),
                window.axios.get(route('api.admin.profile-photos.pending')),
                window.axios.get(route('api.admin.schedules.pending'), {
                    params: { per_page: 5, sort_by: 'created_at', sort_order: 'desc' },
                }),
                window.axios.get(route('api.admin.schedules.deletion-requests'), {
                    params: { per_page: 5 },
                }),
            ]);

            setMessages(messagesRes.data);
            setPhotoRequests(photosRes.data);
            setPendingSchedules(pendingRes.data.data || []);
            setPendingTotal(pendingRes.data.total || 0);
            setDeletionRequests(deletionRes.data.data || []);
            setDeletionTotal(deletionRes.data.total || 0);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchAll();

        // Poll every 60 s so count stays fresh without WebSocket
        const interval = setInterval(fetchAll, 60000);

        if (window.Echo) {
            window.Echo.private('admin.notifications')
                .listen('.profile.photo.request', (e) => {
                    setPhotoRequests(prev => [e.request, ...prev]);
                });
        }

        return () => {
            clearInterval(interval);
            if (window.Echo) window.Echo.leave('admin.notifications');
        };
    }, []);

    const markMessageRead = async (id) => {
        try {
            await window.axios.patch(route('api.admin.schedule-messages.read', id));
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Failed to mark as read', error);
            fetchAll();
        }
    };

    const handleMessageClick = (msg) => {
        router.visit(route('schedule.index', { schedule_id: msg.schedule_id }));
    };

    const handlePhotoRequestClick = (req) => {
        setPhotoRequests(prev => prev.filter(r => r.id !== req.id));
        router.visit(route('admin.profile-photos.index'));
    };

    const handleScheduleApprovalClick = () => {
        router.visit(route('admin.schedule-approval.index'));
    };

    const handleDeletionRequestClick = (meeting) => {
        // Go to the schedule calendar and open the day modal for that meeting
        router.visit(route('schedule.index', { meeting_id: meeting.id }));
    };

    const totalEmpty = unreadCount === 0;

    return (
        <div className="relative ms-3">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button
                            type="button"
                            className="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            {unreadCount > 0 && (
                                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </div>
                            )}
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content width="80">
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        {__('Notifications')}
                    </div>

                    {totalEmpty ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {__('No new notifications')}
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">

                            {/* ── Pending Schedule Approval Requests ── */}
                            {pendingSchedules.length > 0 && (
                                <>
                                    <div className="px-4 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800 flex items-center justify-between">
                                        <span>{__('Schedule Requests')}</span>
                                        {pendingTotal > 5 && (
                                            <span className="text-xs text-orange-500">+{pendingTotal - 5} {__('more')}</span>
                                        )}
                                    </div>
                                    {pendingSchedules.map((meeting) => (
                                        <div
                                            key={`schedule-${meeting.id}`}
                                            className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition duration-150 ease-in-out cursor-pointer"
                                            onClick={handleScheduleApprovalClick}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="shrink-0 mt-0.5">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">{__('New Schedule Request')}</p>
                                                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                                        {meeting.mentor
                                                            ? (meeting.mentor.name || `${meeting.mentor.first_name ?? ''} ${meeting.mentor.last_name ?? ''}`.trim() || __('Mentor'))
                                                            : __('Mentor')}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{meeting.agenda}</p>
                                                    {meeting.scheduled_at && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(meeting.scheduled_at.endsWith('Z') ? meeting.scheduled_at : meeting.scheduled_at + 'Z').toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200">
                                                        {__('Pending')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingTotal > 5 && (
                                        <button
                                            className="w-full px-4 py-2 text-xs text-center text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-b border-gray-100 dark:border-gray-700"
                                            onClick={handleScheduleApprovalClick}
                                        >
                                            {__('View all')} {pendingTotal} {__('pending requests')} →
                                        </button>
                                    )}
                                </>
                            )}

                            {/* ── Deletion Requests ── */}
                            {deletionRequests.length > 0 && (
                                <>
                                    <div className="px-4 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center justify-between">
                                        <span>{__('Deletion Requests')}</span>
                                        {deletionTotal > 5 && (
                                            <span className="text-xs text-red-500">+{deletionTotal - 5} {__('more')}</span>
                                        )}
                                    </div>
                                    {deletionRequests.map((meeting) => (
                                        <div
                                            key={`deletion-${meeting.id}`}
                                            className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition duration-150 ease-in-out cursor-pointer"
                                            onClick={() => handleDeletionRequestClick(meeting)}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="shrink-0 mt-0.5">
                                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">{__('Deletion Request')}</p>
                                                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                                                        {meeting.mentor
                                                            ? (`${meeting.mentor.first_name ?? ''} ${meeting.mentor.last_name ?? ''}`.trim() || __('Mentor'))
                                                            : __('Mentor')}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{meeting.agenda}</p>
                                                    {meeting.scheduled_at && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {new Date(meeting.scheduled_at.endsWith('Z') ? meeting.scheduled_at : meeting.scheduled_at + 'Z').toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="shrink-0">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200">
                                                        {__('Review')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {deletionTotal > 5 && (
                                        <button
                                            className="w-full px-4 py-2 text-xs text-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-b border-gray-100 dark:border-gray-700"
                                            onClick={() => router.visit(route('admin.schedule-approval.index'))}
                                        >
                                            {__('View all')} {deletionTotal} {__('deletion requests')} →
                                        </button>
                                    )}
                                </>
                            )}

                            {/* ── Photo Requests ── */}
                            {photoRequests.map((req) => (
                                <div
                                    key={`photo-${req.id}`}
                                    className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer bg-blue-50 dark:bg-blue-900/20"
                                    onClick={() => handlePhotoRequestClick(req)}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0 flex items-start gap-2">
                                            <div className="shrink-0">
                                                <ProfilePhoto
                                                    src={req.user?.profile_photo_url}
                                                    alt={req.user?.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                    fallbackClassName="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs"
                                                    fallback={(req.user?.name || 'U').charAt(0).toUpperCase()}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">{__('New Photo Request')}</p>
                                                <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{req.user?.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(req.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            {__('Review')}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* ── Schedule Messages ── */}
                            {messages.map((msg) => (
                                <div
                                    key={`msg-${msg.id}`}
                                    className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer"
                                    onClick={() => handleMessageClick(msg)}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{msg.user?.name}</p>
                                            <p className="text-xs text-gray-500 mb-1 truncate">{msg.schedule?.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 break-words">{msg.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); markMessageRead(msg.id); }}
                                            className="shrink-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1"
                                            title={__('Mark as read')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
