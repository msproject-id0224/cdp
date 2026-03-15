import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';

export default function TheOnlyOneMeeting2({ auth, multipleIntelligence, files }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const [navError, setNavError] = useState(null);

    // Helper to safely parse initial data.
    // PHP may encode sequential checklist as a JSON array [1,2,3,...] instead of
    // an object {"0":1,"1":2,...}. Convert array back to object so checked comparison works.
    const getInitialData = (data) => {
        if (Array.isArray(data)) {
            const obj = {};
            data.forEach((val, idx) => { obj[idx] = val; });
            return obj;
        }
        return data || {};
    };

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        linguistic_checklist: getInitialData(multipleIntelligence?.linguistic_checklist),
        logical_mathematical_checklist: getInitialData(multipleIntelligence?.logical_mathematical_checklist),
        visual_spatial_checklist: getInitialData(multipleIntelligence?.visual_spatial_checklist),
        kinesthetic_checklist: getInitialData(multipleIntelligence?.kinesthetic_checklist),
        musical_checklist: getInitialData(multipleIntelligence?.musical_checklist),
        interpersonal_checklist: getInitialData(multipleIntelligence?.interpersonal_checklist),
        intrapersonal_checklist: getInitialData(multipleIntelligence?.intrapersonal_checklist),
        naturalist_checklist: getInitialData(multipleIntelligence?.naturalist_checklist),
        existential_checklist: getInitialData(multipleIntelligence?.existential_checklist),
        reflection_suitability: multipleIntelligence?.reflection_suitability || '',
        reflection_development: multipleIntelligence?.reflection_development || '',
        reflection_new_learning: multipleIntelligence?.reflection_new_learning || '',
        reflection_plan: multipleIntelligence?.reflection_plan || '',
    });

    const linguisticItems = [
        __('RMD_LINGUISTIC_1'),
        __('RMD_LINGUISTIC_2'),
        __('RMD_LINGUISTIC_3'),
        __('RMD_LINGUISTIC_4'),
        __('RMD_LINGUISTIC_5'),
        __('RMD_LINGUISTIC_6'),
        __('RMD_LINGUISTIC_7'),
        __('RMD_LINGUISTIC_8'),
        __('RMD_LINGUISTIC_9'),
        __('RMD_LINGUISTIC_10')
    ];

    const logicalMathematicalItems = [
        __('RMD_LOGICAL_MATHEMATICAL_1'),
        __('RMD_LOGICAL_MATHEMATICAL_2'),
        __('RMD_LOGICAL_MATHEMATICAL_3'),
        __('RMD_LOGICAL_MATHEMATICAL_4'),
        __('RMD_LOGICAL_MATHEMATICAL_5'),
        __('RMD_LOGICAL_MATHEMATICAL_6'),
        __('RMD_LOGICAL_MATHEMATICAL_7'),
        __('RMD_LOGICAL_MATHEMATICAL_8'),
        __('RMD_LOGICAL_MATHEMATICAL_9'),
        __('RMD_LOGICAL_MATHEMATICAL_10')
    ];

    const visualSpatialItems = [
        __('RMD_VISUAL_SPATIAL_1'),
        __('RMD_VISUAL_SPATIAL_2'),
        __('RMD_VISUAL_SPATIAL_3'),
        __('RMD_VISUAL_SPATIAL_4'),
        __('RMD_VISUAL_SPATIAL_5'),
        __('RMD_VISUAL_SPATIAL_6'),
        __('RMD_VISUAL_SPATIAL_7'),
        __('RMD_VISUAL_SPATIAL_8'),
        __('RMD_VISUAL_SPATIAL_9'),
        __('RMD_VISUAL_SPATIAL_10')
    ];

    const kinestheticItems = [
        __('RMD_KINESTETIC_1'),
        __('RMD_KINESTETIC_2'),
        __('RMD_KINESTETIC_3'),
        __('RMD_KINESTETIC_4'),
        __('RMD_KINESTETIC_5'),
        __('RMD_KINESTETIC_6'),
        __('RMD_KINESTETIC_7'),
        __('RMD_KINESTETIC_8'),
        __('RMD_KINESTETIC_9'),
        __('RMD_KINESTETIC_10')
    ];

    const musicalItems = [
        __('RMD_MUSICAL_1'),
        __('RMD_MUSICAL_2'),
        __('RMD_MUSICAL_3'),
        __('RMD_MUSICAL_4'),
        __('RMD_MUSICAL_5'),
        __('RMD_MUSICAL_6'),
        __('RMD_MUSICAL_7'),
        __('RMD_MUSICAL_8'),
        __('RMD_MUSICAL_9'),
        __('RMD_MUSICAL_10')
    ];

    const interpersonalItems = [
        __('RMD_INTERPERSONAL_1'),
        __('RMD_INTERPERSONAL_2'),
        __('RMD_INTERPERSONAL_3'),
        __('RMD_INTERPERSONAL_4'),
        __('RMD_INTERPERSONAL_5'),
        __('RMD_INTERPERSONAL_6'),
        __('RMD_INTERPERSONAL_7'),
        __('RMD_INTERPERSONAL_8'),
        __('RMD_INTERPERSONAL_9'),
        __('RMD_INTERPERSONAL_10')
    ];

    const intrapersonalItems = [
        __('RMD_INTRAPERSONAL_1'),
        __('RMD_INTRAPERSONAL_2'),
        __('RMD_INTRAPERSONAL_3'),
        __('RMD_INTRAPERSONAL_4'),
        __('RMD_INTRAPERSONAL_5'),
        __('RMD_INTRAPERSONAL_6'),
        __('RMD_INTRAPERSONAL_7'),
        __('RMD_INTRAPERSONAL_8'),
        __('RMD_INTRAPERSONAL_9'),
        __('RMD_INTRAPERSONAL_10')
    ];

    const naturalistItems = [
        __('RMD_NATURALIST_1'),
        __('RMD_NATURALIST_2'),
        __('RMD_NATURALIST_3'),
        __('RMD_NATURALIST_4'),
        __('RMD_NATURALIST_5'),
        __('RMD_NATURALIST_6'),
        __('RMD_NATURALIST_7'),
        __('RMD_NATURALIST_8'),
        __('RMD_NATURALIST_9'),
        __('RMD_NATURALIST_10')
    ];

    const existentialItems = [
        __('RMD_EXISTENTIAL_1'),
        __('RMD_EXISTENTIAL_2'),
        __('RMD_EXISTENTIAL_3'),
        __('RMD_EXISTENTIAL_4'),
        __('RMD_EXISTENTIAL_5'),
        __('RMD_EXISTENTIAL_6'),
        __('RMD_EXISTENTIAL_7'),
        __('RMD_EXISTENTIAL_8'),
        __('RMD_EXISTENTIAL_9'),
        __('RMD_EXISTENTIAL_10')
    ];

    const handleRadioChange = (category, index, value) => {
        const fieldName = `${category}_checklist`;
        setData(fieldName, {
            ...data[fieldName],
            [index]: parseInt(value)
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.the-only-one-meeting-2.store'));
    };

    const calculateScore = (checklist) => {
        if (!checklist) return 0;
        return Object.values(checklist).reduce((a, b) => a + (parseInt(b) || 0), 0);
    };

    const sections = [
        { title: __('RMD_SECTION_LINGUISTIC'), items: linguisticItems, key: 'linguistic', color: 'purple' },
        { title: __('RMD_SECTION_LOGICAL_MATHEMATICAL'), items: logicalMathematicalItems, key: 'logical_mathematical', color: 'blue' },
        { title: __('RMD_SECTION_VISUAL_SPATIAL'), items: visualSpatialItems, key: 'visual_spatial', color: 'yellow' },
        { title: __('RMD_SECTION_KINESTETIC'), items: kinestheticItems, key: 'kinesthetic', color: 'red' },
        { title: __('RMD_SECTION_MUSICAL'), items: musicalItems, key: 'musical', color: 'green' },
        { title: __('RMD_SECTION_INTERPERSONAL'), items: interpersonalItems, key: 'interpersonal', color: 'indigo' },
        { title: __('RMD_SECTION_INTRAPERSONAL'), items: intrapersonalItems, key: 'intrapersonal', color: 'pink' },
        { title: __('RMD_SECTION_NATURALIST'), items: naturalistItems, key: 'naturalist', color: 'emerald' },
        { title: __('RMD_SECTION_EXISTENTIAL'), items: existentialItems, key: 'existential', color: 'cyan' },
    ];

    const sortedScores = sections
        .map(s => ({
            title: s.title.split('. ')[1] || s.title, // Fallback if no dot separation in translation
            score: calculateScore(data[`${s.key}_checklist`])
        }))
        .sort((a, b) => b.score - a.score);

    const topThree = sortedScores.slice(0, 3);

    const isCompleted = sections.every(section => 
        data[`${section.key}_checklist`] && 
        Object.keys(data[`${section.key}_checklist`]).length === section.items.length
    ) && data.reflection_new_learning?.trim() && data.reflection_plan?.trim();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('meeting_type', 'the-only-one-meeting-2');

        setIsUploading(true);
        router.post(route('rmd.files.upload'), formData, {
            onProgress: (progress) => {
                setUploadProgress(progress.percentage);
            },
            onFinish: () => {
                setIsUploading(false);
                setUploadProgress(0);
            },
        });
    };

    const handleDeleteFile = (fileId) => {
        if (confirm(__('RMD_CONFIRM_DELETE_FILE'))) {
            router.delete(route('rmd.files.delete', fileId));
        }
    };

    const navigateToMeeting3 = () => {
        setIsNavigating(true);
        setNavError(null);
        router.visit(route('rmd.the-only-one-meeting-3'), {
            onFinish: () => setIsNavigating(false),
            onError: () => {
                setIsNavigating(false);
                setNavError(__('RMD_NAV_ERROR'));
            }
        });
    };

    const renderQuestions = (items, category, colorClass, borderColorClass, ringColorClass, textColorClass) => {
        return items.map((item, idx) => (
            <div key={idx} className="mb-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-3">
                    <span className="mr-2 font-bold">{idx + 1}.</span> {item}
                </p>
                <div className="flex flex-wrap gap-4 ml-6">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <label key={val} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="radio"
                                name={`${category}_${idx}`}
                                value={val}
                                checked={data[`${category}_checklist`]?.[idx] === val}
                                onChange={(e) => handleRadioChange(category, idx, e.target.value)}
                                className={`w-5 h-5 ${colorClass} bg-gray-100 border-gray-300 focus:${ringColorClass} dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600`}
                                required
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{val}</span>
                        </label>
                    ))}
                </div>
            </div>
        ));
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_THE_ONLY_ONE_MEETING_2_TITLE')}</h2>}
        >
            <Head title={__('RMD_THE_ONLY_ONE_MEETING_2_TITLE')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
                {/* RMD Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/images/rmd-backgrounds/latar-_8_.svg')",
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
                            <div className="text-center mb-8 border-b-2 border-purple-200 dark:border-purple-800 pb-4">
                                <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400">{__('RMD_THE_ONLY_ONE_TITLE')}</h1>
                                <p className="text-lg italic text-gray-600 dark:text-gray-400 mt-2">{__('RMD_MEETING_2')}</p>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* Pembuka Section */}
                                <section className="mb-8">
                                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{__('RMD_OPENING')}</h3>
                                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                        <p>
                                            {__('RMD_OPENING_TEXT_1')}
                                        </p>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4 border-l-4 border-yellow-400">
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>{__('RMD_OPENING_LIST_1')}</li>
                                                <li>{__('RMD_OPENING_LIST_2')}</li>
                                                <li>{__('RMD_OPENING_LIST_3')}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Kecerdasan Majemuk Intro */}
                                <section className="mb-8 border-t-2 border-gray-200 dark:border-gray-700 pt-8">
                                    <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">{__('RMD_MULTIPLE_INTELLIGENCES')}</h3>
                                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                                        <p>
                                            {__('RMD_INSTRUCTION_TEXT_1')}
                                        </p>
                                        <ol className="list-decimal list-inside space-y-2 ml-4 mt-2">
                                            <li>{__('RMD_INSTRUCTION_LIST_1')}</li>
                                            <li>{__('RMD_INSTRUCTION_LIST_2')}</li>
                                        </ol>
                                    </div>
                                </section>

                                {/* Questionnaire Sections */}
                                {sections.map((section) => {
                                             const colorMap = {
                                        purple: {
                                            border: 'border-purple-200 dark:border-purple-800',
                                            bg: 'bg-purple-50 dark:bg-purple-900/10',
                                            text: 'text-purple-800 dark:text-purple-300',
                                            radio: 'text-purple-600',
                                            ring: 'focus:ring-purple-500',
                                            scoreBg: 'bg-purple-100 dark:bg-purple-900',
                                            scoreText: 'text-purple-800 dark:text-purple-200',
                                            scoreBorder: 'border-purple-200 dark:border-purple-800'
                                        },
                                        blue: {
                                            border: 'border-blue-200 dark:border-blue-800',
                                            bg: 'bg-blue-50 dark:bg-blue-900/10',
                                            text: 'text-blue-800 dark:text-blue-300',
                                            radio: 'text-blue-600',
                                            ring: 'focus:ring-blue-500',
                                            scoreBg: 'bg-blue-100 dark:bg-blue-900',
                                            scoreText: 'text-blue-800 dark:text-blue-200',
                                            scoreBorder: 'border-blue-200 dark:border-blue-800'
                                        },
                                        yellow: {
                                            border: 'border-yellow-200 dark:border-yellow-800',
                                            bg: 'bg-yellow-50 dark:bg-yellow-900/10',
                                            text: 'text-yellow-800 dark:text-yellow-300',
                                            radio: 'text-yellow-600',
                                            ring: 'focus:ring-yellow-500',
                                            scoreBg: 'bg-yellow-100 dark:bg-yellow-900',
                                            scoreText: 'text-yellow-800 dark:text-yellow-200',
                                            scoreBorder: 'border-yellow-200 dark:border-yellow-800'
                                        },
                                        red: {
                                            border: 'border-red-200 dark:border-red-800',
                                            bg: 'bg-red-50 dark:bg-red-900/10',
                                            text: 'text-red-800 dark:text-red-300',
                                            radio: 'text-red-600',
                                            ring: 'focus:ring-red-500',
                                            scoreBg: 'bg-red-100 dark:bg-red-900',
                                            scoreText: 'text-red-800 dark:text-red-200',
                                            scoreBorder: 'border-red-200 dark:border-red-800'
                                        },
                                        green: {
                                            border: 'border-green-200 dark:border-green-800',
                                            bg: 'bg-green-50 dark:bg-green-900/10',
                                            text: 'text-green-800 dark:text-green-300',
                                            radio: 'text-green-600',
                                            ring: 'focus:ring-green-500',
                                            scoreBg: 'bg-green-100 dark:bg-green-900',
                                            scoreText: 'text-green-800 dark:text-green-200',
                                            scoreBorder: 'border-green-200 dark:border-green-800'
                                        },
                                        indigo: {
                                            border: 'border-indigo-200 dark:border-indigo-800',
                                            bg: 'bg-indigo-50 dark:bg-indigo-900/10',
                                            text: 'text-indigo-800 dark:text-indigo-300',
                                            radio: 'text-indigo-600',
                                            ring: 'focus:ring-indigo-500',
                                            scoreBg: 'bg-indigo-100 dark:bg-indigo-900',
                                            scoreText: 'text-indigo-800 dark:text-indigo-200',
                                            scoreBorder: 'border-indigo-200 dark:border-indigo-800'
                                        },
                                        pink: {
                                            border: 'border-pink-200 dark:border-pink-800',
                                            bg: 'bg-pink-50 dark:bg-pink-900/10',
                                            text: 'text-pink-800 dark:text-pink-300',
                                            radio: 'text-pink-600',
                                            ring: 'focus:ring-pink-500',
                                            scoreBg: 'bg-pink-100 dark:bg-pink-900',
                                            scoreText: 'text-pink-800 dark:text-pink-200',
                                            scoreBorder: 'border-pink-200 dark:border-pink-800'
                                        },
                                        emerald: {
                                            border: 'border-emerald-200 dark:border-emerald-800',
                                            bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                                            text: 'text-emerald-800 dark:text-emerald-300',
                                            radio: 'text-emerald-600',
                                            ring: 'focus:ring-emerald-500',
                                            scoreBg: 'bg-emerald-100 dark:bg-emerald-900',
                                            scoreText: 'text-emerald-800 dark:text-emerald-200',
                                            scoreBorder: 'border-emerald-200 dark:border-emerald-800'
                                        },
                                        cyan: {
                                            border: 'border-cyan-200 dark:border-cyan-800',
                                            bg: 'bg-cyan-50 dark:bg-cyan-900/10',
                                            text: 'text-cyan-800 dark:text-cyan-300',
                                            radio: 'text-cyan-600',
                                            ring: 'focus:ring-cyan-500',
                                            scoreBg: 'bg-cyan-100 dark:bg-cyan-900',
                                            scoreText: 'text-cyan-800 dark:text-cyan-200',
                                            scoreBorder: 'border-cyan-200 dark:border-cyan-800'
                                        },
                                    };

                                    const colors = colorMap[section.color];

                                    return (
                                        <section key={section.key} className={`mb-8 border-2 ${colors.border} rounded-lg p-6 ${colors.bg}`}>
                                            <h4 className={`text-xl font-bold mb-6 ${colors.text}`}>{section.title}</h4>
                                            <div className="space-y-4">
                                                {renderQuestions(section.items, section.key, colors.radio, '', colors.ring, '')}
                                            </div>
                                            {errors[`${section.key}_checklist`] && <InputError message={errors[`${section.key}_checklist`]} className="mt-2" />}
                                            <div className={`mt-8 pt-4 border-t ${colors.scoreBorder} flex justify-between items-center`}>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50"
                                                >
                                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                                </button>
                                                <div className={`${colors.scoreBg} px-6 py-3 rounded-full`}>
                                                    <span className={`text-lg font-bold ${colors.scoreText} mr-2`}>{__('RMD_TOTAL_SCORE')}</span>
                                                    <span className={`text-2xl font-extrabold ${colors.scoreText}`}>{calculateScore(data[`${section.key}_checklist`])}</span>
                                                </div>
                                            </div>
                                        </section>
                                     );
                                 })}

                                 {/* Ringkasan Skor & Top 3 Section */}
                                 <section className="mt-12 mb-8 bg-white dark:bg-gray-800 border-4 border-blue-400 dark:border-blue-600 rounded-3xl overflow-hidden shadow-xl">
                                     <div className="bg-blue-400 dark:bg-blue-600 py-4 px-6">
                                         <p className="text-white text-center font-bold italic">
                                             {__('RMD_SCORE_SUMMARY_INSTRUCTION')}
                                         </p>
                                     </div>

                                     <div className="p-6 md:p-8">
                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                             {/* Table Score Summary */}
                                             <div className="border-2 border-orange-300 dark:border-orange-800 rounded-2xl overflow-hidden">
                                                 <table className="w-full text-left">
                                                     <thead>
                                                         <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                             <th className="py-3 px-4 font-bold border-r border-white/20">{__('RMD_INTELLIGENCE_TYPE')}</th>
                                                             <th className="py-3 px-4 font-bold">{__('RMD_MY_SCORE')}</th>
                                                         </tr>
                                                     </thead>
                                                     <tbody className="divide-y divide-orange-200 dark:divide-orange-900">
                                                         {sections.map((section, idx) => {
                                                             const score = calculateScore(data[`${section.key}_checklist`]);
                                                             return (
                                                                 <tr key={idx} className="dark:text-gray-200">
                                                                     <td className="py-3 px-4 border-r border-orange-200 dark:border-orange-900 font-medium">
                                                                         {idx + 1}. {section.title.split('. ')[1] || section.title}
                                                                     </td>
                                                                     <td className="py-3 px-4 font-bold text-center bg-orange-50 dark:bg-orange-900/20">
                                                                         {score}
                                                                     </td>
                                                                 </tr>
                                                             );
                                                         })}
                                                     </tbody>
                                                 </table>
                                             </div>

                                             {/* Top 3 Intelligence Table */}
                                             <div className="flex flex-col">
                                                 <div className="bg-cyan-400 dark:bg-cyan-700 text-white py-3 px-6 rounded-t-2xl font-bold text-center">
                                                     {__('RMD_TOP_THREE_INTELLIGENCES')}
                                                 </div>
                                                 <div className="border-2 border-orange-300 dark:border-orange-800 rounded-b-2xl p-6 flex-grow bg-white dark:bg-gray-800">
                                                     <table className="w-full border-collapse">
                                                         <thead>
                                                             <tr className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200">
                                                                 <th className="py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm">{__('RMD_RANK_NO')}</th>
                                                                 <th className="py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm">{__('RMD_INTELLIGENCE')}</th>
                                                                 <th className="py-2 px-3 border border-orange-300 dark:border-orange-800 font-bold text-sm">{__('RMD_SCORE')}</th>
                                                             </tr>
                                                         </thead>
                                                         <tbody>
                                                             {[0, 1, 2].map((i) => (
                                                                 <tr key={i}>
                                                                     <td className="py-4 px-3 border border-orange-300 dark:border-orange-800 text-center font-bold text-gray-700 dark:text-gray-300">{i + 1}</td>
                                                                     <td className="py-4 px-3 border border-orange-300 dark:border-orange-800 font-bold text-blue-600 dark:text-blue-400">
                                                                         {topThree[i]?.title || '-'}
                                                                     </td>
                                                                     <td className="py-4 px-3 border border-orange-300 dark:border-orange-800 text-center font-black text-xl text-orange-600 dark:text-orange-400">
                                                                         {topThree[i]?.score || 0}
                                                                     </td>
                                                                 </tr>
                                                             ))}
                                                         </tbody>
                                                     </table>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </section>

                                 {/* Reflection Table Section (Berdasarkan Gambar) */}
                                 <section className="mt-12 space-y-6">
                                     <div className="flex items-center justify-between mb-2">
                                         <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{__('RMD_REFLECTION_TITLE') || 'Refleksi'}</h3>
                                         <button
                                             type="submit"
                                             disabled={processing}
                                             className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50"
                                         >
                                             {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                         </button>
                                     </div>
                                     <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                                         <table className="w-full border-collapse">
                                             <thead>
                                                 <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                                     <th className="py-4 px-4 border-r border-white/20 w-16 text-center font-bold">{__('RMD_NO')}</th>
                                                     <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_MULTIPLE_INTELLIGENCES')}</th>
                                                     <th className="py-4 px-6 text-center font-bold">{__('RMD_ANSWER')}</th>
                                                 </tr>
                                             </thead>
                                             <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                                 <tr>
                                                     <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">1</td>
                                                     <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic">
                                                         {__('RMD_REFLECTION_LEARNING_LABEL')}
                                                     </td>
                                                     <td className="p-2">
                                                         <textarea
                                                             className="w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
                                                             value={data.reflection_new_learning}
                                                             onChange={e => setData('reflection_new_learning', e.target.value)}
                                                             placeholder={__('RMD_PLACEHOLDER_WRITE_HERE')}
                                                         />
                                                     </td>
                                                 </tr>
                                                 <tr>
                                                     <td className="py-8 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold">2</td>
                                                     <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold italic">
                                                         {__('RMD_REFLECTION_DEVELOPMENT_LABEL')}
                                                     </td>
                                                     <td className="p-2">
                                                         <textarea
                                                             className="w-full min-h-[128px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
                                                             value={data.reflection_plan}
                                                             onChange={e => setData('reflection_plan', e.target.value)}
                                                             placeholder={__('RMD_PLACEHOLDER_WRITE_HERE')}
                                                         />
                                                     </td>
                                                 </tr>
                                             </tbody>
                                         </table>
                                     </div>

                                     <div className="text-center space-y-4 py-8">
                                         <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                             {__('RMD_CLOSING_TEXT_1')}
                                         </p>
                                         <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                             {__('RMD_CLOSING_TEXT_2')}
                                         </p>
                                     </div>

                                     {/* Proyek Rame-Rame */}
                                     <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                                         <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-6">{__('RMD_GROUP_PROJECT')}</h4>
                                         <ul className="space-y-4">
                                             <li className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-lg">
                                                 <span className="text-orange-500 font-bold text-2xl mt-[-4px]">•</span>
                                                 <span dangerouslySetInnerHTML={{ __html: __('RMD_PROJECT_ITEM_1') }} />
                                             </li>
                                             <li className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-lg">
                                                 <span className="text-orange-500 font-bold text-2xl mt-[-4px]">•</span>
                                                 <span>{__('RMD_PROJECT_ITEM_2')}</span>
                                             </li>
                                         </ul>
                                         
                                         {/* Illustration Mock (representing the child in the image) */}
                                         <div className="hidden md:block absolute bottom-0 right-8 opacity-20 pointer-events-none">
                                             <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
                                                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
                                             </svg>
                                         </div>
                                     </div>
                                 </section>

                                <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                                    <Link 
                                        href={route('rmd.chapters')}
                                        className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-2 transition-colors"
                                    >
                                        {__('RMD_BACK')}
                                    </Link>

                                    <div className="flex items-center gap-4">
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{__('RMD_SAVED')}</p>
                                        </Transition>

                                        <button 
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2.5 bg-[#1e293b] hover:bg-[#334155] text-white text-sm font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50"
                                        >
                                            {__('RMD_SAVE_ANSWER_BUTTON')}
                                        </button>

                                        {isCompleted && (
                                            <button
                                                type="button"
                                                onClick={navigateToMeeting3}
                                                disabled={isNavigating}
                                                className="px-6 py-2.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 uppercase tracking-wider disabled:opacity-50"
                                            >
                                                {isNavigating ? __('RMD_LOADING') : __('RMD_NEXT_MEETING_3')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>

                            {/* File Management Section */}
                            <section className="mt-12 border-t-2 border-gray-200 dark:border-gray-700 pt-8">
                                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">{__('RMD_ATTACHMENTS_DOCUMENTS')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {__('RMD_UPLOAD_INSTRUCTION')}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="mt-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                {isUploading ? `${__('RMD_UPLOADING')} ${uploadProgress}%` : __('RMD_CLICK_TO_UPLOAD')}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{__('RMD_MAX_FILE_SIZE')}</p>
                                        </label>
                                        {isUploading && (
                                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                                <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* File List */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">{__('RMD_FILE_LIST')} ({files?.length || 0})</h4>
                                        {files?.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">{__('RMD_NO_FILES_UPLOADED')}</p>
                                        ) : (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {files?.map((file) => (
                                                    <li key={file.id} className="py-3 flex items-center justify-between group">
                                                        <div className="flex items-center">
                                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded mr-3">
                                                                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[150px] md:max-w-[200px]" title={file.file_name}>
                                                                    {file.file_name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(file.file_size / 1024).toFixed(1)} KB • {new Date(file.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <a
                                                                href={route('rmd.files.download', file.id)}
                                                                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                                                title={__('RMD_DOWNLOAD')}
                                                            >
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteFile(file.id)}
                                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                                title={__('RMD_DELETE')}
                                                            >
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Navigation to Next Meeting */}
                            <Transition
                                show={isCompleted}
                                enter="transition-opacity duration-500"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="mt-16 mb-8 flex flex-col items-center border-t-2 border-gray-100 dark:border-gray-700 pt-12">
                                    <div className="text-center mb-6">
                                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{__('RMD_COMPLETION_TITLE')}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mt-2">{__('RMD_COMPLETION_SUBTITLE')}</p>
                                    </div>
                                    
                                    <button
                                        onClick={navigateToMeeting3}
                                        disabled={isNavigating}
                                        aria-label={__('RMD_NEXT_MEETING_3_BUTTON')}
                                        className={`
                                            relative group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 
                                            hover:from-cyan-600 hover:to-blue-700 text-white font-black text-xl rounded-full 
                                            shadow-[0_10px_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_30px_-10px_rgba(6,182,212,0.6)] 
                                            transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {isNavigating ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {__('RMD_LOADING')}
                                            </>
                                        ) : (
                                            <>
                                                <span>{__('RMD_NEXT_MEETING_3_BUTTON')}</span>
                                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    {navError && (
                                        <p className="mt-4 text-red-500 text-sm font-medium animate-bounce">
                                            {navError}
                                        </p>
                                    )}
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
