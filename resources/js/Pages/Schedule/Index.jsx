import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import ScheduleApprovalList from '@/Components/ScheduleApprovalList';

export default function ScheduleIndex({ auth, schedules }) {
    const { locale } = usePage().props;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'messages'
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        // Check for schedule_id in URL params
        const params = new URLSearchParams(window.location.search);
        const scheduleId = params.get('schedule_id');
        
        if (scheduleId && schedules.length > 0) {
            const schedule = schedules.find(s => s.id === parseInt(scheduleId));
            if (schedule) {
                // Pre-fill form data
                reset();
                clearErrors();
                setData({
                    name: schedule.name,
                    date: schedule.date,
                    start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : '',
                    end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '',
                    description: schedule.description,
                    priority: schedule.priority,
                    pic: schedule.pic,
                    location: schedule.location || '',
                    status: schedule.status || 'scheduled',
                });
                
                setSelectedSchedule(schedule);
                setModalMode('edit');
                setActiveTab('messages'); // Open messages tab directly
                setIsModalOpen(true);
                
                // Remove param from URL without reload
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }, [schedules]); // Depend on schedules to ensure they are loaded

    // Form handling
    const { data, setData, post, patch, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        date: '',
        start_time: '',
        end_time: '',
        description: '',
        priority: 'medium',
        pic: '',
        location: '',
        status: 'scheduled',
    });

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        reset();
        clearErrors();
        setData({
            name: '',
            date: dateString,
            start_time: '',
            end_time: '',
            description: '',
            priority: 'medium',
            pic: auth.user.name,
            location: '',
            status: 'scheduled',
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
            name: schedule.name,
            date: schedule.date,
            start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : '',
            end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '',
            description: schedule.description,
            priority: schedule.priority,
            pic: schedule.pic,
            location: schedule.location || '',
            status: schedule.status || 'scheduled',
        });
        setModalMode('edit');
        setActiveTab('details');
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

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

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post(route('schedule.store'), {
                onSuccess: () => closeModal(),
            });
        } else {
            patch(route('schedule.update', selectedSchedule.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this activity?'))) {
            destroy(route('schedule.destroy', selectedSchedule.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Filter schedules for the current month
    const currentMonthSchedules = schedules.filter(s => {
        const sDate = new Date(s.date);
        return sDate.getMonth() === month && sDate.getFullYear() === year;
    });

    const getSchedulesForDay = (day) => {
        return currentMonthSchedules.filter(s => {
            const sDate = new Date(s.date);
            return sDate.getDate() === day;
        });
    };

    const renderCalendarGrid = () => {
        const days = [];
        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dailySchedules = getSchedulesForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            days.push(
                <div 
                    key={day} 
                    className={`h-24 sm:h-32 border border-gray-200 dark:border-gray-700 p-1 transition duration-150 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer overflow-y-auto ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}
                    onClick={() => handleDateClick(day)}
                >
                    <div className={`text-right text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dailySchedules.map(schedule => (
                            <div 
                                key={schedule.id}
                                onClick={(e) => handleEventClick(e, schedule)}
                                className={`text-xs p-1 rounded truncate text-white cursor-pointer hover:opacity-80 ${
                                    schedule.priority === 'high' ? 'bg-red-500' :
                                    schedule.priority === 'medium' ? 'bg-blue-500' :
                                    'bg-green-500'
                                }`}
                                title={`${schedule.start_time} - ${schedule.name}`}
                            >
                                {schedule.start_time && <span className="mr-1">{schedule.start_time.substring(0, 5)}</span>}
                                {schedule.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('Schedule')}</h2>}
        >
            <Head title={__('Schedule')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* Calendar Controls */}
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                </button>
                                <h3 className="text-xl font-bold">
                                    {new Date(year, month).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long' })} {year}
                                </h3>
                                <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>

                            {/* Days Header */}
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
                            <div className="mt-4 flex gap-4 text-sm">
                                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-1"></div> {__('High Priority')}</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-1"></div> {__('Medium Priority')}</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1"></div> {__('Low Priority')}</div>
                            </div>

                        </div>
                    </div>

                    {auth.user.role === 'admin' && (
                        <ScheduleApprovalList />
                    )}
                </div>
            </div>

            {/* Activity Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {modalMode === 'add' ? __('Add Activity') : __('Edit Activity')}
                    </h2>

                    {modalMode === 'edit' && (
                        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                            <button
                                className={`py-2 px-4 text-sm font-medium ${
                                    activeTab === 'details'
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('details')}
                            >
                                {__('Details')}
                            </button>
                            <button
                                className={`py-2 px-4 text-sm font-medium ${
                                    activeTab === 'messages'
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('messages')}
                            >
                                {__('Communication')}
                            </button>
                        </div>
                    )}

                    {activeTab === 'details' ? (
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                            <InputLabel htmlFor="name" value={__('Activity Name')} />
                            <TextInput
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="date" value={__('Date')} />
                                <TextInput
                                    id="date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="priority" value={__('Priority')} />
                                <select
                                    id="priority"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                >
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
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    required
                                />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_time" value={__('End Time')} />
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    className="mt-1 block w-full"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    required
                                />
                                <InputError message={errors.end_time} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="location" value={__('Location')} />
                                <TextInput
                                    id="location"
                                    className="mt-1 block w-full"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                                <InputError message={errors.location} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="status" value={__('Status')} />
                                <select
                                    id="status"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                >
                                    <option value="scheduled">{__('Scheduled')}</option>
                                    <option value="ongoing">{__('Ongoing')}</option>
                                    <option value="completed">{__('Completed')}</option>
                                    <option value="cancelled">{__('Cancelled')}</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value={__('Description')} />
                            <textarea
                                id="description"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="pic" value={__('PIC')} />
                            <TextInput
                                id="pic"
                                className="mt-1 block w-full"
                                value={data.pic}
                                onChange={(e) => setData('pic', e.target.value)}
                                required
                            />
                            <InputError message={errors.pic} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-6">
                            {modalMode === 'edit' && (
                                <DangerButton type="button" onClick={handleDelete} className="mr-auto" disabled={processing}>
                                    {__('Delete')}
                                </DangerButton>
                            )}
                            <SecondaryButton onClick={closeModal} className="mr-3">
                                {__('Cancel')}
                            </SecondaryButton>
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
                                                <button
                                                    onClick={() => handleArchiveMessage(msg.id)}
                                                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                                >
                                                    {__('Archive')}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex justify-end mt-6">
                                <SecondaryButton onClick={closeModal}>
                                    {__('Close')}
                                </SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
