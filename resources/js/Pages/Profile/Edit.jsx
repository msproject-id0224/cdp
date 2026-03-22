import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import AdminList from '../Admin/Partials/AdminList';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { useState } from 'react';

const EditableInfoRow = ({ label, value, field, user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value || '');
    const [processing, setProcessing] = useState(false);

    const handleSave = () => {
        setProcessing(true);
        // Construct the data object. We must send all required fields for ProfileUpdateRequest
        // or ensure the backend handles partial updates.
        // ProfileUpdateRequest requires: first_name, email.
        // So we should probably send all current user data + the updated field.
        
        const data = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            job_title: user.job_title,
            [field]: editValue
        };

        router.patch(route('profile.update'), data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setProcessing(false);
                if (onUpdate) onUpdate();
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    const handleCancel = () => {
        setEditValue(value || '');
        setIsEditing(false);
    };

    return (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 last:border-0 items-center">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0 flex justify-between items-center">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <TextInput 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)} 
                            className="w-full"
                            autoFocus
                        />
                        <PrimaryButton onClick={handleSave} disabled={processing} className="px-3 py-1 text-xs">
                            {__('Save')}
                        </PrimaryButton>
                        <SecondaryButton onClick={handleCancel} disabled={processing} className="px-3 py-1 text-xs">
                            {__('Cancel')}
                        </SecondaryButton>
                    </div>
                ) : (
                    <>
                        <span>{value || '-'}</span>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="ml-4 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title={__('Edit')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </>
                )}
            </dd>
        </div>
    );
};

export default function Edit({ mustVerifyEmail, status }) {
    const { auth, locale } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    const { data: photoData, setData: setPhotoData, post: postPhoto, processing: photoProcessing, errors: photoErrors, reset: resetPhoto } = useForm({
        photo: null,
    });

    const submitPhotoRequest = (e) => {
        e.preventDefault();
        
        let routeName;
        let routeParams = {};

        if (isAdmin) {
            routeName = 'admin.profile-photos.upload';
            routeParams = { user: user.id };
        } else {
            routeName = user.role === 'mentor' 
                ? 'mentor.profile-photo.request' 
                : 'participant.profile-photo.request';
        }
        
        postPhoto(route(routeName, routeParams), {
            onSuccess: () => resetPhoto(),
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const InfoRow = ({ label, value }) => (
        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">{value || '-'}</dd>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {isAdmin ? __('Admin Information') : __('Profile')}
                </h2>
            }
        >
            <Head title={__('Profile')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg dark:bg-gray-800 transition-colors duration-200">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="px-4 sm:px-0 mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{__('Profile Photo')}</h3>
                                
                                <div className="flex flex-col md:flex-row md:items-start md:space-x-6 space-y-4 md:space-y-0">
                                    <div className="flex-shrink-0">
                                        <ProfilePhoto 
                                            src={user.profile_photo_url} 
                                            alt={user.name} 
                                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700" 
                                            fallbackClassName="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                            fallback={
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            }
                                        />
                                    </div>
                                    
                                    <div className="flex-grow max-w-xl">
                                        {!isAdmin && user.profile_photo_status === 'pending' ? (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                                                            {__('Your photo update request is pending approval.')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <form onSubmit={submitPhotoRequest}>
                                                {user.profile_photo_status === 'rejected' && (
                                                    <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 p-4">
                                                        <div className="flex">
                                                            <div className="flex-shrink-0">
                                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="text-sm text-red-700 dark:text-red-200">
                                                                    {__('Your last photo request was rejected.')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <InputLabel htmlFor="photo" value={isAdmin ? __('Change Profile Photo') : __('Request Photo Update')} />
                                                <div className="flex items-center gap-4 mt-2">
                                                    <input 
                                                        type="file" 
                                                        id="photo" 
                                                        onChange={e => setPhotoData('photo', e.target.files[0])}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
                                                        accept="image/*"
                                                    />
                                                    <PrimaryButton disabled={photoProcessing}>
                                                        {isAdmin ? __('Save Photo') : __('Submit Request')}
                                                    </PrimaryButton>
                                                </div>
                                                <InputError message={photoErrors.photo} className="mt-2" />
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 sm:px-0 mb-6">
                                <h3 className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                                    {isAdmin ? __('Admin Information') : __('Participant Information')}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                                    {isAdmin ? __('Administrator account information details.') : __('Personal details and membership status.')}
                                </p>
                            </div>
                            <dl className="divide-y divide-gray-100 dark:divide-gray-700">
                                {isAdmin ? (
                                    <>
                                        <EditableInfoRow label={__('First Name')} value={user.first_name} field="first_name" user={user} />
                                        <EditableInfoRow label={__('Last Name')} value={user.last_name} field="last_name" user={user} />
                                        <EditableInfoRow label={__('Email')} value={user.email} field="email" user={user} />
                                        <EditableInfoRow label={__('Phone Number')} value={user.phone_number} field="phone_number" user={user} />
                                        <EditableInfoRow label={__('Job Title')} value={user.job_title} field="job_title" user={user} />
                                    </>
                                ) : (
                                    <>
                                        <InfoRow label={__('Full Name')} value={user.name} />
                                        <InfoRow label={__('Email Address')} value={user.email} />
                                        <InfoRow label={__('Phone Number')} value={user.phone_number} />
                                        <InfoRow label={__('Address')} value={user.address} />
                                        <InfoRow label={__('Date of Birth')} value={formatDate(user.date_of_birth)} />
                                        <InfoRow label={__('Membership Status')} value={user.role ? __(String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)) : '-'} />
                                    </>
                                )}
                            </dl>
                        </div>
                    </div>

                    {isAdmin ? (
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
                            <AdminList />
                        </div>
                    ) : (
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    )}

                    {!isAdmin && user.role !== 'participant' && user.role !== 'mentor' && (
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}