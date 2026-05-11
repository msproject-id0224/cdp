import { useState } from 'react';
import { router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import { __ } from '@/Utils/lang';

export default function GiftHistory({ gifts, filters }) {
    const [dateStart, setDateStart] = useState(filters.gift_date_start || '');
    const [dateEnd, setDateEnd] = useState(filters.gift_date_end || '');

    const handleFilter = () => {
        router.get(
            route('dashboard'),
            { ...filters, gift_date_start: dateStart, gift_date_end: dateEnd, active_tab: 'gifts' },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {__('Riwayat Gift')}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto items-end">
                    <div>
                        <span className="block text-xs text-gray-500 mb-1">{__('Dari')}</span>
                        <TextInput
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="w-full text-sm"
                        />
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 mb-1">{__('Sampai')}</span>
                        <TextInput
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="w-full text-sm"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150 h-[42px]"
                    >
                        {__('Filter')}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Kode Hadiah')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Tanggal')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Jenis')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Nilai')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {__('Status')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {gifts.data.length > 0 ? (
                            gifts.data.map((gift) => (
                                <tr key={gift.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                        {gift.gift_code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(gift.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">
                                        {gift.type} ({gift.model})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {gift.gift_value ? `Rp ${parseInt(gift.gift_value).toLocaleString('id-ID')}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            gift.status === 'received' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            gift.status === 'returned' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                            gift.status === 'pending_verification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                        }`}>
                                            {gift.status === 'received' ? __('Diterima') :
                                             gift.status === 'returned' ? __('Dikembalikan') :
                                             gift.status === 'pending_verification' ? __('Verifikasi') : __('Pending')}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    {__('Tidak ada riwayat hadiah.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-4">
                <Pagination links={gifts.links} />
            </div>
        </div>
    );
}
