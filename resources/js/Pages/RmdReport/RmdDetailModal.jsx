import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useTrans } from '@/Utils/lang';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function RmdDetailModal({ show, onClose, userId }) {
    const __ = useTrans();
    const { locale } = usePage().props;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [expandedModule, setExpandedModule] = useState(null);

    useEffect(() => {
        if (show && userId) {
            fetchData();
            setExpandedModule(null);
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
            setError(__('Failed to fetch participant data.'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (percentage) => {
        if (percentage === 100) return 'text-green-600 dark:text-green-400';
        if (percentage > 0) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-gray-500 dark:text-gray-400';
    };

    const getBarColor = (percentage) => {
        if (percentage === 100) return 'bg-green-500';
        if (percentage > 0) return 'bg-indigo-500';
        return 'bg-gray-300 dark:bg-gray-600';
    };

    const getSectionIcon = (percentage) => {
        if (percentage === 100) return (
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
        );
        if (percentage > 0) return (
            <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
        );
        return (
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
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
                        {__('Participant RMD Progress Details')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">{__('Close')}</span>
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
                            {__('Try Again')}
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
                                <span className="block text-gray-500 dark:text-gray-400">{__('Full Name')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.name}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('ID Number')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.id_number || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('Age')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.user.age} {__('year(s)')}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 dark:text-gray-400">{__('Overall Status')}</span>
                                <span className={`font-medium ${data.summary.percentage === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                                    {data.summary.status} ({data.summary.percentage}%)
                                </span>
                            </div>
                        </div>

                        {/* Modules List */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1">
                            {__('Click on a module to see details of filled/unfilled sections.')}
                        </p>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                            {data.modules.map((module, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                        onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{module.name}</span>
                                                {module.sections?.length > 0 && (
                                                    <svg
                                                        className={`w-4 h-4 text-gray-400 transition-transform ${expandedModule === index ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 ${getStatusColor(module.percentage)}`}>
                                                {module.status}
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1.5">
                                            <div
                                                className={`h-2 rounded-full transition-all ${getBarColor(module.percentage)}`}
                                                style={{ width: `${module.percentage}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>{__('Progress')}: {module.percentage}%</span>
                                            <span>{__('Last Update')}: {formatDate(module.last_updated)}</span>
                                        </div>
                                    </button>

                                    {expandedModule === index && module.sections?.length > 0 && (
                                        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 pb-3 pt-2 space-y-2">
                                            {module.sections.map((section, si) => (
                                                <div key={si} className="flex items-center gap-2">
                                                    {getSectionIcon(section.percentage)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-0.5">
                                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{section.label}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 shrink-0">
                                                                {section.filled}/{section.total}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                            <div
                                                                className={`h-1.5 rounded-full ${getBarColor(section.percentage)}`}
                                                                style={{ width: `${section.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                        {__('Close')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
