import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { __ } from '@/Utils/lang';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const [confirmingProfileUpdate, setConfirmingProfileUpdate] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name || '',
            id_number: user.id_number || '',
            email: user.email,
        });

    const confirmProfileUpdate = (e) => {
        e.preventDefault();
        setConfirmingProfileUpdate(true);
    };

    const submit = () => {
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => closeModal(),
            onFinish: () => setConfirmingProfileUpdate(false),
        });
    };

    const closeModal = () => {
        setConfirmingProfileUpdate(false);
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {__('Profile Information')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {__("Update your account's profile information and email address.")}
                </p>
            </header>

            <form onSubmit={confirmProfileUpdate} className="mt-6 space-y-6">
                {/* Profile Photo Display */}
                <div className="flex items-center space-x-4 mb-4">
                    <ProfilePhoto 
                        src={user.profile_photo_url} 
                        alt={user.name} 
                        className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                        fallbackClassName="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-2xl font-bold border-2 border-gray-200 dark:border-gray-700"
                        fallback={(user.name || 'U').charAt(0).toUpperCase()}
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="first_name" value={__('First Name')} />

                    <TextInput
                        id="first_name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                        isFocused
                        autoComplete="given-name"
                    />

                    <InputError className="mt-2" message={errors.first_name} />
                </div>

                <div>
                    <InputLabel htmlFor="last_name" value={__('Last Name')} />

                    <TextInput
                        id="last_name"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        autoComplete="family-name"
                    />

                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={__('Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            {__('Your email address is unverified.')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {__('Click here to re-send the verification email.')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                {__('A new verification link has been sent to your email address.')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{__('Save')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            {__('Saved.')}
                        </p>
                    </Transition>
                </div>
            </form>

            <Modal show={confirmingProfileUpdate} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {__('Confirm Profile Update')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        {__('Are you sure you want to update your profile information?')}
                    </p>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {__('Cancel')}
                        </SecondaryButton>

                        <PrimaryButton className="ms-3" disabled={processing} onClick={submit}>
                        {processing ? __('Saving...') : __('Confirm Save')}
                    </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
