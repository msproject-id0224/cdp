import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import { __ } from '@/Utils/lang';
import { router } from '@inertiajs/react';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function AdminNotificationComponent() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [photoRequests, setPhotoRequests] = useState([]);

    const fetchMessages = async () => {
        try {
            const [messagesRes, photosRes] = await Promise.all([
                window.axios.get(route('api.admin.schedule-messages.unread')),
                window.axios.get(route('api.admin.profile-photos.pending'))
            ]);
            
            setMessages(messagesRes.data);
            setPhotoRequests(photosRes.data);
            updateTotalCount(messagesRes.data, photosRes.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const updateTotalCount = (msgs, reqs) => {
        setUnreadCount(msgs.length + reqs.length);
    };

    useEffect(() => {
        fetchMessages();
        // Initial setup only, we use Echo for real-time
        
        // Listen for new profile photo requests
        if (window.Echo) {
            window.Echo.private('admin.notifications')
                .listen('.profile.photo.request', (e) => {
                    setPhotoRequests(prev => {
                        const newReqs = [e.request, ...prev];
                        updateTotalCount(messages, newReqs);
                        return newReqs;
                    });
                    
                    // Optional: Play a sound or show browser notification
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave('admin.notifications');
            }
        };
    }, []);

    const markAsRead = async (id) => {
        try {
            await window.axios.patch(route('api.admin.schedule-messages.read', id));
            // Optimistic update
            const newMessages = messages.filter(m => m.id !== id);
            setMessages(newMessages);
            updateTotalCount(newMessages, photoRequests);
        } catch (error) {
            console.error('Failed to mark as read', error);
            fetchMessages(); // Re-fetch on error to ensure sync
        }
    };

    const removePhotoRequest = (id) => {
        setPhotoRequests(prev => {
            const newReqs = prev.filter(r => r.id !== id);
            updateTotalCount(messages, newReqs);
            return newReqs;
        });
    };

    const handleMessageClick = (msg) => {
        router.visit(route('schedule.index', { schedule_id: msg.schedule_id }));
    };

    const handlePhotoRequestClick = (req) => {
        router.visit(route('admin.profile-photos.index'));
        removePhotoRequest(req.id);
    };

    return (
        <div className="relative ms-3">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button type="button" className="relative inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300">
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                            {unreadCount > 0 && (
                                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900">
                                    {unreadCount}
                                </div>
                            )}
                        </button>
                    </span>
                </Dropdown.Trigger>
                <Dropdown.Content width="80">
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        {__('Notifications')}
                    </div>
                    {(messages.length === 0 && photoRequests.length === 0) ? (
                         <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                             {__('No new notifications')}
                         </div>
                    ) : (
                        <div className="max-h-64 overflow-y-auto">
                            {/* Photo Requests */}
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
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {__('Review')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Schedule Messages */}
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
                                            onClick={(e) => { e.stopPropagation(); markAsRead(msg.id); }}
                                            className="shrink-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1"
                                            title={__('Mark as read')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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
