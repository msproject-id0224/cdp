import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function MenentukanCitaCitaP2({ auth, careerExplorationP2, files }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [confirmState, setConfirmState] = useState({ show: false, title: '', message: '', onConfirm: null });
    const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
    const closeConfirm = () => setConfirmState(s => ({ ...s, show: false }));

    const defaultSwot = [
        { aspect: 'S', description: '' },
        { aspect: 'W', description: '' },
        { aspect: 'O', description: '' },
        { aspect: 'T', description: '' },
    ];

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        final_career_choice: careerExplorationP2?.final_career_choice || '',
        final_career_reason: careerExplorationP2?.final_career_reason || '',
        swot_definition: careerExplorationP2?.swot_definition || '',
        swot_analysis_data: careerExplorationP2?.swot_analysis_data || defaultSwot,
        chapter4_check1: !!careerExplorationP2?.chapter4_check1,
        chapter4_check2: !!careerExplorationP2?.chapter4_check2,
        chapter4_check3: !!careerExplorationP2?.chapter4_check3,
        mentoring_notes: careerExplorationP2?.mentoring_notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.career-exploration-p2.store'), {
            preserveScroll: true,
        });
    };

    const updateSwot = (index, value) => {
        const updated = [...data.swot_analysis_data];
        updated[index] = { ...updated[index], description: value };
        setData('swot_analysis_data', updated);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        router.post(route('rmd.files.upload'), {
            file: file,
            meeting_type: 'career-exploration-p2',
        }, {
            forceFormData: true,
            onProgress: (progress) => {
                setUploadProgress(progress.percentage);
            },
            onSuccess: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
            onError: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };

    const deleteFile = (fileId) => {
        askConfirm(
            __('RMD_DELETE'),
            __('RMD_DELETE_CONFIRMATION'),
            () => router.delete(route('rmd.files.delete', fileId))
        );
    };

    const swotLabels = [
        __('RMD_CH4_P2_SWOT_STRENGTH'),
        __('RMD_CH4_P2_SWOT_WEAKNESS'),
        __('RMD_CH4_P2_SWOT_OPPORTUNITY'),
        __('RMD_CH4_P2_SWOT_THREAT'),
    ];

    const swotColors = [
        'bg-green-400 dark:bg-green-700',
        'bg-red-400 dark:bg-red-700',
        'bg-blue-400 dark:bg-blue-700',
        'bg-yellow-400 dark:bg-yellow-600',
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_CH4_P2_TITLE')}</h2>}
        >
            <Head title={__('RMD_CH4_P2_TITLE')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
                {/* RMD Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/images/rmd-backgrounds/latar-_11_.svg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        opacity: 0.08,
                    }}
                />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{__('RMD_CH4_P2_CHAPTER')}</h4>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase">{__('RMD_CH4_P2_MAIN_TITLE')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 italic font-medium">{__('RMD_CH4_P2_MEETING')}</p>
                        </div>
                        <div className="mt-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            <p>{__('RMD_CH4_P2_OPENING_TEXT')}</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-8">

                        {/* Final Career Choice */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {__('RMD_CH4_P2_FINAL_CAREER_TITLE')}
                            </h4>

                            <div className="space-y-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    {__('RMD_CH4_P2_FINAL_CAREER_LABEL')}
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 focus:border-orange-400 focus:ring-orange-400 shadow-sm text-lg font-bold"
                                    value={data.final_career_choice}
                                    onChange={e => setData('final_career_choice', e.target.value)}
                                    placeholder={__('RMD_CH4_P2_FINAL_CAREER_PLACEHOLDER')}
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    {__('RMD_CH4_P2_FINAL_CAREER_REASON_LABEL')}
                                </label>
                                <textarea
                                    className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-orange-400 focus:ring-orange-400 shadow-sm min-h-[120px]"
                                    value={data.final_career_reason}
                                    onChange={e => setData('final_career_reason', e.target.value)}
                                    placeholder={__('RMD_CH4_P2_FINAL_CAREER_REASON_PLACEHOLDER')}
                                />
                            </div>
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* SWOT Analysis */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {__('RMD_CH4_P2_SWOT_TITLE')}
                            </h4>

                            <div className="space-y-3">
                                <label className="block text-gray-700 dark:text-gray-300 font-medium">
                                    {__('RMD_CH4_P2_SWOT_DEF_LABEL')}
                                </label>
                                <textarea
                                    className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-400 focus:ring-cyan-400 shadow-sm min-h-[100px]"
                                    value={data.swot_definition}
                                    onChange={e => setData('swot_definition', e.target.value)}
                                    placeholder={__('RMD_CH4_P2_SWOT_DEF_PLACEHOLDER')}
                                />
                            </div>

                            <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                            <th className="py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold">{__('RMD_CH4_P2_SWOT_TABLE_ASPECT')}</th>
                                            <th className="py-4 px-6 text-center font-bold">{__('RMD_CH4_P2_SWOT_TABLE_DESCRIPTION')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                        {data.swot_analysis_data.map((row, index) => (
                                            <tr key={index}>
                                                <td className="py-6 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center bg-gray-50 dark:bg-gray-800/50">
                                                    <span className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm ${swotColors[index]}`}>
                                                        {swotLabels[index]}
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <textarea
                                                        className="w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
                                                        value={row.description}
                                                        onChange={e => updateSwot(index, e.target.value)}
                                                        placeholder={__('RMD_CH4_P2_SWOT_PLACEHOLDER')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Chapter 4 Checklist */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {__('RMD_CH4_P2_CHECKLIST_TITLE')}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">{__('RMD_CH4_P2_CHECKLIST_DESC')}</p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'chapter4_check1', label: __('RMD_CH4_P2_CHECK1') },
                                    { id: 'chapter4_check2', label: __('RMD_CH4_P2_CHECK2') },
                                    { id: 'chapter4_check3', label: __('RMD_CH4_P2_CHECK3') },
                                ].map((item) => (
                                    <label key={item.id} className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/40 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700"
                                            checked={data[item.id]}
                                            onChange={e => setData(item.id, e.target.checked)}
                                        />
                                        <span className="text-gray-800 dark:text-gray-200 font-medium">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Mentoring Notes */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-4">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                {__('RMD_CH4_P2_MENTORING_NOTES_TITLE')}
                            </h4>
                            <textarea
                                className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-400 focus:ring-cyan-400 shadow-sm min-h-[120px]"
                                value={data.mentoring_notes}
                                onChange={e => setData('mentoring_notes', e.target.value)}
                                placeholder={__('RMD_CH4_P2_MENTORING_NOTES_PLACEHOLDER')}
                            />
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4 pt-4 pb-4">
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600 dark:text-green-400 font-bold">{__('RMD_CH4_P2_SUCCESS_MSG')}</p>
                            </Transition>

                            <PrimaryButton disabled={processing} className="px-12 py-4 text-lg font-bold uppercase tracking-widest bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700">
                                {__('RMD_CH4_P2_BTN_SAVE')}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* File Management */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{__('RMD_SUPPORTING_DOCS_TITLE')}</h4>

                        <div className="space-y-6">
                            <label className="relative group cursor-pointer block">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative flex items-center justify-center px-6 py-4 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl group-hover:border-cyan-400 transition-colors">
                                    <div className="text-center">
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                                            {isUploading ? `${__('RMD_UPLOADING')} ${uploadProgress}%` : __('RMD_UPLOAD_PLACEHOLDER')}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">{__('RMD_UPLOAD_LIMIT_10MB')}</p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </label>

                            {files && files.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                    {file.file_name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={route('rmd.files.download', file.id)}
                                                    className="p-2 text-gray-400 hover:text-cyan-500 transition-colors"
                                                    title={__('RMD_DOWNLOAD')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </a>
                                                <button
                                                    onClick={() => deleteFile(file.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title={__('RMD_DELETE')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center py-8">
                        <Link
                            href={route('rmd.career-exploration')}
                            className="flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            {__('RMD_CH4_P2_BTN_PREV')}
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link
                                href={route('rmd.chapters')}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm"
                            >
                                {__('RMD_TABLE_OF_CONTENTS')}
                            </Link>

                            <Link
                                href={route('rmd.preparation-dream-island')}
                                className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                            >
                                {__('RMD_CH4_P2_BTN_NEXT')}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            <ConfirmModal
                show={confirmState.show}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={() => { confirmState.onConfirm?.(); closeConfirm(); }}
                onCancel={closeConfirm}
                confirmLabel={__('RMD_DELETE')}
            />
        </AuthenticatedLayout>
    );
}
