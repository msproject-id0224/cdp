import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, screenings, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [date, setDate] = useState(filters.date || '');
    const [isInitialMount, setIsInitialMount] = useState(true);

    // Debounce search
    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                route('health-screenings.index'),
                { search, status, date },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 500);
        return () => clearTimeout(timer);
    }, [search, status, date]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
            router.delete(route('health-screenings.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Pemeriksaan Kesehatan
                    </h2>
                    <Link
                        href={route('health-screenings.create')}
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        + Tambah Pemeriksaan
                    </Link>
                </div>
            }
        >
            <Head title="Pemeriksaan Kesehatan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* Filters */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <TextInput
                                        placeholder="Cari nama atau ID..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-full sm:w-48">
                                    <SelectInput
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="normal">Normal</option>
                                        <option value="mild">Ringan (Mild)</option>
                                        <option value="moderate">Sedang (Moderate)</option>
                                        <option value="severe">Sangat Buruk (Severe)</option>
                                    </SelectInput>
                                </div>
                                <div className="w-full sm:w-48">
                                    <TextInput
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peserta</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">BB / TB (BMI)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status Gizi</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pemeriksa</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {screenings.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    Tidak ada data pemeriksaan ditemukan.
                                                </td>
                                            </tr>
                                        ) : (
                                            screenings.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.user?.first_name} {item.user?.last_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.user?.id_number || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(item.checked_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {item.weight ? `${item.weight} kg` : '-'} / {item.height ? `${item.height} cm` : '-'}
                                                        {item.bmi && <span className="ml-1 text-xs font-bold text-indigo-600">({item.bmi})</span>}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            item.malnutrition_status === 'normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            item.malnutrition_status === 'mild' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            item.malnutrition_status === 'moderate' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                            {item.malnutrition_status === 'normal' ? 'Normal' :
                                                             item.malnutrition_status === 'mild' ? 'Ringan' :
                                                             item.malnutrition_status === 'moderate' ? 'Sedang' : 'Sangat Buruk'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {item.examiner_name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                        <Link
                                                            href={route('health-screenings.edit', item.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <a 
                                                            href={route('health-screenings.export-pdf', item.id)} 
                                                            target="_blank"
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            PDF
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={screenings.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
