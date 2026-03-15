import { useState, Fragment, useEffect } from 'react';
import { Transition, Popover } from '@headlessui/react';
import { usePage, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { __ } from '@/Utils/lang';

export default function NotificationBell() {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState(auth.unread_notifications || []);
    const [unreadCount, setUnreadCount] = useState(auth.unread_notifications_count || 0);
    
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Polling for real-time updates (every 30 seconds)
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(route('api.notifications.unread'));
                const data = await response.json();
                setNotifications(data.unread_notifications);
                setUnreadCount(data.unread_count);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        const interval = setInterval(fetchNotifications, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    // Keep state in sync with initial props if they change
    useEffect(() => {
        setNotifications(auth.unread_notifications || []);
        setUnreadCount(auth.unread_notifications_count || 0);
    }, [auth.unread_notifications, auth.unread_notifications_count]);

    // Sync with LocalStorage if needed (as per user request), 
    // but relying on DB source of truth is better.
    // We can use LocalStorage to store 'dismissed' popup state if we had a persistent popup.
    
    const handleNotificationClick = (notification) => {
        // If Admin, redirect to Gifts page with pending_verification filter
        if (auth.user.role === 'admin' && notification.type.includes('GiftProofUploaded')) {
            router.post(route('notifications.read', notification.id), {}, {
                onSuccess: () => {
                    router.get(route('gifts.index'), { status: 'pending_verification' });
                }
            });
            return;
        }

        // If Participant/Mentor, show modal
        setSelectedNotification(notification);
        setIsModalOpen(true);
        
        // Mark as read in backend
        router.post(route('notifications.read', notification.id), {}, {
            preserveScroll: true,
            preserveState: true, 
            onSuccess: () => {
                // Optimistically update UI
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNotification(null);
    };

    return (
        <div className="relative">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button className={`
                            relative p-2 rounded-full text-gray-500 dark:text-gray-400 
                            hover:bg-gray-100 dark:hover:bg-gray-800 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500
                            transition-all duration-300 ease-in-out
                            ${open ? 'bg-gray-100 dark:bg-gray-800 text-indigo-500 dark:text-indigo-400' : ''}
                        `}>
                            <span className="sr-only">{__('View notifications')}</span>
                            
                            {/* Bell Icon */}
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>

                            {/* Badge with Animation */}
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 block h-5 w-5 transform -translate-y-1/4 translate-x-1/4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-[10px] font-bold items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                </span>
                            )}
                        </Popover.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {__('Notifikasi')}
                                    </h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                            {unreadCount} Baru
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <button
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700 last:border-0 ${!notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {notification.type.includes('GiftProofUploaded') ? __('Bukti Hadiah Baru') : 
                                                         notification.type.includes('GiftVerified') ? __('Status Hadiah') : __('Notifikasi Baru')}
                                                    </p>
                                                    {!notification.read_at && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notification.data.message || __('Anda menerima notifikasi baru.')}
                                                </p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-[10px] text-gray-400">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </span>
                                                    {notification.data.gift_code && (
                                                        <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                                            {notification.data.gift_code}
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            {__('Tidak ada notifikasi baru.')}
                                        </div>
                                    )}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>

            {/* Detail Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    {selectedNotification && (
                        <>
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                    {__('Selamat! Anda Menerima Hadiah')}
                                </h3>
                                <div className="mt-4 space-y-3">
                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                        {__('Hadiah dengan ID Hadiah')}: <span className="font-bold text-gray-900 dark:text-white">{selectedNotification.data.gift_code}</span>
                                    </p>
                                    
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                            {__('Hubungi Mentor Kamu untuk memproses hadiah.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {__('Tutup')}
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
