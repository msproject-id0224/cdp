import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import InputError from '@/Components/InputError';
import { useState, useMemo, useEffect } from 'react';

export default function GiftEdit({ auth, gift, participants }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: gift.user_id,
        gift_code: gift.gift_code,
        letter_code: gift.letter_code || '',
        type: gift.type,
        model: gift.model,
        status: gift.status,
    });

    // Reusable formatter for "XX - 123..." pattern
    const formatCodeInput = (rawValue) => {
        let value = rawValue.toUpperCase();
        const clean = value.replace(/[^A-Z0-9]/g, '');
        let formatted = '';
        
        if (clean.length > 0) if (/[A-Z]/.test(clean[0])) formatted += clean[0];
        if (clean.length > 1) if (/[A-Z]/.test(clean[1])) formatted += clean[1];
        
        if (formatted.length === 2) formatted += ' - ';
        
        if (clean.length > 2) {
            const digits = clean.substring(2).replace(/[^0-9]/g, '');
            formatted += digits;
        }
        
        // Handle backspace on separator
        const match = value.match(/^([A-Z]{0,2})(?:\s*-\s*)?([0-9]*)/);
        if (match) {
            const rawLetters = value.replace(/[^A-Z]/g, '').substring(0, 2);
            const rawDigits = value.replace(/[^0-9]/g, '');
            if (rawLetters.length === 2 && rawDigits.length === 0 && value.endsWith(' ')) {
                formatted = rawLetters;
            }
        }
        return formatted;
    };

    const validateCodeFormat = (formatted) => {
        if (formatted.length >= 2 && !/^[A-Z]{2} - [0-9]+$/.test(formatted)) {
             if (formatted.length === 2) return '';
             if (formatted === (formatted.substring(0, 2) + ' - ')) return '';
             return 'Format: 2 Huruf + " - " + Angka (Contoh: AB - 123)';
        }
        return '';
    };

    const [giftCodeError, setGiftCodeError] = useState('');
    const [letterCodeError, setLetterCodeError] = useState('');
    
    // Search logic for Participant
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const participant = participants.find(p => p.id === parseInt(data.user_id));
        if (participant) {
            setSearchTerm(participant.name);
        }
    }, []); // Run once

    const filteredParticipants = useMemo(() => {
        if (!searchTerm) return participants;
        return participants.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(p.id).includes(searchTerm)
        );
    }, [participants, searchTerm]);

    const handleSelectParticipant = (participant) => {
        setData('user_id', participant.id);
        setSearchTerm(participant.name);
        setIsDropdownOpen(false);
    };

    const handleGiftCodeChange = (e) => {
        const formatted = formatCodeInput(e.target.value);
        setData('gift_code', formatted);
        setGiftCodeError(validateCodeFormat(formatted));
    };

    const handleLetterCodeChange = (e) => {
        let value = e.target.value.toUpperCase();
        
        // Remove invalid characters (Keep only C, D at start, and digits)
        // If empty, reset
        if (!value) {
            setData('letter_code', '');
            setLetterCodeError('');
            return;
        }

        // Validate first char
        const firstChar = value.charAt(0);
        if (firstChar !== 'C' && firstChar !== 'D') {
            // Reject input that doesn't start with C or D
            return;
        }

        // Validate rest are digits
        const rest = value.substring(1).replace(/[^0-9]/g, '');
        
        // Enforce max length (C=9 digits -> 10 chars, D=10 digits -> 11 chars)
        const maxLength = firstChar === 'C' ? 10 : 11;
        const truncatedRest = rest.substring(0, maxLength - 1);
        
        const newValue = firstChar + truncatedRest;
        setData('letter_code', newValue);

        // Validation Message
        if (firstChar === 'C') {
            if (truncatedRest.length !== 9) {
                setLetterCodeError('Format ID harus C diikuti 9 digit angka');
            } else {
                setLetterCodeError('');
            }
        } else if (firstChar === 'D') {
            if (truncatedRest.length !== 10) {
                setLetterCodeError('Format ID harus D diikuti 10 digit angka');
            } else {
                setLetterCodeError('');
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('gifts.update', gift.id), {
            onSuccess: () => {
                // Flash message is handled by AuthenticatedLayout
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {__('Edit Data Hadiah')}
                </h2>
            }
        >
            <Head title={__('Edit Data Hadiah')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit} className="space-y-6 max-w-xl">
                                
                                {/* Participant Selection (Read Only usually, but let's allow edit) */}
                                <div className="relative">
                                    <InputLabel htmlFor="user_id" value={__('ID Partisipan / Nama')} />
                                    <div className="relative mt-1">
                                        <TextInput
                                            id="user_search"
                                            type="text"
                                            className="block w-full"
                                            placeholder={__('Cari nama atau ID partisipan...')}
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setIsDropdownOpen(true);
                                                setData('user_id', ''); 
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            autoComplete="off"
                                        />
                                        {isDropdownOpen && (
                                            <div className="absolute z-10 w-full bg-white dark:bg-gray-700 mt-1 max-h-60 overflow-y-auto shadow-lg rounded-md border border-gray-200 dark:border-gray-600">
                                                {filteredParticipants.length > 0 ? (
                                                    filteredParticipants.map((p) => (
                                                        <div
                                                            key={p.id}
                                                            className="px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-sm text-gray-700 dark:text-gray-200"
                                                            onClick={() => handleSelectParticipant(p)}
                                                        >
                                                            {p.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                        {__('Tidak ditemukan')}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.user_id} className="mt-2" />
                                </div>

                                {/* Gift ID */}
                                <div>
                                    <InputLabel htmlFor="gift_code" value={__('ID Hadiah')} />
                                    <TextInput
                                        id="gift_code"
                                        type="text"
                                        className={`mt-1 block w-full ${giftCodeError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        value={data.gift_code}
                                        onChange={handleGiftCodeChange}
                                        required
                                        placeholder="XX - 123456789"
                                        maxLength={20}
                                    />
                                    {giftCodeError && <p className="text-sm text-red-600 mt-1">{giftCodeError}</p>}
                                    <InputError message={errors.gift_code} className="mt-2" />
                                </div>

                                {/* Letter ID */}
                                <div>
                                    <InputLabel htmlFor="letter_code" value={__('ID Surat Terhubung')} />
                                    <TextInput
                                        id="letter_code"
                                        type="text"
                                        className={`mt-1 block w-full ${letterCodeError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        value={data.letter_code}
                                        onChange={handleLetterCodeChange}
                                        required
                                        placeholder="Contoh: C012345678"
                                        maxLength={11}
                                    />
                                    {letterCodeError && <p className="text-sm text-red-600 mt-1">{letterCodeError}</p>}
                                    <InputError message={errors.letter_code} className="mt-2" />
                                </div>

                                {/* Gift Type */}
                                <div>
                                    <InputLabel htmlFor="type" value={__('Jenis Hadiah')} />
                                    <SelectInput
                                        id="type"
                                        className="mt-1 block w-full"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="birthday">{__('Hadiah Ulang Tahun')}</option>
                                        <option value="family">{__('Hadiah Keluarga')}</option>
                                        <option value="general">{__('Hadiah Umum')}</option>
                                    </SelectInput>
                                    <InputError message={errors.type} className="mt-2" />
                                </div>

                                {/* Gift Model */}
                                <div>
                                    <InputLabel htmlFor="model" value={__('Model Hadiah')} />
                                    <SelectInput
                                        id="model"
                                        className="mt-1 block w-full"
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        required
                                    >
                                        <option value="small">{__('Hadiah Kecil')}</option>
                                        <option value="large">{__('Hadiah Besar')}</option>
                                    </SelectInput>
                                    <InputError message={errors.model} className="mt-2" />
                                </div>

                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status" value={__('Status Hadiah')} />
                                    <SelectInput
                                        id="status"
                                        className="mt-1 block w-full"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="pending">{__('Belum diterima')}</option>
                                        <option value="received">{__('Telah diterima')}</option>
                                        <option value="returned">{__('Dikembalikan')}</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        {processing ? __('Menyimpan...') : __('Simpan Perubahan')}
                                    </PrimaryButton>
                                    
                                    <Link href={route('gifts.index')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 underline text-sm">
                                        {__('Batal')}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
