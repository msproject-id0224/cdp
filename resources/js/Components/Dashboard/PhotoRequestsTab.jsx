import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import ProfilePhoto from '@/Components/ProfilePhoto';

export default function PhotoRequestsTab({ initialRequests }) {
    const [requests, setRequests] = useState(initialRequests || []);
    const [search, setSearch] = useState('');
    const [rejectingRequest, setRejectingRequest] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        setRequests(initialRequests || []);
    }, [initialRequests]);

    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
    });

    const filteredRequests = requests.filter(request => {
        const userName = request.user?.name || request.user?.first_name || '';
        const userEmail = request.user?.email || '';
        const searchTerm = search.toLowerCase();
        
        return userName.toLowerCase().includes(searchTerm) ||
               userEmail.toLowerCase().includes(searchTerm);
    });

    const approve = (id) => {
        if (confirm(__('Are you sure you want to approve this photo?'))) {
            setProcessingId(id);
            router.post(route('admin.profile-photos.approve', id), {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setRequests(prev => prev.filter(r => r.id !== id));
                    setProcessingId(null);
                },
                onError: () => setProcessingId(null)
            });
        }
    };

    const openRejectModal = (request) => {
        setRejectingRequest(request);
        setData('reason', '');
    };

    const closeRejectModal = () => {
        setRejectingRequest(null);
        reset();
    };

    const submitReject = (e) => {
        e.preventDefault();
        post(route('admin.profile-photos.reject', rejectingRequest.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setRequests(prev => prev.filter(r => r.id !== rejectingRequest.id));
                closeRejectModal();
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {__('Pending Photo Requests')}
                </h3>
                <div className="w-full sm:w-64">
                    <TextInput
                        type="text"
                        placeholder={__('Search requests...')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    {search ? __('No requests found matching your search.') : __('No pending photo requests.')}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4 relative group">
                                <ProfilePhoto 
                                    src={request.photo_url} 
                                    alt={request.user?.name || request.user?.first_name || 'User'} 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors"
                                    fallbackClassName="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-gray-100 dark:border-gray-700"
                                    fallback={
                                        <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                            {(request.user?.name || request.user?.first_name || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    }
                                />
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                            </div>
                            <div className="text-center mb-4 flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{request.user?.name || request.user?.first_name || __('User')}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{request.user?.email}</p>
                                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] rounded-full capitalize ${
                                    request.user?.role === 'mentor' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                    {__(request.user?.role || 'participant')}
                                </span>
                                <p className="text-[10px] text-gray-400 mt-2">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2 w-full mt-auto">
                                <PrimaryButton 
                                    onClick={() => approve(request.id)}
                                    className="flex-1 justify-center text-xs"
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? __('Processing...') : __('Approve')}
                                </PrimaryButton>
                                <DangerButton 
                                    onClick={() => openRejectModal(request)}
                                    className="flex-1 justify-center text-xs"
                                    disabled={processingId === request.id}
                                >
                                    {__('Reject')}
                                </DangerButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            <Modal show={!!rejectingRequest} onClose={closeRejectModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {__('Reject Profile Photo')}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {__('Please provide a reason for rejecting the photo for :name', { name: rejectingRequest?.user?.name || rejectingRequest?.user?.first_name || __('User') })}
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
                        <DangerButton className="ms-3" onClick={submitReject} disabled={processing}>
                            {__('Reject Photo')}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
