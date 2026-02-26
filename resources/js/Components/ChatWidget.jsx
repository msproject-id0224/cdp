import { useState, useRef, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import axios from 'axios';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function ChatWidget({ user }) {
    const { translations } = usePage().props;
    
    const __ = (key, replace = {}) => {
        let translation = translations?.[key] || key;
        Object.keys(replace).forEach(key => {
            translation = translation.replace(':' + key, replace[key]);
        });
        return translation;
    };

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('global'); // 'global' | 'chat' | 'users'
    const [unreadCount, setUnreadCount] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // Private messages
    const [globalMessages, setGlobalMessages] = useState([]); // Global messages
    const [lastGlobalId, setLastGlobalId] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatTarget, setChatTarget] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [retryQueue, setRetryQueue] = useState([]);
    const [offlineQueue, setOfflineQueue] = useState(() => {
        if (!user?.id) return [];
        const saved = localStorage.getItem(`offline_queue_${user.id}`);
        return saved ? JSON.parse(saved) : [];
    });
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastNotificationCount, setLastNotificationCount] = useState(-1);

    // Online/Offline Detection
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            syncOfflineMessages();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [offlineQueue]);

    // Save offline queue to local storage
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(`offline_queue_${user.id}`, JSON.stringify(offlineQueue));
        }
    }, [offlineQueue, user?.id]);

    const syncOfflineMessages = async () => {
        if (offlineQueue.length === 0) return;

        const queue = [...offlineQueue];
        setOfflineQueue([]); // Clear queue before syncing to prevent double sync

        for (const msg of queue) {
            try {
                await sendMessage(msg.message, msg.receiver_id, msg.tempId);
            } catch (error) {
                // If fails again, add back to queue
                setOfflineQueue(prev => [...prev, msg]);
            }
        }
    };

    const fetchGlobalMessages = async () => {
        try {
            const response = await axios.get('/api/chat/global', {
                params: { after_id: lastGlobalId }
            });
            
            if (response.data.length > 0) {
                const newMessages = response.data;
                setGlobalMessages(prev => {
                    // Filter out duplicates just in case
                    const existingIds = new Set(prev.map(m => m.id));
                    const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
                    return [...prev, ...uniqueNew];
                });
                setLastGlobalId(newMessages[newMessages.length - 1].id);
            }
        } catch (error) {
            console.error('Failed to fetch global messages', error);
        }
    };

    const sendMessage = async (msgText, targetId, tempId = Date.now()) => {
        if (!isOnline) {
            const offlineMsg = {
                id: tempId,
                tempId,
                message: msgText,
                sender_id: user.id,
                receiver_id: targetId,
                status: 'offline',
                created_at: new Date().toISOString(),
                sender: user // Add sender info for global chat display
            };
            if (targetId) {
                setMessages(prev => [...prev, offlineMsg]);
            } else {
                setGlobalMessages(prev => [...prev, offlineMsg]);
            }
            setOfflineQueue(prev => [...prev, offlineMsg]);
            return;
        }

        const newMessage = {
            id: tempId,
            message: msgText,
            sender_id: user.id,
            receiver_id: targetId,
            status: 'sending',
            created_at: new Date().toISOString(),
            sender: user
        };

        if (targetId) {
            if (!messages.find(m => m.id === tempId)) {
                setMessages(prev => [...prev, newMessage]);
            }
        } else {
            if (!globalMessages.find(m => m.id === tempId)) {
                setGlobalMessages(prev => [...prev, newMessage]);
            }
        }

        setIsSending(true);
        try {
            const response = await axios.post('/api/chat', {
                receiver_id: targetId,
                message: msgText
            });
            
            const updateStatus = (prev) => prev.map(m => m.id === tempId ? { ...response.data, status: 'sent', sender: user } : m);
            
            if (targetId) {
                setMessages(updateStatus);
            } else {
                setGlobalMessages(updateStatus);
                setLastGlobalId(response.data.id); // Update last ID to avoid re-fetching
            }
        } catch (error) {
            const failStatus = (prev) => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m);
            if (targetId) {
                setMessages(failStatus);
            } else {
                setGlobalMessages(failStatus);
            }
            setRetryQueue(prev => [...prev, { ...newMessage, id: tempId }]);
            logChatError(error, 'sendMessage');
        } finally {
            setIsSending(false);
        }
    };
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const messagesEndRef = useRef(null);
    const audioRef = useRef(null);

    // Audio for notifications
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    }, []);

    // Error logging helper
    const logChatError = async (error, context) => {
        console.error(`Chat Error [${context}]:`, error);
        try {
            await axios.post('/api/log-error', {
                type: 'chat',
                context: context,
                message: error.message,
                stack: error.stack,
                user_id: user.id
            });
        } catch (e) {
            // Fallback to local storage if server logging fails
            const logs = JSON.parse(localStorage.getItem('chat_error_logs') || '[]');
            logs.push({ timestamp: new Date().toISOString(), context, error: error.message });
            localStorage.setItem('chat_error_logs', JSON.stringify(logs.slice(-20)));
        }
    };

    const fetchMessages = async (targetId) => {
        if (!targetId) return;
        try {
            const response = await axios.get(`/api/chat/${targetId}`);
            setMessages(response.data);
            // Mark as read when messages are fetched for the active chat
            await markAsRead(targetId);
        } catch (error) {
            logChatError(error, 'fetchMessages');
        }
    };

    const [isAppInForeground, setIsAppInForeground] = useState(true);

    // Foreground/Background Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsAppInForeground(document.visibilityState === 'visible');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/api/chat-unread');
            const newCount = response.data.count;
            
            // Check for new messages to trigger notification
            // Don't trigger on first load (when lastNotificationCount is -1)
            if (lastNotificationCount !== -1 && newCount > lastNotificationCount) {
                triggerNotification();
            }
            
            setUnreadCount(newCount);
            setLastNotificationCount(newCount);
        } catch (error) {
            // Silently log background errors to avoid annoying user
            console.warn('Unread count fetch failed', error);
        }
    };

    const [notificationPermission, setNotificationPermission] = useState(
        "Notification" in window ? Notification.permission : "default"
    );

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) return;
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === "granted") {
            new Notification(__('Notifications Enabled'), {
                body: __('You will now receive alerts for new messages'),
                icon: '/favicon.ico'
            });
        }
    };

    const triggerNotification = () => {
        // Play sound
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
        }

        // Behavior based on visibility
        if (isAppInForeground) {
            if (!isOpen) {
                setToastMessage(__('You have a new message!'));
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }
        } else {
            // Browser Notification for Background
            if (notificationPermission === "granted") {
                new Notification(__('New Message'), {
                    body: __('You have a new message in live chat'),
                    icon: '/favicon.ico',
                    tag: 'chat-notification',
                    renotify: true
                });
            }
        }
    };

    const markAsRead = async (targetId) => {
        try {
            await axios.patch(`/api/chat/${targetId}/read`);
            const response = await axios.get('/api/chat-unread');
            setUnreadCount(response.data.count);
            setLastNotificationCount(response.data.count);
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const fetchOnlineUsers = async (query = '') => {
        try {
            const response = await axios.get('/api/online-users', {
                params: { query }
            });
            setOnlineUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch online users', error);
        }
    };

    useEffect(() => {
        const handleStartChat = (event) => {
            const { user: targetUser } = event.detail;
            setIsOpen(true);
            setActiveTab('chat');
            setChatTarget(targetUser);
            fetchMessages(targetUser.id);
        };

        window.addEventListener('start-chat', handleStartChat);
        return () => window.removeEventListener('start-chat', handleStartChat);
    }, []);

    // Global background poller for unread count (always active)
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 2000); // Poll every 2s for notifications (as per requirement)
        
        return () => clearInterval(interval);
    }, [lastNotificationCount]);

    // WebSocket Subscription for Global Chat
    useEffect(() => {
        if (isOpen && activeTab === 'global' && window.Echo) {
            window.Echo.join('chat.global')
                .here((_users) => {
                    // Online users tracked via separate poller
                })
                .joining((_user) => {
                    // User joined event
                })
                .leaving((_user) => {
                    // User left event
                })
                .listen('.message.sent', (e) => {
                    const newMsg = e.message;

                    setGlobalMessages(prev => {
                        if (prev.find(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });

                    setLastGlobalId(prev => Math.max(prev, newMsg.id));
                    scrollToBottom();
                });

            return () => {
                window.Echo.leave('chat.global');
            };
        }
    }, [isOpen, activeTab]);

    // Active chat poller (only active when chat is open)
    useEffect(() => {
        if (isOpen) {
            fetchOnlineUsers(searchQuery);
            
            // Initial fetch for global messages if active
            if (activeTab === 'global') {
                fetchGlobalMessages();
            }

            const interval = setInterval(() => {
                fetchOnlineUsers(searchQuery);
                if (chatTarget) {
                    fetchMessages(chatTarget.id);
                }
                if (activeTab === 'global') {
                    fetchGlobalMessages();
                }
            }, 3000); // Slightly slower for heavy data
            
            return () => clearInterval(interval);
        }
    }, [isOpen, searchQuery, chatTarget, activeTab]);

    const toggleChat = () => {
        if (!isOpen) {
            fetchUnreadCount();
        }
        setIsOpen(!isOpen);
    };

    const resetChat = () => {
        setChatTarget(null);
        setMessages([]);
        setActiveTab('users');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && (activeTab === 'chat' || activeTab === 'global')) {
            scrollToBottom();
        }
    }, [messages, globalMessages, isOpen, activeTab]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!message.trim() || isSending) return;
        
        // Ensure we have a target for private chat, or just proceed for global
        if (activeTab === 'chat' && !chatTarget) return;

        const msgText = message;
        setMessage('');
        
        if (activeTab === 'global') {
            await sendMessage(msgText, null);
        } else {
            await sendMessage(msgText, chatTarget.id);
        }
    };

    const retryMessage = async (failedMsg) => {
        // If it was an offline message, it will be handled by syncOfflineMessages
        if (failedMsg.status === 'offline') {
            if (isOnline) {
                syncOfflineMessages();
            }
            return;
        }

        setIsSending(true);
        try {
            const response = await axios.post('/api/chat', {
                receiver_id: failedMsg.receiver_id,
                message: failedMsg.message
            });

            if (response.status === 201) {
                setMessages(prev => prev.map(m => m.id === failedMsg.id ? { ...response.data, status: 'sent' } : m));
                setRetryQueue(prev => prev.filter(m => m.id !== failedMsg.id));
            }
        } catch (error) {
            logChatError(error, 'retryMessage');
        } finally {
            setIsSending(false);
        }
    };

    // Auto-retry mechanism
    useEffect(() => {
        if (retryQueue.length > 0 && !isSending) {
            const timer = setTimeout(() => {
                retryMessage(retryQueue[0]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [retryQueue, isSending]);

    if (!user?.id) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            {/* Toast Notification */}
            {showToast && (
                <div 
                    className="mb-4 bg-white dark:bg-gray-800 border-l-4 border-blue-600 p-4 shadow-lg rounded animate-bounce flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                        setIsOpen(true);
                        setShowToast(false);
                    }}
                >
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{toastMessage}</p>
                        <p className="text-xs text-gray-500">{__('Click to open')}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowToast(false); }} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[500px] rounded-lg bg-white shadow-xl overflow-hidden flex flex-col border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 ease-in-out transform origin-bottom-right">
                    {/* Header with Tabs */}
                    <div className="bg-blue-600 p-0 text-white flex flex-col">
                        <div className="flex justify-between items-center p-4 pb-2">
                            <div className="flex items-center gap-2">
                                {chatTarget && (
                                    <>
                                        <button 
                                            onClick={resetChat}
                                            className="mr-1 hover:bg-blue-700 rounded-full p-1"
                                            title={__('Back to Support')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <ProfilePhoto 
                                            src={chatTarget.avatar} 
                                            alt={chatTarget.name} 
                                            className="w-8 h-8 rounded-full object-cover border border-white/20" 
                                            fallbackClassName="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold border border-white/20"
                                            fallback={(chatTarget.name || 'U').charAt(0).toUpperCase()}
                                        />
                                    </>
                                )}
                                <h3 className="font-semibold text-sm">
                                    {chatTarget ? chatTarget.name : __('Live Chat')}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {notificationPermission === 'default' && (
                                    <button 
                                        onClick={requestNotificationPermission}
                                        className="text-white hover:text-blue-200 transition-colors"
                                        title={__('Enable Notifications')}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </button>
                                )}
                                <button 
                                    onClick={toggleChat}
                                    className="text-white hover:text-gray-200 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Tabs - Only show if not in direct chat mode */}
                        {!chatTarget && (
                            <div className="flex px-4 space-x-4">
                                <button
                                    onClick={() => setActiveTab('global')}
                                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'global' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white'
                                    }`}
                                >
                                    {__('All Message')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`pb-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1 ${
                                        activeTab === 'users' 
                                            ? 'border-white text-white' 
                                            : 'border-transparent text-blue-200 hover:text-white'
                                    }`}
                                >
                                    {__('Users')}
                                    <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {onlineUsers.length}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative flex flex-col bg-gray-50 dark:bg-gray-900">
                        
                        {/* Tab: Global Chat */}
                        {activeTab === 'global' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
                                    {globalMessages.length === 0 && (
                                        <div className="text-center text-gray-500 text-xs mt-4">
                                            {__('Welcome to Global Chat!')}
                                        </div>
                                    )}
                                    {globalMessages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            className={`flex flex-col max-w-[85%] ${msg.sender_id === user.id ? 'self-end items-end' : 'self-start items-start'}`}
                                        >
                                            {msg.sender_id !== user.id && (
                                                <span className="text-[10px] text-gray-500 mb-1 ml-1 flex items-center gap-1">
                                                    <span className="font-semibold">{msg.sender?.name || 'Unknown'}</span>
                                                    {msg.sender?.role && (
                                                        <span className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-[9px]">{msg.sender.role}</span>
                                                    )}
                                                </span>
                                            )}
                                            <div 
                                                className={`px-4 py-2 rounded-lg text-sm relative group ${
                                                    msg.sender_id === user.id 
                                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                                                } ${msg.status === 'failed' ? 'border-red-500' : ''} ${msg.status === 'offline' ? 'border-dashed border-gray-400 opacity-70' : ''}`}
                                            >
                                                {msg.message}
                                                
                                                {msg.status === 'failed' && msg.sender_id === user.id && (
                                                    <button 
                                                        onClick={() => retryMessage(msg)}
                                                        className="absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                                                        title={__('Retry')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <TextInput
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={__('Type your message...')}
                                            className="w-full text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Tab: Chat (Private) */}
                        {activeTab === 'chat' && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
                                    {messages.length === 0 && (
                                        <div className="text-center text-gray-500 text-xs mt-4">
                                            {__('No messages yet. Say hello!')}
                                        </div>
                                    )}
                                    {messages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            className={`flex flex-col max-w-[80%] ${msg.sender_id === user.id ? 'self-end items-end' : 'self-start items-start'}`}
                                        >
                                            <div 
                                                className={`px-4 py-2 rounded-lg text-sm relative group ${
                                                    msg.sender_id === user.id 
                                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                                                } ${msg.status === 'failed' ? 'border-red-500' : ''} ${msg.status === 'offline' ? 'border-dashed border-gray-400 opacity-70' : ''}`}
                                            >
                                                {msg.message}
                                                
                                                {msg.status === 'failed' && msg.sender_id === user.id && (
                                                    <button 
                                                        onClick={() => retryMessage(msg)}
                                                        className="absolute -left-8 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                                                        title={__('Retry')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.sender_id === user.id && (
                                                    <span className="text-[10px]">
                                                        {msg.status === 'sending' && (
                                                            <svg className="animate-spin h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        )}
                                                        {msg.status === 'sent' && !msg.is_read && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {msg.is_read && (
                                                            <div className="flex -space-x-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        {msg.status === 'offline' && (
                                                            <span className="text-[8px] text-gray-400 italic">offline</span>
                                                        )}
                                                        {msg.status === 'failed' && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <TextInput
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={__('Type your message...')}
                                            className="w-full text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* Tab: Users */}
                        {activeTab === 'users' && (
                            <div className="flex-1 flex flex-col h-full">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <TextInput
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={__('Search users...')}
                                        className="w-full text-sm"
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {onlineUsers.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-4">
                                            <p className="text-sm">{__('No active users found')}</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {onlineUsers.map(u => (
                                                <li 
                                                    key={u.id} 
                                                    onClick={() => {
                                                        setChatTarget(u);
                                                        setActiveTab('chat');
                                                        fetchMessages(u.id);
                                                    }}
                                                    className="flex items-center space-x-3 p-3 hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                                >
                                                    <div className="relative">
                                                        <ProfilePhoto 
                                                            src={u.avatar} 
                                                            alt={u.name} 
                                                            className="w-10 h-10 rounded-full object-cover" 
                                                            fallbackClassName="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs"
                                                            fallback={(u.name || 'U').charAt(0).toUpperCase()}
                                                        />
                                                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-50 dark:border-gray-900 ${
                                                            u.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                                        }`}></span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {u.name}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="capitalize mr-2 bg-gray-100 dark:bg-gray-700 px-1.5 rounded">
                                                                {u.role}
                                                            </span>
                                                            <span className="truncate">
                                                                {u.last_active}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <div className="relative">
                {unreadCount > 0 && !isOpen && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce z-50 shadow-md">
                        {unreadCount}
                    </span>
                )}
                <button
                    onClick={toggleChat}
                    className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 transform bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    aria-label={__('Open Chat')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
