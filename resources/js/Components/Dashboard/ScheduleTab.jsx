import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import SelectInput from '@/Components/SelectInput';

export default function ScheduleTab() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        date: '',
        priority: 'all',
        page: 1
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedSchedule, setSelectedSchedule] = useState(null);

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

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const params = { ...filters };
            // Remove empty filters
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === 'all') delete params[key];
            });

            const response = await window.axios.get(route('api.schedules'), { params });
            setSchedules(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSchedules();
        }, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (url) => {
        if (!url) return;
        const urlParams = new URL(url).searchParams;
        const page = urlParams.get('page');
        setFilters(prev => ({ ...prev, page }));
    };

    const openModal = (mode, schedule = null) => {
        setModalMode(mode);
        setSelectedSchedule(schedule);
        clearErrors();
        if (mode === 'edit' && schedule) {
            setData({
                name: schedule.name,
                date: schedule.date,
                start_time: schedule.start_time ? schedule.start_time.substring(0, 5) : '',
                end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '',
                description: schedule.description || '',
                priority: schedule.priority,
                pic: schedule.pic,
                location: schedule.location || '',
                status: schedule.status || 'scheduled',
            });
        } else {
            reset();
            // Default date to today if adding
            setData('date', new Date().toISOString().split('T')[0]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        const action = modalMode === 'add' ? route('schedule.store') : route('schedule.update', selectedSchedule.id);
        const method = modalMode === 'add' ? post : patch;

        method(action, {
            onSuccess: () => {
                closeModal();
                fetchSchedules(); // Refresh list
            },
        });
    };

    const handleDelete = () => {
        if (confirm(__('Are you sure you want to delete this activity?'))) {
            destroy(route('schedule.destroy', selectedSchedule.id), {
                onSuccess: () => {
                    closeModal();
                    fetchSchedules();
                },
            });
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <TextInput
                        placeholder={__('Search schedules...')}
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full sm:w-64"
                    />
                    <SelectInput
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full sm:w-40"
                    >
                        <option value="all">{__('All Status')}</option>
                        <option value="scheduled">{__('Scheduled')}</option>
                        <option value="ongoing">{__('Ongoing')}</option>
                        <option value="completed">{__('Completed')}</option>
                        <option value="cancelled">{__('Cancelled')}</option>
                    </SelectInput>
                    <TextInput
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="w-full sm:w-40"
                    />
                </div>
                <PrimaryButton onClick={() => openModal('add')}>
                    {__('Add Schedule')}
                </PrimaryButton>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Activity')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Date & Time')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Priority')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('PIC')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Status')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">{__('Loading...')}</td>
                                </tr>
                            ) : schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">{__('No schedules found.')}</td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{schedule.name}</div>
                                            {schedule.location && <div className="text-xs text-gray-500 dark:text-gray-400">{schedule.location}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(schedule.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {schedule.start_time?.substring(0, 5) || '-'} - {schedule.end_time?.substring(0, 5) || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(schedule.priority)}`}>
                                                {__(schedule.priority)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {schedule.pic}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
                                                {__(schedule.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => openModal('edit', schedule)}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                                            >
                                                {__('Edit')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination.links && pagination.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        {/* Custom simplified pagination for API response structure */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-sm text-gray-700 dark:text-gray-400">
                                {__('Showing')} {pagination.from} {__('to')} {pagination.to} {__('of')} {pagination.total} {__('results')}
                            </div>
                            <div className="flex gap-1">
                                {pagination.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url || link.active}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white' 
                                                : !link.url 
                                                    ? 'text-gray-400 cursor-not-allowed' 
                                                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {modalMode === 'add' ? __('Add Schedule') : __('Edit Schedule')}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value={__('Activity Name')} />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="date" value={__('Date')} />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="status" value={__('Status')} />
                                <SelectInput
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="scheduled">{__('Scheduled')}</option>
                                    <option value="ongoing">{__('Ongoing')}</option>
                                    <option value="completed">{__('Completed')}</option>
                                    <option value="cancelled">{__('Cancelled')}</option>
                                </SelectInput>
                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="start_time" value={__('Start Time')} />
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_time" value={__('End Time')} />
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.end_time} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="location" value={__('Location')} />
                            <TextInput
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.location} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="priority" value={__('Priority')} />
                                <SelectInput
                                    id="priority"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="mt-1 block w-full"
                                >
                                    <option value="low">{__('Low')}</option>
                                    <option value="medium">{__('Medium')}</option>
                                    <option value="high">{__('High')}</option>
                                </SelectInput>
                                <InputError message={errors.priority} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="pic" value={__('PIC')} />
                                <TextInput
                                    id="pic"
                                    value={data.pic}
                                    onChange={(e) => setData('pic', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.pic} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value={__('Description')} />
                            <TextInput
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        {modalMode === 'edit' ? (
                            <DangerButton type="button" onClick={handleDelete} disabled={processing}>
                                {__('Delete')}
                            </DangerButton>
                        ) : <div></div>}
                        
                        <div className="flex gap-3">
                            <SecondaryButton onClick={closeModal}>{__('Cancel')}</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {modalMode === 'add' ? __('Create') : __('Update')}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
