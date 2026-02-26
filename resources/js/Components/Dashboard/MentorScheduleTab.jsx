import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';
import { __ } from '@/Utils/lang';
import axios from 'axios';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function MentorScheduleTab() {
    const { auth } = usePage().props;
    const [events, setEvents] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create_availability'); // create_availability, create_meeting, edit_meeting, view_event
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterParticipant, setFilterParticipant] = useState('all');
    
    // List View State
    const [listSearch, setListSearch] = useState('');
    const [listStatus, setListStatus] = useState('all');
    const [listStartDate, setListStartDate] = useState('');
    const [listEndDate, setListEndDate] = useState('');

    const calendarRef = useRef(null);
    
    // Form for Availability
    const availabilityForm = useForm({
        start_time: '',
        end_time: '',
        day_of_week: '',
        is_recurring: false,
        specific_date: '',
    });

    // Form for Meeting
    const meetingForm = useForm({
        participant_ids: [],
        max_participants: 1,
        scheduled_at: '',
        end_time: '',
        location: '',
        meeting_link: '',
        agenda: '',
        notes: '',
        status: 'scheduled',
    });

    const [participantSearch, setParticipantSearch] = useState('');

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('api.mentor-schedules'));
            const { availabilities, meetings, participants } = response.data;
            
            setParticipants(participants || []);

            const calendarEvents = [];

            // Process Availabilities (Recurring)
            availabilities.forEach(avail => {
                if (avail.is_recurring) {
                    calendarEvents.push({
                        id: `avail-${avail.id}`,
                        groupId: 'available',
                        daysOfWeek: [avail.day_of_week], // 0=Sunday
                        startTime: avail.start_time,
                        endTime: avail.end_time,
                        display: 'background',
                        color: '#10B981', // Green
                        extendedProps: { type: 'availability', data: avail }
                    });
                } else {
                    calendarEvents.push({
                        id: `avail-${avail.id}`,
                        groupId: 'available',
                        start: `${avail.specific_date}T${avail.start_time}`,
                        end: `${avail.specific_date}T${avail.end_time}`,
                        display: 'background',
                        color: '#10B981',
                        extendedProps: { type: 'availability', data: avail }
                    });
                }
            });

            // Process Meetings
            meetings.forEach(meeting => {
                let color = '#3B82F6'; // Blue (scheduled)
                if (meeting.status === 'confirmed') color = '#10B981';
                if (meeting.status === 'cancelled') color = '#EF4444';
                if (meeting.status === 'pending') color = '#F59E0B';

                // Assume meeting times are UTC
                const start = meeting.scheduled_at.endsWith('Z') ? meeting.scheduled_at : meeting.scheduled_at + 'Z';
                const end = meeting.end_time.endsWith('Z') ? meeting.end_time : meeting.end_time + 'Z';

                calendarEvents.push({
                    id: `meeting-${meeting.id}`,
                    title: `${__('Meeting')} (${meeting.participants?.length || 0}/${meeting.max_participants})`,
                    start: start,
                    end: end,
                    backgroundColor: color,
                    borderColor: color,
                    extendedProps: { type: 'meeting', data: meeting }
                });
            });

            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const toDateTimeLocal = (date) => {
        const pad = (n) => n < 10 ? '0' + n : n;
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes());
    };

    const handleDateSelect = (selectInfo) => {
        setSelectedDate(selectInfo);
        
        let startStr, endStr;
        let startTimeStr, endTimeStr;

        if (selectInfo.allDay) {
            // Month view click (all day)
            // Default to 09:00 - 10:00 on the selected day
            const s = new Date(selectInfo.start);
            s.setHours(9, 0, 0, 0);
            const e = new Date(selectInfo.start);
            e.setHours(10, 0, 0, 0);
            
            startStr = toDateTimeLocal(s);
            endStr = toDateTimeLocal(e);
            
            startTimeStr = "09:00";
            endTimeStr = "10:00";
        } else {
            // Time view click (specific time) - unlikely in month-only view but safe to keep
            startStr = toDateTimeLocal(selectInfo.start);
            endStr = toDateTimeLocal(selectInfo.end);
            startTimeStr = selectInfo.start.toTimeString().substring(0, 5);
            endTimeStr = selectInfo.end.toTimeString().substring(0, 5);
        }

        meetingForm.setData({
            participant_ids: [],
            max_participants: 1,
            scheduled_at: startStr,
            end_time: endStr,
            location: '',
            meeting_link: '',
            agenda: '',
            notes: '',
            status: 'scheduled',
        });
        setParticipantSearch('');
        
        availabilityForm.setData({
            ...availabilityForm.data,
            start_time: startTimeStr,
            end_time: endTimeStr,
            specific_date: selectInfo.startStr.split('T')[0],
            day_of_week: selectInfo.start.getDay(),
        });
        setModalMode('create_menu'); // Ask user what to create
        setIsModalOpen(true);
    };

    const handleEventClick = (clickInfo) => {
        const { type, data } = clickInfo.event.extendedProps;
        setSelectedEvent({ type, data });
        
        if (type === 'meeting') {
            // Convert UTC backend time to Local for Input
            const utcStart = new Date((data.scheduled_at.endsWith('Z') ? data.scheduled_at : data.scheduled_at + 'Z'));
            const utcEnd = new Date((data.end_time.endsWith('Z') ? data.end_time : data.end_time + 'Z'));
            
            meetingForm.setData({
                participant_ids: data.participants ? data.participants.map(p => p.id) : (data.participant_id ? [data.participant_id] : []),
                max_participants: data.max_participants || 1,
                scheduled_at: toDateTimeLocal(utcStart),
                end_time: toDateTimeLocal(utcEnd),
                location: data.location,
                meeting_link: data.meeting_link,
                agenda: data.agenda,
                notes: data.notes,
                status: data.status,
            });
            setParticipantSearch('');
            setModalMode('edit_meeting');
        } else {
            // Availability
            setModalMode('view_availability');
        }
        setIsModalOpen(true);
    };

    const submitAvailability = (e) => {
        e.preventDefault();
        availabilityForm.clearErrors();
        
        axios.post(route('api.mentor-availability.store'), availabilityForm.data)
            .then(() => {
                setIsModalOpen(false);
                fetchSchedules();
                availabilityForm.reset();
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        availabilityForm.setError(key, error.response.data.errors[key][0]);
                    });
                } else {
                    console.error('Error saving availability:', error);
                    alert(__('Failed to save availability. Please try again.'));
                }
            });
    };

    const submitMeeting = (e) => {
        e.preventDefault();
        meetingForm.clearErrors();
        
        const isEdit = modalMode === 'edit_meeting';
        const url = isEdit 
            ? route('api.mentor-meetings.update', selectedEvent.data.id) 
            : route('api.mentor-meetings.store');
        
        const method = isEdit ? 'patch' : 'post';

        const payload = {
            ...meetingForm.data,
            scheduled_at: new Date(meetingForm.data.scheduled_at).toISOString(),
            end_time: new Date(meetingForm.data.end_time).toISOString(),
        };

        axios[method](url, payload)
            .then((response) => {
                setIsModalOpen(false);
                fetchSchedules();
                meetingForm.reset();
                if (response.data.message) {
                    alert(response.data.message);
                }
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    if (error.response.data.errors) {
                        Object.keys(error.response.data.errors).forEach(key => {
                            meetingForm.setError(key, error.response.data.errors[key][0]);
                        });
                    } else if (error.response.data.message) {
                        // Handle generic 422 message (like overlap)
                        meetingForm.setError('scheduled_at', error.response.data.message);
                    }
                } else {
                    console.error('Error saving meeting:', error);
                    alert(__('Failed to save meeting. Please try again.'));
                }
            });
    };
    
    const deleteAvailability = () => {
        if (!selectedEvent || selectedEvent.type !== 'availability') return;
        if (confirm(__('Are you sure you want to delete this availability slot?'))) {
             axios.delete(route('api.mentor-availability.destroy', selectedEvent.data.id))
                .then(() => {
                    setIsModalOpen(false);
                    fetchSchedules();
                });
        }
    };

    const deleteMeeting = () => {
        if (!selectedEvent || selectedEvent.type !== 'meeting') return;
        if (confirm(__('Are you sure you want to delete this meeting?'))) {
             axios.delete(route('api.mentor-meetings.destroy', selectedEvent.data.id))
                .then(() => {
                    setIsModalOpen(false);
                    fetchSchedules();
                })
                .catch(error => {
                    console.error('Error deleting meeting:', error);
                    alert(__('Failed to delete meeting.'));
                });
        }
    };

    const handleEventDrop = (dropInfo) => {
        const { event } = dropInfo;
        const { type, data } = event.extendedProps;
        
        if (type !== 'meeting') {
            dropInfo.revert();
            return;
        }

        if (!confirm(__('Are you sure you want to reschedule this meeting?'))) {
            dropInfo.revert();
            return;
        }

        // FullCalendar updates the event object in place
        // In dayGridMonth, dropping often results in an all-day event or 00:00 time
        // We want to preserve the original time of day
        
        let newStart = new Date(event.start);
        
        // If it became allDay or time is 00:00 (and it wasn't before), restore original time
        // We assume meetings are not usually at exactly midnight unless specified
        if (event.allDay || (newStart.getHours() === 0 && newStart.getMinutes() === 0)) {
             const oldStart = dropInfo.oldEvent.start;
             if (oldStart) {
                 newStart.setHours(oldStart.getHours());
                 newStart.setMinutes(oldStart.getMinutes());
             }
        }
        
        const start = newStart.toISOString();

        // Calculate end time based on original duration
        let end;
        const oldStart = dropInfo.oldEvent.start;
        const oldEnd = dropInfo.oldEvent.end;
        
        if (oldStart && oldEnd) {
             const duration = oldEnd.getTime() - oldStart.getTime();
             end = new Date(newStart.getTime() + duration).toISOString();
        } else if (event.end) {
             end = event.end.toISOString();
        } else {
             // Fallback default 1 hour if no duration info
             end = new Date(newStart.getTime() + 60 * 60 * 1000).toISOString();
        }

        axios.patch(route('api.mentor-meetings.update', data.id), {
            scheduled_at: start,
            end_time: end,
        })
        .then(() => {
            fetchSchedules(); 
        })
        .catch(error => {
            console.error('Error rescheduling meeting:', error);
            alert(__('Failed to reschedule meeting.'));
            dropInfo.revert();
        });
    };

    const filteredEvents = events.filter(event => {
        if (filterType !== 'all') {
            if (filterType === 'availability' && event.extendedProps.type !== 'availability') return false;
            if (filterType === 'meeting' && event.extendedProps.type !== 'meeting') return false;
        }
        if (filterParticipant !== 'all' && event.extendedProps.type === 'meeting') {
            const meetingParticipants = event.extendedProps.data.participants || [];
            if (!meetingParticipants.some(p => p.id == filterParticipant)) {
                 // Fallback to legacy participant_id check just in case
                 if (event.extendedProps.data.participant_id != filterParticipant) return false;
            }
        }
        return true;
    });

    const filteredListEvents = events.filter(event => {
        const { type, data } = event.extendedProps;
        const date = new Date(event.start);

        // Status Filter
        if (listStatus !== 'all') {
            if (type === 'availability') {
                // Availability is implicitly 'available' or matches 'scheduled' conceptually?
                // Let's hide availability if filtering for specific status like 'pending' or 'cancelled'
                if (listStatus !== 'scheduled' && listStatus !== 'available') return false;
            } else {
                if (data.status !== listStatus) return false;
            }
        }

        // Search Filter
        if (listSearch) {
            const search = listSearch.toLowerCase();
            const agenda = (data.agenda || '').toLowerCase();
            const notes = (data.notes || '').toLowerCase();
            const participants = (data.participants || []).map(p => (p.first_name + ' ' + p.last_name).toLowerCase()).join(' ');
            
            if (!agenda.includes(search) && !notes.includes(search) && !participants.includes(search)) {
                return false;
            }
        }

        // Date Range Filter
        if (listStartDate) {
            const startDate = new Date(listStartDate);
            if (date < startDate) return false;
        }
        if (listEndDate) {
            const endDate = new Date(listEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (date > endDate) return false;
        }

        return true;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));

    const handleExport = () => {
        window.location.href = route('api.mentor-schedules.export');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex gap-4 w-full md:w-auto flex-wrap">
                        <div className="w-full md:w-48">
                            <SelectInput
                                className="w-full"
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <option value="all">{__('All Events')}</option>
                                <option value="availability">{__('Availability Only')}</option>
                                <option value="meeting">{__('Meetings Only')}</option>
                            </SelectInput>
                        </div>
                        <div className="w-full md:w-48">
                            <SelectInput
                                className="w-full"
                                value={filterParticipant}
                                onChange={e => setFilterParticipant(e.target.value)}
                            >
                                <option value="all">{__('All Participants')}</option>
                                {participants.map(p => (
                                    <option key={p.id} value={p.id}>{p.nickname || p.first_name}</option>
                                ))}
                            </SelectInput>
                        </div>
                    </div>
                    
                    <SecondaryButton onClick={handleExport}>
                        {__('Export to Calendar')}
                    </SecondaryButton>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridDay'
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={filteredEvents}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventDrop={handleEventDrop}
                    height="auto"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                />
            </div>

            {/* List View */}
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Schedule List')}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <div className="w-full md:w-64">
                            <TextInput
                                placeholder={__('Search participants, agenda...')}
                                value={listSearch}
                                onChange={e => setListSearch(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        <div className="w-full md:w-40">
                             <SelectInput
                                value={listStatus}
                                onChange={e => setListStatus(e.target.value)}
                                className="w-full"
                            >
                                <option value="all">{__('All Status')}</option>
                                <option value="scheduled">{__('Scheduled')}</option>
                                <option value="pending">{__('Pending Approval')}</option>
                                <option value="confirmed">{__('Confirmed')}</option>
                                <option value="cancelled">{__('Cancelled')}</option>
                                <option value="completed">{__('Completed')}</option>
                            </SelectInput>
                        </div>

                        <div className="flex gap-2 items-center">
                            <TextInput
                                type="date"
                                value={listStartDate}
                                onChange={e => setListStartDate(e.target.value)}
                                className="w-36"
                            />
                            <span className="text-gray-500">-</span>
                            <TextInput
                                type="date"
                                value={listEndDate}
                                onChange={e => setListEndDate(e.target.value)}
                                className="w-36"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Date & Time')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Mentor')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Type')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Participants')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Status')}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {__('Action')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredListEvents.length > 0 ? (
                                filteredListEvents.map((event) => {
                                    const { type, data } = event.extendedProps;
                                    const date = new Date(event.start);
                                    const endDate = event.end ? new Date(event.end) : null;
                                    
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                <div className="font-medium">{date.toLocaleDateString()}</div>
                                                <div className="text-gray-500 text-xs">
                                                    {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    {endDate && ` - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {auth.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${type === 'meeting' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'}`}>
                                                    {type}
                                                </span>
                                                {type === 'meeting' && data.agenda && (
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">{data.agenda}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                {type === 'meeting' && data.participants && data.participants.length > 0 ? (
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {data.participants.slice(0, 3).map(p => (
                                                            <div key={p.id} title={p.first_name + ' ' + p.last_name}>
                                                                <ProfilePhoto 
                                                                    src={p.profile_photo_url} 
                                                                    alt={p.first_name}
                                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                                                                    fallback={(p.first_name?.[0] || 'P').toUpperCase()}
                                                                />
                                                            </div>
                                                        ))}
                                                        {data.participants.length > 3 && (
                                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-100 text-xs font-medium text-gray-500">
                                                                +{data.participants.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs">{__('No participants')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {type === 'meeting' ? (
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${data.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                                          data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                          data.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                                          'bg-blue-100 text-blue-800'}`}>
                                                        {data.status === 'pending' ? __('Pending Approval') : __(data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Scheduled')}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {__('Available')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => handleEventClick({ event: { extendedProps: { type, data } } })}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    {__('Details')}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p>{__('No schedules found matching your criteria.')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    {modalMode === 'create_menu' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {__('Select Action')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <SecondaryButton 
                                    className="justify-center h-24 flex-col gap-2"
                                    onClick={() => setModalMode('create_availability')}
                                >
                                    <span className="text-xl">📅</span>
                                    {__('Set Availability')}
                                </SecondaryButton>
                                <SecondaryButton 
                                    className="justify-center h-24 flex-col gap-2"
                                    onClick={() => setModalMode('create_meeting')}
                                >
                                    <span className="text-xl">🤝</span>
                                    {__('Schedule Meeting')}
                                </SecondaryButton>
                            </div>
                        </div>
                    )}

                    {modalMode === 'create_availability' && (
                        <form onSubmit={submitAvailability} className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {__('Set Availability')}
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value={__('Start Time')} />
                                    <TextInput 
                                        type="time" 
                                        className="w-full mt-1"
                                        value={availabilityForm.data.start_time}
                                        onChange={e => availabilityForm.setData('start_time', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel value={__('End Time')} />
                                    <TextInput 
                                        type="time" 
                                        className="w-full mt-1"
                                        value={availabilityForm.data.end_time}
                                        onChange={e => availabilityForm.setData('end_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    checked={availabilityForm.data.is_recurring}
                                    onChange={e => availabilityForm.setData('is_recurring', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {__('Recurring (Weekly)')}
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <SecondaryButton onClick={() => setIsModalOpen(false)}>{__('Cancel')}</SecondaryButton>
                                <PrimaryButton disabled={availabilityForm.processing}>{__('Save')}</PrimaryButton>
                            </div>
                        </form>
                    )}

                    {(modalMode === 'create_meeting' || modalMode === 'edit_meeting') && (
                        <form onSubmit={submitMeeting} className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {modalMode === 'create_meeting' ? __('Schedule Meeting') : __('Edit Meeting')}
                            </h2>

                            {/* Participant Management */}
                            <div>
                                <InputLabel value={__('Participants')} />
                                
                                {/* Dropdown Selection */}
                                <div className="mt-1">
                                    <SelectInput
                                        className="w-full"
                                        value=""
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value);
                                            if (selectedId) {
                                                const newIds = [...meetingForm.data.participant_ids, selectedId];
                                                meetingForm.setData({
                                                    ...meetingForm.data,
                                                    participant_ids: newIds,
                                                    max_participants: Math.max(meetingForm.data.max_participants, newIds.length)
                                                });
                                            }
                                        }}
                                    >
                                        <option value="">{__('Select Participant')}</option>
                                        {participants
                                            .filter(p => !meetingForm.data.participant_ids.includes(p.id))
                                            .map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.first_name} {p.last_name} ({p.nickname || 'N/A'})
                                                </option>
                                            ))
                                        }
                                    </SelectInput>
                                </div>
                                <InputError message={meetingForm.errors.participant_ids} />

                                {/* Selected Participants List */}
                                <div className="mt-3 space-y-2">
                                    {meetingForm.data.participant_ids.map(id => {
                                        const p = participants.find(part => part.id === id);
                                        if (!p) return null;
                                        return (
                                            <div key={id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                                                <div className="flex items-center gap-3">
                                                    <ProfilePhoto 
                                                        src={p.profile_photo_url} 
                                                        alt={p.first_name} 
                                                        className="w-8 h-8 rounded-full object-cover" 
                                                        fallback={(p.first_name?.[0] || 'P').toUpperCase()}
                                                    />
                                                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                        {p.first_name} {p.last_name}
                                                    </span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    onClick={() => {
                                                        meetingForm.setData('participant_ids', meetingForm.data.participant_ids.filter(pid => pid !== id));
                                                    }}
                                                    title={__('Remove')}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {meetingForm.data.participant_ids.length === 0 && (
                                        <div className="p-2 text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-md text-center">
                                            {__('No participants selected')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value={__('Start')} />
                                    <TextInput 
                                        type="datetime-local" 
                                        className="w-full mt-1"
                                        value={meetingForm.data.scheduled_at}
                                        onChange={e => meetingForm.setData('scheduled_at', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel value={__('End')} />
                                    <TextInput 
                                        type="datetime-local" 
                                        className="w-full mt-1"
                                        value={meetingForm.data.end_time}
                                        onChange={e => meetingForm.setData('end_time', e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <InputLabel value={__('Agenda')} />
                                <TextInput 
                                    className="w-full mt-1"
                                    value={meetingForm.data.agenda}
                                    onChange={e => meetingForm.setData('agenda', e.target.value)}
                                />
                            </div>

                             <div>
                                <InputLabel value={__('Status')} />
                                <SelectInput
                                    className="w-full mt-1"
                                    value={meetingForm.data.status}
                                    onChange={e => meetingForm.setData('status', e.target.value)}
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                {modalMode === 'edit_meeting' ? (
                                    <DangerButton type="button" onClick={deleteMeeting}>{__('Delete')}</DangerButton>
                                ) : <div></div>}
                                <div className="flex gap-2">
                                    <SecondaryButton onClick={() => setIsModalOpen(false)}>{__('Cancel')}</SecondaryButton>
                                    <PrimaryButton disabled={meetingForm.processing}>{__('Save')}</PrimaryButton>
                                </div>
                            </div>
                        </form>
                    )}
                    
                    {modalMode === 'view_availability' && (
                         <div className="space-y-4">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {__('Availability Slot')}
                            </h2>
                            <p>{__('Start')}: {selectedEvent?.data.start_time}</p>
                            <p>{__('End')}: {selectedEvent?.data.end_time}</p>
                            <p>{__('Recurring')}: {selectedEvent?.data.is_recurring ? __('Yes') : __('No')}</p>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <SecondaryButton onClick={() => setIsModalOpen(false)}>{__('Close')}</SecondaryButton>
                                <DangerButton onClick={deleteAvailability}>{__('Delete')}</DangerButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
