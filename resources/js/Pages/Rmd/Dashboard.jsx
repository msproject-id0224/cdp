import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function RmdDashboard({ auth, stats, participants, filters, ppaInfo }) {
    const [search, setSearch] = useState(filters.search || '');

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Pelaksanaan RMD')}
                </h2>
            }
        >
            <Head title={__('Dashboard RMD')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* TABLE SUMMARY (PELAKSANAAN RMD) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-2 border-dashed border-indigo-200 dark:border-indigo-800">
                        <div className="bg-blue-900 text-white text-center py-2 font-bold text-lg uppercase">
                            PELAKSANAAN RMD
                        </div>

                        {/* INFORMASI PPA */}
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 text-center py-1 font-bold text-sm uppercase border-b border-blue-200 dark:border-blue-800">
                            INFORMASI PPA
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 text-sm border border-gray-300 dark:border-gray-600">
                                {/* Row 1 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Tahun Fiskal Pengisian RMD
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.fiscal_year}
                                </div>

                                {/* Row 2 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Nama Gereja
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.church_name}
                                </div>

                                {/* Row 3 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    No ID PPA
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.ppa_id}
                                </div>

                                {/* Row 4 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Cluster
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.cluster}
                                </div>

                                {/* Row 5 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Bulan pengisian RMD
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.rmd_period}
                                </div>

                                {/* Row 6 */}
                                <div className="border-b border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Nama PIC Pendampingan RMD & Posisi
                                </div>
                                <div className="border-b border-gray-300 dark:border-gray-600 p-2 text-center">
                                    {ppaInfo.pic_name}
                                </div>

                                {/* Row 7 */}
                                <div className="border-r border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                    Jumlah Mentor Pendamping untuk RMD
                                </div>
                                <div className="p-2 text-center">
                                    {stats.mentor_count} Orang
                                </div>
                            </div>
                        </div>

                        {/* JUMLAH REMAJA & KEHADIRAN */}
                        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 text-center py-1 font-bold text-sm uppercase border-t border-b border-blue-200 dark:border-blue-800">
                            JUMLAH REMAJA & KEHADIRAN
                        </div>
                        <div className="p-4 pt-0 overflow-x-auto">
                            <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
                                <thead>
                                    <tr className="bg-blue-900 text-white">
                                        <th className="border border-blue-800 p-2 w-1/3"></th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">KU 12-14</th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">KU 15-18</th>
                                        <th className="border border-blue-800 p-2 w-1/6 text-center">KU 19+</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            Jumlah Remaja per KU
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_12_14}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_15_18}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.count_19_plus}</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            Jumlah Kelompok RMD per KU
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_12_14}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_15_18}</td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">{stats.groups_19_plus}</td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">
                                            Jumlah Total Remaja di PPA
                                        </td>
                                        <td colSpan="3" className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold">
                                            {stats.total_teens}
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">
                                            Jumlah Total Kelompok RMD di PPA
                                        </td>
                                        <td colSpan="3" className="border border-gray-300 dark:border-gray-600 p-2 text-center font-bold">
                                            {stats.total_groups}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 font-medium">
                                            Persentase Kehadiran Pertemuan RMD (Bab 1 - Bab 6)
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                                            {stats.attendance['12_14'] ?? '-'}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                                            {stats.attendance['15_18'] ?? '-'}
                                        </td>
                                        <td className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                                            {stats.attendance['19_plus'] ?? '-'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* DAFTAR PARTISIPAN (> 12 TAHUN) */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">
                                Daftar Partisipan (> 12 Tahun)
                            </h3>
                            <div className="w-full sm:w-64">
                                <TextInput
                                    type="text"
                                    placeholder={__('Cari Nama / ID...')}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            ID Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Nama Lengkap
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Umur
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kelompok Umur
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {participants.data.length > 0 ? (
                                        participants.data.map((participant) => {
                                            const birthDate = new Date(participant.date_of_birth);
                                            const today = new Date();
                                            let age = today.getFullYear() - birthDate.getFullYear();
                                            const m = today.getMonth() - birthDate.getMonth();
                                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                age--;
                                            }

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
                                                        {age} Tahun
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            ageGroup === '12-14' ? 'bg-green-100 text-green-800' :
                                                            ageGroup === '15-18' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                        }`}>
                                                            KU {ageGroup}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('participants.show', participant.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {__('Tidak ada partisipan di atas 12 tahun.')}
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
