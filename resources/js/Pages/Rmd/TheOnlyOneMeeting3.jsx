import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';

export default function TheOnlyOneMeeting3({ auth, socioEmotional, files }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        learning_style_practice: socioEmotional?.learning_style_practice || '',
        learning_style_impact: socioEmotional?.learning_style_impact || '',
        birth_order_siblings: socioEmotional?.birth_order_siblings || '',
        parents_occupation: socioEmotional?.parents_occupation || '',
        home_responsibilities: socioEmotional?.home_responsibilities || '',
        family_uniqueness: socioEmotional?.family_uniqueness || '',
        extracurricular_activities: socioEmotional?.extracurricular_activities || '',
        ppa_activities: socioEmotional?.ppa_activities || '',
        hobbies: socioEmotional?.hobbies || '',
        strengths: socioEmotional?.strengths || '',
        weaknesses: socioEmotional?.weaknesses || '',
        reflection_learned: socioEmotional?.reflection_learned || '',
        reflection_improvement: socioEmotional?.reflection_improvement || '',
        height: socioEmotional?.height || '',
        weight: socioEmotional?.weight || '',
        physical_traits: socioEmotional?.physical_traits || '',
        favorite_sports: socioEmotional?.favorite_sports || '',
        sports_achievements: socioEmotional?.sports_achievements || '',
        eating_habits: socioEmotional?.eating_habits || '',
        sleeping_habits: socioEmotional?.sleeping_habits || '',
        health_issues: socioEmotional?.health_issues || '',
        physical_likes: socioEmotional?.physical_likes || '',
        physical_development_goal: socioEmotional?.physical_development_goal || '',
        spiritual_knowledge_jesus: socioEmotional?.spiritual_knowledge_jesus || '',
        spiritual_relationship_growth: socioEmotional?.spiritual_relationship_growth || '',
        spiritual_love_obedience: socioEmotional?.spiritual_love_obedience || '',
        spiritual_community: socioEmotional?.spiritual_community || '',
        spiritual_bible_study: socioEmotional?.spiritual_bible_study || '',
        spiritual_mentor: socioEmotional?.spiritual_mentor || '',
        spiritual_reflection_learned: socioEmotional?.spiritual_reflection_learned || '',
        spiritual_reflection_improvement: socioEmotional?.spiritual_reflection_improvement || '',
        chapter3_check1: !!socioEmotional?.chapter3_check1,
        chapter3_check2: !!socioEmotional?.chapter3_check2,
        chapter3_check3: !!socioEmotional?.chapter3_check3,
        chapter3_check4: !!socioEmotional?.chapter3_check4,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.the-only-one-meeting-3.store'), {
            preserveScroll: true,
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        router.post(route('rmd.files.upload'), {
            file: file,
            meeting_type: 'the-only-one-meeting-3',
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
        if (confirm(__('RMD_DELETE_CONFIRMATION'))) {
            router.delete(route('rmd.files.delete', fileId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_MEETING_3_TITLE')}</h2>}
        >
            <Head title={__('RMD_MEETING_3_TITLE')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-cyan-400 p-8 text-center text-white">
                            <h3 className="text-lg font-bold tracking-widest uppercase">{__('RMD_MEETING_3_CHAPTER')}</h3>
                            <h1 className="text-4xl font-black mt-2">{__('RMD_MEETING_3_MAIN_TITLE')}</h1>
                            <p className="text-xl italic mt-2 opacity-90">{__('RMD_MEETING_3_SUBTITLE')}</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <section>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{__('RMD_OPENING_SECTION_TITLE')}</h4>
                                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                    <p>
                                        {__('RMD_MEETING_3_INTRO_TEXT_1')}
                                    </p>
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border-l-4 border-orange-400 italic">
                                        "{__('RMD_MEETING_3_REFLECTION_QUESTION_1')}"
                                    </div>
                                    <textarea
                                        className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm min-h-[100px]"
                                        placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                        value={data.learning_style_practice}
                                        onChange={e => setData('learning_style_practice', e.target.value)}
                                    />
                                    <textarea
                                        className="w-full rounded-2xl border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-sm min-h-[100px]"
                                        placeholder={__('RMD_MEETING_3_PLACEHOLDER_IMPACT')}
                                        value={data.learning_style_impact}
                                        onChange={e => setData('learning_style_impact', e.target.value)}
                                    />
                                    <p>
                                        {__('RMD_MEETING_3_INTRO_TEXT_2')}
                                    </p>
                                    <p>
                                        {__('RMD_MEETING_3_INTRO_TEXT_3')}
                                    </p>
                                </div>
                            </section>

                            <hr className="border-gray-100 dark:border-gray-700" />

                            <section>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                    {__('RMD_PHYSICAL_ASPECT_TITLE')}
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                                    {__('RMD_PHYSICAL_ASPECT_DESC')}
                                </p>

                                <form onSubmit={submit} className="space-y-12">
                                    {/* Aspek Fisik */}
                                    <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                    <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                    <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_TABLE_QUESTION')}</th>
                                                    <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                {[
                                                    { no: 1, q: __('RMD_PHYSICAL_Q1'), key: 'height' },
                                                    { no: 2, q: __('RMD_PHYSICAL_Q2'), key: 'weight' },
                                                    { no: 3, q: __('RMD_PHYSICAL_Q3'), key: 'physical_traits' },
                                                    { no: 4, q: __('RMD_PHYSICAL_Q4'), key: 'favorite_sports' },
                                                    { no: 5, q: __('RMD_PHYSICAL_Q5'), key: 'sports_achievements' },
                                                    { no: 6, q: __('RMD_PHYSICAL_Q6'), key: 'eating_habits' },
                                                    { no: 7, q: __('RMD_PHYSICAL_Q7'), key: 'sleeping_habits' },
                                                    { no: 8, q: __('RMD_PHYSICAL_Q8'), key: 'health_issues' },
                                                ].map((item) => (
                                                    <tr key={item.no}>
                                                        <td className="py-6 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">{item.no}</td>
                                                        <td className="py-6 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {item.q}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-24 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data[item.key]}
                                                                onChange={e => setData(item.key, e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-8 space-y-6">
                                        <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                                            {__('RMD_REFLECTION_INSTRUCTION')}
                                        </p>
                                        
                                        <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                        <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                        <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_PHYSICAL_ASPECT_SHORT')}</th>
                                                        <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">1</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_PHYSICAL_REFLECT_Q1')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.physical_likes}
                                                                onChange={e => setData('physical_likes', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">2</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_PHYSICAL_REFLECT_Q2')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.physical_development_goal}
                                                                onChange={e => setData('physical_development_goal', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-700" />

                                    {/* Aspek Sosio-Emosional */}
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                            {__('RMD_SOCIO_ASPECT_TITLE')}
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
                                            {__('RMD_SOCIO_ASPECT_DESC')}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 italic">
                                            {__('RMD_SOCIO_ASPECT_INSTRUCTION')}
                                        </p>

                                        <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                        <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                        <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_TABLE_QUESTION')}</th>
                                                        <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                    {[
                                                        { no: 1, q: __('RMD_SOCIO_Q1'), key: 'birth_order_siblings' },
                                                        { no: 2, q: __('RMD_SOCIO_Q2'), key: 'parents_occupation' },
                                                        { no: 3, q: __('RMD_SOCIO_Q3'), key: 'home_responsibilities' },
                                                        { no: 4, q: __('RMD_SOCIO_Q4'), key: 'family_uniqueness' },
                                                        { no: 5, q: __('RMD_SOCIO_Q5'), key: 'extracurricular_activities' },
                                                        { no: 6, q: __('RMD_SOCIO_Q6'), key: 'ppa_activities' },
                                                        { no: 7, q: __('RMD_SOCIO_Q7'), key: 'hobbies' },
                                                        { no: 8, q: __('RMD_SOCIO_Q8'), key: 'strengths' },
                                                        { no: 9, q: __('RMD_SOCIO_Q9'), key: 'weaknesses' },
                                                    ].map((item) => (
                                                        <tr key={item.no}>
                                                            <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">{item.no}</td>
                                                            <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                                {item.q}
                                                            </td>
                                                            <td className="p-2">
                                                                <textarea
                                                                    className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                    value={data[item.key]}
                                                                    onChange={e => setData(item.key, e.target.value)}
                                                                    placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-6">
                                        <p className="text-gray-700 dark:text-gray-300 text-lg italic">
                                            {__('RMD_REFLECTION_INSTRUCTION')}
                                        </p>
                                        
                                        <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                        <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                        <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_SOCIO_ASPECT_SHORT')}</th>
                                                        <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">1</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic">
                                                            {__('RMD_TABLE_LEARNED_THINGS')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.reflection_learned}
                                                                onChange={e => setData('reflection_learned', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">2</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic">
                                                            <span dangerouslySetInnerHTML={{ __html: __('RMD_REFLECTION_IMPROVEMENT') }}></span>
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.reflection_improvement}
                                                                onChange={e => setData('reflection_improvement', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-700" />

                                    {/* Aspek Rohani */}
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                                            {__('RMD_SPIRITUAL_ASPECT_TITLE')}
                                        </h4>
                                        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-8">
                                            <p>
                                                {__('RMD_SPIRITUAL_ASPECT_DESC')}
                                            </p>
                                        </div>

                                        <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                        <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                        <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_TABLE_QUESTION')}</th>
                                                        <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">1</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q1')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_knowledge_jesus}
                                                                onChange={e => setData('spiritual_knowledge_jesus', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">2</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q2')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_relationship_growth}
                                                                onChange={e => setData('spiritual_relationship_growth', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">3</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q3')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_love_obedience}
                                                                onChange={e => setData('spiritual_love_obedience', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">4</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q4')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_community}
                                                                onChange={e => setData('spiritual_community', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">5</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q5')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_bible_study}
                                                                onChange={e => setData('spiritual_bible_study', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">6</td>
                                                        <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                            {__('RMD_SPIRITUAL_Q6')}
                                                        </td>
                                                        <td className="p-2">
                                                            <textarea
                                                                className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                value={data.spiritual_mentor}
                                                                onChange={e => setData('spiritual_mentor', e.target.value)}
                                                                placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-8 space-y-6">
                                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-3xl border-l-8 border-cyan-400">
                                                <h5 className="text-xl font-black text-cyan-700 dark:text-cyan-300 mb-4 uppercase tracking-wider">{__('RMD_IMPORTANT_NOTICE_TITLE')}</h5>
                                                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                                    <p>
                                                        {__('RMD_IMPORTANT_NOTICE_DESC_1')}
                                                    </p>
                                                    <p className="italic font-medium">
                                                        {__('RMD_IMPORTANT_NOTICE_DESC_2')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                            <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_TABLE_NO')}</th>
                                                            <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_SPIRITUAL_ASPECT_SHORT')}</th>
                                                            <th className="py-4 px-6 text-center font-bold">{__('RMD_TABLE_ANSWER')}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                        <tr>
                                                            <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">1</td>
                                                            <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                                {__('RMD_REFLECTION_LEARNED')}
                                                            </td>
                                                            <td className="p-2">
                                                                <textarea
                                                                    className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                    value={data.spiritual_reflection_learned}
                                                                    onChange={e => setData('spiritual_reflection_learned', e.target.value)}
                                                                    placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">2</td>
                                                            <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-medium">
                                                                <span dangerouslySetInnerHTML={{ __html: __('RMD_REFLECTION_IMPROVEMENT') }} />
                                                            </td>
                                                            <td className="p-2">
                                                                <textarea
                                                                    className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                                    value={data.spiritual_reflection_improvement}
                                                                    onChange={e => setData('spiritual_reflection_improvement', e.target.value)}
                                                                    placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="mt-12 space-y-8">
                                            <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border-2 border-orange-400 dark:border-orange-700 space-y-6">
                                                <h5 className="text-2xl font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">{__('RMD_CLOSING_TITLE')}</h5>
                                                <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                                    <p>
                                                        {__('RMD_CLOSING_DESC_1')}
                                                    </p>
                                                    <p>
                                                        {__('RMD_CLOSING_DESC_2')}
                                                    </p>
                                                    <p className="font-bold text-orange-600 dark:text-orange-400 italic">
                                                        {__('RMD_CLOSING_DESC_3')}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 mt-6">
                                                    {[
                                                        { id: 'chapter3_check1', label: __('RMD_CLOSING_CHECKLIST_1') },
                                                        { id: 'chapter3_check2', label: __('RMD_CLOSING_CHECKLIST_2') },
                                                        { id: 'chapter3_check3', label: __('RMD_CLOSING_CHECKLIST_3') },
                                                        { id: 'chapter3_check4', label: __('RMD_CLOSING_CHECKLIST_4') },
                                                    ].map((item) => (
                                                        <label key={item.id} className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-900 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-6 h-6 rounded border-2 border-orange-400 text-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-orange-700"
                                                                    checked={data[item.id]}
                                                                    onChange={e => setData(item.id, e.target.checked)}
                                                                />
                                                            </div>
                                                            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-8 rounded-3xl border-2 border-cyan-400 dark:border-cyan-700 space-y-6">
                                                <h5 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{__('RMD_GROUP_PROJECT_TITLE')}</h5>
                                                <ul className="space-y-4 text-gray-700 dark:text-gray-300 text-lg list-disc pl-6">
                                                    <li>
                                                        {__('RMD_GROUP_PROJECT_ITEM_1')}
                                                    </li>
                                                    <li>
                                                        {__('RMD_GROUP_PROJECT_ITEM_2')}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-4 mt-8">
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                {__('RMD_SAVED_SUCCESS')}
                                            </p>
                                        </Transition>

                                        <PrimaryButton disabled={processing} className="bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700">
                                            {__('RMD_SAVE_PROGRESS_CHAPTER_3')}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>

                    {/* File Management Card */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{__('RMD_SUPPORTING_DOCS_TITLE')}</h4>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
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
                                </div>
                            </div>

                            {files && files.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="C9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="C4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
                            href={route('rmd.the-only-one-meeting-2')}
                            className="flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            {__('RMD_PREVIOUS_MEETING')}
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('rmd.chapters')}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm"
                            >
                                {__('RMD_TABLE_OF_CONTENTS')}
                            </Link>

                            <Link 
                                href={route('rmd.career-exploration')}
                                className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                            >
                                {__('RMD_CAREER_EXPLORATION_TITLE')}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
