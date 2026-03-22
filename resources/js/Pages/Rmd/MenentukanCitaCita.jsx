import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { __ } from '@/Utils/lang';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

// ─── Profesi per Gaya Belajar ─────────────────────────────────────────────
const LEARNING_STYLE_PROFESSIONS = {
    visual_professions: [
        {
            category: 'Seni & Desain Kreatif',
            items: [
                'Desainer Grafis / UI/UX Designer',
                'Animator / Motion Graphic Designer',
                'Fotografer / Videografer',
                'Ilustrator / Seniman Digital',
                'Fashion Desainer / Stylist',
                'Sutradara Film / Sinematografer',
            ],
        },
        {
            category: 'Arsitektur & Teknik Visual',
            items: [
                'Arsitek / Arsitektur Lansekap',
                'Interior Desainer',
                'Drafter / CAD Engineer',
                'Urban Planner / Perencana Kota',
            ],
        },
        {
            category: 'Sains & Data Visual',
            items: [
                'Analis Data / Data Visualization Specialist',
                'Ahli Radiologi / Sonografer Medis',
                'Kartografer / GIS Specialist',
                'Astronom / Astrofisikawan',
            ],
        },
        {
            category: 'Media & Komunikasi Visual',
            items: [
                'Art Director / Creative Director',
                'Game Designer / Game Developer',
                'Kurator Museum / Sejarawan Seni',
                'Jurnalis Foto / Jurnalis Visual',
            ],
        },
    ],
    auditory_professions: [
        {
            category: 'Pendidikan & Komunikasi',
            items: [
                'Guru / Dosen / Pengajar',
                'Penyiar Radio / Podcaster',
                'Presenter TV / MC / Host',
                'Jurnalis / Reporter Berita',
            ],
        },
        {
            category: 'Hukum & Konseling',
            items: [
                'Pengacara / Advokat / Jaksa',
                'Konselor Psikologi / Terapis Bicara',
                'Penerjemah Lisan / Interpreter',
                'Mediator / Negosiator Konflik',
            ],
        },
        {
            category: 'Seni & Musik',
            items: [
                'Musisi / Penyanyi Profesional',
                'Aktor / Pengisi Suara (Voice Actor)',
                'Komposer / Produser Musik',
                'Guru Musik / Terapis Musik',
            ],
        },
        {
            category: 'Bisnis & Pelayanan',
            items: [
                'Sales Manager / Marketing Komunikasi',
                'Public Speaker / Motivator',
                'Customer Experience Manager',
                'Konsultan SDM / Pelatih Korporat',
            ],
        },
    ],
    kinesthetic_professions_style: [
        {
            category: 'Olahraga & Seni Gerak',
            items: [
                'Atlet Profesional / Pelatih Olahraga',
                'Penari / Koreografer',
                'Personal Trainer / Instruktur Fitness',
                'Instruktur Yoga / Pilates / Martial Arts',
            ],
        },
        {
            category: 'Kesehatan & Medis',
            items: [
                'Dokter Umum / Dokter Bedah',
                'Fisioterapis / Terapis Okupasi',
                'Perawat / Bidan Profesional',
                'Dokter Gigi / Teknisi Gigi',
            ],
        },
        {
            category: 'Teknik & Rekayasa Praktis',
            items: [
                'Mekanik / Teknisi Otomotif',
                'Tukang Kayu / Pengrajin (Craftsman)',
                'Teknisi Listrik / Elektronik',
                'Insinyur Konstruksi / Teknisi Lapangan',
            ],
        },
        {
            category: 'Pangan, Alam & Keselamatan',
            items: [
                'Chef / Koki Profesional / Pastry Chef',
                'Petani Modern / Agripreneur',
                'Ahli Konservasi Alam / Ranger',
                'Petugas Pemadam Kebakaran / Tim SAR',
            ],
        },
    ],
};

const getParsedItems = (str) => {
    if (!str) return new Set();
    return new Set(str.split(',').map(s => s.trim()).filter(Boolean));
};

const toggleItem = (currentStr, item) => {
    const items = getParsedItems(currentStr);
    if (items.has(item)) { items.delete(item); } else { items.add(item); }
    return Array.from(items).join(', ');
};

