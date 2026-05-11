import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import { useState } from 'react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [confirmingLogout, setConfirmingLogout] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    const confirmLogout = (e) => {
        e.preventDefault();
        setConfirmingLogout(true);
    };

    const logout = () => {
        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Close modal
        setConfirmingLogout(false);

        // Perform logout request
        router.post(route('logout'));
    };

    return (
        <GuestLayout>
            <Head title={__('Email Verification')} />

            <div className="mb-4 text-sm text-gray-600">
                {__("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.")}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {__('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {__('Resend Verification Email')}
                    </PrimaryButton>

                    <Link
                        as="button"
                        type="button"
                        onClick={confirmLogout}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {__('Log Out')}
                    </Link>
                </div>
            </form>

            <Modal show={confirmingLogout} onClose={() => setConfirmingLogout(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Are you sure you want to log out?')}
                    </h2>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingLogout(false)}>
                            {__('Cancel')}
                        </SecondaryButton>
                        <DangerButton className="ms-3" onClick={logout}>
                            {__('Yes, Log Out')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </GuestLayout>
    );
}
