import { useEffect, useRef } from 'react';

/**
 * Reusable confirmation modal.
 *
 * Props:
 *   show        – boolean
 *   title       – string
 *   message     – string
 *   onConfirm   – function called when user confirms
 *   onCancel    – function called when user cancels / closes
 *   confirmLabel – string (default "Ya, Lanjutkan")
 *   cancelLabel  – string (default "Batal")
 *   danger      – boolean: red confirm button (default true)
 */
export default function ConfirmModal({
    show,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel  = 'Batal',
    danger       = true,
}) {
    const cancelRef = useRef();

    useEffect(() => {
        if (!show) return;
        const handler = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', handler);
        if (cancelRef.current) cancelRef.current.focus();
        return () => window.removeEventListener('keydown', handler);
    }, [show, onCancel]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Icon header */}
                <div className="flex justify-center pt-6 pb-2">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                        {danger ? (
                            <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        ) : (
                            <svg className="h-7 w-7 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-2 text-center">
                    {title && (
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
                    )}
                    {message && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 py-5">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${
                            danger
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
