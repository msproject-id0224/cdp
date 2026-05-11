import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState, useEffect } from 'react';

export default function GiftReceptionForm({ show, onClose, gift }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        usage_plan: gift.usage_plan || '',
        gift_description: gift.gift_description || '',
        gift_value: gift.gift_value || '',
        proof_photos: [],
        action: 'submit', // 'draft' or 'submit' (submit sets to pending_verification)
    });

    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (show) {
            // Reset form when modal opens with fresh data from gift prop
            setData({
                usage_plan: gift.usage_plan || '',
                gift_description: gift.gift_description || '',
                gift_value: gift.gift_value || '',
                proof_photos: [],
                action: 'submit',
            });
            setPreviews([]);
            clearErrors();
        }
    }, [show, gift]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Limit to 3 files
        if (files.length > 3) {
            alert('Maksimal 3 file.');
            return;
        }

        setData('proof_photos', files);

        // Generate previews
        const newPreviews = files.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return null; // No preview for PDF
        });
        setPreviews(newPreviews);
    };

    const submit = (actionType) => {
        data.action = actionType;
        post(route('gifts.upload-proof', gift.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
            preserveScroll: true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit('submit');
    };

    const handleDraft = (e) => {
        e.preventDefault();
        submit('draft');
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {__('Formulir Penerimaan Hadiah')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Readonly Info */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div>
                            <span className="block text-xs text-gray-500">{__('Nama Partisipan')}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {gift.user?.first_name} {gift.user?.last_name}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500">{__('ID Hadiah')}</span>
                            <span className="font-medium text-indigo-600">{gift.gift_code}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500">{__('Jenis Hadiah')}</span>
                            <span className="capitalize text-gray-700 dark:text-gray-300">{gift.type}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500">{__('Model')}</span>
                            <span className="capitalize text-gray-700 dark:text-gray-300">{gift.model}</span>
                        </div>
                    </div>

                    {/* Keterangan Hadiah */}
                    <div>
                        <InputLabel htmlFor="gift_description" value={__('Keterangan Hadiah (Nama, Deskripsi, Syarat)')} />
                        <textarea
                            id="gift_description"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            rows="3"
                            value={data.gift_description}
                            onChange={(e) => setData('gift_description', e.target.value)}
                            placeholder="Contoh: Sepatu Sekolah Nike (Ukuran 40), Syarat: Foto saat dipakai."
                            required
                        />
                        <InputError message={errors.gift_description} className="mt-2" />
                    </div>

                    {/* Nilai Hadiah */}
                    <div>
                        <InputLabel htmlFor="gift_value" value={__('Perkiraan Nilai Hadiah (Rp)')} />
                        <TextInput
                            id="gift_value"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.gift_value}
                            onChange={(e) => setData('gift_value', e.target.value)}
                            placeholder="0"
                        />
                        <InputError message={errors.gift_value} className="mt-2" />
                    </div>

                    {/* Rencana Penggunaan */}
                    <div>
                        <InputLabel htmlFor="usage_plan" value={__('Rencana Penggunaan Hadiah')} />
                        <textarea
                            id="usage_plan"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            rows="3"
                            value={data.usage_plan}
                            onChange={(e) => setData('usage_plan', e.target.value)}
                            placeholder="Jelaskan bagaimana hadiah ini akan digunakan..."
                            required
                        />
                        <InputError message={errors.usage_plan} className="mt-2" />
                    </div>

                    {/* Upload Dokumentasi */}
                    <div>
                        <InputLabel htmlFor="proof_photos" value={__('Upload Dokumentasi (Foto/PDF, Max 3 File)')} />
                        <input
                            id="proof_photos"
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF. Maks 5MB per file.</p>
                        <InputError message={errors.proof_photos} className="mt-2" />

                        {/* Previews */}
                        {previews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                                        {src ? (
                                            <img src={src} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">
                                                <span className="text-xs">PDF Document</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Existing Proofs Link if any */}
                        {gift.proof_photo_path && gift.proof_photo_path.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium mb-1">File Sebelumnya:</p>
                                <ul className="list-disc pl-4 text-xs text-blue-600">
                                    {gift.proof_photo_path.map((path, idx) => (
                                        <li key={idx}>
                                            <a href={`/storage/${path}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Dokumen {idx + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <SecondaryButton onClick={onClose} disabled={processing}>
                            {__('Batal')}
                        </SecondaryButton>
                        
                        <SecondaryButton onClick={handleDraft} disabled={processing}>
                            {processing && data.action === 'draft' ? __('Menyimpan...') : __('Simpan Draft')}
                        </SecondaryButton>

                        <PrimaryButton disabled={processing} onClick={handleSubmit}>
                            {processing && data.action === 'submit' ? __('Mengirim...') : __('Kirim Verifikasi')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
