import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import TextInput from '@/Components/TextInput';
import { useState, useEffect, useRef } from 'react';
import Pagination from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import GiftReceptionForm from '@/Components/Gifts/GiftReceptionForm';
import GiftVerificationModal from '@/Components/Gifts/GiftVerificationModal';
import GiftDetailModal from '@/Components/Gifts/GiftDetailModal';

export default function GiftIndex({ auth, gifts, filters = {} }) {
    const isAdmin = auth.user.role === 'admin';
    const isMentor = auth.user.role === 'mentor';
    const { delete: destroy, processing } = useForm();
    
    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [model, setModel] = useState(filters.model || '');
    const [status, setStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters.per_page || 25);

    // Modal States
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [giftToDelete, setGiftToDelete] = useState(null);
    const [showReceptionForm, setShowReceptionForm] = useState(false);
    const [selectedGiftForReception, setSelectedGiftForReception] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [selectedGiftForVerification, setSelectedGiftForVerification] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedGiftForDetail, setSelectedGiftForDetail] = useState(null);

    // Track first render to avoid initial loop
    const isFirstRender = useRef(true);

    // Debounce Search & Filter
    useEffect(() => {
        // Skip first render if state matches initial props
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(
                route('gifts.index'),
                { search, type, model, status, sort_by: sortBy, sort_order: sortOrder, per_page: perPage },
                { preserveState: true, replace: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, type, model, status, sortBy, sortOrder, perPage]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const confirmDelete = (gift) => {
        setGiftToDelete(gift);
        setConfirmingDeletion(true);
    };

    const handleDelete = () => {
        if (giftToDelete) {
            destroy(route('gifts.destroy', giftToDelete.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onError: () => {
                    // Handle error (flash message handled by layout)
                    closeModal();
                }
            });
        }
    };

    const handleOpenReceptionForm = (gift) => {
        setSelectedGiftForReception(gift);
        setShowReceptionForm(true);
    };

    const handleOpenVerification = (gift) => {
        setSelectedGiftForVerification(gift);
        setShowVerificationModal(true);
    };

    const handleOpenDetail = (gift) => {
        setSelectedGiftForDetail(gift);
        setShowDetailModal(true);
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setGiftToDelete(null);
        setShowReceptionForm(false);
        setSelectedGiftForReception(null);
        setShowVerificationModal(false);
        setSelectedGiftForVerification(null);
        setShowDetailModal(false);
        setSelectedGiftForDetail(null);
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return <span className="text-gray-400 ml-1">⇅</span>;
        return sortOrder === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {__('Daftar Partisipan Penerima Hadiah')}
                    </h2>
                    {isAdmin && (
                        <Link href={route('gifts.create')}>
                            <PrimaryButton>{__('Tambah Penerima Hadiah')}</PrimaryButton>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={__('Daftar Partisipan Penerima Hadiah')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* Filters & Controls */}
                            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-end">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                                    <TextInput
                                        placeholder={__('Cari Nama, ID Hadiah, Surat...')}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                    <SelectInput
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">{__('Semua Jenis')}</option>
                                        <option value="birthday">{__('Ulang Tahun')}</option>
                                        <option value="family">{__('Keluarga')}</option>
                                        <option value="general">{__('Umum')}</option>
                                    </SelectInput>
                                    <SelectInput
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full"
                                    >
                                        <option value="">{__('Semua Status')}</option>
                                        <option value="pending">{__('Belum diterima')}</option>
                                        <option value="pending_verification">{__('Menunggu Verifikasi')}</option>
                                        <option value="received">{__('Telah diterima')}</option>
                                        <option value="returned">{__('Dikembalikan')}</option>
                                        <option value="draft">{__('Draft')}</option>
                                    </SelectInput>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 whitespace-nowrap">{__('Show')}:</span>
                                        <SelectInput
                                            value={perPage}
                                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                                            className="w-20"
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </SelectInput>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {__('No.')}
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                                onClick={() => handleSort('user.name')}
                                            >
                                                {__('Nama Partisipan')} <SortIcon column="user.name" />
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                                onClick={() => handleSort('gift_code')}
                                            >
                                                {__('ID Hadiah')} <SortIcon column="gift_code" />
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                                onClick={() => handleSort('letter_code')}
                                            >
                                                {__('ID Surat')} <SortIcon column="letter_code" />
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                                onClick={() => handleSort('status')}
                                            >
                                                {__('Status')} <SortIcon column="status" />
                                            </th>
                                            {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('Aksi')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {gifts.data.length > 0 ? (
                                            gifts.data.map((gift, index) => (
                                                <tr key={gift.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {(gifts.current_page - 1) * gifts.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {gift.user.first_name} {gift.user.last_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{gift.user.id_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400">
                                                        {isMentor && gift.status !== 'received' ? (
                                                            <button 
                                                                onClick={() => handleOpenReceptionForm(gift)}
                                                                className="hover:underline text-left"
                                                                title="Proses Penerimaan Hadiah"
                                                            >
                                                                {gift.gift_code}
                                                            </button>
                                                        ) : (
                                                            isAdmin ? (
                                                                gift.status === 'received' ? (
                                                                    <button 
                                                                        onClick={() => handleOpenDetail(gift)}
                                                                        className="hover:underline text-left font-medium text-green-600 dark:text-green-400"
                                                                        title="Lihat Detail Penerimaan"
                                                                    >
                                                                        {gift.gift_code}
                                                                    </button>
                                                                ) : (
                                                                    <Link href={route('gifts.edit', gift.id)} className="hover:underline">
                                                                        {gift.gift_code}
                                                                    </Link>
                                                                )
                                                            ) : (
                                                                <span>{gift.gift_code}</span>
                                                            )
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 dark:text-indigo-400">
                                                        {gift.letter_code ? (
                                                             <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline cursor-pointer" title="Lihat Dokumen">
                                                                {gift.letter_code}
                                                             </a>
                                                        ) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            gift.status === 'received' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                                            gift.status === 'returned' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                                            gift.status === 'pending_verification' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            gift.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                        }`}>
                                                            {gift.status === 'pending' ? 'Belum diterima' : 
                                                             gift.status === 'received' ? 'Telah diterima' : 
                                                             gift.status === 'pending_verification' ? 'Menunggu Verifikasi' :
                                                             gift.status === 'draft' ? 'Draft' : 'Dikembalikan'}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end gap-3">
                                                                {gift.status === 'pending_verification' && (
                                                                    <button
                                                                        onClick={() => handleOpenVerification(gift)}
                                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-bold"
                                                                    >
                                                                        {__('Verifikasi')}
                                                                    </button>
                                                                )}
                                                                <Link
                                                                    href={route('gifts.edit', gift.id)}
                                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                                >
                                                                    {__('Edit')}
                                                                </Link>
                                                                <button
                                                                    onClick={() => confirmDelete(gift)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                >
                                                                    {__('Hapus')}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                        <p>{__('Belum ada data hadiah yang ditemukan.')}</p>
                                                    </div>
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
                    </div>
                </div>
            </div>

            {/* Reception Form Modal (Mentor) */}
            {selectedGiftForReception && (
                <GiftReceptionForm
                    show={showReceptionForm}
                    onClose={closeModal}
                    gift={selectedGiftForReception}
                />
            )}

            {/* Verification Modal (Admin) */}
            {selectedGiftForVerification && (
                <GiftVerificationModal
                    show={showVerificationModal}
                    onClose={closeModal}
                    gift={selectedGiftForVerification}
                />
            )}

            {/* Detail Modal (Admin - Received) */}
            {selectedGiftForDetail && (
                <GiftDetailModal
                    show={showDetailModal}
                    onClose={closeModal}
                    gift={selectedGiftForDetail}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={confirmingDeletion} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Apakah Anda yakin ingin menghapus data hadiah ini?')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {__('Data yang dihapus tidak dapat dikembalikan. Pastikan data ini tidak sedang digunakan untuk referensi lain.')}
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {__('Batal')}
                        </SecondaryButton>

                        <DangerButton className="ml-3" disabled={processing} onClick={handleDelete}>
                            {processing ? __('Menghapus...') : __('Hapus Data')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
