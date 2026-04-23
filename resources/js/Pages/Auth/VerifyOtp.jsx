import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { __ } from '@/Utils/lang';

export default function VerifyOtp() {
    const { email, flash } = usePage().props;
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        otp: '',
    });
    
    const [countdown, setCountdown] = useState(60);
    const inputRef = useRef(null);

    // Auto-focus on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        if (data.otp.length === 6) {
            submit();
        }
    }, [data.otp]);

    // Auto-clear input on error
    useEffect(() => {
        if (errors.otp) {
            const timer = setTimeout(() => {
                reset('otp');
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 1000); // Give user a moment to see the error, then clear
            return () => clearTimeout(timer);
        }
    }, [errors.otp]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Ensure only numbers
        if (value.length <= 6) {
            setData('otp', value);
            if (errors.otp) clearErrors('otp');
        }
    };

    const submit = (e) => {
        if (e) e.preventDefault();
        post(route('otp.verify'), {
            preserveScroll: true,
            onError: () => {
                // Focus will be handled by the error useEffect
            }
        });
    };

    const handleResend = () => {
        setCountdown(60);
        router.post(route('otp.resend'), {}, {
            preserveScroll: true,
        });
    };

    const isComplete = data.otp.length === 6;
    const hasError = !!errors.otp;

    // Determine border color
    let borderColorClass = "border-gray-300 dark:border-gray-700"; // default
    if (hasError) borderColorClass = "border-red-500 focus:border-red-500 ring-red-500";
    else if (isComplete) borderColorClass = "border-green-500 focus:border-green-500 ring-green-500";
    else borderColorClass = "border-gray-300 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-500";

    return (
        <GuestLayout>
            <Head title={__('Confirm OTP')} />

            {flash?.success && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400 text-center bg-green-100 dark:bg-green-900/30 p-2 rounded-lg border border-green-200 dark:border-green-800">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 font-medium text-sm text-red-600 dark:text-red-400 text-center bg-red-100 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-800">
                    {flash.error}
                </div>
            )}

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{__('Confirm OTP')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {__('Please enter the 6-digit OTP code sent to your email')}
                </p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">{email}</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="6"
                        value={data.otp}
                        onChange={handleChange}
                        className={`w-full text-center text-3xl font-mono tracking-[0.5em] py-4 rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-sm focus:ring-2 transition-all outline-none ${borderColorClass}`}
                        placeholder="••••••"
                        aria-label={__('OTP Code')}
                        aria-invalid={hasError}
                        autoComplete="one-time-code"
                    />
                    
                    {/* Character Count Indicator */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-mono pointer-events-none">
                        {data.otp.length}/6
                    </div>
                </div>

                <InputError message={errors.otp} className="mt-2 text-center" />

                <div>
                    <PrimaryButton className="w-full justify-center py-3" disabled={processing || !isComplete}>
                        {processing ? __('Verifying...') : __('Confirm OTP')}
                    </PrimaryButton>
                </div>

                <div className="text-center">
                    {countdown > 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {__('Resend code in')} <span className="font-mono font-bold">{countdown}s</span>
                        </p>
                    ) : (
                        <button 
                            type="button" 
                            onClick={handleResend}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                            {__('Resend Code')}
                        </button>
                    )}
                </div>
            </form>
        </GuestLayout>
    );
}
