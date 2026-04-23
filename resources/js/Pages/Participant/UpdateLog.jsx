import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTrans } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { useState, useEffect, useRef } from 'react';

const formatDDMMYY = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
};

export default function UpdateLog({ participants, filters }) {
    const __ = useTrans();
    const [search, setSearch] = useState(filters.search || '');
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) { isFirstRender.current = false; return; }
        const id = setTimeout(() => {
            router.get(route('participants.update-log'), { search }, {
                preserveState: true, preserveScroll: true, replace: true,
            });
        }, 300);
        return () => clearTimeout(id);
    }, [search]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Daftar Pembaruan Partisipan')}
                </h2>
            }
        >
            <Head title={__('Daftar Pembaruan Partisipan')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">

                        <div className="mb-6 flex items-center gap-4">
                            <TextInput
                                placeholder={__('Search...')}
                                className="w-full max-w-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            {__('Name')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden md:table-cell">
                                            {__('ID')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 hidden md:table-cell">
                                            {__('Age Group')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            {__('Status')}
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            {__('Last Update')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {participants.data && participants.data.length > 0 ? (
                                        participants.data.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <ProfilePhoto
                                                            src={p.profile_photo_url}
                                                            alt={p.first_name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                            fallbackClassName="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xs"
                                                            fallback={(p.first_name || 'P').charAt(0).toUpperCase()}
                                                        />
                                                        <Link
                                                            href={route('participants.show', p.id)}
                                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            {p.first_name} {p.last_name}
                                                            {p.nickname && (
                                                                <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">({p.nickname})</span>
                                                            )}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                        {p.id_number ? `ID-0224${String(p.id_number).padStart(5, '0')}` : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                                    {p.age_group || '-'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                                                        p.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {p.is_active ? __('Active') : __('Inactive')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700 dark:text-gray-300 font-mono">
                                                    {formatDDMMYY(p.updated_at)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
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
