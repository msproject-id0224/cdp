import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { __ } from '@/Utils/lang';
import { useState, useEffect } from 'react';

export default function GiftDetailModal({ show, onClose, gift }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // Lightbox handlers
    const openLightbox = (src) => setSelectedImage(src);
    const closeLightbox = () => setSelectedImage(null);

    // Log View Action (Audit Trail) when modal opens
    useEffect(() => {
        if (show && gift) {
            // Trigger backend log (fire and forget)
            fetch(route('gifts.log-view', gift.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Content-Type': 'application/json'
                }
            }).catch(err => console.error('Failed to log view', err));
        }
    }, [show, gift]);

    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="3xl">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {__('Detail Penerimaan Hadiah')}
                        </h2>
                        <span className="px-3 py-1 text-sm font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            {__('Telah Diterima')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Info Section */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                                    {__('Informasi Partisipan')}
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="block text-xs text-gray-400">{__('Nama Lengkap')}</span>
                                        <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {gift.user?.first_name} {gift.user?.last_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-400">{__('ID Hadiah')}</span>
                                        <span className="text-base font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                            {gift.gift_code}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-400">{__('Tanggal Penerimaan')}</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {gift.reception_date ? new Date(gift.reception_date).toLocaleDateString() : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                                    {__('Detail Penggunaan')}
                                </h3>
                                <div className="space-y-4">
                                    {gift.gift_description && (
                                        <div>
                                            <span className="block text-xs text-gray-400">{__('Deskripsi Hadiah')}</span>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                                {gift.gift_description}
                                            </p>
                                        </div>
                                    )}
                                    {gift.gift_value && (
                                        <div>
                                            <span className="block text-xs text-gray-400">{__('Nilai Hadiah')}</span>
                                            <p className="text-sm font-bold text-green-600 mt-1">
                                                Rp {parseInt(gift.gift_value).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="block text-xs text-gray-400">{__('Rencana Penggunaan')}</span>
                                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded mt-1">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                "{gift.usage_plan || '-'}"
                                            </p>
                                        </div>
                                    </div>
                                    {gift.admin_notes && (
                                        <div>
                                            <span className="block text-xs text-gray-400">{__('Catatan Verifikator')}</span>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {gift.admin_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Documentation Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                {__('Dokumentasi Penerimaan')}
                            </h3>
                            
                            {gift.proof_photo_path && gift.proof_photo_path.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {gift.proof_photo_path.map((path, idx) => (
                                        <div key={idx} className="group relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                                            {path.endsWith('.pdf') ? (
                                                <a 
                                                    href={`/storage/${path}`} 
                                                    target="_blank" 
                                                    className="flex flex-col items-center justify-center h-full w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                                >
                                                    <svg className="w-10 h-10 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">PDF Document</span>
                                                    <span className="text-[10px] text-gray-400 mt-1">Klik untuk unduh</span>
                                                </a>
                                            ) : (
                                                <>
                                                    <img 
                                                        src={`/storage/${path}`} 
                                                        alt={`Dokumentasi ${idx + 1}`} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                                                        onClick={() => openLightbox(`/storage/${path}`)}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                                            {__('Perbesar')}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                        {__('Tidak ada foto dokumentasi tersedia.')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                        <SecondaryButton onClick={onClose}>
                            {__('Tutup')}
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeLightbox}
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
                        onClick={closeLightbox}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Full Preview" 
                        className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </>
    );
}
