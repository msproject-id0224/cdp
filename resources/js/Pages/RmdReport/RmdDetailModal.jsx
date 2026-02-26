import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { __ } from '@/Utils/lang';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function RmdDetailModal({ show, onClose, userId }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && userId) {
            fetchData();
        } else {
            setData(null);
            setError(null);
        }
    }, [show, userId]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(route('rmd-report.participant.details', userId));
            setData(response.data);
        } catch (err) {
            console.error('Error fetching participant details:', err);
            setError(__('Gagal mengambil data partisipan.'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (percentage) => {
        if (percentage === 100) return 'text-green-600 dark:text-green-400';
        if (percentage > 0) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-gray-500 dark:text-gray-400';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Detail Progres RMD Partisipan')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        {error}
                        <button 
                            onClick={fetchData} 
                            className="block mx-auto mt-4 text-indigo-600 hover:text-indigo-800 underline"
                        >
                            {__('Coba Lagi')}
                        </button>
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        {/* Participant Info */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm relative">
                            <div className="absolute top-4 right-4">
                                <ProfilePhoto 
                                    src={data.user.profile_photo_url} 
                                    alt={data.user.name} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm" 
                                    fallbackClassName="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 font-bold text-2xl border-2 border-white dark:border-gray-600 shadow-sm"
                                    fallback={(data?.user?.name || 'P').charAt(0).toUpperCase()}
                                />
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('Nama Lengkap')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.name}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('No. Identitas')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.id_number || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('Usia')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.age} {__('Tahun')}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('Status Keseluruhan')}</span>
                                <span className={`font-medium ${data.summary.percentage === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                                    {data.summary.status} ({data.summary.percentage}%)
                                </span>
                            </div>
                        </div>

                        {/* Modules List */}
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {data.modules.map((module, index) => (
                                <div 
                                    key={index} 
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{module.name}</h3>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 ${getStatusColor(module.percentage)}`}>
                                            {module.status}
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-2">
                                        <div 
                                            className={`h-2 rounded-full ${module.percentage === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                            style={{ width: `${module.percentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{__('Progress')}: {module.percentage}%</span>
                                        <span>{__('Update')}: {formatDate(module.last_updated)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={onClose}
                    >
                        {__('Tutup')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
