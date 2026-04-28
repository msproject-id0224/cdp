import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import BibleVerseModal, { VerseTag } from '@/Components/BibleVerseModal';

const BIBLE_VERSES = {
    luke: {
        reference: 'Lukas 2:52',
        text: 'Dan Yesus makin bertambah besar dan bertambah hikmat-Nya dan besar-Nya, dan makin dikasihi oleh Allah dan manusia.',
        translation: 'TB',
    },
    philippians: {
        reference: 'Filipi 2:5-10',
        text: 'Hendaklah kamu dalam hidupmu bersama, menaruh pikiran dan perasaan yang terdapat juga dalam Kristus Yesus, yang walaupun dalam rupa Allah, tidak menganggap kesetaraan dengan Allah itu sebagai milik yang harus dipertahankan, melainkan telah mengosongkan diri-Nya sendiri, dan mengambil rupa seorang hamba, dan menjadi sama dengan manusia. Dan dalam keadaan sebagai manusia, Ia telah merendahkan diri-Nya dan taat sampai mati, bahkan sampai mati di kayu salib. Itulah sebabnya Allah sangat meninggikan Dia dan mengaruniakan kepada-Nya nama di atas segala nama, supaya dalam nama Yesus bertekuk lutut segala yang ada di langit dan yang ada di atas bumi dan yang ada di bawah bumi,',
        translation: 'TB',
    },
    matthew: {
        reference: 'Matius 3:17',
        text: 'lalu terdengarlah suara dari sorga yang mengatakan: "Inilah Anak-Ku yang Kukasihi, kepada-Nyalah Aku berkenan."',
        translation: 'TB',
    },
    philippians_2_9: {
        reference: 'Filipi 2:9',
        text: 'Itulah sebabnya Allah sangat meninggikan Dia dan mengaruniakan kepada-Nya nama di atas segala nama,',
        translation: 'TB',
    },
};

