import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState } from 'react';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const { data, setData, processing, errors, setError, clearErrors } = useForm({
        email: '',
        phone_number: '',
        channel: 'mail',
    });

    const [clientError, setClientError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (value) => {
        if (!value || value.trim() === '') {
            setClientError(__('Email is required'));
            return false;
        }
        setClientError('');
        return true;
    };

    const validatePhone = (value) => {
        if (!value || value.trim() === '') {
            setClientError(__('Nomor WhatsApp wajib diisi.'));
            return false;
        }
        setClientError('');
        return true;
    };

    const handleChannelChange = (channel) => {
        setData('channel', channel);
        setClientError('');
        clearErrors();
    };

    const submit = async (e) => {
        e.preventDefault();
        setClientError('');
        clearErrors();

        const isWhatsapp = data.channel === 'whatsapp';
        const isValid = isWhatsapp ? validatePhone(data.phone_number) : validateEmail(data.email);
        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const payload = { channel: data.channel };
            if (isWhatsapp) {
                payload.phone_number = data.phone_number;
            } else {
                payload.email = data.email;
            }

            const response = await axios.post(route('login'), payload);

            if (response.status === 200 && response.data.success && response.data.nextScreen === 'otp') {
                router.visit(route('otp.view'));
            } else {
                setClientError(__('Unexpected response from server.'));
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                if (error.response.status === 422) {
                    // Validation errors
                    const validationErrors = error.response.data.errors;
                    Object.keys(validationErrors).forEach(key => {
                        setError(key, validationErrors[key][0]);
                    });
                } else {
                    // Other server errors
                    setClientError(error.response.data.message || __('An error occurred. Please try again.'));
                }
            } else {
                // Network errors
                setClientError(__('Network error. Please check your connection.'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isWhatsapp = data.channel === 'whatsapp';

    return (
        <GuestLayout>
            <Head title={__('Login')} />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 text-sm font-medium text-red-600 bg-red-100 p-3 rounded border border-red-200">
                    {flash.error}
                </div>
            )}

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{__('Login')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {isWhatsapp
                        ? __('Enter your WhatsApp number to receive an OTP code.')
                        : __('Enter your email to receive an OTP code.')}
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel value={__('Send OTP via')} className="text-gray-500 dark:text-gray-400 font-semibold" />
                    <div className="mt-2 flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="radio"
                                name="channel"
                                value="mail"
                                checked={data.channel === 'mail'}
                                onChange={() => handleChannelChange('mail')}
                            />
                            {__('Email')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                                type="radio"
                                name="channel"
                                value="whatsapp"
                                checked={isWhatsapp}
                                onChange={() => handleChannelChange('whatsapp')}
                            />
                            {__('WhatsApp')}
                        </label>
                    </div>
                    <InputError message={errors.channel} className="mt-2" />
                </div>

                {isWhatsapp ? (
                    <div className="mt-4">
                        <InputLabel htmlFor="phone_number" value={__('WhatsApp Number')} className="text-gray-500 dark:text-gray-400 font-semibold" />

                        <TextInput
                            id="phone_number"
                            type="tel"
                            name="phone_number"
                            value={data.phone_number}
                            className="mt-1 block w-full bg-white/50 border-white/30 focus:bg-white/70 dark:bg-gray-800/50 dark:border-gray-700/50 dark:focus:bg-gray-800/70 transition-all"
                            autoComplete="tel"
                            placeholder="08xxxxxxxxxx"
                            isFocused={true}
                            onChange={(e) => {
                                setData('phone_number', e.target.value);
                                if (clientError) {
                                    validatePhone(e.target.value);
                                }
                            }}
                            onBlur={(e) => validatePhone(e.target.value)}
                        />

                        <InputError message={clientError || errors.phone_number} className="mt-2" />
                    </div>
                ) : (
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value={__('Email')} className="text-gray-500 dark:text-gray-400 font-semibold" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-white/50 border-white/30 focus:bg-white/70 dark:bg-gray-800/50 dark:border-gray-700/50 dark:focus:bg-gray-800/70 transition-all"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                if (clientError) {
                                    validateEmail(e.target.value);
                                }
                            }}
                            onBlur={(e) => validateEmail(e.target.value)}
                        />

                        <InputError message={clientError || errors.email} className="mt-2" />
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center">
                    <PrimaryButton className="w-full justify-center py-3" disabled={isSubmitting || processing}>
                        {isSubmitting ? __('Sending...') : __('Send OTP Code')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
