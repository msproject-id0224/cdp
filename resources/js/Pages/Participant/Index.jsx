import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { useState, useEffect, useRef } from 'react';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function ParticipantIndex({ auth, participants, filters, mentors }) {
    const { locale } = usePage().props;
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

    const isFirstRender = useRef(true);

    const formatIdNumber = (idNumber) => {
        if (!idNumber) return '-';
        const str = idNumber.toString();
        const prefix = 'ID-0224';
        if (str.startsWith(prefix)) {
            return str;
        }
        return prefix + str.padStart(5, '0');
    };

    const toggleStatus = (id) => {
        if (!isAdmin) return;
        router.patch(route('participants.toggle-status', id));
    };

    const handleAssignMentor = (participantId, mentorId) => {
        if (!isAdmin) return;
        router.patch(route('participants.assign-mentor', participantId), {
            mentor_id: mentorId,
        }, {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatNumber = (number) => {
        if (!number) return '-';
        return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US').format(number);
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(route('participants.index'), queryParams, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                                        {isAdmin && (
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                {__('Actions')}
                                            </th>
                                        )}
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
                                                {isAdmin && (
                                                    <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                href={route('participants.edit', participant.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                {__('Edit')}
                                                            </Link>
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
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isAdmin ? 7 : 5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
