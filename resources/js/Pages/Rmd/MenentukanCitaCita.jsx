import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function MenentukanCitaCita({ auth, careerExploration }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        visual_professions: careerExploration?.visual_professions || '',
        auditory_professions: careerExploration?.auditory_professions || '',
        kinesthetic_professions_style: careerExploration?.kinesthetic_professions_style || '',
        interested_professions_from_style: careerExploration?.interested_professions_from_style || '',
        linguistic_ability: careerExploration?.linguistic_ability || '',
        linguistic_professions: careerExploration?.linguistic_professions || '',
        logical_math_ability: careerExploration?.logical_math_ability || '',
        logical_math_professions: careerExploration?.logical_math_professions || '',
        visual_spatial_ability: careerExploration?.visual_spatial_ability || '',
        visual_spatial_professions: careerExploration?.visual_spatial_professions || '',
        kinesthetic_ability: careerExploration?.kinesthetic_ability || '',
        kinesthetic_professions: careerExploration?.kinesthetic_professions || '',
        musical_ability: careerExploration?.musical_ability || '',
        musical_professions: careerExploration?.musical_professions || '',
        interpersonal_ability: careerExploration?.interpersonal_ability || '',
        interpersonal_professions: careerExploration?.interpersonal_professions || '',
        intrapersonal_ability: careerExploration?.intrapersonal_ability || '',
        intrapersonal_professions: careerExploration?.intrapersonal_professions || '',
        naturalist_ability: careerExploration?.naturalist_ability || '',
        naturalist_professions: careerExploration?.naturalist_professions || '',
        consider_learning_style: !!careerExploration?.consider_learning_style,
        consider_intelligence: !!careerExploration?.consider_intelligence,
        consider_academic_achievement: !!careerExploration?.consider_academic_achievement,
        consider_parental_support: !!careerExploration?.consider_parental_support,
        consider_gods_will: !!careerExploration?.consider_gods_will,
        additional_considerations: careerExploration?.additional_considerations || '',
        career_decision_matrix: careerExploration?.career_decision_matrix || [
            { alternative: '', factors: '' },
            { alternative: '', factors: '' },
            { alternative: '', factors: '' }
        ],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.career-exploration.store'), {
            preserveScroll: true,
        });
    };

    const updateMatrix = (index, field, value) => {
        const newMatrix = [...data.career_decision_matrix];
        newMatrix[index][field] = value;
        setData('career_decision_matrix', newMatrix);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_CH4_TITLE')}</h2>}
        >
            <Head title={__('RMD_CH4_DETERMINE_GOAL_TITLE')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Header Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                        <div className="text-center space-y-2">
                            <h4 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{__('RMD_CH4_CHAPTER')}</h4>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase">{__('RMD_CH4_MAIN_TITLE')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 italic font-medium">{__('RMD_CH4_MEETING')}</p>
                        </div>

                        <div className="mt-8 space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            <section>
                                <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{__('RMD_CH4_OPENING_TITLE')}</h5>
                                <p>
                                    {__('RMD_CH4_OPENING_TEXT_1')}
                                </p>
                                <p className="mt-4">
                                    {__('RMD_CH4_OPENING_TEXT_2')}
                                </p>
                            </section>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-8">
                        {/* Gaya Belajar Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{__('RMD_CH4_PROFESSION_TITLE')}</h4>
                            <div className="space-y-4">
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2">{__('RMD_CH4_LEARNING_STYLE')}</h5>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {__('RMD_CH4_LEARNING_STYLE_DESC')}
                                </p>
                            </div>

                            {/* Visual Icons Placeholder */}
                            <div className="flex justify-around py-8">
                                <div className="text-center space-y-2">
                                    <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white text-3xl">👁️</div>
                                    <p className="font-bold uppercase text-sm tracking-widest">{__('RMD_CH4_VISUAL')}</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl">👂</div>
                                    <p className="font-bold uppercase text-sm tracking-widest">{__('RMD_CH4_AUDITORY')}</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl">👆</div>
                                    <p className="font-bold uppercase text-sm tracking-widest">{__('RMD_CH4_KINESTHETIC')}</p>
                                </div>
                            </div>

                            <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                            <th className="py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold">{__('RMD_CH4_TABLE_LEARNING_STYLE')}</th>
                                            <th className="py-4 px-6 text-center font-bold">{__('RMD_CH4_TABLE_SUITABLE_PROFESSION')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                        {[
                                            { label: __('RMD_CH4_VISUAL'), id: 'visual_professions' },
                                            { label: __('RMD_CH4_AUDITORY_LABEL'), id: 'auditory_professions' },
                                            { label: __('RMD_CH4_KINESTHETIC'), id: 'kinesthetic_professions_style' },
                                        ].map((item) => (
                                            <tr key={item.id}>
                                                <td className="py-8 px-6 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold bg-gray-50 dark:bg-gray-800/50">
                                                    {item.label}
                                                </td>
                                                <td className="p-2">
                                                    <textarea
                                                        className="w-full h-32 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                        value={data[item.id]}
                                                        onChange={e => setData(item.id, e.target.value)}
                                                        placeholder={__('RMD_CH4_PLACEHOLDER_WRITE_HERE')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-400">
                                <p className="text-gray-700 dark:text-gray-300 italic">
                                    {__('RMD_CH4_NOTE_MARK_THREE')}
                                </p>
                                <textarea
                                    className="mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-blue-500"
                                    value={data.interested_professions_from_style}
                                    onChange={e => setData('interested_professions_from_style', e.target.value)}
                                    placeholder={__('RMD_CH4_PLACEHOLDER_THREE_PROFESSIONS')}
                                    rows="2"
                                />
                            </div>
                        </div>

                        {/* Kecerdasan Majemuk Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 italic underline decoration-orange-400 decoration-2">{__('RMD_CH4_MULTIPLE_INTELLIGENCE_TITLE')}</h5>
                            <p className="text-gray-600 dark:text-gray-400">
                                {__('RMD_CH4_MULTIPLE_INTELLIGENCE_DESC')}
                            </p>

                            <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                            <th className="py-4 px-4 border-r border-white/20 w-12 text-center font-bold">{__('RMD_CH4_TABLE_NO')}</th>
                                            <th className="py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold">{__('RMD_CH4_TABLE_MULTIPLE_INTELLIGENCE')}</th>
                                            <th className="py-4 px-6 border-r border-white/20 text-center font-bold">{__('RMD_CH4_TABLE_ABILITY')}</th>
                                            <th className="py-4 px-6 text-center font-bold">{__('RMD_CH4_TABLE_SUITABLE_PROFESSION')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200 text-sm">
                                        {[
                                            { no: 1, label: __('RMD_CH4_MI_LINGUISTIC'), ability: 'linguistic_ability', professions: 'linguistic_professions' },
                                            { no: 2, label: __('RMD_CH4_MI_LOGICAL_MATH'), ability: 'logical_math_ability', professions: 'logical_math_professions' },
                                            { no: 3, label: __('RMD_CH4_MI_VISUAL_SPATIAL'), ability: 'visual_spatial_ability', professions: 'visual_spatial_professions' },
                                            { no: 4, label: __('RMD_CH4_MI_KINESTHETIC'), ability: 'kinesthetic_ability', professions: 'kinesthetic_professions' },
                                            { no: 5, label: __('RMD_CH4_MI_MUSICAL'), ability: 'musical_ability', professions: 'musical_professions' },
                                            { no: 6, label: __('RMD_CH4_MI_INTERPERSONAL'), ability: 'interpersonal_ability', professions: 'interpersonal_professions' },
                                            { no: 7, label: __('RMD_CH4_MI_INTRAPERSONAL'), ability: 'intrapersonal_ability', professions: 'intrapersonal_professions' },
                                            { no: 8, label: __('RMD_CH4_MI_NATURALIST'), ability: 'naturalist_ability', professions: 'naturalist_professions' },
                                        ].map((item) => (
                                            <tr key={item.no}>
                                                <td className="py-4 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center font-bold bg-gray-50 dark:bg-gray-800/50">
                                                    {item.no}
                                                </td>
                                                <td className="py-4 px-6 border-r-2 border-orange-400 dark:border-orange-700 font-bold bg-gray-50 dark:bg-gray-800/50">
                                                    {item.label}
                                                </td>
                                                <td className="p-2 border-r-2 border-orange-400 dark:border-orange-700">
                                                    <textarea
                                                        className="w-full h-24 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                        value={data[item.ability]}
                                                        onChange={e => setData(item.ability, e.target.value)}
                                                        placeholder={__('RMD_CH4_PLACEHOLDER_ABILITY')}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <textarea
                                                        className="w-full h-24 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                        value={data[item.professions]}
                                                        onChange={e => setData(item.professions, e.target.value)}
                                                        placeholder={__('RMD_CH4_PLACEHOLDER_PROFESSION')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Menentukan Cita-Cita Checklist */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{__('RMD_CH4_DETERMINE_GOAL_TITLE')}</h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {__('RMD_CH4_DETERMINE_GOAL_DESC')} <span className="italic font-bold">decision making</span>
                            </p>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'consider_learning_style', label: __('RMD_CH4_CONSIDER_LEARNING_STYLE') },
                                    { id: 'consider_intelligence', label: __('RMD_CH4_CONSIDER_INTELLIGENCE') },
                                    { id: 'consider_academic_achievement', label: __('RMD_CH4_CONSIDER_ACADEMIC') },
                                    { id: 'consider_parental_support', label: __('RMD_CH4_CONSIDER_PARENTAL') },
                                    { id: 'consider_gods_will', label: __('RMD_CH4_CONSIDER_GODS_WILL') },
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

                            <div className="space-y-4 pt-4">
                                <h5 className="font-bold text-gray-800 dark:text-gray-200">{__('RMD_CH4_ADDITIONAL_CONSIDERATIONS')}</h5>
                                <textarea
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-orange-400 h-32"
                                    value={data.additional_considerations}
                                    onChange={e => setData('additional_considerations', e.target.value)}
                                    placeholder={__('RMD_CH4_PLACEHOLDER_DISCUSS')}
                                />
                            </div>
                        </div>

                        {/* Career Decision Matrix */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{__('RMD_CH4_DECISION_MATRIX_TITLE')}</h4>
                            <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                                {__('RMD_CH4_DECISION_MATRIX_DESC')}
                            </p>

                            <div className="border-2 border-orange-400 dark:border-orange-700 rounded-3xl overflow-hidden shadow-lg">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-400 dark:bg-cyan-700 text-white">
                                            <th className="py-4 px-6 border-r border-white/20 w-1/3 text-center font-bold uppercase tracking-wider">{__('RMD_CH4_TABLE_ALTERNATIVE')}</th>
                                            <th className="py-4 px-6 text-center font-bold uppercase tracking-wider">{__('RMD_CH4_TABLE_FACTORS')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                        {data.career_decision_matrix.map((row, index) => (
                                            <tr key={index}>
                                                <td className="p-4 border-r-2 border-orange-400 dark:border-orange-700 bg-gray-50 dark:bg-gray-800/50">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-cyan-400 font-bold text-center"
                                                        value={row.alternative}
                                                        onChange={e => updateMatrix(index, 'alternative', e.target.value)}
                                                        placeholder={`${__('RMD_CH4_PLACEHOLDER_ALTERNATIVE')} ${index + 1}`}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <textarea
                                                        className="w-full h-40 border-none focus:ring-0 bg-transparent resize-none dark:text-gray-200"
                                                        value={row.factors}
                                                        onChange={e => updateMatrix(index, 'factors', e.target.value)}
                                                        placeholder={__('RMD_CH4_PLACEHOLDER_FACTORS')}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-2xl border-l-8 border-cyan-400 space-y-3">
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    <span className="font-bold">{__('RMD_CH4_TIPS_LABEL')}</span> {__('RMD_CH4_TIPS_TEXT')}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                                    {__('RMD_CH4_PARENT_ADVICE')}
                                </p>
                            </div>
                        </div>

                        {/* Final Reflection */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-3xl border-2 border-orange-400 dark:border-orange-700 text-center space-y-4">
                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                {__('RMD_CH4_FINAL_REFLECTION')}
                            </p>
                        </div>

                        {/* Submit Section */}
                        <div className="flex items-center justify-end gap-4 pt-8 border-b-2 border-gray-100 dark:border-gray-800 pb-12">
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600 dark:text-green-400 font-bold">{__('RMD_CH4_SUCCESS_MSG')}</p>
                            </Transition>

                            <PrimaryButton disabled={processing} className="px-12 py-4 text-lg font-bold uppercase tracking-widest bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700">
                                {__('RMD_CH4_BTN_SAVE')}
                            </PrimaryButton>
                        </div>

                        {/* Navigation Section */}
                        <div className="flex justify-between items-center py-8">
                            <Link 
                                href={route('rmd.the-only-one-meeting-3')}
                                className="flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                {__('RMD_CH4_BTN_PREV')}
                            </Link>
                            
                            <Link 
                                href={route('rmd.chapters')}
                                className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm"
                            >
                                {__('RMD_CH4_BTN_TOC')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
