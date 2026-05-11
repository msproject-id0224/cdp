import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '@/Components/ProfilePhoto';
import RmdDetailSummary from './RmdDetailSummary';
import axios from 'axios';

// ─── RMD Drawer ─────────────────────────────────────────────────────────────
function RmdDrawer({ participant, onClose }) {
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const [data, setData]       = useState(null);

    useEffect(() => {
        if (!participant) return;
        setLoading(true);
        setError(null);
        axios.get(route('participants.rmd-summary', participant.id))
            .then(res => setData(res.data))
            .catch(() => setError(__('Gagal memuat data RMD.')))
            .finally(() => setLoading(false));
    }, [participant?.id]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!participant) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <ProfilePhoto
                            src={participant.profile_photo_url}
                            alt={participant.first_name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            fallbackClassName="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0"
                            fallback={(participant.first_name || 'P').charAt(0).toUpperCase()}
                        />
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                {participant.first_name} {participant.last_name}
                                {participant.nickname && (
                                    <span className="ml-1 text-xs font-normal text-gray-400">({participant.nickname})</span>
                                )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {participant.age ? `${participant.age} ${__('Years')}` : ''}
                                {participant.gender ? ` · ${participant.gender}` : ''}
                                {participant.education ? ` · ${participant.education}` : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-3 shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        aria-label="Tutup"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress bar banner */}
                {data?.rmdProgress && (
                    <div className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800 shrink-0">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                                {__('Progres RMD')} — {data.rmdProgress.filled_count}/{data.rmdProgress.total_modules} {__('modul')}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                data.rmdProgress.overall_status === 'Selesai'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : data.rmdProgress.overall_status === 'Sedang Mengisi'
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                                {data.rmdProgress.overall_status}
                            </span>
                        </div>
                        <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${
                                    data.rmdProgress.overall_percentage === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${data.rmdProgress.overall_percentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {loading && (
                        <div className="flex items-center justify-center h-40">
                            <svg className="animate-spin w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center h-40 text-sm text-red-500">{error}</div>
                    )}
                    {!loading && !error && data && (
                        <RmdDetailSummary rmdDetail={data.rmdDetail} rmdProgress={data.rmdProgress} />
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0 flex justify-between items-center">
                    <Link
                        href={route('participants.show', participant.id)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        {__('Buka halaman detail lengkap')} →
                    </Link>
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        {__('Tutup')}
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ParticipantIndex({ auth, participants, filters, mentors }) {
    const isAdmin = auth?.user?.role === 'admin';
    const isMentorOrAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'mentor';
    const [queryParams, setQueryParams] = useState({
        search: filters.search || '',
        status: filters.status || '',
        gender: filters.gender || '',
        age_group: filters.age_group || '',
        sort_by: filters.sort_by || 'created_at',
        sort_direction: filters.sort_direction || 'desc',
        per_page: filters.per_page || '10',
    });

    const [rmdParticipant, setRmdParticipant] = useState(null);
    const isFirstRender = useRef(true);

    const formatIdNumber = (idNumber) => {
        if (!idNumber) return '-';
        const str = idNumber.toString();
        const prefix = 'ID-0224';
        if (str.startsWith(prefix)) return str;
        return prefix + str.padStart(5, '0');
    };

    const toggleStatus = (id) => {
        if (!isAdmin) return;
        router.patch(route('participants.toggle-status', id));
    };

    const handleAssignMentor = (participantId, mentorId) => {
        if (!isAdmin) return;
        router.patch(route('participants.assign-mentor', participantId), { mentor_id: mentorId }, { preserveScroll: true });
    };

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const id = setTimeout(() => {
            router.get(route('participants.index'), queryParams, {
                preserveState: true, preserveScroll: true, replace: true,
            });
        }, 300);
        return () => clearTimeout(id);
    }, [queryParams]);

    const handleSort = (column) => {
        setQueryParams(prev => ({
            ...prev,
            sort_by: column,
            sort_direction: prev.sort_by === column && prev.sort_direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const SortIcon = ({ column }) => {
        if (queryParams.sort_by !== column) return <span className="ml-1 text-gray-400">⇅</span>;
        return queryParams.sort_direction === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
    };

    // Determine if a participant is eligible for RMD (age >= 12)
    const isRmdEligible = (p) => {
        if (p.date_of_birth) {
            const birth = new Date(p.date_of_birth);
            const diff = (new Date() - birth) / (365.25 * 24 * 3600 * 1000);
            return diff >= 12;
        }
        return typeof p.age === 'number' && p.age >= 12;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {__('Participant List')}
                    </h2>
                    {isAdmin && (
                        <Link
                            href={route('participants.create')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {__('Add Participant')}
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={__('Participant List')} />

            {/* RMD Drawer */}
            {rmdParticipant && (
                <RmdDrawer
                    participant={rmdParticipant}
                    onClose={() => setRmdParticipant(null)}
                />
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">

                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="w-full md:w-1/3">
                                <TextInput
                                    placeholder={__('Search...')}
                                    className="w-full"
                                    value={queryParams.search}
                                    onChange={(e) => setQueryParams({ ...queryParams, search: e.target.value })}
                                />
                            </div>
                            <div className="w-full md:w-1/4">
                                <SelectInput
                                    className="w-full"
                                    value={queryParams.status}
                                    onChange={(e) => setQueryParams({ ...queryParams, status: e.target.value })}
                                >
                                    <option value="">{__('All Status')}</option>
                                    <option value="active">{__('Active')}</option>
                                    <option value="inactive">{__('Inactive')}</option>
                                </SelectInput>
                            </div>
                            <div className="w-full md:w-1/4">
                                <SelectInput
                                    className="w-full"
                                    value={queryParams.gender}
                                    onChange={(e) => setQueryParams({ ...queryParams, gender: e.target.value })}
                                >
                                    <option value="">{__('All Gender')}</option>
                                    <option value="Laki-laki">{__('Laki-laki')}</option>
                                    <option value="Perempuan">{__('Perempuan')}</option>
                                </SelectInput>
                            </div>
                            <div className="w-full md:w-1/4">
                                <SelectInput
                                    className="w-full"
                                    value={queryParams.age_group}
                                    onChange={(e) => setQueryParams({ ...queryParams, age_group: e.target.value })}
                                >
                                    <option value="">{__('All Age Groups')}</option>
                                    <option value="0-2">{__('0-2')}</option>
                                    <option value="3-5">{__('3-5')}</option>
                                    <option value="6-8">{__('6-8')}</option>
                                    <option value="9-11">{__('9-11')}</option>
                                    <option value="12-14">{__('12-14')}</option>
                                    <option value="15-18">{__('15-18')}</option>
                                    <option value="19+">{__('19+')}</option>
                                </SelectInput>
                            </div>
                            <div className="w-full md:w-1/6">
                                <SelectInput
                                    className="w-full"
                                    value={queryParams.per_page}
                                    onChange={(e) => setQueryParams({ ...queryParams, per_page: e.target.value })}
                                >
                                    <option value="10">10 / {__('Page')}</option>
                                    <option value="25">25 / {__('Page')}</option>
                                    <option value="50">50 / {__('Page')}</option>
                                    <option value="100">100 / {__('Page')}</option>
                                    <option value="250">250 / {__('Page')}</option>
                                </SelectInput>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th onClick={() => handleSort('first_name')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                            {__('Name')} <SortIcon column="first_name" />
                                        </th>
                                        <th onClick={() => handleSort('id_number')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hidden md:table-cell">
                                            {__('ID')} <SortIcon column="id_number" />
                                        </th>
                                        <th onClick={() => handleSort('age')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                            {__('Age/Gender')} <SortIcon column="age" />
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell">
                                            {__('Age Group')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            {__('Status')}
                                        </th>
                                        {isAdmin && (
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell">
                                                {__('Assigned Mentor')}
                                            </th>
                                        )}
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden lg:table-cell">
                                            {__('Last Update')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            {__('Actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {participants.data && participants.data.length > 0 ? (
                                        participants.data.map((participant) => (
                                            <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <ProfilePhoto
                                                            src={participant.profile_photo_url}
                                                            alt={participant.first_name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                            fallbackClassName="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs"
                                                            fallback={(participant.first_name || 'P').charAt(0).toUpperCase()}
                                                        />
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={route('participants.show', participant.id)}
                                                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                            >
                                                                {participant.first_name} {participant.last_name}
                                                            </Link>
                                                            {participant.nickname && (
                                                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                    ({participant.nickname})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        {formatIdNumber(participant.id_number)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="text-xs text-gray-900 dark:text-gray-100">
                                                        {participant.age ? `${participant.age} ${__('Years')}` : '-'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                                        {participant.gender ? __(participant.gender) : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                    {participant.age_group ? __(participant.age_group) : '-'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                                                        participant.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {participant.is_active ? __('Active') : __('Inactive')}
                                                    </span>
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                        <select
                                                            className="block w-full py-1 px-2 text-xs border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                            value={participant.mentor_id || ''}
                                                            onChange={(e) => handleAssignMentor(participant.id, e.target.value)}
                                                        >
                                                            <option value="">{__('Unassigned')}</option>
                                                            {mentors && mentors.map((mentor) => (
                                                                <option key={mentor.id} value={mentor.id}>
                                                                    {mentor.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                )}
                                                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300 font-mono hidden lg:table-cell">
                                                    {participant.updated_at
                                                        ? (() => {
                                                            const d = new Date(participant.updated_at);
                                                            return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)}`;
                                                          })()
                                                        : '-'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {isAdmin && (
                                                            <Link
                                                                href={route('participants.edit', participant.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                {__('Edit')}
                                                            </Link>
                                                        )}
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => toggleStatus(participant.id)}
                                                                className={`${
                                                                    participant.is_active
                                                                        ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                                                        : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                                                }`}
                                                            >
                                                                {participant.is_active ? __('Deactivate') : __('Activate')}
                                                            </button>
                                                        )}
                                                        {isMentorOrAdmin && isRmdEligible(participant) && (
                                                            <button
                                                                onClick={() => setRmdParticipant(participant)}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-[10px] font-semibold transition"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                RMD
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {__('No participants found.')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <Pagination links={participants.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
