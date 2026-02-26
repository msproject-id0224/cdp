import Modal from '@/Components/Modal';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { __ } from '@/Utils/lang';

export default function ProfilePhotoUpdateModal({ show, onClose }) {
    const user = usePage().props.auth.user;
    const photoInput = useRef();
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        photo: null,
    });

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!show) {
            reset();
            clearErrors();
            setPreview(null);
        }
    }, [show]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validation: Max 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert(__('File size must be less than 2MB'));
                e.target.value = null;
                return;
            }

            setData('photo', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        const routeName = user.role === 'mentor' ? 'mentor.profile-photo.request' : 'participant.profile-photo.request';
        
        post(route(routeName), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                setPreview(null);
                // The page props (user) will automatically update via Inertia
            },
        });
    };

    const closeModal = () => {
        onClose();
        reset();
        clearErrors();
        setPreview(null);
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {__('Update Profile Photo')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {__('Upload a new profile photo. Max 2MB, JPG/PNG.')}
                </p>

                <div className="mt-6 flex flex-col items-center">
                    {/* Current or New Photo Preview */}
                    <div className="mb-4 relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-md bg-gray-100 dark:bg-gray-900">
                            {preview ? (
                                <img src={preview} alt={__('New Photo Preview')} className="w-full h-full object-cover" />
                            ) : (
                                <ProfilePhoto 
                                    src={user.profile_photo_url} 
                                    alt={__('Current Photo')} 
                                    className="w-full h-full object-cover" 
                                    fallbackClassName="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-4xl font-bold"
                                    fallback={(user.name || user.first_name || 'U').charAt(0)}
                                />
                            )}
                        </div>
                        {user.profile_photo_status === 'pending' && !preview && (
                            <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-sm">
                                {__('Pending')}
                            </div>
                        )}
                    </div>

                    <form onSubmit={submit} className="w-full">
                        <input
                            type="file"
                            ref={photoInput}
                            className="hidden"
                            onChange={handlePhotoChange}
                            accept="image/png, image/jpeg, image/jpg"
                        />

                        <div className="mt-4 flex justify-center">
                            <SecondaryButton type="button" onClick={() => photoInput.current.click()}>
                                {__('Select New Photo')}
                            </SecondaryButton>
                        </div>

                        {errors.photo && (
                            <div className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                                {errors.photo}
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <SecondaryButton onClick={closeModal} disabled={processing}>
                                {__('Cancel')}
                            </SecondaryButton>

                            <PrimaryButton disabled={!data.photo || processing} className="ml-3">
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {__('Uploading...')}
                                    </span>
                                ) : (
                                    __('Save')
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
