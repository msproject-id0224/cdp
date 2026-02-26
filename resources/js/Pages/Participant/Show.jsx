import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import ProfilePhoto from '@/Components/ProfilePhoto';
import axios from 'axios';

export default function ParticipantShow({ auth, participant, notes, tasks, meetings, messages, metrics, analytics }) {
    const { locale } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const [status, setStatus] = useState(participant.is_active ? 'active' : 'inactive');
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState('');

    const [noteText, setNoteText] = useState('');
    const [noteLoading, setNoteLoading] = useState(false);
    const [noteError, setNoteError] = useState('');
    const [noteItems, setNoteItems] = useState(notes || []);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskLoading, setTaskLoading] = useState(false);
    const [taskError, setTaskError] = useState('');
    const [taskItems, setTaskItems] = useState(tasks || []);

    const [meetingDateTime, setMeetingDateTime] = useState('');
    const [meetingLocation, setMeetingLocation] = useState('');
    const [meetingAgenda, setMeetingAgenda] = useState('');
    const [meetingLoading, setMeetingLoading] = useState(false);
    const [meetingError, setMeetingError] = useState('');
    const [meetingItems, setMeetingItems] = useState(meetings || []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US');
    };

    const handleUpdateStatus = async () => {
        setStatusLoading(true);
        setStatusError('');
        try {
            await axios.patch(route('participants.status.update', participant.id), { status });
        } catch (error) {
            setStatusError(__('Failed to update status.'));
        } finally {
            setStatusLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setNoteLoading(true);
        setNoteError('');
        try {
            const response = await axios.post(route('participants.notes.store', participant.id), { note: noteText });
            setNoteItems(prev => [response.data, ...prev]);
            setNoteText('');
        } catch (error) {
            setNoteError(__('Failed to add note.'));
        } finally {
            setNoteLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!taskTitle.trim()) return;
        setTaskLoading(true);
        setTaskError('');
        try {
            const response = await axios.post(route('participants.tasks.store', participant.id), {
                title: taskTitle,
                description: taskDescription || null,
                due_date: taskDueDate || null,
            });
            setTaskItems(prev => [response.data, ...prev]);
            setTaskTitle('');
            setTaskDescription('');
            setTaskDueDate('');
        } catch (error) {
            setTaskError(__('Failed to add task.'));
        } finally {
            setTaskLoading(false);
        }
    };

    const handleUpdateTaskStatus = async (taskId, nextStatus) => {
        try {
            const response = await axios.patch(route('participants.tasks.update', { participant: participant.id, task: taskId }), {
                status: nextStatus
            });
            setTaskItems(prev => prev.map(item => item.id === taskId ? response.data : item));
        } catch (error) {
            setTaskError(__('Failed to update task status.'));
        }
    };

    const handleAddMeeting = async () => {
        if (!meetingDateTime) return;
        setMeetingLoading(true);
        setMeetingError('');
        try {
            const response = await axios.post(route('participants.meetings.store', participant.id), {
                scheduled_at: meetingDateTime,
                location: meetingLocation || null,
                agenda: meetingAgenda || null,
            });
            setMeetingItems(prev => [response.data, ...prev]);
            setMeetingDateTime('');
            setMeetingLocation('');
            setMeetingAgenda('');
        } catch (error) {
            setMeetingError(__('Failed to schedule meeting.'));
        } finally {
            setMeetingLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2">
                    <nav className="text-xs text-gray-500 dark:text-gray-400">
                        <Link href={route('dashboard')} className="hover:text-gray-700 dark:hover:text-gray-200">{__('Dashboard')}</Link>
                        <span className="mx-2">/</span>
                        <Link href={route('participants.index')} className="hover:text-gray-700 dark:hover:text-gray-200">{__('Participants')}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-700 dark:text-gray-200">{__('My Participant')}</span>
                    </nav>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {__('My Participant')}
                    </h2>
                </div>
            }
        >
            <Head title={__('My Participant')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <ProfilePhoto 
                                    src={participant.profile_photo_url} 
                                    alt={participant.first_name} 
                                    className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold object-cover"
                                    fallbackClassName="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold"
                                    fallback={(participant.first_name?.[0] || 'P').toUpperCase()}
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {participant.first_name} {participant.last_name || ''}
                                        {participant.nickname && (
                                            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                                ({participant.nickname})
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{participant.email}</p>
                                </div>
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-3">
                                    <SelectInput value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
                                        <option value="active">{__('Active')}</option>
                                        <option value="inactive">{__('Inactive')}</option>
                                    </SelectInput>
                                    <PrimaryButton onClick={handleUpdateStatus} disabled={statusLoading}>
                                        {statusLoading ? __('Saving...') : __('Update Status')}
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                        {isAdmin && statusError && <p className="mt-2 text-sm text-red-600">{statusError}</p>}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <div className="text-xs text-gray-500">{__('ID Number')}</div>
                                <div>{participant.id_number || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Date of Birth')}</div>
                                <div>{formatDate(participant.date_of_birth)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Gender')}</div>
                                <div>{participant.gender || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Age')}</div>
                                <div>{participant.age || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Education')}</div>
                                <div>{participant.education || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Age Group')}</div>
                                <div>{participant.age_group || '-'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Total Tasks')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.total_tasks}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Completed Tasks')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.completed_tasks}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Completion Rate')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.completion_rate}%</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Meetings')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.meetings_count}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Upcoming Meetings')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.upcoming_meetings_count}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-5">
                            <div className="text-xs text-gray-500">{__('Messages')}</div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.messages_count}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{__('Performance Analytics')}</h4>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <div className="text-xs text-gray-500">{__('Last Message')}</div>
                                <div>{formatDateTime(analytics.last_message_at)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">{__('Last Meeting')}</div>
                                <div>{formatDateTime(analytics.last_meeting_at)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{__('Add Note')}</h4>
                            <textarea
                                className="mt-3 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                rows="3"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder={__('Write note...')}
                            />
                            {noteError && <p className="mt-2 text-sm text-red-600">{noteError}</p>}
                            <div className="mt-3">
                                <PrimaryButton onClick={handleAddNote} disabled={noteLoading}>
                                    {noteLoading ? __('Saving...') : __('Add Note')}
                                </PrimaryButton>
                            </div>
                            <div className="mt-6 space-y-3">
                                {noteItems.length === 0 && (
                                    <p className="text-sm text-gray-500">{__('No notes yet.')}</p>
                                )}
                                {noteItems.map((note) => (
                                    <div key={note.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
                                        <div className="text-xs text-gray-500 mb-1">{formatDateTime(note.created_at)}</div>
                                        <div className="text-gray-700 dark:text-gray-200">{note.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{__('Assigned Tasks')}</h4>
                            <div className="mt-3 grid grid-cols-1 gap-3">
                                <TextInput
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    placeholder={__('Task title')}
                                />
                                <textarea
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                    rows="2"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder={__('Task description')}
                                />
                                <TextInput
                                    type="date"
                                    value={taskDueDate}
                                    onChange={(e) => setTaskDueDate(e.target.value)}
                                />
                                {taskError && <p className="text-sm text-red-600">{taskError}</p>}
                                <PrimaryButton onClick={handleAddTask} disabled={taskLoading}>
                                    {taskLoading ? __('Saving...') : __('Add Task')}
                                </PrimaryButton>
                            </div>
                            <div className="mt-6 space-y-3">
                                {taskItems.length === 0 && (
                                    <p className="text-sm text-gray-500">{__('No tasks yet.')}</p>
                                )}
                                {taskItems.map((task) => (
                                    <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</div>
                                            <span className="text-xs text-gray-500">{task.status}</span>
                                        </div>
                                        {task.description && <p className="mt-1 text-gray-600 dark:text-gray-300">{task.description}</p>}
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                {task.due_date ? `${__('Due')} ${formatDate(task.due_date)}` : '-'}
                                            </div>
                                            {task.status !== 'completed' && (
                                                <SecondaryButton onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                                                    {__('Mark Completed')}
                                                </SecondaryButton>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{__('Schedule Meeting')}</h4>
                            <div className="mt-3 grid grid-cols-1 gap-3">
                                <TextInput
                                    type="datetime-local"
                                    value={meetingDateTime}
                                    onChange={(e) => setMeetingDateTime(e.target.value)}
                                />
                                <TextInput
                                    value={meetingLocation}
                                    onChange={(e) => setMeetingLocation(e.target.value)}
                                    placeholder={__('Location')}
                                />
                                <textarea
                                    className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                    rows="2"
                                    value={meetingAgenda}
                                    onChange={(e) => setMeetingAgenda(e.target.value)}
                                    placeholder={__('Agenda')}
                                />
                                {meetingError && <p className="text-sm text-red-600">{meetingError}</p>}
                                <PrimaryButton onClick={handleAddMeeting} disabled={meetingLoading}>
                                    {meetingLoading ? __('Saving...') : __('Schedule')}
                                </PrimaryButton>
                            </div>
                            <div className="mt-6 space-y-3">
                                {meetingItems.length === 0 && (
                                    <p className="text-sm text-gray-500">{__('No meetings yet.')}</p>
                                )}
                                {meetingItems.map((meeting) => (
                                    <div key={meeting.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">{formatDateTime(meeting.scheduled_at)}</div>
                                            <span className="text-xs text-gray-500">{meeting.status}</span>
                                        </div>
                                        {meeting.location && <div className="text-xs text-gray-500 mt-1">{meeting.location}</div>}
                                        {meeting.agenda && <div className="text-gray-600 dark:text-gray-300 mt-1">{meeting.agenda}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{__('Communication History')}</h4>
                            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                                {messages.length === 0 && (
                                    <p className="text-sm text-gray-500">{__('No messages yet.')}</p>
                                )}
                                {messages.map((msg) => (
                                    <div key={msg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                                                {msg.sender?.name || __('User')}
                                            </div>
                                            <div className="text-xs text-gray-500">{formatDateTime(msg.created_at)}</div>
                                        </div>
                                        <div className="mt-2 text-gray-600 dark:text-gray-300">{msg.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
