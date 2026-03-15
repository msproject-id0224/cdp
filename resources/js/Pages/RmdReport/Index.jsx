import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';
import RmdDetailModal from './RmdDetailModal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

export default function RmdReportIndex({ auth, reports, filters, chartData, totalParticipants, userRole }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chartType, setChartType] = useState('bar');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                handleFilterChange('search', search);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (key, value) => {
        setIsLoading(true);
        router.get(
            route('rmd-report.index'),
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleSort = (column) => {
        const direction =
            filters.sort === column && filters.direction === 'asc' ? 'desc' : 'asc';
        handleFilterChange('sort', column);
        handleFilterChange('direction', direction);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Selesai':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Sedang Mengisi':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        setIsModalOpen(true);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                },
            }
        }
    };

    const renderAgeChart = () => {
        const data = chartData.age_distribution;
        if (!data || !data.datasets || data.datasets.length === 0) return null;

        const options = {
            ...chartOptions,
            plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Distribusi Usia Partisipan' }
            },
            scales: {
                y: { ...chartOptions.scales.y, title: { display: true, text: 'Jumlah Partisipan' } },
                x: { title: { display: true, text: 'Rentang Usia' } }
            }
        };

        return <Bar options={options} data={data} />;
    };

    const renderParticipationChart = () => {
        const data = chartData.participation_rate;
        if (!data || !data.datasets || data.datasets.length === 0) return null;

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Partisipasi RMD' }
            }
        };

        return <Doughnut options={options} data={data} />;
    };

    const renderProgressChart = () => {
        const data = chartData.progress_distribution;
        if (!data || !data.datasets || data.datasets.length === 0) return null;

        const options = {
            ...chartOptions,
            indexAxis: 'y',
            plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Progress Pengisian Modul' }
            },
            scales: {
                x: { ...chartOptions.scales.y, title: { display: true, text: 'Jumlah Partisipan' } },
                y: { title: { display: true, text: 'Jumlah Modul Terisi' } }
            }
        };

        return <Bar options={options} data={data} />;
    };

    const renderCharts = () => {
        if (chartData?.error) {
            return (
                <div className="col-span-full flex items-center justify-center h-40 text-red-500 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    {chartData.error}
                </div>
            );
        }

        return (
            <div className="space-y-6 mb-6">
                {/* Summary Card */}
                <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 dark:bg-indigo-900 dark:text-indigo-200">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{__('Total Partisipan (12+ Tahun)')}</p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalParticipants || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Age Distribution */}
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{__('Distribusi Usia')}</h3>
                             {chartData?.age_distribution?.total !== undefined && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    Total: {chartData.age_distribution.total}
                                </span>
                            )}
                        </div>
                        <div className="h-64">
                            {renderAgeChart() || <div className="flex items-center justify-center h-full text-gray-500">{__('Tidak ada data')}</div>}
                        </div>
                    </div>

                    {/* Participation Rate */}
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{__('Tingkat Partisipasi (12+ Tahun)')}</h3>
                             {chartData?.participation_rate?.total !== undefined && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Total: {chartData.participation_rate.total}
                                </span>
                            )}
                        </div>
                        <div className="h-64 flex justify-center relative group">
                            {renderParticipationChart() || <div className="flex items-center justify-center h-full text-gray-500">{__('Tidak ada data')}</div>}
                            
                            {/* Tooltip hint for age filter */}
                            <div className="absolute top-0 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-75">
                                {__('Data hanya mencakup partisipan berusia 12 tahun ke atas')}
                            </div>
                        </div>
                    </div>

                    {/* Progress Distribution */}
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{__('Progress Pengisian (12+ Tahun)')}</h3>
                             {chartData?.progress_distribution?.total !== undefined && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    Total: {chartData.progress_distribution.total}
                                </span>
                            )}
                        </div>
                        <div className="h-80 relative group">
                            {renderProgressChart() || <div className="flex items-center justify-center h-full text-gray-500">{__('Tidak ada data')}</div>}
                            
                            {/* Tooltip hint for age filter */}
                            <div className="absolute top-0 right-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-75">
                                {__('Data hanya mencakup partisipan berusia 12 tahun ke atas')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Laporan RMD')}
                </h2>
            }
        >
            <Head title={__('Laporan RMD')} />

            <RmdDetailModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                userId={selectedUser} 
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {userRole === 'mentor' && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                {__('Menampilkan progres RMD partisipan yang ditugaskan kepada Anda.')}
                            </p>
                        </div>
                    )}

                    {userRole !== 'mentor' && renderCharts()}

                    {/* Table Section */}
                    <div className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">{__('Daftar Partisipan (> 12 Tahun)')}</h3>
                                <span className="text-sm text-gray-500">
                                    Total: {reports.total} Partisipan
                                </span>
                            </div>

                            {/* Filters & Actions */}
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div className="flex flex-col gap-4 md:flex-row md:items-end flex-grow">
                                    <div className="w-full md:w-1/3">
                                        <TextInput
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={__('Cari Nama atau No. Identitas')}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/4">
                                        <SelectInput
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value);
                                                handleFilterChange('status', e.target.value);
                                            }}
                                            className="w-full"
                                        >
                                            <option value="">{__('Semua Status')}</option>
                                            <option value="Belum Mulai">{__('Belum Mulai')}</option>
                                            <option value="Sedang Mengisi">{__('Sedang Mengisi')}</option>
                                            <option value="Selesai">{__('Selesai')}</option>
                                        </SelectInput>
                                    </div>
                                </div>
                                
                                {userRole !== 'mentor' && (
                                    <div className="flex gap-2 shrink-0">
                                        <a
                                            href={route('rmd-report.export.excel', filters)}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-500 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            Excel
                                        </a>
                                        <a
                                            href={route('rmd-report.export.pdf', filters)}
                                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            PDF
                                        </a>
                                        <a
                                            href={route('rmd-report.export.analytics')}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                            title={__('Download Data Analisis Lengkap')}
                                        >
                                            {__('Data Analisis')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="relative overflow-x-auto border rounded-lg dark:border-gray-700">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    </div>
                                )}
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('user_name')}>
                                                <div className="flex items-center">
                                                    {__('Nama Partisipan')}
                                                    {filters.sort === 'user_name' && (
                                                        <span className="ml-1">{filters.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                {__('No. Identitas')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                {__('Progres Modul')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                {__('Status')}
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                {__('Terakhir Diperbarui')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.data.length > 0 ? (
                                            reports.data.map((item, index) => (
                                                <tr
                                                    key={item.user_id}
                                                    onClick={() => handleUserClick(item.user_id)}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer"
                                                >
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        <span className="text-indigo-600 dark:text-indigo-400">
                                                            {item.user_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.user_id_number || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 flex-grow">
                                                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
                                                                {item.filled_modules_count} / {item.total_modules}
                                                            </span>
                                                            <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" title={__('Klik untuk detail')}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.last_updated}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    {__('Tidak ada data ditemukan.')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4">
                                <Pagination links={reports.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
