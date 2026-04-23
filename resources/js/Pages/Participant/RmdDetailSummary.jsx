import { useState } from 'react';
import { __ } from '@/Utils/lang';

// ─── helpers ────────────────────────────────────────────────────────────────

const val = (v) => (v !== null && v !== undefined && v !== '') ? v : '-';

// Format ISO / date string → "15 Jan 2024"
const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    if (isNaN(d)) return v;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Format ISO / datetime string → "15 Jan 2024 14:30"
const fmtDatetime = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    if (isNaN(d)) return v;
    const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const hh   = String(d.getHours()).padStart(2, '0');
    const mm   = String(d.getMinutes()).padStart(2, '0');
    // Only append time when it isn't midnight (pure date values)
    if (hh === '00' && mm === '00') return date;
    return `${date} ${hh}:${mm}`;
};

const countChecked = (arr) => {
    if (!arr) return 0;
    if (Array.isArray(arr)) return arr.filter(Boolean).length;
    if (typeof arr === 'object') return Object.values(arr).filter(Boolean).length;
    return 0;
};

const totalItems = (arr) => {
    if (!arr) return 0;
    if (Array.isArray(arr)) return arr.length;
    if (typeof arr === 'object') return Object.keys(arr).length;
    return 0;
};

// Labelled text row
const Row = ({ label, value, wide = false }) => (
    <div className={`py-2 ${wide ? '' : 'sm:grid sm:grid-cols-3 sm:gap-4'}`}>
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</dt>
        <dd className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${wide ? '' : 'sm:col-span-2'}`}>
            {val(value)}
        </dd>
    </div>
);

// Score badge for checklist intelligence
const ScoreBadge = ({ checked, total }) => {
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    const color = pct >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        : pct >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    return (
        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
            {checked}/{total} ({pct}%)
        </span>
    );
};

// JSON table renderer for career_decision_matrix and swot_analysis_data
const JsonTable = ({ data }) => {
    if (!data) return <span className="text-sm text-gray-400">-</span>;

    // SWOT: { strengths, weaknesses, opportunities, threats }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
        const swotKeys = ['strengths', 'weaknesses', 'opportunities', 'threats'];
        const isSwot = swotKeys.some(k => k in data);
        if (isSwot) {
            const labels = { strengths: 'Strengths', weaknesses: 'Weaknesses', opportunities: 'Opportunities', threats: 'Threats' };
            return (
                <div className="grid grid-cols-2 gap-2 mt-1">
                    {swotKeys.map(k => (
                        <div key={k} className="border rounded p-2 dark:border-gray-600">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{labels[k]}</div>
                            {Array.isArray(data[k]) ? (
                                <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-0.5">
                                    {data[k].length > 0 ? data[k].map((item, i) => <li key={i}>{item}</li>) : <li className="text-gray-400">-</li>}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-700 dark:text-gray-300">{data[k] || '-'}</p>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // Generic object
        return (
            <div className="space-y-1 mt-1">
                {Object.entries(data).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-xs">
                        <span className="font-medium text-gray-500 dark:text-gray-400 min-w-32">{k}:</span>
                        <span className="text-gray-700 dark:text-gray-300">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                    </div>
                ))}
            </div>
        );
    }

    // Array of rows (career_decision_matrix)
    if (Array.isArray(data) && data.length > 0) {
        const keys = Object.keys(data[0] || {});
        return (
            <div className="overflow-x-auto mt-1">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            {keys.map(k => (
                                <th key={k} className="px-2 py-1 border dark:border-gray-600 text-left font-semibold text-gray-600 dark:text-gray-300">
                                    {k}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                                {keys.map(k => (
                                    <td key={k} className="px-2 py-1 border dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                        {typeof row[k] === 'boolean' ? (row[k] ? '✓' : '✗') : (row[k] ?? '-')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return <span className="text-sm text-gray-400">-</span>;
};

// Accordion item wrapper
const Accordion = ({ id, title, icon, filled, progress, open, onToggle, children }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <button
            onClick={() => onToggle(id)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg shrink-0">{icon}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{title}</span>
                {filled ? (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shrink-0">
                        {progress}%
                    </span>
                ) : (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 shrink-0">
                        {__('Belum diisi')}
                    </span>
                )}
            </div>
            <svg
                className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {open && (
            <div className="px-4 py-4 bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filled ? children : (
                    <p className="text-sm text-gray-400 italic py-2">{__('Belum diisi oleh partisipan.')}</p>
                )}
            </div>
        )}
    </div>
);

// Section header inside accordion
const Section = ({ title, children }) => (
    <div className="py-3 first:pt-0">
        <h5 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">{title}</h5>
        <dl className="space-y-1">{children}</dl>
    </div>
);

// ─── main component ──────────────────────────────────────────────────────────

export default function RmdDetailSummary({ rmdDetail, rmdProgress }) {
    const [openModule, setOpenModule] = useState(null);
    const toggle = (key) => setOpenModule(prev => prev === key ? null : key);

    // Helper: find progress % for a module name
    const modPct = (name) => {
        const m = rmdProgress?.modules?.find(m => m.name === name);
        return m ? m.percentage : 0;
    };

    const {
        profile, bible_reflection, true_success, the_only_one,
        multiple_intelligence, socio_emotional, career_exploration,
        career_exploration_p2, dream_island
    } = rmdDetail || {};

    // Intelligence names with their field keys
    const intelligences = [
        { label: 'Linguistik',        field: 'linguistic_checklist' },
        { label: 'Logis-Matematis',   field: 'logical_mathematical_checklist' },
        { label: 'Visual-Spasial',    field: 'visual_spatial_checklist' },
        { label: 'Kinestetik',        field: 'kinesthetic_checklist' },
        { label: 'Musikal',           field: 'musical_checklist' },
        { label: 'Interpersonal',     field: 'interpersonal_checklist' },
        { label: 'Intrapersonal',     field: 'intrapersonal_checklist' },
        { label: 'Naturalis',         field: 'naturalist_checklist' },
        { label: 'Eksistensial',      field: 'existential_checklist' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {__('Detail Isian RMD')}
            </h4>

            <div className="space-y-2">

                {/* 1. Profil RMD */}
                <Accordion
                    id="profile" title="Profil RMD" icon="📋"
                    filled={!!profile} progress={modPct('Profil RMD')}
                    open={openModule === 'profile'} onToggle={toggle}
                >
                    <Section title="Informasi Profil">
                        <Row label="Tanggal Rencana Lulus"      value={fmtDate(profile?.graduation_plan_date)} />
                        <Row label="Pertama Kali Mengisi"       value={fmtDatetime(profile?.first_filled_at)} />
                        <Row label="Usia Saat Mengisi"          value={profile?.first_filled_age} />
                        <Row label="Pendidikan Saat Mengisi"    value={profile?.first_filled_education} />
                        <Row label="Institusi Pendidikan"       value={profile?.first_filled_education_institution} />
                    </Section>
                </Accordion>

                {/* 2. Refleksi Alkitab */}
                <Accordion
                    id="bible" title="Refleksi Alkitab" icon="📖"
                    filled={!!bible_reflection} progress={modPct('Refleksi Alkitab')}
                    open={openModule === 'bible'} onToggle={toggle}
                >
                    <Section title="Yeremia 29:11">
                        <Row label="Siapa yang mengetahui rencana?"  value={bible_reflection?.jeremiah_29_11_who_knows} wide />
                        <Row label="Rencana seperti apa?"            value={bible_reflection?.jeremiah_29_11_plans} wide />
                    </Section>
                    <Section title="Efesus 2:10">
                        <Row label="Dibuat oleh siapa?"              value={bible_reflection?.ephesians_2_10_made_by} wide />
                        <Row label="Untuk tujuan apa?"               value={bible_reflection?.ephesians_2_10_purpose} wide />
                        <Row label="Allah menghendaki kita?"         value={bible_reflection?.ephesians_2_10_god_wants} wide />
                    </Section>
                    <Section title="Kejadian 1:26-28">
                        <Row label="Gambaran / Rupa Allah"           value={bible_reflection?.genesis_1_26_28_image} wide />
                        <Row label="Tujuan penciptaan manusia"       value={bible_reflection?.genesis_1_26_28_purpose} wide />
                    </Section>
                    <Section title="Ringkasan">
                        <Row label="Poin 1"  value={bible_reflection?.summary_point_1} wide />
                        <Row label="Poin 2"  value={bible_reflection?.summary_point_2} wide />
                    </Section>
                    <Section title="Ayat Favorit">
                        <Row label="Ayat"    value={bible_reflection?.favorite_verse} wide />
                        <Row label="Alasan"  value={bible_reflection?.reason_favorite_verse} wide />
                    </Section>
                    <Section title="Kepemimpinan (checklist)">
                        {[1,2,3,4,5].map(n => (
                            bible_reflection?.[`leadership_c${n}`] !== undefined && (
                                <div key={n} className="flex items-center gap-2 py-0.5">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${bible_reflection[`leadership_c${n}`] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        {bible_reflection[`leadership_c${n}`] ? '✓' : '–'}
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Kepemimpinan {n}</span>
                                </div>
                            )
                        ))}
                    </Section>
                    <Section title="Refleksi Bab">
                        <Row label="Pembelajaran" value={bible_reflection?.chapter_learning_text} wide />
                    </Section>
                </Accordion>

                {/* 3. Sukses Sejati */}
                <Accordion
                    id="true_success" title="Sukses Sejati" icon="🏆"
                    filled={!!true_success} progress={modPct('Sukses Sejati')}
                    open={openModule === 'true_success'} onToggle={toggle}
                >
                    <Section title="Definisi & Ukuran Sukses">
                        <Row label="Definisi hidup sukses"           value={true_success?.successful_life_definition} wide />
                        <Row label="Ukuran sukses umum"              value={true_success?.general_success_measure} wide />
                    </Section>
                    <Section title="Perspektif Alkitab">
                        <Row label="Lukas 2:52 – Pertumbuhan"        value={true_success?.luke_2_52_growth} wide />
                        <Row label="Filipi 2:5-10 – Tindakan"        value={true_success?.philippians_2_5_10_actions} wide />
                        <Row label="Sukses Yesus vs Dunia"           value={true_success?.jesus_success_vs_society} wide />
                        <Row label="Pendapat Allah tentang Yesus"    value={true_success?.god_opinion_on_jesus} wide />
                    </Section>
                    <Section title="Refleksi">
                        <Row label="Pembelajaran baru"               value={true_success?.new_learning_text} wide />
                    </Section>
                </Accordion>

                {/* 4. The Only One */}
                <Accordion
                    id="only_one" title="The Only One" icon="⭐"
                    filled={!!the_only_one} progress={modPct('The Only One')}
                    open={openModule === 'only_one'} onToggle={toggle}
                >
                    <Section title="Keunikan Diri">
                        <Row label="Sifat/Ciri Unik"                 value={the_only_one?.unique_traits} wide />
                        <Row label="Tingkat Pendidikan Saat Ini"     value={the_only_one?.current_education_level} />
                    </Section>
                    <Section title="Prestasi Akademik">
                        <Row label="Mata pelajaran favorit"          value={the_only_one?.favorite_subject} />
                        <Row label="Alasan favorit"                  value={the_only_one?.favorite_subject_reason} wide />
                        <Row label="Mata pelajaran kurang diminati"  value={the_only_one?.least_favorite_subject} />
                        <Row label="Alasan kurang diminati"          value={the_only_one?.least_favorite_subject_reason} wide />
                        <Row label="Nilai tertinggi – Mapel"         value={the_only_one?.highest_score_subject} />
                        <Row label="Nilai tertinggi – Nilai"         value={the_only_one?.highest_score_value} />
                        <Row label="Nilai terendah – Mapel"          value={the_only_one?.lowest_score_subject} />
                        <Row label="Nilai terendah – Nilai"          value={the_only_one?.lowest_score_value} />
                    </Section>
                    <Section title="Gaya Belajar (Checklist)">
                        {[
                            { label: 'Visual',        field: 'visual_checklist' },
                            { label: 'Auditori',      field: 'auditory_checklist' },
                            { label: 'Kinestetik',    field: 'kinesthetic_checklist' },
                        ].map(({ label, field }) => {
                            const arr = the_only_one?.[field];
                            const checked = countChecked(arr);
                            const total = totalItems(arr);
                            return (
                                <div key={field} className="flex items-center justify-between py-0.5">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                    <ScoreBadge checked={checked} total={total} />
                                </div>
                            );
                        })}
                    </Section>
                    <Section title="Refleksi">
                        <Row label="Hal yang dipelajari"             value={the_only_one?.learned_aspects} wide />
                        <Row label="Hal yang perlu ditingkatkan"     value={the_only_one?.aspects_to_improve} wide />
                    </Section>
                </Accordion>

                {/* 5. Kecerdasan Majemuk */}
                <Accordion
                    id="mi" title="Kecerdasan Majemuk" icon="🧠"
                    filled={!!multiple_intelligence} progress={modPct('Kecerdasan Majemuk')}
                    open={openModule === 'mi'} onToggle={toggle}
                >
                    <Section title="Skor per Kecerdasan">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            {intelligences.map(({ label, field }) => {
                                const arr = multiple_intelligence?.[field];
                                const checked = countChecked(arr);
                                const total = totalItems(arr);
                                return (
                                    <div key={field} className="flex items-center justify-between py-1 border-b dark:border-gray-700 last:border-0">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                                        <ScoreBadge checked={checked} total={total} />
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                    <Section title="Refleksi">
                        <Row label="Pembelajaran baru"               value={multiple_intelligence?.reflection_new_learning} wide />
                        <Row label="Rencana ke depan"                value={multiple_intelligence?.reflection_plan} wide />
                    </Section>
                </Accordion>

                {/* 6. Sosial Emosional */}
                <Accordion
                    id="socio" title="Sosial Emosional" icon="💬"
                    filled={!!socio_emotional} progress={modPct('Sosial Emosional')}
                    open={openModule === 'socio'} onToggle={toggle}
                >
                    <Section title="Gaya Belajar">
                        <Row label="Praktik gaya belajar"            value={socio_emotional?.learning_style_practice} wide />
                        <Row label="Dampak gaya belajar"             value={socio_emotional?.learning_style_impact} wide />
                    </Section>
                    <Section title="Keluarga">
                        <Row label="Urutan kelahiran / Saudara"      value={socio_emotional?.birth_order_siblings} />
                        <Row label="Pekerjaan orang tua"             value={socio_emotional?.parents_occupation} />
                        <Row label="Tanggung jawab di rumah"         value={socio_emotional?.home_responsibilities} wide />
                        <Row label="Keunikan keluarga"               value={socio_emotional?.family_uniqueness} wide />
                    </Section>
                    <Section title="Aktivitas">
                        <Row label="Kegiatan ekstrakurikuler"        value={socio_emotional?.extracurricular_activities} wide />
                        <Row label="Kegiatan PPA"                    value={socio_emotional?.ppa_activities} wide />
                        <Row label="Hobi"                            value={socio_emotional?.hobbies} wide />
                    </Section>
                    <Section title="Kekuatan & Kelemahan">
                        <Row label="Kekuatan"                        value={socio_emotional?.strengths} wide />
                        <Row label="Kelemahan"                       value={socio_emotional?.weaknesses} wide />
                        <Row label="Hal yang dipelajari"             value={socio_emotional?.reflection_learned} wide />
                        <Row label="Hal yang perlu ditingkatkan"     value={socio_emotional?.reflection_improvement} wide />
                    </Section>
                    <Section title="Fisik">
                        <Row label="Tinggi badan (cm)"               value={socio_emotional?.height} />
                        <Row label="Berat badan (kg)"                value={socio_emotional?.weight} />
                        <Row label="Ciri fisik"                      value={socio_emotional?.physical_traits} wide />
                        <Row label="Olahraga favorit"                value={socio_emotional?.favorite_sports} />
                        <Row label="Prestasi olahraga"               value={socio_emotional?.sports_achievements} wide />
                        <Row label="Pola makan"                      value={socio_emotional?.eating_habits} wide />
                        <Row label="Pola tidur"                      value={socio_emotional?.sleeping_habits} wide />
                        <Row label="Masalah kesehatan"               value={socio_emotional?.health_issues} wide />
                        <Row label="Yang disukai dari tubuh"         value={socio_emotional?.physical_likes} wide />
                        <Row label="Tujuan perkembangan fisik"       value={socio_emotional?.physical_development_goal} wide />
                    </Section>
                    <Section title="Spiritual">
                        <Row label="Pengetahuan tentang Yesus"       value={socio_emotional?.spiritual_knowledge_jesus} wide />
                        <Row label="Pertumbuhan hubungan dengan Allah" value={socio_emotional?.spiritual_relationship_growth} wide />
                        <Row label="Cinta & ketaatan"                value={socio_emotional?.spiritual_love_obedience} wide />
                        <Row label="Komunitas iman"                  value={socio_emotional?.spiritual_community} wide />
                        <Row label="Belajar Alkitab"                 value={socio_emotional?.spiritual_bible_study} wide />
                        <Row label="Mentor rohani"                   value={socio_emotional?.spiritual_mentor} wide />
                        <Row label="Pembelajaran rohani"             value={socio_emotional?.spiritual_reflection_learned} wide />
                        <Row label="Rencana perkembangan rohani"     value={socio_emotional?.spiritual_reflection_improvement} wide />
                    </Section>
                </Accordion>

                {/* 7. Eksplorasi Karir */}
                <Accordion
                    id="career" title="Eksplorasi Karir" icon="🎯"
                    filled={!!career_exploration} progress={modPct('Eksplorasi Karir')}
                    open={openModule === 'career'} onToggle={toggle}
                >
                    <Section title="Profesi Berdasarkan Gaya Belajar">
                        <Row label="Profesi visual"                  value={career_exploration?.visual_professions} wide />
                        <Row label="Profesi auditori"                value={career_exploration?.auditory_professions} wide />
                        <Row label="Profesi kinestetik"              value={career_exploration?.kinesthetic_professions_style} wide />
                        <Row label="Profesi paling diminati"         value={career_exploration?.interested_professions_from_style} wide />
                    </Section>
                    <Section title="Profesi Berdasarkan Kecerdasan Majemuk">
                        {[
                            ['Linguistik',      'linguistic_ability',      'linguistic_professions'],
                            ['Logis-Matematis', 'logical_math_ability',    'logical_math_professions'],
                            ['Visual-Spasial',  'visual_spatial_ability',  'visual_spatial_professions'],
                            ['Kinestetik',      'kinesthetic_ability',     'kinesthetic_professions'],
                            ['Musikal',         'musical_ability',         'musical_professions'],
                            ['Interpersonal',   'interpersonal_ability',   'interpersonal_professions'],
                            ['Intrapersonal',   'intrapersonal_ability',   'intrapersonal_professions'],
                            ['Naturalis',       'naturalist_ability',      'naturalist_professions'],
                        ].map(([label, abilityField, profField]) => (
                            <div key={label} className="py-1.5 border-b dark:border-gray-700 last:border-0">
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">{label}</div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                                    <div><span className="text-gray-400">Kemampuan:</span> {val(career_exploration?.[abilityField])}</div>
                                    <div><span className="text-gray-400">Profesi:</span> {val(career_exploration?.[profField])}</div>
                                </div>
                            </div>
                        ))}
                    </Section>
                    <Section title="Pertimbangan Karir">
                        <Row label="Pertimbangan tambahan"           value={career_exploration?.additional_considerations} wide />
                        <div className="py-2">
                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Matriks Keputusan Karir</dt>
                            <JsonTable data={career_exploration?.career_decision_matrix} />
                        </div>
                        <div className="py-1.5">
                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Pertimbangan yang Dipilih</dt>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {[
                                    ['Gaya Belajar',        'consider_learning_style'],
                                    ['Kecerdasan',          'consider_intelligence'],
                                    ['Prestasi Akademik',   'consider_academic_achievement'],
                                    ['Dukungan Orang Tua',  'consider_parental_support'],
                                    ['Kehendak Allah',      'consider_gods_will'],
                                ].map(([label, field]) => (
                                    <span key={field} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        career_exploration?.[field]
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 line-through'
                                    }`}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Section>
                </Accordion>

                {/* 8. Eksplorasi Karir P2 */}
                <Accordion
                    id="career_p2" title="Eksplorasi Karir – Bagian 2" icon="🏁"
                    filled={!!career_exploration_p2} progress={modPct('Eksplorasi Karir P2')}
                    open={openModule === 'career_p2'} onToggle={toggle}
                >
                    {/* Highlighted: Final Career Choice */}
                    {career_exploration_p2?.final_career_choice && (
                        <div className="mb-4 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                            <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-1">
                                ✦ Pilihan Karir Akhir
                            </p>
                            <p className="text-base font-bold text-indigo-800 dark:text-indigo-200">
                                {career_exploration_p2.final_career_choice}
                            </p>
                            {career_exploration_p2.final_career_reason && (
                                <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300 whitespace-pre-wrap">
                                    {career_exploration_p2.final_career_reason}
                                </p>
                            )}
                        </div>
                    )}
                    <Section title="Analisis SWOT">
                        <Row label="Definisi SWOT" value={career_exploration_p2?.swot_definition} wide />
                        <div className="py-2">
                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Data Analisis SWOT</dt>
                            <JsonTable data={career_exploration_p2?.swot_analysis_data} />
                        </div>
                    </Section>
                    <Section title="Catatan Mentoring">
                        <Row label="Catatan" value={career_exploration_p2?.mentoring_notes} wide />
                    </Section>
                    <Section title="Checklist Bab 4">
                        {[
                            ['Eksplorasi karir selesai',     'chapter4_check1'],
                            ['Analisis SWOT selesai',        'chapter4_check2'],
                            ['Yakin dengan keputusan karir', 'chapter4_check3'],
                        ].map(([label, field]) => (
                            <div key={field} className="flex items-center gap-2 py-0.5">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                                    career_exploration_p2?.[field]
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                }`}>
                                    {career_exploration_p2?.[field] ? '✓' : '–'}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                            </div>
                        ))}
                    </Section>
                </Accordion>

                {/* 9. Persiapan Pulau Impian */}
                <Accordion
                    id="dream" title="Persiapan Pulau Impian" icon="🏝️"
                    filled={!!dream_island} progress={modPct('Persiapan Pulau Impian')}
                    open={openModule === 'dream'} onToggle={toggle}
                >
                    <Section title="Pertanyaan Profesi">
                        <div className="py-1">
                            <JsonTable data={dream_island?.profession_questions} />
                        </div>
                    </Section>
                    <Section title="Analisis SWOT">
                        <div className="py-1">
                            <JsonTable data={dream_island?.swot_analysis} />
                        </div>
                    </Section>
                    <Section title="Rencana Perbaikan">
                        <Row label="Rencana" value={dream_island?.improvement_plan} wide />
                    </Section>
                </Accordion>

            </div>
        </div>
    );
}
