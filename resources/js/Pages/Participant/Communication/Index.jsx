import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { __ } from '@/Utils/lang';
import TextInput from '@/Components/TextInput';
import ProfilePhoto from '@/Components/ProfilePhoto';
import axios from 'axios';

export default function CommunicationIndex({ auth }) {
    
    const user = auth.user;
    const [usersList, setUsersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatTarget, setChatTarget] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimer, setTypingTimer] = useState(null);
    const [isTargetTyping, setIsTargetTyping] = useState(false);
    const [messageSearchQuery, setMessageSearchQuery] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchUsers = async (query = '') => {
        try {
            const response = await axios.get(`/api/users/search${query ? `?query=${query}` : ''}`);
            setUsersList(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const fetchMessages = async (targetId) => {
        if (!targetId) return;
        try {
            const response = await axios.get(`/api/chat/${targetId}`);
            setMessages(response.data);
            await axios.patch(`/api/chat/${targetId}/read`);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    // Typing Indicator Listener
    useEffect(() => {
        if (chatTarget && window.Echo) {
            const channel = window.Echo.private(`chat.${user.id}`);
            channel.listen('.message.typing', (e) => {
                if (Number(e.senderId) === Number(chatTarget.id)) {
                    setIsTargetTyping(true);
                    setTimeout(() => setIsTargetTyping(false), 3000);
                }
            });
            return () => channel.stopListening('.message.typing');
        }
    }, [chatTarget]);

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            axios.post('/api/chat/typing', { receiver_id: chatTarget.id }).catch(() => {});
        }
        clearTimeout(typingTimer);
        setTypingTimer(setTimeout(() => setIsTyping(false), 2000));
    };

    useEffect(() => {
        fetchUsers(searchQuery);
        const interval = setInterval(() => {
            fetchUsers(searchQuery);
            if (chatTarget) {
                fetchMessages(chatTarget.id);
            }
        }, 3000); // Polling every 3 seconds
        return () => clearInterval(interval);
    }, [searchQuery, chatTarget]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTargetTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!message.trim() && !file) || !chatTarget || isSending) return;

        const tempId = Date.now();
        const newMessage = {
            id: tempId,
            message: message,
            sender_id: user.id,
            receiver_id: chatTarget.id,
            status: 'sending',
            created_at: new Date().toISOString(),
            attachment_path: file ? URL.createObjectURL(file) : null,
            attachment_type: file ? file.type : null,
        };

        setMessages(prev => [...prev, newMessage]);
        const msgText = message;
        const msgFile = file;
        setMessage('');
        setFile(null);
        setIsSending(true);

        const formData = new FormData();
        formData.append('receiver_id', chatTarget.id);
        if (msgText) formData.append('message', msgText);
        if (msgFile) formData.append('file', msgFile);

        try {
            const response = await axios.post('/api/chat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prev => prev.map(m => m.id === tempId ? { ...response.data, status: 'sent' } : m));
        } catch (error) {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
        } finally {
            setIsSending(false);
        }
    };

    const handleFlagMessage = async (msgId) => {
        if (!confirm(__('Are you sure you want to flag this message?'))) return;
        try {
            await axios.patch(`/api/chat/${msgId}/flag`);
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_flagged: true } : m));
        } catch (error) {
            console.error('Failed to flag message', error);
        }
    };

    const filteredMessages = messages.filter(m => 
        !messageSearchQuery || (m.message && m.message.toLowerCase().includes(messageSearchQuery.toLowerCase()))
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Communication')}
                </h2>
            }
        >
            <Head title={__('Communication')} />

            <div className="py-6 h-[calc(100vh-120px)]">
                <div className="mx-auto max-w-7xl h-full sm:px-6 lg:px-8">
                    <div className="flex h-full bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        {/* User List Sidebar */}
                        <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col ${chatTarget ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <TextInput
                                    type="text"
                                    placeholder={__('Search users...')}
                                    className="w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {usersList.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        {__('No users found')}
                                    </div>
                                ) : (
                                    usersList.map(u => (
                                        <div
                                            key={u.id}
                                            onClick={() => { setChatTarget(u); fetchMessages(u.id); }}
                                            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${chatTarget?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500' : ''}`}
                                        >
                                            <div className="relative">
                                                <ProfilePhoto 
                                                    src={u.avatar_url} 
                                                    alt={u.name} 
                                                    className="w-10 h-10 rounded-full object-cover" 
                                                    fallbackClassName="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold"
                                                    fallback={(u.name || 'U').charAt(0).toUpperCase()}
                                                />
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${u.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{u.name}</h4>
                                                    <span className="text-[10px] text-gray-500 uppercase">{u.role}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.last_seen}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50 ${!chatTarget ? 'hidden md:flex' : 'fixed inset-0 z-50 md:static md:inset-auto'}`}>
                            {chatTarget ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button className="md:hidden" onClick={() => setChatTarget(null)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <ProfilePhoto 
                                                src={chatTarget.avatar_url} 
                                                alt={chatTarget.name} 
                                                className="w-10 h-10 rounded-full object-cover" 
                                                fallbackClassName="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold"
                                                fallback={(chatTarget.name || 'U').charAt(0).toUpperCase()}
                                            />
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{chatTarget.name}</h3>
                                                <p className={`text-[10px] font-medium uppercase ${chatTarget.is_online ? 'text-green-500' : 'text-gray-500'}`}>
                                                    {chatTarget.is_online ? __('Online') : __('Offline')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TextInput
                                                type="text"
                                                placeholder={__('Search in chat...')}
                                                className="text-xs py-1"
                                                value={messageSearchQuery}
                                                onChange={(e) => setMessageSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Messages List */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                                        {filteredMessages.map(msg => (
                                            <div key={msg.id} className={`flex flex-col ${Number(msg.sender_id) === Number(user.id) ? 'items-end' : 'items-start'}`}>
                                                <div className={`relative max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-lg text-sm group ${
                                                    Number(msg.sender_id) === Number(user.id) 
                                                        ? 'bg-blue-600 text-white rounded-br-none' 
                                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                                                }`}>
                                                    {msg.attachment_path && (
                                                        <div className="mb-2">
                                                            {msg.attachment_type?.startsWith('image/') ? (
                                                                <img src={msg.attachment_path.startsWith('blob:') ? msg.attachment_path : `/storage/${msg.attachment_path}`} alt="Attachment" className="max-w-full rounded-lg" />
                                                            ) : (
                                                                <a href={`/storage/${msg.attachment_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-xs">
                                                                    📎 {__('Attachment')}
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    {msg.message}
                                                    {msg.is_flagged && (
                                                        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">🚩</span>
                                                    )}
                                                    <button 
                                                        onClick={() => handleFlagMessage(msg.id)}
                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 hover:text-red-500"
                                                        title={__('Flag inappropriate')}
                                                    >
                                                        🚩
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-[10px] text-gray-500">{new Date(msg.created_at).toLocaleTimeString()}</span>
                                                    {Number(msg.sender_id) === Number(user.id) && (
                                                        <span className="text-[10px]">
                                                            {msg.is_read ? <span className="text-blue-500">✓✓</span> : <span className="text-gray-400">✓</span>}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {isTargetTyping && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                                        <span className="animate-pulse">{__('Typing...')}</span>
                                    </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                        {file && (
                                            <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                <span>📎 {file.name}</span>
                                                <button type="button" onClick={() => setFile(null)} className="text-red-500">×</button>
                                            </div>
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                                title={__('Attach file')}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                            </button>
                                            <TextInput
                                                value={message}
                                                onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
                                                className="flex-1"
                                                placeholder={__('Type a message...')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMessage(prev => prev + '👍')}
                                                className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
                                            >
                                                😊
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={(!message.trim() && !file) || isSending}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p>{__('Select a user to start chatting')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
