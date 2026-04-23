import Modal from '@/Components/Modal';
import { useEffect, useState, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useTrans } from '@/Utils/lang';
import ProfilePhoto from '@/Components/ProfilePhoto';

// ─── colour wheel for module dots ────────────────────────────────────────────
const MODULE_COLORS = [
    'bg-violet-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
    'bg-green-500',  'bg-amber-500','bg-orange-500','bg-pink-500','bg-rose-500',
];

// ─── SVG circular progress indicator ─────────────────────────────────────────
function CircleProgress({ percentage, size = 76 }) {
    const r    = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ - (percentage / 100) * circ;
    const col  = percentage === 100 ? '#22c55e' : percentage > 0 ? '#6366f1' : '#d1d5db';
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} className="dark:stroke-gray-700"/>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={8}
                strokeDasharray={circ} strokeDashoffset={dash}
                strokeLinecap="round" style={{ transition:'stroke-dashoffset .4s ease' }}/>
        </svg>
    );
}

// ─── small status pill ────────────────────────────────────────────────────────
function Pill({ pct, label }) {
    if (pct === 100) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {label}
        </span>
    );
    if (pct > 0) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            {label}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {label}
        </span>
    );
}

// ─── render a single field value based on its type ───────────────────────────
function FieldValue({ value, type, __ }) {
    const [expanded, setExpanded] = useState(false);

    if (value === null || value === undefined || value === '') {
        return <span className="italic text-gray-400 dark:text-gray-600 text-xs">{__('(empty)')}</span>;
    }

    if (type === 'boolean') {
        return value
            ? <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Ya
              </span>
            : <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                Tidak
              </span>;
    }

    if (type === 'date') {
        return <span className="text-xs text-gray-700 dark:text-gray-300">{value}</span>;
    }

    if (type === 'number') {
        return <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{value}</span>;
    }

    if (type === 'image') {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Ada gambar
            </span>
        );
    }

    if (type === 'array') {
        const items = Array.isArray(value) ? value : [];
        if (items.length === 0) return <span className="italic text-gray-400 text-xs">{__('(empty)')}</span>;
        return (
            <div className="flex flex-wrap gap-1 mt-0.5">
                {items.map((item, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] rounded border border-indigo-200 dark:border-indigo-700">
                        {item}
                    </span>
                ))}
            </div>
        );
    }

    if (type === 'json') {
        if (Array.isArray(value)) {
            return (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 space-y-1">
                    {value.map((item, i) => (
                        <div key={i} className="pl-2 border-l-2 border-indigo-200 dark:border-indigo-700">
                            {typeof item === 'object'
                                ? Object.entries(item).map(([k, v]) => (
                                    <div key={k} className="flex gap-1">
                                        <span className="font-medium text-gray-500 dark:text-gray-400 capitalize shrink-0">{k}:</span>
                                        <span className="text-gray-700 dark:text-gray-300">{String(v)}</span>
                                    </div>
                                ))
                                : <span>{String(item)}</span>}
                        </div>
                    ))}
                </div>
            );
        }
        if (typeof value === 'object') {
            return (
                <div className="text-xs mt-0.5 space-y-0.5">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="flex gap-1">
                            <span className="font-medium text-gray-500 dark:text-gray-400 capitalize shrink-0">{k}:</span>
                            <span className="text-gray-700 dark:text-gray-300">{String(v)}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return <span className="text-xs text-gray-700 dark:text-gray-300">{String(value)}</span>;
    }

    // text (default)
    const str = String(value);
    const LIMIT = 220;
    if (str.length <= LIMIT) {
        return <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{str}</span>;
    }
    return (
        <div>
            <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {expanded ? str : str.slice(0, LIMIT) + '…'}
            </span>
            <button
                type="button"
                onClick={() => setExpanded(p => !p)}
                className="ml-1 text-[11px] text-indigo-500 hover:text-indigo-700 underline"
            >
                {expanded ? __('collapse') : __('show more')}
            </button>
        </div>
    );
}

// ─── main modal ───────────────────────────────────────────────────────────────
export default function RmdDetailModal({ show, onClose, userId }) {
    const __ = useTrans();
    const { locale } = usePage().props;

    const [loading, setLoading]   = useState(false);
    const [data, setData]         = useState(null);
    const [error, setError]       = useState(null);

    // which module index is expanded (accordion — one at a time)
    const [openModule, setOpenModule] = useState(null);
    // which sections are expanded within a module (key = `${modIdx}-${secIdx}`)
    const [openSections, setOpenSections] = useState(new Set());

    const toggleModule = (i) => {
        setOpenModule(p => p === i ? null : i);
        setOpenSections(new Set());
    };

    const toggleSection = useCallback((key) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }, []);

    useEffect(() => {
        if (show && userId) {
            setOpenModule(null);
            setOpenSections(new Set());
            setData(null);
            setError(null);
            fetchData();
        }
    }, [show, userId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(route('rmd-report.participant.details', userId));
            setData(res.data);
        } catch {
            setError(__('Failed to fetch participant data.'));
        } finally {
            setLoading(false);
        }
    };

    const fmt = (d) => {
        if (!d) return '–';
        return new Date(d).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
            year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit',
        });
    };

    const barColor = (pct) =>
        pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700';

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl">
            <div className="flex flex-col" style={{ maxHeight: '92vh' }}>

                {/* ── header ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {__('Participant RMD Progress Details')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* ── scrollable body ────────────────────────────────────── */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                    {loading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"/>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-10">
                            <p className="text-red-500 mb-3 text-sm">{error}</p>
                            <button onClick={fetchData} className="text-indigo-600 hover:underline text-sm">
                                {__('Try Again')}
                            </button>
                        </div>
                    )}

                    {!loading && !error && data && (<>

                        {/* ══ participant card ═══════════════════════════════ */}
                        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4 flex gap-4">
                            <ProfilePhoto
                                src={data.user.profile_photo_url}
                                alt={data.user.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow shrink-0 mt-0.5"
                                fallbackClassName="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xl border-2 border-white dark:border-gray-600 shadow shrink-0 mt-0.5"
                                fallback={(data.user.name || 'P').charAt(0).toUpperCase()}
                            />

                            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm min-w-0">
                                <div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{__('Full Name')}</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{data.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{__('ID Number')}</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{data.user.id_number || '–'}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{__('Age')}</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{data.user.age} {__('year(s)')}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{__('Email')}</p>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate text-xs">{data.user.email}</p>
                                </div>
                                {data.user.mentor_name && (
                                    <div className="col-span-2">
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{__('Assigned Mentor')}</p>
                                        <p className="font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1 text-sm">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            {data.user.mentor_name}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* overall circle */}
                            <div className="shrink-0 flex flex-col items-center justify-center gap-1 pl-2">
                                <div className="relative">
                                    <CircleProgress percentage={data.summary.percentage} size={76}/>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-100">
                                        {data.summary.percentage}%
                                    </span>
                                </div>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                                    {data.summary.filled_modules}/{data.summary.total_modules} modul
                                </span>
                            </div>
                        </div>

                        {/* ══ overall progress bar ═══════════════════════════ */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full transition-all ${barColor(data.summary.percentage)}`}
                                     style={{ width: `${data.summary.percentage}%` }}/>
                            </div>
                            <Pill pct={data.summary.percentage} label={data.summary.status}/>
                        </div>

                        {/* ══ module accordion ════════════════════════════════ */}
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Klik modul → seksi → field untuk melihat detail isian
                            </p>

                            <div className="space-y-1.5">
                                {data.modules.map((mod, mi) => (
                                    <div key={mi} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">

                                        {/* ── module row ─────────────────── */}
                                        <button
                                            type="button"
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                                            onClick={() => toggleModule(mi)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${MODULE_COLORS[mi % MODULE_COLORS.length]}`}/>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{mod.name}</span>
                                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                                            <Pill pct={mod.percentage} label={mod.status}/>
                                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openModule === mi ? 'rotate-180' : ''}`}
                                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                            <div className={`h-1.5 rounded-full transition-all ${barColor(mod.percentage)}`}
                                                                 style={{ width:`${mod.percentage}%` }}/>
                                                        </div>
                                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums shrink-0">{mod.percentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {mod.last_updated && (
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 pl-6">
                                                    Terakhir: {fmt(mod.last_updated)}
                                                    {mod.filled_at && mod.filled_at !== mod.last_updated && (
                                                        <span className="ml-2">· Mulai: {fmt(mod.filled_at)}</span>
                                                    )}
                                                </p>
                                            )}
                                        </button>

                                        {/* ── sections (expand module) ────── */}
                                        {openModule === mi && mod.sections?.length > 0 && (
                                            <div className="border-t border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700/60 bg-gray-50 dark:bg-gray-800/50">
                                                {mod.sections.map((sec, si) => {
                                                    const secKey = `${mi}-${si}`;
                                                    const secOpen = openSections.has(secKey);
                                                    return (
                                                        <div key={si}>
                                                            {/* section row */}
                                                            <button
                                                                type="button"
                                                                className="w-full text-left px-5 py-2.5 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors"
                                                                onClick={() => toggleSection(secKey)}
                                                            >
                                                                {/* section mini-bar */}
                                                                <div className="w-20 shrink-0">
                                                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                                        <div className={`h-1.5 rounded-full ${barColor(sec.percentage)}`}
                                                                             style={{ width:`${sec.percentage}%` }}/>
                                                                    </div>
                                                                </div>
                                                                <span className="flex-1 text-xs font-medium text-gray-700 dark:text-gray-300">{sec.label}</span>
                                                                <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums shrink-0">
                                                                    {sec.filled}/{sec.total}
                                                                </span>
                                                                {sec.fields?.length > 0 && (
                                                                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 shrink-0 ${secOpen ? 'rotate-180' : ''}`}
                                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                                                    </svg>
                                                                )}
                                                            </button>

                                                            {/* ── fields (expand section) ── */}
                                                            {secOpen && sec.fields?.length > 0 && (
                                                                <div className="px-5 pb-3 space-y-2.5 bg-white dark:bg-gray-900/30">
                                                                    {sec.fields.map((field, fi) => (
                                                                        <div key={fi} className={`rounded-md px-3 py-2 border text-xs ${
                                                                            field.filled
                                                                                ? 'border-green-100 dark:border-green-900/40 bg-green-50/60 dark:bg-green-900/10'
                                                                                : 'border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/30'
                                                                        }`}>
                                                                            <div className="flex items-start gap-2">
                                                                                {/* filled indicator */}
                                                                                <span className={`mt-0.5 shrink-0 w-3.5 h-3.5 ${field.filled ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                                                                                    {field.filled
                                                                                        ? <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                                                                        : <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                                                                                    }
                                                                                </span>

                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium text-gray-600 dark:text-gray-400 mb-0.5">{field.label}</p>
                                                                                    <FieldValue value={field.value} type={field.type} __={__}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </>)}
                </div>

                {/* ── footer ─────────────────────────────────────────────── */}
                <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end shrink-0">
                    <button
                        type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    >
                        {__('Close')}
                    </button>
                </div>

            </div>
        </Modal>
    );
}
