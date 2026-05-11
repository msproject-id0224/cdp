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

    const submit = async (e) => {
        e.preventDefault();
        setClientError('');
        clearErrors();

        const isValid = validateEmail(data.email);
        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(route('login'), {
                email: data.email
            });

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
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{__('Enter your email to receive an OTP code.')}</p>
            </div>

            <form onSubmit={submit}>
                <div>
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

                <div className="mt-6 flex items-center justify-center">
                    <PrimaryButton className="w-full justify-center py-3" disabled={isSubmitting || processing}>
                        {isSubmitting ? __('Sending...') : __('Send OTP Code')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
