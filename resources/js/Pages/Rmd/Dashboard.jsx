import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function RmdDashboard({ auth, stats, participants, filters, ppaInfo, staffList }) {
    const [search, setSearch] = useState(filters.search || '');
    const [editMode, setEditMode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        fiscal_year: ppaInfo.fiscal_year || '',
        church_name: ppaInfo.church_name || '',
        ppa_id:      ppaInfo.ppa_id || '',
        cluster:     ppaInfo.cluster || '',
        rmd_period:  ppaInfo.rmd_period || '',
        pic_user_id: ppaInfo.pic_user_id || '',
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            router.get(
                route('rmd.dashboard'),
                { search: value },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);
    };

    const handleSave = (e) => {
        e.preventDefault();
        post(route('rmd.dashboard.ppa-info'), {
            onSuccess: () => setEditMode(false),
        });
    };

    const handleCancel = () => {
        reset();
        setEditMode(false);
    };

    const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500";
    const errorClass = "text-red-500 text-xs mt-0.5";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('RMD Implementation')}
                </h2>
            }
        >
            <Head title={__('RMD Dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* TABLE SUMMARY (PELAKSANAAN RMD) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Header */}
                        <div className="bg-blue-900 text-white text-center py-2 font-bold text-lg uppercase">
                            {__('RMD Implementation')}
                        </div>

                        {/* INFORMASI PPA */}
                        <div className="flex items-center justify-between bg-blue-100 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800 px-4 py-1">
                            <span className="text-blue-900 dark:text-blue-100 font-bold text-sm uppercase flex-1 text-center">
                                {__('PPA Information')}
                            </span>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                                >
                                    {__('Edit')}
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 text-sm border border-gray-300 dark:border-gray-600">

                                    {/* Row 1 – Tahun Fiskal */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('RMD Fiscal Year')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <TextInput
                                                    value={data.fiscal_year}
                                                    onChange={e => setData('fiscal_year', e.target.value)}
                                                    placeholder={__('e.g., FY 2025/2026')}
                                                    className={inputClass}
                                                />
                                                {errors.fiscal_year && <p className={errorClass}>{errors.fiscal_year}</p>}
                                            </div>
                                        ) : ppaInfo.fiscal_year}
                                    </div>

                                    {/* Row 2 – Nama Gereja */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('Church Name')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <TextInput
                                                    value={data.church_name}
                                                    onChange={e => setData('church_name', e.target.value)}
                                                    placeholder={__('Church name')}
                                                    className={inputClass}
                                                />
                                                {errors.church_name && <p className={errorClass}>{errors.church_name}</p>}
                                            </div>
                                        ) : ppaInfo.church_name}
                                    </div>

                                    {/* Row 3 – No ID PPA */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('PPA ID No')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <TextInput
                                                    value={data.ppa_id}
                                                    onChange={e => setData('ppa_id', e.target.value)}
                                                    placeholder={__('e.g., ID 0224')}
                                                    className={inputClass}
                                                />
                                                {errors.ppa_id && <p className={errorClass}>{errors.ppa_id}</p>}
                                            </div>
                                        ) : (
                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                                {ppaInfo.ppa_id}
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 4 – Cluster */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('Cluster')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <TextInput
                                                    value={data.cluster}
                                                    onChange={e => setData('cluster', e.target.value)}
                                                    placeholder={__('Cluster name')}
                                                    className={inputClass}
                                                />
                                                {errors.cluster && <p className={errorClass}>{errors.cluster}</p>}
                                            </div>
                                        ) : ppaInfo.cluster}
                                    </div>

                                    {/* Row 5 – Bulan Pengisian RMD */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('RMD Period')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <TextInput
                                                    value={data.rmd_period}
                                                    onChange={e => setData('rmd_period', e.target.value)}
                                                    placeholder={__('e.g., January 2025 - June 2025')}
                                                    className={inputClass}
                                                />
                                                {errors.rmd_period && <p className={errorClass}>{errors.rmd_period}</p>}
                                            </div>
                                        ) : (
                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                {ppaInfo.rmd_period}
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 6 – PIC */}
                                    <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('RMD Facilitator Name & Position')}
                                    </div>
                                    <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                        {editMode ? (
                                            <div>
                                                <select
                                                    value={data.pic_user_id}
                                                    onChange={e => setData('pic_user_id', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="">-- {__('Select PIC')} --</option>
                                                    {staffList.map(s => (
                                                        <option key={s.id} value={s.id}>{s.label}</option>
                                                    ))}
                                                </select>
                                                {errors.pic_user_id && <p className={errorClass}>{errors.pic_user_id}</p>}
                                            </div>
                                        ) : (
                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                {ppaInfo.pic_name ?? '-'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Row 7 – Jumlah Mentor (auto) */}
                                    <div className="border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                        {__('Number of RMD Mentors')}
                                    </div>
                                    <div className="p-2 text-center">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                            {stats.mentor_count} {__('Person(s)')}
                                        </span>
                                        {editMode && (
                                            <span className="text-xs text-gray-400 ml-1">({__('automatic')})</span>
                                        )}
                                    </div>
                                </div>

                                {/* Save / Cancel buttons */}
                                {editMode && (
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {__('Cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-1.5 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                                        >
                                            {processing ? __('Saving...') : __('Save')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* JUMLAH REMAJA & KEHADIRAN */}
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 text-center py-1 font-bold text-sm uppercase border-t border-b border-blue-200 dark:border-blue-800">
                            {__('Youth Count & Attendance')}
                        </div>
                        <div className="p-4 pt-0 overflow-x-auto">
                            <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-blue-900 text-white">
                                        <th className="border border-blue-800 p-2 w-1/3"></th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">{__('Age Group 12-14')}</th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">{__('Age Group 15-18')}</th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">{__('Age Group 19+')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            {__('Youth Count per Age Group')}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_12_14}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_15_18}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_19_plus}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            {__('RMD Group Count per Age Group')}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_12_14}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_15_18}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_19_plus}</td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">
                                            {__('Total Youth in PPA')}
                                        </td>
                                        <td colSpan="3" className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold">
                                            {stats.total_teens}
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">
                                            {__('Total RMD Groups in PPA')}
                                        </td>
                                        <td colSpan="3" className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold">
                                            {stats.total_groups}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            {__('RMD Meeting Attendance Rate (Ch 1 - Ch 6)')}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.attendance['12_14'] ?? '-'}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.attendance['15_18'] ?? '-'}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.attendance['19_plus'] ?? '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* DAFTAR PARTISIPAN (> 12 TAHUN) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">
                                {__('Participant List (> 12 Years)')}
                            </h3>
                            <div className="w-full sm:w-64">
                                <TextInput
                                    type="text"
                                    placeholder={__('Search Name / ID...')}
                                    value={search}
                                    onChange={handleSearch}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('ID Number')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Full Name')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Age')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Age Group')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Action')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {participants.data.length > 0 ? (
                                        participants.data.map((participant) => {
                                            const birthDate = new Date(participant.date_of_birth);
                                            const today = new Date();
                                            let age = today.getFullYear() - birthDate.getFullYear();
                                            const m = today.getMonth() - birthDate.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

                                            let ageGroup = 'Unknown';
                                            if (age >= 12 && age <= 14) ageGroup = '12-14';
                                            else if (age >= 15 && age <= 18) ageGroup = '15-18';
                                            else if (age >= 19) ageGroup = '19+';

                                            return (
                                                <tr key={participant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                        {participant.id_number || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {participant.first_name} {participant.last_name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {age} {__('year(s)')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            ageGroup === '12-14' ? 'bg-green-100 text-green-800' :
                                                            ageGroup === '15-18' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            {__('KU')} {ageGroup}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('participants.show', participant.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            {__('Details')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {__('No participants over 12 years old.')}
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
