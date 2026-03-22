import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { EyeIcon, SpeakerWaveIcon, HandRaisedIcon } from '@heroicons/react/24/outline';

export default function TheOnlyOne({ auth, theOnlyOne }) {
    // Normalise checklist: PHP may encode sequential arrays as [1,2,...] (not {"0":1,...}).
    // Convert both flat-number arrays and {index,score}-object arrays to {idx: value}.
    const normaliseChecklist = (raw) => {
        if (!raw) return {};
        if (Array.isArray(raw)) {
            if (raw.length === 0) return {};
            // Legacy format: [{index, score}, ...]
            if (typeof raw[0] === 'object' && raw[0] !== null) {
                return raw.reduce((acc, curr) => ({ ...acc, [curr.index]: curr.score }), {});
            }
            // PHP sequential array [1,2,3,...] — convert index→value
            const obj = {};
            raw.forEach((val, idx) => { obj[idx] = val; });
            return obj;
        }
        return raw;
    };

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        unique_traits: theOnlyOne?.unique_traits || '',
        current_education_level: theOnlyOne?.current_education_level || '',
        favorite_subject: theOnlyOne?.favorite_subject || '',
        favorite_subject_reason: theOnlyOne?.favorite_subject_reason || '',
        least_favorite_subject: theOnlyOne?.least_favorite_subject || '',
        least_favorite_subject_reason: theOnlyOne?.least_favorite_subject_reason || '',
        highest_score_subject: theOnlyOne?.highest_score_subject || '',
        highest_score_value: theOnlyOne?.highest_score_value || '',
        lowest_score_subject: theOnlyOne?.lowest_score_subject || '',
        lowest_score_value: theOnlyOne?.lowest_score_value || '',
        visual_checklist: normaliseChecklist(theOnlyOne?.visual_checklist),
        auditory_checklist: normaliseChecklist(theOnlyOne?.auditory_checklist),
        kinesthetic_checklist: normaliseChecklist(theOnlyOne?.kinesthetic_checklist),
        learned_aspects: theOnlyOne?.learned_aspects || '',
        aspects_to_improve: theOnlyOne?.aspects_to_improve || '',
    });

    const visualItems = [
        { no: 1, ciri: __("VISUAL_ITEM_1_CIRI"), keterangan: __("VISUAL_ITEM_1_KET") },
        { no: 2, ciri: __("VISUAL_ITEM_2_CIRI"), keterangan: __("VISUAL_ITEM_2_KET") },
        { no: 3, ciri: __("VISUAL_ITEM_3_CIRI"), keterangan: __("VISUAL_ITEM_3_KET") },
        { no: 4, ciri: __("VISUAL_ITEM_4_CIRI"), keterangan: __("VISUAL_ITEM_4_KET") },
        { no: 5, ciri: __("VISUAL_ITEM_5_CIRI"), keterangan: __("VISUAL_ITEM_5_KET") },
        { no: 6, ciri: __("VISUAL_ITEM_6_CIRI"), keterangan: __("VISUAL_ITEM_6_KET") },
        { no: 7, ciri: __("VISUAL_ITEM_7_CIRI"), keterangan: __("VISUAL_ITEM_7_KET") },
        { no: 8, ciri: __("VISUAL_ITEM_8_CIRI"), keterangan: __("VISUAL_ITEM_8_KET") },
        { no: 9, ciri: __("VISUAL_ITEM_9_CIRI"), keterangan: __("VISUAL_ITEM_9_KET") },
        { no: 10, ciri: __("VISUAL_ITEM_10_CIRI"), keterangan: __("VISUAL_ITEM_10_KET") },
        { no: 11, ciri: __("VISUAL_ITEM_11_CIRI"), keterangan: __("VISUAL_ITEM_11_KET") },
        { no: 12, ciri: __("VISUAL_ITEM_12_CIRI"), keterangan: __("VISUAL_ITEM_12_KET") },
        { no: 13, ciri: __("VISUAL_ITEM_13_CIRI"), keterangan: __("VISUAL_ITEM_13_KET") },
        { no: 14, ciri: __("VISUAL_ITEM_14_CIRI"), keterangan: __("VISUAL_ITEM_14_KET") },
    ];

    const auditoryItems = [
        { no: 1, ciri: __("AUDITORY_ITEM_1_CIRI"), keterangan: __("AUDITORY_ITEM_1_KET") },
        { no: 2, ciri: __("AUDITORY_ITEM_2_CIRI"), keterangan: __("AUDITORY_ITEM_2_KET") },
        { no: 3, ciri: __("AUDITORY_ITEM_3_CIRI"), keterangan: __("AUDITORY_ITEM_3_KET") },
        { no: 4, ciri: __("AUDITORY_ITEM_4_CIRI"), keterangan: __("AUDITORY_ITEM_4_KET") },
        { no: 5, ciri: __("AUDITORY_ITEM_5_CIRI"), keterangan: __("AUDITORY_ITEM_5_KET") },
        { no: 6, ciri: __("AUDITORY_ITEM_6_CIRI"), keterangan: __("AUDITORY_ITEM_6_KET") },
        { no: 7, ciri: __("AUDITORY_ITEM_7_CIRI"), keterangan: __("AUDITORY_ITEM_7_KET") },
        { no: 8, ciri: __("AUDITORY_ITEM_8_CIRI"), keterangan: __("AUDITORY_ITEM_8_KET") },
        { no: 9, ciri: __("AUDITORY_ITEM_9_CIRI"), keterangan: __("AUDITORY_ITEM_9_KET") },
        { no: 10, ciri: __("AUDITORY_ITEM_10_CIRI"), keterangan: __("AUDITORY_ITEM_10_KET") },
        { no: 11, ciri: __("AUDITORY_ITEM_11_CIRI"), keterangan: __("AUDITORY_ITEM_11_KET") },
        { no: 12, ciri: __("AUDITORY_ITEM_12_CIRI"), keterangan: __("AUDITORY_ITEM_12_KET") },
        { no: 13, ciri: __("AUDITORY_ITEM_13_CIRI"), keterangan: __("AUDITORY_ITEM_13_KET") },
        { no: 14, ciri: __("AUDITORY_ITEM_14_CIRI"), keterangan: __("AUDITORY_ITEM_14_KET") },
    ];

    const kinestheticItems = [
        { no: 1, ciri: __("KINESTHETIC_ITEM_1_CIRI"), keterangan: __("KINESTHETIC_ITEM_1_KET") },
        { no: 2, ciri: __("KINESTHETIC_ITEM_2_CIRI"), keterangan: __("KINESTHETIC_ITEM_2_KET") },
        { no: 3, ciri: __("KINESTHETIC_ITEM_3_CIRI"), keterangan: __("KINESTHETIC_ITEM_3_KET") },
        { no: 4, ciri: __("KINESTHETIC_ITEM_4_CIRI"), keterangan: __("KINESTHETIC_ITEM_4_KET") },
        { no: 5, ciri: __("KINESTHETIC_ITEM_5_CIRI"), keterangan: __("KINESTHETIC_ITEM_5_KET") },
        { no: 6, ciri: __("KINESTHETIC_ITEM_6_CIRI"), keterangan: __("KINESTHETIC_ITEM_6_KET") },
        { no: 7, ciri: __("KINESTHETIC_ITEM_7_CIRI"), keterangan: __("KINESTHETIC_ITEM_7_KET") },
        { no: 8, ciri: __("KINESTHETIC_ITEM_8_CIRI"), keterangan: __("KINESTHETIC_ITEM_8_KET") },
        { no: 9, ciri: __("KINESTHETIC_ITEM_9_CIRI"), keterangan: __("KINESTHETIC_ITEM_9_KET") },
        { no: 10, ciri: __("KINESTHETIC_ITEM_10_CIRI"), keterangan: __("KINESTHETIC_ITEM_10_KET") },
        { no: 11, ciri: __("KINESTHETIC_ITEM_11_CIRI"), keterangan: __("KINESTHETIC_ITEM_11_KET") },
        { no: 12, ciri: __("KINESTHETIC_ITEM_12_CIRI"), keterangan: __("KINESTHETIC_ITEM_12_KET") },
        { no: 13, ciri: __("KINESTHETIC_ITEM_13_CIRI"), keterangan: __("KINESTHETIC_ITEM_13_KET") },
        { no: 14, ciri: __("KINESTHETIC_ITEM_14_CIRI"), keterangan: __("KINESTHETIC_ITEM_14_KET") },
    ];

    const handleScoreChange = (type, index, score) => {
        const currentList = { ...data[`${type}_checklist`] };
        currentList[index] = score;
        setData(`${type}_checklist`, currentList);
    };

    const calculateTotalScore = (checklist) => {
        if (!checklist) return 0;
        return Object.values(checklist).reduce((acc, curr) => acc + parseInt(curr || 0), 0);
    };

    const visualScore      = calculateTotalScore(data.visual_checklist);
    const auditoryScore    = calculateTotalScore(data.auditory_checklist);
    const kinestheticScore = calculateTotalScore(data.kinesthetic_checklist);
    const maxScore         = Math.max(visualScore, auditoryScore, kinestheticScore);

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.the-only-one.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_THE_ONLY_ONE_TITLE')}</h2>}
        >
            <Head title={__('RMD_THE_ONLY_ONE_TITLE')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
                {/* RMD Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/images/rmd-backgrounds/latar-_7_.svg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        opacity: 0.08,
                    }}
                />
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* Header Section */}
                            <div className="text-center mb-8 border-b-2 border-orange-200 dark:border-orange-800 pb-4">
                                <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">{__('RMD_THE_ONLY_ONE_TITLE').toUpperCase()}</h1>
                                <p className="text-lg italic text-gray-600 dark:text-gray-400 mt-2">{__('RMD_MEETING_1')}</p>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* Pembuka Section */}
                                <section>
                                    <h3 className="text-xl font-bold mb-4">{__('RMD_CH1_OPENING_TITLE')}</h3>
                                    <div className="prose dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
                                        <p className="mb-4">
                                            {__('RMD_OPENING_TEXT_1')}
                                        </p>
                                        <p className="mb-4">
                                            {__('RMD_OPENING_TEXT_2')}
                                        </p>
                                        <p className="font-semibold text-lg text-orange-600 dark:text-orange-400">
                                            {__('RMD_OPENING_QUESTION')}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <InputLabel htmlFor="unique_traits" value={__('RMD_UNIQUE_TRAITS_LABEL')} />
                                        <TextArea
                                            id="unique_traits"
                                            className="mt-1 block w-full"
                                            value={data.unique_traits}
                                            onChange={(e) => setData('unique_traits', e.target.value)}
                                            rows={4}
                                            placeholder={__('RMD_UNIQUE_TRAITS_PLACEHOLDER')}
                                        />
                                        <InputError message={errors.unique_traits} className="mt-2" />
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                        <p>
                                            {__('RMD_OPENING_TEXT_3')}
                                        </p>
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>




                                {/* Kemajuan Pribadiku Section */}
                                <section className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="text-xl font-bold mb-4">{__('RMD_MY_PERSONAL_PROGRESS_TITLE')}</h3>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        {__('RMD_PERSONAL_PROGRESS_TEXT_1')}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {__('RMD_PERSONAL_PROGRESS_TEXT_2')}
                                    </p>
                                </section>

                                {/* Perkembanganku dalam aspek intelektual Section */}
                                <section>
                                    <h3 className="text-xl font-bold mb-6">{__('RMD_INTELLECTUAL_PROGRESS_TITLE')}</h3>
                                    
                                    <div className="space-y-6">
                                        {/* Question 1 */}
                                        <div>
                                            <InputLabel htmlFor="current_education_level" value={__('RMD_EDUCATION_LEVEL_LABEL')} />
                                            <TextInput
                                                id="current_education_level"
                                                className="mt-1 block w-full"
                                                value={data.current_education_level}
                                                onChange={(e) => setData('current_education_level', e.target.value)}
                                            />
                                        </div>

                                        {/* Question 2 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="favorite_subject" value={__('RMD_FAVORITE_SUBJECT_LABEL')} />
                                                <TextInput
                                                    id="favorite_subject"
                                                    className="mt-1 block w-full"
                                                    value={data.favorite_subject}
                                                    onChange={(e) => setData('favorite_subject', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="favorite_subject_reason" value={__('RMD_REASON_LABEL')} />
                                                <TextArea
                                                    id="favorite_subject_reason"
                                                    className="mt-1 block w-full"
                                                    value={data.favorite_subject_reason}
                                                    onChange={(e) => setData('favorite_subject_reason', e.target.value)}
                                                    rows={1}
                                                />
                                            </div>
                                        </div>

                                        {/* Question 3 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="least_favorite_subject" value={__("RMD_CH1_LEAST_FAV_SUBJECT")} />
                                                <TextInput
                                                    id="least_favorite_subject"
                                                    className="mt-1 block w-full"
                                                    value={data.least_favorite_subject}
                                                    onChange={(e) => setData('least_favorite_subject', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="least_favorite_subject_reason" value={__("RMD_CH1_REASON")} />
                                                <TextArea
                                                    id="least_favorite_subject_reason"
                                                    className="mt-1 block w-full"
                                                    value={data.least_favorite_subject_reason}
                                                    onChange={(e) => setData('least_favorite_subject_reason', e.target.value)}
                                                    rows={1}
                                                />
                                            </div>
                                        </div>

                                        {/* Question 4 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="highest_score_subject" value={__("RMD_CH1_HIGHEST_SCORE_SUBJECT")} />
                                                <TextInput
                                                    id="highest_score_subject"
                                                    className="mt-1 block w-full"
                                                    value={data.highest_score_subject}
                                                    onChange={(e) => setData('highest_score_subject', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="highest_score_value" value={__("RMD_CH1_THE_SCORE")} />
                                                <TextInput
                                                    id="highest_score_value"
                                                    className="mt-1 block w-full"
                                                    value={data.highest_score_value}
                                                    onChange={(e) => setData('highest_score_value', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Question 5 */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="lowest_score_subject" value={__("RMD_CH1_LOWEST_SCORE_SUBJECT")} />
                                                <TextInput
                                                    id="lowest_score_subject"
                                                    className="mt-1 block w-full"
                                                    value={data.lowest_score_subject}
                                                    onChange={(e) => setData('lowest_score_subject', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="lowest_score_value" value={__("RMD_CH1_THE_SCORE")} />
                                                <TextInput
                                                    id="lowest_score_value"
                                                    className="mt-1 block w-full"
                                                    value={data.lowest_score_value}
                                                    onChange={(e) => setData('lowest_score_value', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 italic">
                                            {__("RMD_CH1_COMPLETE_PROFILE_NOTE")}
                                            {__("RMD_THE_ONLY_ONE_NOTE_1")}
                                            <span dangerouslySetInnerHTML={{ __html: __("RMD_THE_ONLY_ONE_NOTE_2") }}></span>
                                        </p>
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>

                                {/* Gaya Belajar Intro */}
                                <section>
                                    <h3 className="text-xl font-bold mb-4">{__("RMD_CH1_LEARNING_STYLE_TITLE")}</h3>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        {__("RMD_LEARNING_STYLE_DESC_1")}
                                        {__("RMD_LEARNING_STYLE_DESC_2")}
                                    </p>
                                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                                        {__("RMD_LEARNING_STYLE_DESC_3")}
                                    </p>
                                    
                                    <div className="flex justify-around items-center mb-8">
                                        <div className="text-center">
                                            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 mb-2 inline-block">
                                                <EyeIcon className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <div className="font-bold text-lg">{__("RMD_CH1_VISUAL")}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-red-100 dark:bg-red-900 rounded-full p-4 mb-2 inline-block">
                                                <SpeakerWaveIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
                                            </div>
                                            <div className="font-bold text-lg">{__("RMD_CH1_AUDITORY")}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-2 inline-block">
                                                <HandRaisedIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="font-bold text-lg">{__("RMD_CH1_KINESTHETIC")}</div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-8">
                                        <p className="font-semibold mb-2">{__("RMD_CH1_INSTRUCTIONS")}</p>
                                        <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                            <li>{__("RMD_INSTRUCTION_1")}</li>
                                            <li>{__("RMD_INSTRUCTION_2")}</li>
                                            <li>{__("RMD_INSTRUCTION_3")}</li>
                                        </ol>
                                    </div>
                                </section>

                                {/* Visual Quiz */}
                                <section className="border-t-4 border-yellow-400 pt-6">
                                    <h4 className="text-lg font-bold mb-4 text-yellow-700 dark:text-yellow-400">{__('RMD_VISUAL_TITLE')}</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                                                <tr>
                                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8">{__('RMD_TABLE_NO')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">{__('RMD_CHARACTERISTIC_HEADER')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('RMD_DESCRIPTION_HEADER')}</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">1</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">2</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">3</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">4</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">5</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {visualItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.no}</td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.ciri}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.keterangan}</td>
                                                        {[1, 2, 3, 4, 5].map((score) => (
                                                            <td key={score} className="px-2 py-4 text-center whitespace-nowrap">
                                                                <input
                                                                    type="radio"
                                                                    name={`visual_${idx}`}
                                                                    className="text-yellow-600 focus:ring-yellow-500 h-4 w-4"
                                                                    checked={data.visual_checklist[idx] == score}
                                                                    onChange={() => handleScoreChange('visual', idx, score)}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-right font-bold text-lg text-yellow-700 dark:text-yellow-400">
                                        {__('RMD_TOTAL_SCORE_VISUAL')} {calculateTotalScore(data.visual_checklist)}
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>

                                {/* Auditory Quiz */}
                                <section className="border-t-4 border-red-400 pt-6">
                                    <h4 className="text-lg font-bold mb-4 text-red-700 dark:text-red-400">{__('RMD_AUDITORY_TITLE')}</h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-red-50 dark:bg-red-900/20">
                                                <tr>
                                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8">{__('RMD_TABLE_NO')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">{__('RMD_CHARACTERISTIC_HEADER')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('RMD_DESCRIPTION_HEADER')}</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">1</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">2</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">3</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">4</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">5</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {auditoryItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.no}</td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.ciri}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.keterangan}</td>
                                                        {[1, 2, 3, 4, 5].map((score) => (
                                                            <td key={score} className="px-2 py-4 text-center whitespace-nowrap">
                                                                <input
                                                                    type="radio"
                                                                    name={`auditory_${idx}`}
                                                                    className="text-red-600 focus:ring-red-500 h-4 w-4"
                                                                    checked={data.auditory_checklist[idx] == score}
                                                                    onChange={() => handleScoreChange('auditory', idx, score)}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-right font-bold text-lg text-red-700 dark:text-red-400">
                                        {__('RMD_TOTAL_SCORE_AUDITORY')} {calculateTotalScore(data.auditory_checklist)}
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>

                                {/* Kinesthetic Quiz */}
                                <section className="border-t-4 border-green-400 pt-6">
                                    <h4 className="text-lg font-bold mb-4 text-green-700 dark:text-green-400">{__('RMD_KINESTHETIC_TITLE')}</h4>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-green-50 dark:bg-green-900/20">
                                                <tr>
                                                    <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-8">{__('RMD_TABLE_NO')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-48">{__('RMD_CHARACTERISTIC_HEADER')}</th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{__('RMD_DESCRIPTION_HEADER')}</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">1</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">2</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">3</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">4</th>
                                                    <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-10">5</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {kinestheticItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.no}</td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.ciri}</td>
                                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{item.keterangan}</td>
                                                        {[1, 2, 3, 4, 5].map((score) => (
                                                            <td key={score} className="px-2 py-4 text-center whitespace-nowrap">
                                                                <input
                                                                    type="radio"
                                                                    name={`kinesthetic_${idx}`}
                                                                    className="text-green-600 focus:ring-green-500 h-4 w-4"
                                                                    checked={data.kinesthetic_checklist[idx] == score}
                                                                    onChange={() => handleScoreChange('kinesthetic', idx, score)}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-4 text-right font-bold text-lg text-green-700 dark:text-green-400">
                                        {__('RMD_TOTAL_SCORE_KINESTHETIC')} {calculateTotalScore(data.kinesthetic_checklist)}
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>

                                {/* Summary & Reflection Section */}
                                <section className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
                                    <h3 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{__('RMD_LEARNING_STYLE_RESULT_TITLE')}</h3>
                                    
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-8">
                                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                            <thead className="bg-cyan-400 dark:bg-cyan-800">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 w-16">{__('RMD_TABLE_NO')}</th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{__('RMD_LEARNING_STYLE_HEADER')}</th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{__('RMD_SCORE_HEADER')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">1</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{__('RMD_CH1_VISUAL')}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 font-bold">
                                                        {visualScore}
                                                        {maxScore > 0 && visualScore === maxScore && (
                                                            <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-semibold">
                                                                Gaya Belajar Kamu
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">2</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{__('RMD_CH1_AUDITORY')}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 font-bold">
                                                        {auditoryScore}
                                                        {maxScore > 0 && auditoryScore === maxScore && (
                                                            <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-semibold">
                                                                Gaya Belajar Kamu
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">3</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{__('RMD_CH1_KINESTHETIC')}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 font-bold">
                                                        {kinestheticScore}
                                                        {maxScore > 0 && kinestheticScore === maxScore && (
                                                            <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs font-semibold">
                                                                Gaya Belajar Kamu
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="space-y-6 text-gray-700 dark:text-gray-300">
                                        <div>
                                            <h4 className="text-lg font-bold mb-2">{__('RMD_GROUP_ACTIVITY_TITLE')}</h4>
                                            <ul className="list-disc list-inside space-y-2 pl-4">
                                                <li>{__('RMD_GROUP_ACTIVITY_ITEM_1')}</li>
                                                <li>{__('RMD_GROUP_ACTIVITY_ITEM_2')}</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold mb-2">{__('RMD_MAXIMIZING_LEARNING_TITLE')}</h4>
                                            <p className="mb-4 leading-relaxed">
                                                {__('RMD_MAXIMIZING_LEARNING_TEXT_1')}
                                            </p>
                                            <p className="mb-4 leading-relaxed">
                                                {__('RMD_MAXIMIZING_LEARNING_TEXT_2')}
                                            </p>
                                            <p className="mb-4 leading-relaxed">
                                                {__('RMD_MAXIMIZING_LEARNING_TEXT_3')}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Penutup & Reflection Section */}
                                <section className="border-t-4 border-indigo-400 pt-6 mt-8">
                                    <h3 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">{__('RMD_CLOSING_TITLE')}</h3>
                                    
                                    <div className="prose dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
                                        <p>
                                            {__('RMD_CLOSING_TEXT_1')}
                                        </p>
                                    </div>

                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-8">
                                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                            <thead className="bg-indigo-50 dark:bg-indigo-900/20">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 w-16">{__('RMD_TABLE_NO')}</th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{__('RMD_TABLE_DEVELOPMENT_ASPECT')}</th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{__('RMD_TABLE_ANSWER')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 align-top">1</td>
                                                    <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300 align-top font-medium">{__('RMD_TABLE_LEARNED_THINGS')}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <TextArea
                                                            id="learned_aspects"
                                                            className="mt-1 block w-full"
                                                            value={data.learned_aspects}
                                                            onChange={(e) => setData('learned_aspects', e.target.value)}
                                                            rows={3}
                                                            placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                        />
                                                        <InputError message={errors.learned_aspects} className="mt-2" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6 align-top">2</td>
                                                    <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300 align-top font-medium">{__('RMD_TABLE_THINGS_TO_IMPROVE')}</td>
                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <TextArea
                                                            id="aspects_to_improve"
                                                            className="mt-1 block w-full"
                                                            value={data.aspects_to_improve}
                                                            onChange={(e) => setData('aspects_to_improve', e.target.value)}
                                                            rows={3}
                                                            placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                                        />
                                                        <InputError message={errors.aspects_to_improve} className="mt-2" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg mb-8 border border-indigo-100 dark:border-indigo-800">
                                        <p className="text-lg text-indigo-800 dark:text-indigo-300 italic text-center font-medium">
                                            {__('RMD_CLOSING_PRAYER')}
                                        </p>
                                    </div>

                                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8 border border-green-100 dark:border-green-800">
                                        <h4 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">{__('RMD_CONGRATS_LEARNED')}</h4>
                                        <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-400 ml-4">
                                            <li>{__('RMD_LEARNED_ITEM_1')}</li>
                                            <li>{__('RMD_LEARNED_ITEM_2')}</li>
                                        </ul>
                                    </div>

                                    <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-6">
                                        <h4 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{__('RMD_GROUP_PROJECT_TITLE')}</h4>
                                        <ul className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 ml-2">
                                            <li className="pl-2"><span className="font-bold">{__('RMD_GROUP_PROJECT_ITEM_1')}</span></li>
                                            <li className="pl-2">{__('RMD_GROUP_PROJECT_ITEM_2')}</li>
                                        </ul>
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                        <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                            {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link href={route('rmd.true-success')} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                        &laquo; {__('RMD_BACK_BUTTON')}
                                    </Link>
                                    
                                    <div className="flex items-center">
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mr-3">{__('RMD_SAVED_MESSAGE')}</p>
                                        </Transition>

                                        <PrimaryButton disabled={processing} className="mr-4">
                                            {__('RMD_SAVE_BUTTON')}
                                        </PrimaryButton>

                                        <Link href={route('rmd.the-only-one-meeting-2')} className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 focus:bg-purple-700 active:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                            {__('RMD_NEXT_MEETING_BUTTON')} &raquo;
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
