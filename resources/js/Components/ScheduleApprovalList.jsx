import React, { useState, useEffect } from 'react';
import { __ } from '@/Utils/lang';
import axios from 'axios';

export default function ScheduleApprovalList() {
    const [schedules, setSchedules] = useState({ data: [], meta: {} });
    const [loading, setLoading] = useState(true);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        start_date: '',
        end_date: '',
        sort_by: 'created_at',
        sort_order: 'desc',
    });
    const [modal, setModal] = useState({ show: false, type: '', data: null });
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchSchedules();
    }, [filters]); // Re-fetch when filters change

    const fetchSchedules = async (page = 1) => {
        setLoading(true);
        try {
            const params = { ...filters, page };
            const response = await axios.get(route('api.admin.schedules.pending'), { params });
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectSchedule = (id) => {
        if (selectedSchedules.includes(id)) {
            setSelectedSchedules(selectedSchedules.filter(s => s !== id));
        } else {
            setSelectedSchedules([...selectedSchedules, id]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSchedules(schedules.data.map(s => s.id));
        } else {
            setSelectedSchedules([]);
        }
    };

    const openModal = (type, data = null) => {
        setModal({ show: true, type, data });
        setReason('');
    };

    const closeModal = () => {
        setModal({ show: false, type: '', data: null });
        setReason('');
    };

    const handleAction = async () => {
        setProcessing(true);
        try {
            if (modal.type === 'approve') {
                await axios.post(route('api.admin.schedules.approve', modal.data.id));
            } else if (modal.type === 'reject') {
                await axios.post(route('api.admin.schedules.reject', modal.data.id), { reason });
            } else if (modal.type === 'request_modification') {
                await axios.post(route('api.admin.schedules.request-modification', modal.data.id), { reason });
            } else if (modal.type === 'bulk_approve') {
                await axios.post(route('api.admin.schedules.bulk-approve'), { ids: selectedSchedules });
                setSelectedSchedules([]);
            } else if (modal.type === 'bulk_reject') {
                await axios.post(route('api.admin.schedules.bulk-reject'), { ids: selectedSchedules, reason });
                setSelectedSchedules([]);
            }

            closeModal();
            fetchSchedules(); // Refresh list
        } catch (error) {
            console.error('Error performing action:', error);
            alert(__('An error occurred. Please try again.'));
        } finally {
            setProcessing(false);
        }
    };

    const handleSort = (field) => {
        setFilters(prev => ({
            ...prev,
            sort_by: field,
            sort_order: prev.sort_by === field && prev.sort_order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const renderSortIcon = (field) => {
        if (filters.sort_by !== field) return null;
        return filters.sort_order === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{__('Schedule Approval')}</h3>
            
            {/* Filters & Actions Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        name="search"
                        placeholder={__('Search mentor or agenda...')}
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="date"
                        name="start_date"
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={filters.start_date}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="date"
                        name="end_date"
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={filters.end_date}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="flex gap-2">
                    {selectedSchedules.length > 0 && (
                        <>
                            <button
                                onClick={() => openModal('bulk_approve')}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow transition"
                            >
                                {__('Approve')} ({selectedSchedules.length})
                            </button>
                            <button
                                onClick={() => openModal('bulk_reject')}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition"
                            >
                                {__('Reject')} ({selectedSchedules.length})
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => fetchSchedules()}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow transition"
                    >
                        {__('Refresh')}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={schedules.data.length > 0 && selectedSchedules.length === schedules.data.length}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('mentor.name')}
                            >
                                {__('Mentor')} {renderSortIcon('mentor.name')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('agenda')}
                            >
                                {__('Agenda')} {renderSortIcon('agenda')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('scheduled_at')}
                            >
                                {__('Date & Time')} {renderSortIcon('scheduled_at')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {__('Participants')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {__('Actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {__('Loading...')}
                                </td>
                            </tr>
                        ) : schedules.data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {__('No pending schedules found.')}
                                </td>
                            </tr>
                        ) : (
                            schedules.data.map((schedule) => (
                                <tr key={schedule.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedSchedules.includes(schedule.id)}
                                            onChange={() => handleSelectSchedule(schedule.id)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {schedule.mentor.profile_photo_url ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={schedule.mentor.profile_photo_url} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                        {schedule.mentor.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{schedule.mentor.name}</div>
                                                <div className="text-sm text-gray-500">{schedule.mentor.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{schedule.agenda}</div>
                                        {schedule.notes && (
                                            <div className="text-xs text-gray-500 truncate max-w-xs" title={schedule.notes}>
                                                {schedule.notes}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(schedule.scheduled_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(schedule.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                            {new Date(schedule.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {schedule.participants && schedule.participants.slice(0, 3).map((p) => (
                                                <div key={p.id} className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-300 items-center justify-center text-xs font-bold text-white" title={p.name}>
                                                    {p.name.charAt(0)}
                                                </div>
                                            ))}
                                            {schedule.participants && schedule.participants.length > 3 && (
                                                <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 items-center justify-center text-xs font-medium text-gray-500">
                                                    +{schedule.participants.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        {(!schedule.participants || schedule.participants.length === 0) && (
                                            <span className="text-xs text-gray-400">{__('No participants')}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal('preview', schedule)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            {__('Preview')}
                                        </button>
                                        <button
                                            onClick={() => openModal('approve', schedule)}
                                            className="text-green-600 hover:text-green-900 mr-3"
                                        >
                                            {__('Approve')}
                                        </button>
                                        <button
                                            onClick={() => openModal('request_modification', schedule)}
                                            className="text-yellow-600 hover:text-yellow-900 mr-3"
                                        >
                                            {__('Modify')}
                                        </button>
                                        <button
                                            onClick={() => openModal('reject', schedule)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {__('Reject')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Simplified for now, can be improved */}
            {schedules.meta && schedules.meta.links && (
                <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                        {__('Showing')} <span className="font-medium">{schedules.meta.from || 0}</span> {__('to')} <span className="font-medium">{schedules.meta.to || 0}</span> {__('of')} <span className="font-medium">{schedules.meta.total || 0}</span> {__('results')}
                    </div>
                    <div className="flex space-x-2">
                        {schedules.meta.links.filter(link => link.url).map((link, key) => (
                            <button
                                key={key}
                                onClick={() => fetchSchedules(link.url.split('page=')[1])}
                                disabled={link.active}
                                className={`px-3 py-1 rounded border ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modal */}
            {modal.show && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                        modal.type === 'approve' || modal.type === 'bulk_approve' ? 'bg-green-100' : 
                                        modal.type === 'reject' || modal.type === 'bulk_reject' ? 'bg-red-100' : 
                                        modal.type === 'request_modification' ? 'bg-yellow-100' : 'bg-indigo-100'
                                    }`}>
                                        {/* Icon based on type */}
                                        <svg className={`h-6 w-6 ${
                                            modal.type === 'approve' || modal.type === 'bulk_approve' ? 'text-green-600' : 
                                            modal.type === 'reject' || modal.type === 'bulk_reject' ? 'text-red-600' : 
                                            modal.type === 'request_modification' ? 'text-yellow-600' : 'text-indigo-600'
                                        }`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {modal.type === 'approve' && __('Approve Schedule')}
                                            {modal.type === 'reject' && __('Reject Schedule')}
                                            {modal.type === 'request_modification' && __('Request Modification')}
                                            {modal.type === 'bulk_approve' && __('Bulk Approve Schedules')}
                                            {modal.type === 'bulk_reject' && __('Bulk Reject Schedules')}
                                            {modal.type === 'preview' && __('Schedule Details')}
                                        </h3>
                                        <div className="mt-2">
                                            {modal.type === 'preview' ? (
                                                <div className="text-sm text-gray-500 space-y-2">
                                                    <p><strong>{__('Mentor')}:</strong> {modal.data.mentor.name}</p>
                                                    <p><strong>{__('Agenda')}:</strong> {modal.data.agenda}</p>
                                                    <p><strong>{__('Date')}:</strong> {new Date(modal.data.scheduled_at).toLocaleDateString()}</p>
                                                    <p><strong>{__('Time')}:</strong> {new Date(modal.data.scheduled_at).toLocaleTimeString()} - {new Date(modal.data.end_time).toLocaleTimeString()}</p>
                                                    <p><strong>{__('Location')}:</strong> {modal.data.location || __('N/A')}</p>
                                                    <p><strong>{__('Notes')}:</strong> {modal.data.notes || __('N/A')}</p>
                                                    <p><strong>{__('Participants')}:</strong></p>
                                                    <ul className="list-disc pl-5">
                                                        {modal.data.participants && modal.data.participants.map(p => (
                                                            <li key={p.id}>{p.name}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : modal.type === 'bulk_approve' ? (
                                                <p className="text-sm text-gray-500">
                                                    {__('Are you sure you want to approve :count selected schedules?').replace(':count', selectedSchedules.length)}
                                                </p>
                                            ) : modal.type === 'bulk_reject' ? (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {__('Are you sure you want to reject :count selected schedules?').replace(':count', selectedSchedules.length)}
                                                    </p>
                                                    <textarea
                                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        rows="4"
                                                        placeholder={__('Enter reason for rejection...')}
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                    ></textarea>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4">
                                                        {modal.type === 'approve' && __('Are you sure you want to approve ":agenda"?').replace(':agenda', modal.data.agenda)}
                                                        {modal.type === 'reject' && __('Please provide a reason for rejecting ":agenda".').replace(':agenda', modal.data.agenda)}
                                                        {modal.type === 'request_modification' && __('Please provide feedback for ":agenda".').replace(':agenda', modal.data.agenda)}
                                                    </p>
                                                    {(modal.type === 'reject' || modal.type === 'request_modification') && (
                                                        <textarea
                                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            rows="4"
                                                            placeholder={__('Enter reason or feedback...')}
                                                            value={reason}
                                                            onChange={(e) => setReason(e.target.value)}
                                                        ></textarea>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                {modal.type !== 'preview' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleAction}
                                            disabled={processing || ((modal.type === 'reject' || modal.type === 'bulk_reject' || modal.type === 'request_modification') && !reason.trim())}
                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                                                modal.type === 'reject' || modal.type === 'bulk_reject' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                                                modal.type === 'request_modification' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                                                'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            } disabled:opacity-50`}
                                        >
                                            {processing ? __('Processing...') : __('Confirm')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            {__('Cancel')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {__('Close')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
