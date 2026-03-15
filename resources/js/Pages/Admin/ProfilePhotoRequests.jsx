import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import PhotoApprovalModal from '@/Components/PhotoApprovalModal';
import ProfilePhoto from '@/Components/ProfilePhoto';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Pagination from '@/Components/Pagination';
import { __ } from '@/Utils/lang';
import { useState, useRef } from 'react';

export default function ProfilePhotoRequests({ auth, requests }) {
    const [rejectingRequest, setRejectingRequest] = useState(null);
    const [approvingRequest, setApprovingRequest] = useState(null);
    const [showBulkModal, setShowBulkModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    const { post: postApprove, processing: approveProcessing } = useForm({});

    const { data: bulkData, setData: setBulkData, post: postBulk, processing: bulkProcessing, errors: bulkErrors, reset: resetBulk } = useForm({
        csv_file: null,
        photos: [],
    });

    const openApproveModal = (request) => {
        setApprovingRequest(request);
    };

    const closeApproveModal = () => {
        setApprovingRequest(null);
    };

    const confirmApprove = (request) => {
        postApprove(route('admin.profile-photos.approve', request.id), {
            onSuccess: () => closeApproveModal(),
        });
    };

    const openRejectModal = (request) => {
        setRejectingRequest(request);
    };

    const closeRejectModal = () => {
        setRejectingRequest(null);
        reset();
    };

    const submitReject = (e) => {
        e.preventDefault();
        post(route('admin.profile-photos.reject', rejectingRequest.id), {
            onSuccess: () => closeRejectModal(),
        });
    };

    const submitBulk = (e) => {
        e.preventDefault();
        postBulk(route('admin.profile-photos.bulk-upload-csv'), {
            forceFormData: true,
            onSuccess: () => {
                setShowBulkModal(false);
                resetBulk();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {__('Profile Photo Management')}
                    </h2>
                    <PrimaryButton onClick={() => setShowBulkModal(true)}>
                        {__('Bulk Upload (CSV)')}
                    </PrimaryButton>
                </div>
            }
        >
            <Head title={__('Photo Management')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-lg font-bold mb-6">{__('Pending Requests')} ({requests.total})</h3>

                            {requests.data.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    {__('No pending photo requests.')}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {requests.data.map((request) => (
                                        <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center">
                                            <div className="mb-4">
                                                <ProfilePhoto 
                                                    src={request.photo_url} 
                                                    alt={request.user.name} 
                                                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                                    fallbackClassName="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-200 dark:border-gray-700"
                                                    fallback={
                                                        <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                                            {request.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    }
                                                />
                                            </div>
                                            <div className="text-center mb-4">
                                                <h4 className="font-semibold">{request.user.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{request.user.email}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 capitalize">{__(request.user.role)}</p>
                                            </div>
                                            <div className="flex space-x-2 w-full">
                                                <PrimaryButton 
                                                    onClick={() => openApproveModal(request)}
                                                    className="flex-1 justify-center text-xs"
                                                    disabled={processing || approveProcessing}
                                                >
                                                    {__('Approve')}
                                                </PrimaryButton>
                                                <DangerButton 
                                                    onClick={() => openRejectModal(request)}
                                                    className="flex-1 justify-center text-xs"
                                                    disabled={processing || approveProcessing}
                                                >
                                                    {__('Reject')}
                                                </DangerButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="mt-6">
                                <Pagination links={requests.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <PhotoApprovalModal 
                show={!!approvingRequest}
                request={approvingRequest}
                onConfirm={confirmApprove}
                onCancel={closeApproveModal}
                processing={approveProcessing}
            />

            {/* Reject Modal */}
            <Modal show={!!rejectingRequest} onClose={closeRejectModal}>
                <form onSubmit={submitReject} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Reject Profile Photo')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {__('Please provide a reason for rejecting the photo for :name', { name: rejectingRequest?.user.name })}
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="reason" value={__('Reason')} className="sr-only" />
                        <TextInput
                            id="reason"
                            type="text"
                            name="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder={__('e.g., Image is blurry, inappropriate content, etc.')}
                            isFocused
                        />
                        <InputError message={errors.reason} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeRejectModal}>{__('Cancel')}</SecondaryButton>
                        <DangerButton className="ms-3" disabled={processing}>
                            {__('Reject Photo')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>

            {/* Bulk Upload Modal */}
            <Modal show={showBulkModal} onClose={() => setShowBulkModal(false)}>
                <form onSubmit={submitBulk} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Bulk Upload Profile Photos')}
                    </h2>

                    <div className="mt-6">
                        <InputLabel htmlFor="csv_file" value={__('CSV Template')} />
                        <input
                            id="csv_file"
                            type="file"
                            accept=".csv"
                            onChange={(e) => setBulkData('csv_file', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {__('CSV format')}: <code>id_number,photo_name</code>
                        </p>
                        <InputError message={bulkErrors.csv_file} className="mt-2" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="photos" value={__('Photo Files')} />
                        <input
                            id="photos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setBulkData('photos', Array.from(e.target.files))}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {__('Upload all photos listed in the CSV.')}
                        </p>
                        <InputError message={bulkErrors.photos} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setShowBulkModal(false)}>{__('Cancel')}</SecondaryButton>
                        <PrimaryButton className="ms-3" disabled={bulkProcessing}>
                            {__('Start Bulk Upload')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
