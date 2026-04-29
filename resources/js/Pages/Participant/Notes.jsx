import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { __ } from '@/Utils/lang';

const LETTER_TYPES = [
    { key: 'perkenalan',          label: 'Perkenalan' },
    { key: 'terjadwal',           label: 'Terjadwal' },
    { key: 'ucapan_terima_kasih', label: 'Ucapan Terima Kasih' },
];

function formatDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function StatusBadge({ status }) {
    const map = {
        sent:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        received: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
        read:     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    };
    const labels = { sent: __('Sent'), received: __('Received'), read: __('Read') };
    return (
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? map.sent}`}>
            {labels[status] ?? status}
        </span>
    );
}

function NoteCard({ note }) {
    const mentorName = note.mentor
        ? `${note.mentor.first_name ?? ''} ${note.mentor.last_name ?? ''}`.trim()
        : __('Mentor');
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 dark:text-blue-300 text-sm font-bold">
                            {mentorName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{mentorName}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{formatDate(note.created_at)}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{note.note}</p>
        </div>
    );
}

function LetterCard({ letter }) {
    const [open, setOpen] = useState(false);
    const senderName = letter.sender
        ? `${letter.sender.first_name ?? ''} ${letter.sender.last_name ?? ''}`.trim()
        : '-';
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full text-left p-5 flex items-start justify-between gap-3"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{letter.letter_number}</span>
                        <StatusBadge status={letter.status} />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{letter.subject}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {__('From')}: {senderName} &middot; {formatDate(letter.sent_at)}
                    </p>
                </div>
                <svg
                    className={`h-4 w-4 text-gray-400 shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                    {letter.content && (
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{letter.content}</p>
                    )}
                    {letter.file_path && (
                        <a
                            href={`/storage/${letter.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            {__('Download File')}
                        </a>
                    )}
                    {!letter.content && !letter.file_path && (
                        <p className="text-sm text-gray-400">{__('No content available.')}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Notes({ auth, notes = [], letters = {} }) {
    const [mainTab, setMainTab]   = useState('catatan_pribadi');
    const [letterTab, setLetterTab] = useState('perkenalan');

    const currentLetters = letters[letterTab] ?? [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('My Notes')}</h2>}
        >
            <Head title={__('My Notes')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ── Main Tabs ───────────────────────────────────── */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <nav className="-mb-px flex gap-6">
                            {[
                                { key: 'catatan_pribadi', label: __('Catatan Pribadi'), count: notes.length },
                                { key: 'surat',           label: __('Surat'),           count: Object.values(letters).flat().length },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setMainTab(tab.key)}
                                    className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                        mainTab === tab.key
                                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                        mainTab === tab.key
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* ── Catatan Pribadi ─────────────────────────────── */}
                    {mainTab === 'catatan_pribadi' && (
                        <div>
                            {notes.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                                    <svg className="mx-auto h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-sm">{__('No notes yet.')}</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {notes.map(note => <NoteCard key={note.id} note={note} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Surat ───────────────────────────────────────── */}
                    {mainTab === 'surat' && (
                        <div>
                            {/* Letter type sub-tabs */}
                            <div className="flex gap-2 mb-6 flex-wrap">
                                {LETTER_TYPES.map(lt => {
                                    const count = (letters[lt.key] ?? []).length;
                                    const active = letterTab === lt.key;
                                    return (
                                        <button
                                            key={lt.key}
                                            type="button"
                                            onClick={() => setLetterTab(lt.key)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                                active
                                                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {__(lt.label)}
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                                active
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                            }`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Letter list */}
                            {currentLetters.length === 0 ? (
                                <div className="text-center py-20 text-gray-400 dark:text-gray-500">
                                    <svg className="mx-auto h-12 w-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">
                                        {__('No letters yet.')}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {currentLetters.map(letter => <LetterCard key={letter.id} letter={letter} />)}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
