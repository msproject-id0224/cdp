import { useState } from 'react';
import { router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import { __ } from '@/Utils/lang';

export default function LetterHistory({ letters, filters }) {
    const [search, setSearch] = useState(filters.letter_search || '');
    
    // Debounce search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        // Simple debounce timeout
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            router.get(
                route('dashboard'),
                { ...filters, letter_search: value, active_tab: 'letters' },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {__('Riwayat Surat')}
                </h3>
                <div className="w-full sm:w-64">
                    <TextInput
                        type="text"
                        placeholder={__('Cari Nomor Surat / Perihal...')}
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
                                {__('Nomor Surat')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Tanggal')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Perihal')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Status')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Aksi')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {letters.data.length > 0 ? (
                            letters.data.map((letter) => (
                                <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {letter.letter_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(letter.sent_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {letter.subject}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            letter.status === 'read' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            letter.status === 'received' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                        }`}>
                                            {letter.status === 'read' ? __('Dibaca') :
                                             letter.status === 'received' ? __('Diterima') : __('Terkirim')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {letter.file_path ? (
                                            <a 
                                                href={`/storage/${letter.file_path}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            >
                                                {__('Unduh PDF')}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 cursor-not-allowed">{__('Tidak ada file')}</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {__('Tidak ada riwayat surat.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4">
                <Pagination links={letters.links} />
            </div>
        </div>
    );
}
