import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState, useEffect } from 'react';

export default function GiftVerificationModal({ show, onClose, gift }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        status: '', // 'received' or 'returned'
        admin_notes: '',
    });

    useEffect(() => {
        if (show) {
            reset();
            clearErrors();
        }
    }, [show, gift]);

    const submit = (status) => {
        data.status = status;
        post(route('gifts.verify', gift.id), {
            onSuccess: () => {
                onClose();
            },
            preserveScroll: true,
        });
    };

    const handleApprove = () => submit('received');
    const handleReject = () => submit('returned');

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Verifikasi Penerimaan Hadiah')}
                    </h2>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                        {__('Menunggu Verifikasi')}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Gift Details */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                            <div>
                                <span className="block text-xs text-gray-500">{__('Partisipan')}</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {gift.user?.first_name} {gift.user?.last_name}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500">{__('ID Hadiah')}</span>
                                <span className="font-medium text-indigo-600">{gift.gift_code}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500">{__('Rencana Penggunaan')}</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {gift.usage_plan || '-'}
                                </p>
                            </div>
                            {gift.gift_description && (
                                <div>
                                    <span className="block text-xs text-gray-500">{__('Keterangan Hadiah')}</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                        {gift.gift_description}
                                    </p>
                                </div>
                            )}
                             {gift.gift_value && (
                                <div>
                                    <span className="block text-xs text-gray-500">{__('Nilai Hadiah')}</span>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                        Rp {parseInt(gift.gift_value).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Proofs & Action */}
                    <div className="space-y-4">
                        <div>
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {__('Dokumentasi Bukti')}
                            </span>
                            {gift.proof_photo_path && gift.proof_photo_path.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                    {gift.proof_photo_path.map((path, idx) => (
                                        <div key={idx} className="relative group">
                                            {path.endsWith('.pdf') ? (
                                                <a 
                                                    href={`/storage/${path}`} 
                                                    target="_blank" 
                                                    className="flex flex-col items-center justify-center h-24 bg-gray-100 rounded border border-gray-200 hover:bg-gray-200 transition"
                                                >
                                                    <svg className="w-8 h-8 text-red-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600 truncate w-full text-center px-1">PDF Document</span>
                                                </a>
                                            ) : (
                                                <a href={`/storage/${path}`} target="_blank" className="block relative aspect-square bg-gray-100 rounded overflow-hidden border border-gray-200">
                                                    <img 
                                                        src={`/storage/${path}`} 
                                                        alt={`Proof ${idx}`} 
                                                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">{__('Tidak ada dokumen yang diunggah.')}</p>
                            )}
                        </div>

                        <div>
                            <InputLabel htmlFor="admin_notes" value={__('Catatan Admin (Opsional)')} />
                            <textarea
                                id="admin_notes"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm text-sm"
                                rows="3"
                                value={data.admin_notes}
                                onChange={(e) => setData('admin_notes', e.target.value)}
                                placeholder="Tambahkan catatan jika perlu (misal alasan penolakan)..."
                            />
                            <InputError message={errors.admin_notes} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {__('Batal')}
                    </SecondaryButton>
                    
                    <DangerButton onClick={handleReject} disabled={processing} className="bg-red-600 hover:bg-red-700">
                        {processing ? __('Memproses...') : __('Tolak / Revisi')}
                    </DangerButton>

                    <PrimaryButton onClick={handleApprove} disabled={processing} className="bg-green-600 hover:bg-green-700">
                        {processing ? __('Memproses...') : __('Terima & Verifikasi')}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
