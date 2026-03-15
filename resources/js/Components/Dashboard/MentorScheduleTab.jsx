import React, { useState, useEffect, useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import idLocale from '@fullcalendar/core/locales/id';
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
import { QRCodeCanvas } from 'qrcode.react';

export default function MentorScheduleTab() {
    const { auth } = usePage().props;
    const [events, setEvents] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [qrData, setQrData] = useState(null);
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
        agenda_type: '',
        agenda: '',
        tools_materials: '',
        notes: '',
        status: 'scheduled',
    });

    const [participantSearch, setParticipantSearch] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null });
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', message }

    const showConfirm = (title, message, onConfirm, onCancel = null) => {
        setConfirmDialog({ open: true, title, message, onConfirm, onCancel });
    };
    const closeConfirm = (confirmed = false) => {
        if (!confirmed) confirmDialog.onCancel?.();
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null, onCancel: null });
    };
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3500);
    };

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
                if (meeting.status === 'confirmed')          color = '#10B981';
                if (meeting.status === 'cancelled')          color = '#6B7280';
                if (meeting.status === 'pending')            color = '#F59E0B';
                if (meeting.status === 'deletion_requested') color = '#EF4444';

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

    const handleShowQr = (id) => {
        setQrData(id);
        setIsQrModalOpen(true);
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
            agenda_type: '',
            agenda: '',
            tools_materials: '',
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
                location: data.location || '',
                meeting_link: data.meeting_link || '',
                agenda_type: data.agenda_type || '',
                agenda: data.agenda || '',
                tools_materials: data.tools_materials || '',
                notes: data.notes || '',
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
                availabilityForm.reset();
                showNotification('success', __('Availability saved successfully.'));
                fetchSchedules();
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    Object.keys(error.response.data.errors).forEach(key => {
                        availabilityForm.setError(key, error.response.data.errors[key][0]);
                    });
                } else {
                    console.error('Error saving availability:', error);
                    showNotification('error', __('Failed to save availability. Please try again.'));
                }
            });
    };

    // Build a FullCalendar event object from a meeting record (avoids full re-fetch after save)
    const buildMeetingEvent = (meeting) => {
        let color = '#3B82F6'; // scheduled
        if (meeting.status === 'confirmed')          color = '#10B981';
        if (meeting.status === 'cancelled')          color = '#6B7280';
        if (meeting.status === 'pending')            color = '#F59E0B';
        if (meeting.status === 'deletion_requested') color = '#EF4444';
        const start = (meeting.scheduled_at || '').endsWith('Z') ? meeting.scheduled_at : meeting.scheduled_at + 'Z';
        const end   = (meeting.end_time     || '').endsWith('Z') ? meeting.end_time     : meeting.end_time + 'Z';
        return {
            id:              `meeting-${meeting.id}`,
            title:           `${__('Meeting')} (${meeting.participants?.length ?? 0}/${meeting.max_participants})`,
            start,
            end,
            backgroundColor: color,
            borderColor:     color,
            extendedProps:   { type: 'meeting', data: meeting },
        };
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
                meetingForm.reset();
                showNotification('success', response.data.message || __('Meeting saved successfully.'));

                // Optimistic update: update only the affected event in state instead of
                // re-fetching all schedules (which is expensive).
                const meeting = response.data.meeting;
                if (meeting) {
                    const newEvent = buildMeetingEvent(meeting);
                    if (isEdit) {
                        setEvents(prev => prev.map(e => e.id === newEvent.id ? newEvent : e));
                    } else {
                        setEvents(prev => [...prev, newEvent]);
                    }
                } else {
                    fetchSchedules(); // fallback if server didn't return meeting data
                }
            })
            .catch(error => {
                if (error.response?.status === 422) {
                    if (error.response.data.errors) {
                        Object.keys(error.response.data.errors).forEach(key => {
                            meetingForm.setError(key, error.response.data.errors[key][0]);
                        });
                    } else if (error.response.data.message) {
                        meetingForm.setError('scheduled_at', error.response.data.message);
                    }
                } else {
                    console.error('Error saving meeting:', error);
                    showNotification('error', __('Failed to save meeting. Please try again.'));
                }
            });
    };
    
    const deleteAvailability = () => {
        if (!selectedEvent || selectedEvent.type !== 'availability') return;
        showConfirm(
            __('Delete Availability'),
            __('Are you sure you want to delete this availability slot?'),
            () => {
                axios.delete(route('api.mentor-availability.destroy', selectedEvent.data.id))
                    .then(() => {
                        setIsModalOpen(false);
                        showNotification('success', __('Availability deleted.'));
                        fetchSchedules();
                    })
                    .catch(() => showNotification('error', __('Failed to delete availability.')));
            }
        );
    };

    const deleteMeeting = () => {
        if (!selectedEvent || selectedEvent.type !== 'meeting') return;
        const meeting = selectedEvent.data;

        if (meeting.status === 'deletion_requested') {
            showNotification('error', __('Deletion request is already pending admin approval.'));
            return;
        }

        showConfirm(
            __('Request Meeting Deletion'),
            __('This will send a deletion request to admin for approval. The meeting will be removed once admin approves.'),
            () => {
                axios.delete(route('api.mentor-meetings.destroy', meeting.id))
                    .then((response) => {
                        setIsModalOpen(false);
                        showNotification('success', response.data.message || __('Deletion request submitted.'));
                        const updatedMeeting = response.data.meeting;
                        if (updatedMeeting) {
                            const newEvent = buildMeetingEvent(updatedMeeting);
                            setEvents(prev => prev.map(e => e.id === newEvent.id ? newEvent : e));
                        } else {
                            fetchSchedules();
                        }
                    })
                    .catch(error => {
                        console.error('Error requesting meeting deletion:', error);
                        showNotification('error', error.response?.data?.message || __('Failed to submit deletion request.'));
                    });
            }
        );
    };

    const handleEventDrop = (dropInfo) => {
        const { event } = dropInfo;
        const { type, data } = event.extendedProps;

        if (type !== 'meeting') {
            dropInfo.revert();
            return;
        }

        // Compute new times before reverting (values change after revert)
        let newStart = new Date(event.start);
        if (event.allDay || (newStart.getHours() === 0 && newStart.getMinutes() === 0)) {
            const oldStart = dropInfo.oldEvent.start;
            if (oldStart) {
                newStart.setHours(oldStart.getHours());
                newStart.setMinutes(oldStart.getMinutes());
            }
        }
        const start = newStart.toISOString();
        const oldStart = dropInfo.oldEvent.start;
        const oldEnd   = dropInfo.oldEvent.end;
        let end;
        if (oldStart && oldEnd) {
            end = new Date(newStart.getTime() + (oldEnd.getTime() - oldStart.getTime())).toISOString();
        } else if (event.end) {
            end = event.end.toISOString();
        } else {
            end = new Date(newStart.getTime() + 60 * 60 * 1000).toISOString();
        }

        // Revert visual position immediately — modal will confirm actual reschedule
        dropInfo.revert();

        showConfirm(
            __('Reschedule Meeting'),
            __('Are you sure you want to reschedule this meeting?'),
            () => {
                axios.patch(route('api.mentor-meetings.update', data.id), { scheduled_at: start, end_time: end })
                    .then(() => {
                        showNotification('success', __('Meeting rescheduled successfully.'));
                        fetchSchedules();
                    })
                    .catch(error => {
                        console.error('Error rescheduling meeting:', error);
                        showNotification('error', __('Failed to reschedule meeting.'));
                    });
            }
        );
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

    // Derived values for meeting form date/time display
    const scheduledDate = meetingForm.data.scheduled_at ? meetingForm.data.scheduled_at.split('T')[0] : '';
    const scheduledTime = meetingForm.data.scheduled_at ? (meetingForm.data.scheduled_at.split('T')[1] || '') : '';
    const endTimePart   = meetingForm.data.end_time     ? (meetingForm.data.end_time.split('T')[1]     || '') : '';
    const allParticipantsSelected = participants.length > 0 &&
        participants.every(p => meetingForm.data.participant_ids.includes(p.id));

    // ── Date → meeting status map for cell coloring ────────────────────────
    const dateMeetingMap = useMemo(() => {
        const map = {};
        events.forEach(event => {
            if (event.extendedProps?.type !== 'meeting') return;
            const status = event.extendedProps.data?.status;
            const start  = event.start;
            if (!start || !status) return;
            // Convert UTC event start to local YYYY-MM-DD
            const dateStr = new Date(start).toLocaleDateString('en-CA');
            if (!map[dateStr]) map[dateStr] = { pending: 0, approved: 0, total: 0 };
            map[dateStr].total++;
            if (['pending', 'modification_requested'].includes(status)) map[dateStr].pending++;
            else if (['scheduled', 'confirmed'].includes(status)) map[dateStr].approved++;
        });
        return map;
    }, [events]);

    const getDayCellClassNames = (arg) => {
        const dateStr = arg.date.toLocaleDateString('en-CA');
        const day = dateMeetingMap[dateStr];
        if (!day) return [];
        if (day.pending > 0) return ['fc-day-meeting-pending'];
        if (day.total > 0)   return ['fc-day-meeting-approved'];
        return [];
    };

    const AGENDA_OPTIONS = [
        { value: 'pengisian_rmd',  label: __('Pengisian RMD') },
        { value: 'pertemuan_umum', label: __('Pertemuan Umum') },
        { value: 'rapat_youth',    label: __('Rapat Youth') },
        { value: 'lainnya',        label: __('Lainnya') },
    ];

    const STATUS_LABELS = {
        scheduled:              __('Scheduled'),
        pending:                __('Pending Approval'),
        confirmed:              __('Confirmed'),
        cancelled:              __('Cancelled'),
        completed:              __('Completed'),
        modification_requested: __('Modification Requested'),
        rejected:               __('Rejected'),
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
                    locale={idLocale}
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
                    dayCellClassNames={getDayCellClassNames}
                    height="auto"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                />
                <style>{`
                    .fc-day-meeting-pending  { background-color: #FED7AA !important; }
                    .fc-day-meeting-pending  .fc-daygrid-day-number { color: #C2410C; font-weight: 700; }
                    .fc-day-meeting-approved { background-color: #BBF7D0 !important; }
                    .fc-day-meeting-approved .fc-daygrid-day-number { color: #15803D; font-weight: 700; }
                    .fc-day-meeting-pending:hover,
                    .fc-day-meeting-approved:hover { filter: brightness(0.94); }
                `}</style>
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
                                                <div className="font-medium">{date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                <div className="text-gray-500 text-xs">
                                                    {date.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                                    {endDate && ` – ${endDate.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {auth.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${type === 'meeting' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'}`}>
                                                    {type === 'meeting' ? __('Meeting') : __('Availability')}
                                                </span>
                                                {type === 'meeting' && data.agenda_type && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {AGENDA_OPTIONS.find(o => o.value === data.agenda_type)?.label || data.agenda_type}
                                                        {data.agenda_type === 'lainnya' && data.agenda && `: ${data.agenda}`}
                                                    </div>
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
                                                          data.status === 'cancelled' || data.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                          data.status === 'modification_requested' ? 'bg-orange-100 text-orange-800' :
                                                          'bg-blue-100 text-blue-800'}`}>
                                                        {STATUS_LABELS[data.status] ?? data.status}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {__('Available')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {type === 'meeting' && (
                                                    <button
                                                        onClick={() => handleShowQr(data.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                                        title={__('Show QR Code')}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75zM19.5 16.5h.75v.75h-.75v-.75z" />
                                                        </svg>
                                                    </button>
                                                )}
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

            {/* ── Toast Notification ── */}
            {notification && (
                <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all animate-fade-in ${
                    notification.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/80 text-green-800 dark:text-green-100 border-green-200 dark:border-green-700'
                        : 'bg-red-50 dark:bg-red-900/80 text-red-800 dark:text-red-100 border-red-200 dark:border-red-700'
                }`}>
                    {notification.type === 'success' ? (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    {notification.message}
                </div>
            )}

            {/* ── Confirmation Dialog ── */}
            <Modal show={confirmDialog.open} onClose={() => closeConfirm(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {confirmDialog.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {confirmDialog.message}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                        <SecondaryButton onClick={() => closeConfirm(false)}>
                            {__('Cancel')}
                        </SecondaryButton>
                        <DangerButton onClick={() => { confirmDialog.onConfirm?.(); closeConfirm(true); }}>
                            {__('Confirm')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>

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
                        <form onSubmit={submitMeeting} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 sticky top-0 bg-white dark:bg-gray-800 pb-2 border-b border-gray-100 dark:border-gray-700">
                                {modalMode === 'create_meeting' ? __('Schedule Meeting') : __('Edit Meeting')}
                            </h2>

                            {/* ── Date & Time ── */}
                            <div>
                                <InputLabel value={__('Date & Time')} />
                                <div className="mt-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                                    <div className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
                                        {scheduledDate
                                            ? new Date(scheduledDate + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                            : __('No date selected')}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <InputLabel value={__('Start Time')} />
                                            <TextInput
                                                type="time"
                                                className="w-full mt-1"
                                                value={scheduledTime}
                                                onChange={e => meetingForm.setData('scheduled_at', `${scheduledDate}T${e.target.value}`)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value={__('End Time')} />
                                            <TextInput
                                                type="time"
                                                className="w-full mt-1"
                                                value={endTimePart}
                                                onChange={e => meetingForm.setData('end_time', `${scheduledDate}T${e.target.value}`)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <InputError message={meetingForm.errors.scheduled_at} />
                                <InputError message={meetingForm.errors.end_time} />
                            </div>

                            {/* ── Participants ── */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <InputLabel value={__('Participants')} />
                                    <button
                                        type="button"
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                        onClick={() => meetingForm.setData(
                                            'participant_ids',
                                            allParticipantsSelected ? [] : participants.map(p => p.id)
                                        )}
                                    >
                                        {allParticipantsSelected ? __('Deselect All') : __('Select All')}
                                    </button>
                                </div>

                                <TextInput
                                    placeholder={__('Search participants...')}
                                    className="w-full mb-2"
                                    value={participantSearch}
                                    onChange={e => setParticipantSearch(e.target.value)}
                                />

                                <div className="max-h-44 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
                                    {participants
                                        .filter(p => {
                                            if (!participantSearch) return true;
                                            const s = participantSearch.toLowerCase();
                                            return (p.first_name + ' ' + p.last_name + ' ' + (p.nickname || '')).toLowerCase().includes(s);
                                        })
                                        .map(p => {
                                            const checked = meetingForm.data.participant_ids.includes(p.id);
                                            return (
                                                <label
                                                    key={p.id}
                                                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                                                        checked ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        checked={checked}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                meetingForm.setData('participant_ids', [...meetingForm.data.participant_ids, p.id]);
                                                            } else {
                                                                meetingForm.setData('participant_ids', meetingForm.data.participant_ids.filter(id => id !== p.id));
                                                            }
                                                        }}
                                                    />
                                                    <ProfilePhoto
                                                        src={p.profile_photo_url}
                                                        alt={p.first_name}
                                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                                        fallback={(p.first_name?.[0] || 'P').toUpperCase()}
                                                    />
                                                    <span className="text-sm text-gray-800 dark:text-gray-100 leading-tight">
                                                        {p.first_name} {p.last_name}
                                                        {p.nickname && <span className="text-xs text-gray-400 ml-1">({p.nickname})</span>}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    }
                                    {participants.length === 0 && (
                                        <div className="p-3 text-sm text-gray-500 italic text-center">{__('No participants assigned')}</div>
                                    )}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    {meetingForm.data.participant_ids.length} {__('selected')}
                                </p>
                                <InputError message={meetingForm.errors.participant_ids} />
                            </div>

                            {/* ── Meeting Agenda ── */}
                            <div>
                                <InputLabel value={__('Meeting Agenda')} />
                                <div className="mt-2 space-y-2">
                                    {AGENDA_OPTIONS.map(opt => (
                                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="agenda_type"
                                                value={opt.value}
                                                checked={meetingForm.data.agenda_type === opt.value}
                                                onChange={() => meetingForm.setData('agenda_type', opt.value)}
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {meetingForm.data.agenda_type === 'lainnya' && (
                                    <div className="mt-2">
                                        <InputLabel value={__('Description')} />
                                        <textarea
                                            className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                            rows={2}
                                            placeholder={__('Describe the agenda...')}
                                            value={meetingForm.data.agenda}
                                            onChange={e => meetingForm.setData('agenda', e.target.value)}
                                        />
                                    </div>
                                )}
                                <InputError message={meetingForm.errors.agenda_type} />
                            </div>

                            {/* ── Tools & Materials ── */}
                            <div>
                                <InputLabel value={__('Tools & Materials')} />
                                <textarea
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                    rows={2}
                                    placeholder={__('e.g. Alkitab, buku catatan, pena...')}
                                    value={meetingForm.data.tools_materials}
                                    onChange={e => meetingForm.setData('tools_materials', e.target.value)}
                                />
                                <InputError message={meetingForm.errors.tools_materials} />
                            </div>

                            {/* ── Location ── */}
                            <div>
                                <InputLabel value={__('Location')} />
                                <TextInput
                                    className="w-full mt-1"
                                    placeholder={__('e.g. Ruang Meeting A, Online...')}
                                    value={meetingForm.data.location}
                                    onChange={e => meetingForm.setData('location', e.target.value)}
                                />
                            </div>

                            {/* ── Meeting Link ── */}
                            <div>
                                <InputLabel value={__('Meeting Link')} />
                                <TextInput
                                    className="w-full mt-1"
                                    placeholder="https://..."
                                    value={meetingForm.data.meeting_link}
                                    onChange={e => meetingForm.setData('meeting_link', e.target.value)}
                                />
                            </div>

                            {/* ── Status (edit only) ── */}
                            {modalMode === 'edit_meeting' && (
                                <div>
                                    <InputLabel value={__('Status')} />
                                    {meetingForm.data.status === 'deletion_requested' ? (
                                        <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md text-sm text-red-700 dark:text-red-400">
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                            </svg>
                                            {__('Deletion Pending Admin Approval')}
                                        </div>
                                    ) : (
                                        <SelectInput
                                            className="w-full mt-1"
                                            value={meetingForm.data.status}
                                            onChange={e => meetingForm.setData('status', e.target.value)}
                                        >
                                            <option value="scheduled">{__('Scheduled')}</option>
                                            <option value="pending">{__('Pending Approval')}</option>
                                            <option value="confirmed">{__('Confirmed')}</option>
                                            <option value="cancelled">{__('Cancelled')}</option>
                                            <option value="completed">{__('Completed')}</option>
                                        </SelectInput>
                                    )}
                                </div>
                            )}

                            {/* ── Notes ── */}
                            <div>
                                <InputLabel value={__('Notes')} />
                                <textarea
                                    className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 rounded-md shadow-sm text-sm"
                                    rows={2}
                                    value={meetingForm.data.notes}
                                    onChange={e => meetingForm.setData('notes', e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                                {modalMode === 'edit_meeting' ? (
                                    selectedEvent?.data?.status === 'deletion_requested' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {__('Deletion Pending Approval')}
                                        </span>
                                    ) : (
                                        <DangerButton type="button" onClick={deleteMeeting}>{__('Request Deletion')}</DangerButton>
                                    )
                                ) : <div />}
                                <div className="flex gap-2">
                                    <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>{__('Cancel')}</SecondaryButton>
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

            {/* ── QR Code Modal ── */}
            <Modal show={isQrModalOpen} onClose={() => setIsQrModalOpen(false)}>
                <div className="p-6 text-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {__('Attendance QR Code')}
                    </h2>
                    <div className="flex justify-center mb-4">
                        {qrData && (
                            <QRCodeCanvas
                                value={qrData.toString()}
                                size={256}
                                level={"H"}
                                includeMargin={true}
                            />
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        {__('Scan this QR code to check in/out for the meeting.')}
                    </p>
                    <SecondaryButton onClick={() => setIsQrModalOpen(false)}>
                        {__('Close')}
                    </SecondaryButton>
                </div>
            </Modal>
        </div>
    );
}
