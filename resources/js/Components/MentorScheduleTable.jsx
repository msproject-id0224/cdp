import { useState, useEffect, useCallback, useRef } from 'react';
import { __ } from '@/Utils/lang';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function MentorScheduleTable() {
    const [schedules, setSchedules] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Message Modal State
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [filters, setFilters] = useState({
        page: 1,
        search: '',
        status: 'all',
        priority: 'all',
        sort_by: 'date',
        sort_order: 'asc'
    });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    const fetchSchedules = useCallback(async (isPolling = false) => {
        if (!isPolling) setLoading(true);
        setError(null);
        try {
            const response = await window.axios.get(route('api.schedules'), { params: filters });
            setSchedules(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                from: response.data.from,
                to: response.data.to,
                total: response.data.total,
                links: response.data.links
            });
        } catch (err) {
            console.error(err);
            setError(__('Failed to load schedule data. Please try again later.'));
        } finally {
            if (!isPolling) setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchSchedules();
        const interval = setInterval(() => fetchSchedules(true), 30000);
        return () => clearInterval(interval);
    }, [fetchSchedules]);

    const handleSort = (column) => {
        setFilters(prev => ({
            ...prev,
            sort_by: column,
            sort_order: prev.sort_by === column && prev.sort_order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const openMessageModal = (scheduleId) => {
        setSelectedScheduleId(scheduleId);
        setMessageContent('');
        setMessages([]);
        setIsMessageModalOpen(true);
        fetchMessages(scheduleId);
    };

    const fetchMessages = async (scheduleId) => {
        setLoadingMessages(true);
        try {
            const response = await axios.get(route('api.schedules.messages', scheduleId));
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setSelectedScheduleId(null);
        setMessageContent('');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageContent.trim()) return;

        setSendingMessage(true);
        try {
            await window.axios.post(route('api.schedule-messages.store'), {
                schedule_id: selectedScheduleId,
                message: messageContent
            });
            setMessageContent('');
            fetchMessages(selectedScheduleId);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message.');
        } finally {
            setSendingMessage(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="w-full sm:w-1/3">
                    <TextInput
                        type="text"
                        className="w-full"
                        placeholder={__('Search activity...')}
                        value={debouncedSearch}
                        onChange={(e) => setDebouncedSearch(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-1/4">
                    <select
                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                    >
                        <option value="all">{__('All Status')}</option>
                        <option value="scheduled">{__('Scheduled')}</option>
                        <option value="ongoing">{__('Ongoing')}</option>
                        <option value="completed">{__('Completed')}</option>
                        <option value="cancelled">{__('Cancelled')}</option>
                    </select>
                </div>
                <div className="w-full sm:w-1/4">
                    <select
                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                        value={filters.priority}
                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value, page: 1 }))}
                    >
                        <option value="all">{__('All Priorities')}</option>
                        <option value="high">{__('High')}</option>
                        <option value="medium">{__('Medium')}</option>
                        <option value="low">{__('Low')}</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-100" role="alert">
                    {error}
                </div>
            )}

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('name')}>
                                <div className="flex items-center">
                                    {__('Activity')}
                                    {filters.sort_by === 'name' && (
                                        <span className="ml-1">{filters.sort_order === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('date')}>
                                <div className="flex items-center">
                                    {__('Date & Time')}
                                    {filters.sort_by === 'date' && (
                                        <span className="ml-1">{filters.sort_order === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {__('Location')}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('priority')}>
                                <div className="flex items-center">
                                    {__('Priority')}
                                    {filters.sort_by === 'priority' && (
                                        <span className="ml-1">{filters.sort_order === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {__('Status')}
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {__('Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && schedules.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {__('Loading...')}
                                    </div>
                                </td>
                            </tr>
                        ) : schedules.length > 0 ? (
                            schedules.map((schedule) => (
                                <tr key={schedule.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {schedule.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>{schedule.date}</div>
                                        <div className="text-xs text-gray-500">
                                            {schedule.start_time ? schedule.start_time.substring(0, 5) : ''} - {schedule.end_time ? schedule.end_time.substring(0, 5) : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {schedule.location || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                                            {schedule.priority ? String(schedule.priority).charAt(0).toUpperCase() + String(schedule.priority).slice(1) : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                                            {schedule.status ? String(schedule.status).charAt(0).toUpperCase() + String(schedule.status).slice(1) : 'Scheduled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openMessageModal(schedule.id)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 text-sm font-medium"
                                        >
                                            {__('Send Message')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                    {__('No schedules found.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    {pagination.links && pagination.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => link.url && handlePageChange(new URL(link.url).searchParams.get('page'))}
                            disabled={!link.url}
                            className={`px-3 py-1 rounded-md text-sm ${
                                link.active
                                    ? 'bg-blue-600 text-white'
                                    : !link.url
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
            
            {loading && schedules.length > 0 && (
                <div className="text-right text-xs text-gray-400 mt-2">
                    {__('Updating data...')}
                </div>
            )}

            <Modal show={isMessageModalOpen} onClose={closeMessageModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Send Message to Admin')}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {__('Send a message regarding this schedule. The admin will be notified.')}
                    </p>

                    <div className="mt-4 mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{__('History')}</h3>
                        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-3 h-48 overflow-y-auto">
                            {loadingMessages ? (
                                <p className="text-center text-gray-500 text-sm py-4">{__('Loading...')}</p>
                            ) : messages.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm py-4">{__('No messages yet.')}</p>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <ProfilePhoto 
                                                        src={msg.user?.profile_photo_url} 
                                                        alt={msg.user?.name} 
                                                        className="w-6 h-6 rounded-full object-cover" 
                                                        fallbackClassName="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-[10px]"
                                                        fallback={(msg.user?.name || 'U').charAt(0).toUpperCase()}
                                                    />
                                                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{msg.user?.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap pl-8">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="message" value={__('Message')} />
                        <textarea
                            id="message"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            rows="4"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            placeholder={__('Type your message here...')}
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeMessageModal}>
                            {__('Cancel')}
                        </SecondaryButton>

                        <PrimaryButton className="ml-3" onClick={handleSendMessage} disabled={sendingMessage}>
                            {sendingMessage ? __('Sending...') : __('Send Message')}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