export default function TrueSuccess({ auth, trueSuccess }) {
    const [activeVerse, setActiveVerse] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        successful_life_definition: trueSuccess?.successful_life_definition || '',
        general_success_measure: trueSuccess?.general_success_measure || '',
        luke_2_52_growth: trueSuccess?.luke_2_52_growth || '',
        philippians_2_5_10_actions: trueSuccess?.philippians_2_5_10_actions || '',
        jesus_success_vs_society: trueSuccess?.jesus_success_vs_society || '',
        god_opinion_on_jesus: trueSuccess?.god_opinion_on_jesus || '',
        new_learning_text: trueSuccess?.new_learning_text || '',
        new_learning_image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('rmd.true-success.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('RMD_TRUE_SUCCESS_TITLE')}</h2>}
        >
            <Head title={__('RMD_TRUE_SUCCESS_TITLE')} />

            <BibleVerseModal
                verse={activeVerse ? BIBLE_VERSES[activeVerse] : null}
                onClose={() => setActiveVerse(null)}
            />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
                {/* RMD Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/images/rmd-backgrounds/latar-_6_.svg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        opacity: 0.08,
                    }}
                />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <form onSubmit={submit} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 space-y-8">
                            
                            {/* Header Section */}
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{__('RMD_TRUE_SUCCESS_MAIN_TITLE')}</h3>
                                <div className="w-24 h-1 bg-indigo-500 mx-auto rounded"></div>
                            </div>

                            {/* Pembuka */}
                            <section className="prose dark:prose-invert max-w-none">
                                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">{__('RMD_OPENING_TITLE')}</h4>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    {__('RMD_TRUE_SUCCESS_INTRO_TASK')}
                                </p>
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{__('RMD_TRUE_SUCCESS_WHAT_IS')}</h5>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                    {__('RMD_TRUE_SUCCESS_DESC_1')}
                                </p>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                    {__('RMD_TRUE_SUCCESS_DESC_2')}
                                </p>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                    {__('RMD_TRUE_SUCCESS_DESC_3')}
                                </p>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                                    {__('RMD_TRUE_SUCCESS_DESC_4')}
                                </p>

                                <div className="space-y-6 mt-6">
                                    <div>
                                        <InputLabel htmlFor="successful_life_definition" value={__('RMD_TRUE_SUCCESS_DEFINITION_LABEL')} />
                                        <TextArea
                                            id="successful_life_definition"
                                            value={data.successful_life_definition}
                                            onChange={(e) => setData('successful_life_definition', e.target.value)}
                                            placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                        />
                                        <InputError message={errors.successful_life_definition} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="general_success_measure" value={__('RMD_TRUE_SUCCESS_MEASURE_LABEL')} />
                                        <TextArea
                                            id="general_success_measure"
                                            value={data.general_success_measure}
                                            onChange={(e) => setData('general_success_measure', e.target.value)}
                                            placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                        />
                                        <InputError message={errors.general_success_measure} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                        {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                    </button>
                                </div>
                            </section>

                            {/* Apa kata Alkitab */}
                            <section className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-indigo-800 dark:text-indigo-300">{__('RMD_BIBLE_SAYS_TITLE')}</h4>
                                <div className="mb-4 flex flex-wrap items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span>{__('RMD_TRUE_SUCCESS_BIBLE_INTRO')}</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <VerseTag label="Lukas 2:52" onClick={() => setActiveVerse('luke')} />
                                    <VerseTag label="Filipi 2:5-10" onClick={() => setActiveVerse('philippians')} />
                                    <VerseTag label="Matius 3:17" onClick={() => setActiveVerse('matthew')} />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <InputLabel htmlFor="luke_2_52_growth" value={__('RMD_TRUE_SUCCESS_LUKE_QUESTION')} />
                                            <VerseTag label="Lukas 2:52" onClick={() => setActiveVerse('luke')} />
                                        </div>
                                        <TextArea
                                            id="luke_2_52_growth"
                                            value={data.luke_2_52_growth}
                                            onChange={(e) => setData('luke_2_52_growth', e.target.value)}
                                        />
                                        <InputError message={errors.luke_2_52_growth} className="mt-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <InputLabel htmlFor="philippians_2_5_10_actions" value={__('RMD_TRUE_SUCCESS_PHILIPPIANS_QUESTION')} />
                                            <VerseTag label="Filipi 2:5-10" onClick={() => setActiveVerse('philippians')} />
                                        </div>
                                        <TextArea
                                            id="philippians_2_5_10_actions"
                                            value={data.philippians_2_5_10_actions}
                                            onChange={(e) => setData('philippians_2_5_10_actions', e.target.value)}
                                        />
                                        <InputError message={errors.philippians_2_5_10_actions} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="jesus_success_vs_society" value={__('RMD_TRUE_SUCCESS_JESUS_SUCCESS_QUESTION')} />
                                        <TextArea
                                            id="jesus_success_vs_society"
                                            value={data.jesus_success_vs_society}
                                            onChange={(e) => setData('jesus_success_vs_society', e.target.value)}
                                        />
                                        <InputError message={errors.jesus_success_vs_society} className="mt-2" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <InputLabel htmlFor="god_opinion_on_jesus" value={__('RMD_TRUE_SUCCESS_GOD_OPINION_QUESTION')} />
                                            <VerseTag label="Matius 3:17" onClick={() => setActiveVerse('matthew')} />
                                            <VerseTag label="Filipi 2:9" onClick={() => setActiveVerse('philippians_2_9')} />
                                        </div>
                                        <TextArea
                                            id="god_opinion_on_jesus"
                                            value={data.god_opinion_on_jesus}
                                            onChange={(e) => setData('god_opinion_on_jesus', e.target.value)}
                                        />
                                        <InputError message={errors.god_opinion_on_jesus} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                        {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                    </button>
                                </div>
                            </section>

                            {/* Refleksi / Gambar */}
                            <section className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-300">{__('RMD_REFLECTION_TITLE')}</h4>
                                <div className="space-y-4">
                                    <div>
                                        <InputLabel htmlFor="new_learning_text" value={__('RMD_TRUE_SUCCESS_REFLECTION_LABEL')} />
                                        <TextArea
                                            id="new_learning_text"
                                            value={data.new_learning_text}
                                            onChange={(e) => setData('new_learning_text', e.target.value)}
                                            placeholder={__('RMD_TABLE_ANSWER_PLACEHOLDER')}
                                        />
                                        <InputError message={errors.new_learning_text} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value={__('RMD_UPLOAD_IMAGE_OPTIONAL')} />
                                        <input
                                            type="file"
                                            onChange={(e) => setData('new_learning_image', e.target.files[0])}
                                            className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100"
                                            accept="image/*"
                                        />
                                        {trueSuccess?.new_learning_image_path && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-1">{__('RMD_CURRENT_IMAGE')}</p>
                                                <img
                                                    src={`/storage/${trueSuccess.new_learning_image_path}`}
                                                    alt="New Learning Drawing"
                                                    className="max-h-48 rounded shadow-sm border border-gray-200"
                                                />
                                            </div>
                                        )}
                                        <InputError message={errors.new_learning_image} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                        {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                    </button>
                                </div>
                            </section>

                            {/* Penutup */}
                            <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-green-800 dark:text-green-300">{__('RMD_CLOSING_TITLE')}</h4>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                                    {__('RMD_TRUE_SUCCESS_CLOSING_DESC')}
                                </p>
                                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600">
                                    <p className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">{__('RMD_CONGRATS_LEARNED')}</p>
                                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                        <li>{__('RMD_TRUE_SUCCESS_LEARNED_1')}</li>
                                        <li>{__('RMD_TRUE_SUCCESS_LEARNED_2')}</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Proyek Rame-Rame */}
                            <section className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 p-6 rounded-lg">
                                <h4 className="text-xl font-bold mb-4 text-orange-800 dark:text-orange-300">{__('RMD_GROUP_PROJECT_TITLE')}</h4>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                                    <li><span className="font-semibold">{__('RMD_TRUE_SUCCESS_PROJECT_TASK_1')}</span></li>
                                    <li>
                                        {__('RMD_TRUE_SUCCESS_PROJECT_TASK_2')}
                                    </li>
                                </ul>
                                <div className="text-center italic font-serif text-xl text-orange-900 dark:text-orange-200 p-4 border-t-2 border-orange-200 dark:border-orange-700">
                                    {__('RMD_TRUE_SUCCESS_QUOTE')}
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route('rmd.what-the-bible-says')}
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

                                    <Link href={route('rmd.the-only-one')}>
                                        <div className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ml-2">
                                            {__('RMD_NEXT_THE_ONLY_ONE')} &raquo;
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
