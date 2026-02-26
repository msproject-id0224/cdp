import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';

export default function WhatTheBibleSays({ auth, reflection }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        jeremiah_29_11_who_knows: reflection?.jeremiah_29_11_who_knows || '',
        jeremiah_29_11_plans: reflection?.jeremiah_29_11_plans || '',
        ephesians_2_10_made_by: reflection?.ephesians_2_10_made_by || '',
        ephesians_2_10_purpose: reflection?.ephesians_2_10_purpose || '',
        ephesians_2_10_god_wants: reflection?.ephesians_2_10_god_wants || '',
        genesis_1_26_28_image: reflection?.genesis_1_26_28_image || '',
        genesis_1_26_28_purpose: reflection?.genesis_1_26_28_purpose || '',
        summary_point_1: reflection?.summary_point_1 || '',
        summary_point_2: reflection?.summary_point_2 || '',
        favorite_verse: reflection?.favorite_verse || '',
        reason_favorite_verse: reflection?.reason_favorite_verse || '',
        leadership_c1: reflection?.leadership_c1 || '',
        leadership_c2: reflection?.leadership_c2 || '',
        leadership_c3: reflection?.leadership_c3 || '',
        leadership_c4: reflection?.leadership_c4 || '',
        leadership_c5: reflection?.leadership_c5 || '',
        chapter_learning_text: reflection?.chapter_learning_text || '',
        chapter_learning_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.what-the-bible-says.store'), {
            preserveScroll: true,
        });
    };

    const TextArea = ({ id, value, onChange, placeholder }) => (
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block"
            rows="3"
        />
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_BIBLE_SAYS_TITLE')}</h2>}
        >
            <Head title={__('RMD_BIBLE_SAYS_TITLE')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 space-y-8">
                            
                            {/* Header Section */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{__('RMD_BIBLE_SAYS_MAIN_TITLE')}</h3>
                                <div className="w-24 h-1 bg-indigo-500 mx-auto rounded"></div>
                            </div>

                            <section className="prose dark:prose-invert max-w-none">
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {__('RMD_BIBLE_SAYS_INTRO')}
                                </p>
                            </section>

                            {/* Yeremia 29:11 */}
                            <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">{__('RMD_JEREMIAH_29_11')}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="jeremiah_29_11_who_knows" value={__('RMD_JEREMIAH_WHO_KNOWS')} />
                                        <TextArea
                                            id="jeremiah_29_11_who_knows"
                                            value={data.jeremiah_29_11_who_knows}
                                            onChange={(e) => setData('jeremiah_29_11_who_knows', e.target.value)}
                                        />
                                        <InputError message={errors.jeremiah_29_11_who_knows} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="jeremiah_29_11_plans" value={__('RMD_JEREMIAH_PLANS')} />
                                        <TextArea
                                            id="jeremiah_29_11_plans"
                                            value={data.jeremiah_29_11_plans}
                                            onChange={(e) => setData('jeremiah_29_11_plans', e.target.value)}
                                        />
                                        <InputError message={errors.jeremiah_29_11_plans} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Efesus 2:10 */}
                            <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">{__('RMD_EPHESIANS_2_10')}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="ephesians_2_10_made_by" value={__('RMD_EPHESIANS_MADE_BY')} />
                                        <TextArea
                                            id="ephesians_2_10_made_by"
                                            value={data.ephesians_2_10_made_by}
                                            onChange={(e) => setData('ephesians_2_10_made_by', e.target.value)}
                                        />
                                        <InputError message={errors.ephesians_2_10_made_by} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="ephesians_2_10_purpose" value={__('RMD_EPHESIANS_PURPOSE')} />
                                        <TextArea
                                            id="ephesians_2_10_purpose"
                                            value={data.ephesians_2_10_purpose}
                                            onChange={(e) => setData('ephesians_2_10_purpose', e.target.value)}
                                        />
                                        <InputError message={errors.ephesians_2_10_purpose} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="ephesians_2_10_god_wants" value={__('RMD_EPHESIANS_GOD_WANTS')} />
                                        <TextArea
                                            id="ephesians_2_10_god_wants"
                                            value={data.ephesians_2_10_god_wants}
                                            onChange={(e) => setData('ephesians_2_10_god_wants', e.target.value)}
                                        />
                                        <InputError message={errors.ephesians_2_10_god_wants} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Kejadian 1:26-28 */}
                            <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                                <h4 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">{__('RMD_GENESIS_1_26_28')}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="genesis_1_26_28_image" value={__('RMD_GENESIS_IMAGE')} />
                                        <TextArea
                                            id="genesis_1_26_28_image"
                                            value={data.genesis_1_26_28_image}
                                            onChange={(e) => setData('genesis_1_26_28_image', e.target.value)}
                                        />
                                        <InputError message={errors.genesis_1_26_28_image} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="genesis_1_26_28_purpose" value={__('RMD_GENESIS_PURPOSE')} />
                                        <TextArea
                                            id="genesis_1_26_28_purpose"
                                            value={data.genesis_1_26_28_purpose}
                                            onChange={(e) => setData('genesis_1_26_28_purpose', e.target.value)}
                                        />
                                        <InputError message={errors.genesis_1_26_28_purpose} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <section className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                                <p className="mb-4 text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                                    {__('RMD_BIBLE_SAYS_SUMMARY')}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <span className="font-bold text-xl text-indigo-600 mt-1">1.</span>
                                        <TextArea
                                            id="summary_point_1"
                                            value={data.summary_point_1}
                                            onChange={(e) => setData('summary_point_1', e.target.value)}
                                            placeholder={__('RMD_SUMMARY_POINT_1_PLACEHOLDER')}
                                        />
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <span className="font-bold text-xl text-indigo-600 mt-1">2.</span>
                                        <TextArea
                                            id="summary_point_2"
                                            value={data.summary_point_2}
                                            onChange={(e) => setData('summary_point_2', e.target.value)}
                                            placeholder={__('RMD_SUMMARY_POINT_2_PLACEHOLDER')}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Reflection */}
                            <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="favorite_verse" value={__('RMD_FAVORITE_VERSE_LABEL')} />
                                        <TextArea
                                            id="favorite_verse"
                                            value={data.favorite_verse}
                                            onChange={(e) => setData('favorite_verse', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="reason_favorite_verse" value={__('RMD_FAVORITE_VERSE_REASON_LABEL')} />
                                        <TextArea
                                            id="reason_favorite_verse"
                                            value={data.reason_favorite_verse}
                                            onChange={(e) => setData('reason_favorite_verse', e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600">
                                        <p className="font-bold text-center text-green-700 dark:text-green-400">
                                            {__('RMD_SHARE_INSTRUCTION')}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Allah merancangmu untuk menjadi pemimpin */}
                            <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{__('RMD_LEADERSHIP_TITLE')}</h3>
                                <div className="w-24 h-1 bg-indigo-500 mx-auto rounded"></div>
                            </div>

                            <section className="prose dark:prose-invert max-w-none">
                                <p className="mb-4 leading-relaxed">
                                    {__('RMD_LEADERSHIP_INTRO_1')}
                                </p>
                                <p className="mb-4 leading-relaxed">
                                    {__('RMD_LEADERSHIP_INTRO_2')}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-indigo-600">1.</span>
                                            <input
                                                type="text"
                                                value={data.leadership_c1}
                                                onChange={(e) => setData('leadership_c1', e.target.value)}
                                                placeholder={__('RMD_LEADERSHIP_C1_PLACEHOLDER')}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-indigo-600">2.</span>
                                            <input
                                                type="text"
                                                value={data.leadership_c2}
                                                onChange={(e) => setData('leadership_c2', e.target.value)}
                                                placeholder={__('RMD_LEADERSHIP_C2_PLACEHOLDER')}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-indigo-600">3.</span>
                                            <input
                                                type="text"
                                                value={data.leadership_c3}
                                                onChange={(e) => setData('leadership_c3', e.target.value)}
                                                placeholder={__('RMD_LEADERSHIP_C3_PLACEHOLDER')}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-indigo-600">4.</span>
                                            <input
                                                type="text"
                                                value={data.leadership_c4}
                                                onChange={(e) => setData('leadership_c4', e.target.value)}
                                                placeholder={__('RMD_LEADERSHIP_C4_PLACEHOLDER')}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-indigo-600">5.</span>
                                            <input
                                                type="text"
                                                value={data.leadership_c5}
                                                onChange={(e) => setData('leadership_c5', e.target.value)}
                                                placeholder={__('RMD_LEADERSHIP_C5_PLACEHOLDER')}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <div>
                                            <strong className="text-indigo-600 dark:text-indigo-400">{__('RMD_LEADERSHIP_C1_TITLE')}</strong>
                                            <p>{__('RMD_LEADERSHIP_C1_DESC')}</p>
                                        </div>
                                        <div>
                                            <strong className="text-indigo-600 dark:text-indigo-400">{__('RMD_LEADERSHIP_C2_TITLE')}</strong>
                                            <p>{__('RMD_LEADERSHIP_C2_DESC')}</p>
                                        </div>
                                        <div>
                                            <strong className="text-indigo-600 dark:text-indigo-400">{__('RMD_LEADERSHIP_C3_TITLE')}</strong>
                                            <p>{__('RMD_LEADERSHIP_C3_DESC')}</p>
                                        </div>
                                        <div>
                                            <strong className="text-indigo-600 dark:text-indigo-400">{__('RMD_LEADERSHIP_C4_TITLE')}</strong>
                                            <p>{__('RMD_LEADERSHIP_C4_DESC')}</p>
                                        </div>
                                        <div>
                                            <strong className="text-indigo-600 dark:text-indigo-400">{__('RMD_LEADERSHIP_C5_TITLE')}</strong>
                                            <p>{__('RMD_LEADERSHIP_C5_DESC')}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mb-4 leading-relaxed">
                                    {__('RMD_LEADERSHIP_CLOSING_INTRO')}
                                </p>
                            </section>

                            {/* Mari Mengingat Kembali */}
                            <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-300">{__('RMD_CHAPTER_REVIEW_TITLE')}</h4>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    {__('RMD_CHAPTER_REVIEW_DESC')}
                                </p>
                                
                                <div className="space-y-4">
                                    <TextArea
                                        id="chapter_learning_text"
                                        value={data.chapter_learning_text}
                                        onChange={(e) => setData('chapter_learning_text', e.target.value)}
                                        placeholder={__('RMD_CHAPTER_REVIEW_PLACEHOLDER')}
                                    />
                                    
                                    <div>
                                        <InputLabel value={__('RMD_CHAPTER_REVIEW_IMAGE_LABEL')} />
                                        <input
                                            type="file"
                                            onChange={(e) => setData('chapter_learning_image', e.target.files[0])}
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100"
                                            accept="image/*"
                                        />
                                        {reflection?.chapter_learning_image_path && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-1">{__('RMD_CHAPTER_REVIEW_IMAGE_CURRENT')}</p>
                                                <img 
                                                    src={`/storage/${reflection.chapter_learning_image_path}`} 
                                                    alt="Learning Drawing" 
                                                    className="max-h-48 rounded shadow-sm border border-gray-200" 
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Penutup */}
                            <section className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-300">{__('RMD_CLOSING_SECTION_TITLE')}</h4>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                    {__('RMD_CLOSING_SECTION_TEXT_1')}
                                </p>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                                    {__('RMD_CLOSING_SECTION_TEXT_2')}
                                </p>
                                <p className="text-center font-bold text-lg text-purple-900 dark:text-purple-200 mt-6">
                                    {__('RMD_CLOSING_SECTION_CONGRATS')}
                                </p>
                            </section>

                            {/* Proyek Rame-Rame */}
                            <section className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-orange-800 dark:text-orange-300">{__('RMD_GROUP_PROJECT_TITLE')}</h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                    <li><span className="font-semibold">{__('RMD_GROUP_PROJECT_TASK_1')}</span></li>
                                    <li>
                                        <span className="font-semibold">{__('RMD_GROUP_PROJECT_TASK_2_LABEL')}</span> {__('RMD_GROUP_PROJECT_TASK_2_DESC')}
                                    </li>
                                </ul>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('rmd.gods-purpose')}
                                    className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    &laquo; {__('RMD_BACK_BUTTON')}
                                </Link>

                                <div className="flex gap-4">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="transition ease-in-out"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600 dark:text-gray-400 self-center">{__('RMD_SAVED_MESSAGE')}</p>
                                    </Transition>

                                    <PrimaryButton disabled={processing}>
                                        {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                    </PrimaryButton>

                                    <Link href={route('rmd.true-success')}>
                                        <div className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ml-2">
                                            {__('RMD_NEXT_TRUE_SUCCESS')} &raquo;
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