const addCustomItem = (currentStr, customItem) => {
    if (!customItem.trim()) return currentStr;
    const items = getParsedItems(currentStr);
    items.add(customItem.trim());
    return Array.from(items).join(', ');
};
// ──────────────────────────────────────────────────────────────────────────────

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

    const [customText, setCustomText] = useState({
        visual_professions: '',
        auditory_professions: '',
        kinesthetic_professions_style: '',
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

            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
                {/* RMD Background */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: "url('/images/rmd-backgrounds/latar-_10_.svg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        opacity: 0.08,
                    }}
                />
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8 relative z-10">
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
                                            <th className="py-4 px-6 border-r border-white/20 w-1/4 text-center font-bold">{__('RMD_CH4_TABLE_LEARNING_STYLE')}</th>
                                            <th className="py-4 px-6 text-center font-bold">{__('RMD_CH4_TABLE_SUITABLE_PROFESSION')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-orange-400 dark:divide-orange-700 text-gray-800 dark:text-gray-200">
                                        {[
                                            { label: __('RMD_CH4_VISUAL'), id: 'visual_professions', icon: '👁️', accentBg: 'bg-orange-50 dark:bg-orange-900/10', accentBorder: 'border-orange-200 dark:border-orange-800', accentText: 'text-orange-700 dark:text-orange-300', checkColor: 'accent-orange-500' },
                                            { label: __('RMD_CH4_AUDITORY_LABEL'), id: 'auditory_professions', icon: '👂', accentBg: 'bg-red-50 dark:bg-red-900/10', accentBorder: 'border-red-200 dark:border-red-800', accentText: 'text-red-700 dark:text-red-300', checkColor: 'accent-red-500' },
                                            { label: __('RMD_CH4_KINESTHETIC'), id: 'kinesthetic_professions_style', icon: '👆', accentBg: 'bg-green-50 dark:bg-green-900/10', accentBorder: 'border-green-200 dark:border-green-800', accentText: 'text-green-700 dark:text-green-300', checkColor: 'accent-green-500' },
                                        ].map((item) => {
                                            const checked = getParsedItems(data[item.id]);
                                            const categories = LEARNING_STYLE_PROFESSIONS[item.id] || [];
                                            const allPredefined = categories.flatMap(c => c.items);
                                            const customItems = Array.from(checked).filter(i => !allPredefined.includes(i));
                                            return (
                                                <tr key={item.id}>
                                                    {/* Label column */}
                                                    <td className={`py-6 px-4 border-r-2 border-orange-400 dark:border-orange-700 text-center align-top bg-gray-50 dark:bg-gray-800/50`}>
                                                        <div className="flex flex-col items-center gap-2 sticky top-4">
                                                            <span className="text-4xl">{item.icon}</span>
                                                            <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                                                            {checked.size > 0 && (
                                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.accentBg} ${item.accentText} border ${item.accentBorder}`}>
                                                                    {checked.size} dipilih
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Checkbox column */}
                                                    <td className="p-4 align-top">
                                                        <div className="space-y-4">
                                                            {categories.map(cat => (
                                                                <div key={cat.category}>
                                                                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                        <span className={`inline-block w-6 h-0.5 rounded ${item.accentBg.replace('bg-', 'bg-').replace('/10', '')} bg-current opacity-50`} />
                                                                        {cat.category}
                                                                    </p>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                                        {cat.items.map(prof => (
                                                                            <label
                                                                                key={prof}
                                                                                className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-3 py-2 transition-all select-none ${
                                                                                    checked.has(prof)
                                                                                        ? `${item.accentBg} border ${item.accentBorder}`
                                                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40 border border-transparent'
                                                                                }`}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className={`w-4 h-4 rounded shrink-0 ${item.checkColor}`}
                                                                                    checked={checked.has(prof)}
                                                                                    onChange={() => setData(item.id, toggleItem(data[item.id], prof))}
                                                                                />
                                                                                <span className={`text-sm leading-snug ${checked.has(prof) ? `${item.accentText} font-medium` : 'text-gray-700 dark:text-gray-300'}`}>
                                                                                    {prof}
                                                                                </span>
                                                                            </label>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {/* Custom items already added */}
                                                            {customItems.length > 0 && (
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Profesi Lainnya (Ditambahkan)</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {customItems.map(ci => (
                                                                            <span key={ci} className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700">
                                                                                {ci}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setData(item.id, toggleItem(data[item.id], ci))}
                                                                                    className="ml-1 text-blue-400 hover:text-red-500 font-bold leading-none"
                                                                                    title="Hapus"
                                                                                >×</button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Add custom profession */}
                                                            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                <input
                                                                    type="text"
                                                                    value={customText[item.id]}
                                                                    onChange={e => setCustomText(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            if (customText[item.id].trim()) {
                                                                                setData(item.id, addCustomItem(data[item.id], customText[item.id]));
                                                                                setCustomText(prev => ({ ...prev, [item.id]: '' }));
                                                                            }
                                                                        }
                                                                    }}
                                                                    className="flex-1 text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 dark:text-gray-200"
                                                                    placeholder="Tambah profesi lainnya…"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (customText[item.id].trim()) {
                                                                            setData(item.id, addCustomItem(data[item.id], customText[item.id]));
                                                                            setCustomText(prev => ({ ...prev, [item.id]: '' }));
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-semibold transition-colors shrink-0"
                                                                >
                                                                    + Tambah
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* ── Pilih 3 Favorit dari centangan di atas ── */}
                            {(() => {
                                const SOURCES = [
                                    { id: 'visual_professions',         label: __('RMD_CH4_VISUAL'),        icon: '👁️', chipBase: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700' },
                                    { id: 'auditory_professions',       label: __('RMD_CH4_AUDITORY_LABEL'),icon: '👂', chipBase: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700' },
                                    { id: 'kinesthetic_professions_style', label: __('RMD_CH4_KINESTHETIC'), icon: '👆', chipBase: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700' },
                                ];

                                const interested = getParsedItems(data.interested_professions_from_style);

                                const toggleInterested = (prof) => {
                                    const set = getParsedItems(data.interested_professions_from_style);
                                    if (set.has(prof)) { set.delete(prof); } else { set.add(prof); }
                                    setData('interested_professions_from_style', Array.from(set).join(', '));
                                };

                                const allCheckedCount = SOURCES.reduce((n, s) => n + getParsedItems(data[s.id]).size, 0);

                                return (
                                    <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-400">
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <p className="text-gray-700 dark:text-gray-300 italic text-sm">
                                                {__('RMD_CH4_NOTE_MARK_THREE')}
                                            </p>
                                            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${
                                                interested.size > 0
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                                            }`}>
                                                {interested.size} dipilih
                                            </span>
                                        </div>

                                        {allCheckedCount === 0 ? (
                                            <div className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm italic">
                                                Belum ada profesi yang dicentang di tabel di atas. Silakan pilih profesi yang sesuai terlebih dahulu.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {SOURCES.map(src => {
                                                    const profs = Array.from(getParsedItems(data[src.id]));
                                                    if (profs.length === 0) return null;
                                                    return (
                                                        <div key={src.id}>
                                                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                                                                <span>{src.icon}</span> {src.label}
                                                            </p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {profs.map(prof => (
                                                                    <button
                                                                        key={prof}
                                                                        type="button"
                                                                        onClick={() => toggleInterested(prof)}
                                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                                                            interested.has(prof)
                                                                                ? 'bg-blue-500 text-white border-blue-600 shadow-md scale-[1.03]'
                                                                                : `${src.chipBase} hover:opacity-80`
                                                                        }`}
                                                                    >
                                                                        {interested.has(prof) && <span className="text-xs font-black">✓</span>}
                                                                        {prof}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                            {/* ─────────────────────────────────────────────── */}
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
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
                                                        className="w-full min-h-[96px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
                                                        value={data[item.ability]}
                                                        onChange={e => setData(item.ability, e.target.value)}
                                                        placeholder={__('RMD_CH4_PLACEHOLDER_ABILITY')}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <textarea
                                                        className="w-full min-h-[96px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
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
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
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
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-orange-400 min-h-[128px] resize"
                                    value={data.additional_considerations}
                                    onChange={e => setData('additional_considerations', e.target.value)}
                                    placeholder={__('RMD_CH4_PLACEHOLDER_DISCUSS')}
                                />
                            </div>
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
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
                                                        className="w-full min-h-[160px] border-none focus:ring-0 bg-transparent resize dark:text-gray-200"
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
                            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wider disabled:opacity-50">
                                    {processing ? __('RMD_SAVING') : __('RMD_SAVE_ANSWER_BUTTON')}
                                </button>
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

                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('rmd.chapters')}
                                    className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-400 text-cyan-500 rounded-full font-bold hover:bg-cyan-50 transition-colors shadow-sm"
                                >
                                    {__('RMD_CH4_BTN_TOC')}
                                </Link>

                                <Link
                                    href={route('rmd.career-exploration-p2')}
                                    className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                                >
                                    {__('RMD_CH4_BTN_NEXT')}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
