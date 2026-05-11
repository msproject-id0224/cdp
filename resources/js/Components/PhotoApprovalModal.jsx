import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ProfilePhoto from '@/Components/ProfilePhoto';
import { __ } from '@/Utils/lang';

export default function PhotoApprovalModal({ 
    show = false, 
    request, 
    onConfirm, 
    onCancel, 
    processing = false 
}) {
    if (!request) return null;

    const handleConfirm = () => {
        onConfirm(request);
    };

    return (
        <Modal show={show} onClose={onCancel} maxWidth="md">
            <form onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    {__('Confirm Photo Approval')}
                </h2>

                <div className="flex flex-col items-center mb-6">
                    <div className="mb-4 relative group">
                        <ProfilePhoto 
                            src={request.photo_url} 
                            alt={request.user.name} 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-lg transition-transform transform group-hover:scale-105 duration-300"
                            fallbackClassName="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 border-4 border-gray-100 dark:border-gray-700 shadow-lg transition-transform transform group-hover:scale-105 duration-300"
                            fallback={
                                <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                    {(request.user?.name || 'U').charAt(0).toUpperCase()}
                                </span>
                            }
                        />
                        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-600 pointer-events-none"></div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {request.user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {request.user?.email || '-'}
                    </p>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 capitalize">
                        {__(request.user?.role || 'participant')}
                    </span>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton type="button" onClick={onCancel} disabled={processing}>
                        {__('Cancel')}
                    </SecondaryButton>

                    <PrimaryButton 
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 dark:focus:bg-green-400 dark:active:bg-green-300 border-green-600 dark:border-green-500"
                        disabled={processing}
                    >
                        {processing ? __('Approving...') : __('Approve Photo')}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
