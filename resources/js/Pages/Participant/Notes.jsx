import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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

/* ── Status badge ──────────────────────────────────────────── */
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

/* ── Note card ─────────────────────────────────────────────── */
function NoteCard({ note }) {
    const mentorName = note.mentor
        ? `${note.mentor.first_name ?? ''} ${note.mentor.last_name ?? ''}`.trim()
        : __('Me');
    const isSelf = note.mentor_id === note.participant_id;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${isSelf ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                        <span className={`text-sm font-bold ${isSelf ? 'text-emerald-600 dark:text-emerald-300' : 'text-blue-600 dark:text-blue-300'}`}>
                            {mentorName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                        {isSelf ? __('Catatan Saya') : mentorName}
                    </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{formatDate(note.created_at)}</span>
            </div>
            {note.subject && (
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2">{note.subject}</p>
            )}
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{note.note}</p>
        </div>
    );
}

/* ── Letter card ───────────────────────────────────────────── */
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
                <svg className={`h-4 w-4 text-gray-400 shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
                    {letter.content && (
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{letter.content}</p>
                    )}
                    {letter.file_path && (
                        <a href={`/storage/${letter.file_path}`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
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

/* ── Reusable modal wrapper ────────────────────────────────── */
function Modal({ show, onClose, title, children }) {
    const overlayRef = useRef();
    useEffect(() => {
        if (!show) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [show, onClose]);
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div ref={overlayRef} onClick={onClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                    <button type="button" onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}

/* ── Add (+) button ────────────────────────────────────────── */
function AddButton({ onClick, label }) {
    return (
        <button type="button" onClick={onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {label}
        </button>
    );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function Notes({ auth, notes: initialNotes = [], letters: initialLetters = {} }) {
    const [mainTab, setMainTab]     = useState('catatan_pribadi');
    const [letterTab, setLetterTab] = useState('perkenalan');

    /* lists – local state so we can optimistically prepend */
    const [notes, setNotes]     = useState(initialNotes);
    const [letters, setLetters] = useState(initialLetters);

    /* note modal */
    const [noteModal, setNoteModal]       = useState(false);
    const [noteSubject, setNoteSubject]   = useState('');
    const [noteText, setNoteText]         = useState('');
    const [noteSaving, setNoteSaving]     = useState(false);
    const [noteError, setNoteError]       = useState('');

    /* letter modal */
    const [letterModal, setLetterModal]     = useState(false);
    const [letterSubject, setLetterSubject] = useState('');
    const [letterContent, setLetterContent] = useState('');
    const [letterSaving, setLetterSaving]   = useState(false);
    const [letterError, setLetterError]     = useState('');

    const currentLetters = letters[letterTab] ?? [];

    /* ── handlers ── */
    function openNoteModal()   { setNoteSubject(''); setNoteText(''); setNoteError(''); setNoteModal(true); }
    function closeNoteModal()  { setNoteModal(false); }

    function openLetterModal()  { setLetterSubject(''); setLetterContent(''); setLetterError(''); setLetterModal(true); }
    function closeLetterModal() { setLetterModal(false); }

    async function handleSaveNote(e) {
        e.preventDefault();
        if (!noteText.trim()) return;
        setNoteSaving(true);
        setNoteError('');
        try {
            const { data } = await axios.post(route('participant.notes.store'), { subject: noteSubject, note: noteText });
            setNotes(prev => [data, ...prev]);
            closeNoteModal();
        } catch (err) {
            setNoteError(err.response?.data?.message ?? __('Failed to save note.'));
        } finally {
            setNoteSaving(false);
        }
    }

    async function handleSaveLetter(e) {
        e.preventDefault();
        if (!letterSubject.trim()) return;
        setLetterSaving(true);
        setLetterError('');
        try {
            const { data } = await axios.post(route('participant.letters.store'), {
                subject:     letterSubject,
                content:     letterContent,
                letter_type: letterTab,
            });
            setLetters(prev => ({
                ...prev,
                [letterTab]: [data, ...(prev[letterTab] ?? [])],
            }));
            closeLetterModal();
        } catch (err) {
            setLetterError(err.response?.data?.message ?? __('Failed to send letter.'));
        } finally {
            setLetterSaving(false);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__('My Notes')}</h2>}
        >
            <Head title={__('My Notes')} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ── Main tabs + add button ───────────────────────── */}
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex gap-6">
                            {[
                                { key: 'catatan_pribadi', label: __('Catatan Pribadi'), count: notes.length },
                                { key: 'surat',           label: __('Surat'),           count: Object.values(letters).flat().length },
                            ].map(tab => (
                                <button key={tab.key} type="button" onClick={() => setMainTab(tab.key)}
                                    className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                        mainTab === tab.key
                                            ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                                    }`}>
                                    {tab.label}
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                        mainTab === tab.key
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>{tab.count}</span>
                                </button>
                            ))}
                        </nav>

                        {/* (+) button changes based on active tab */}
                        <div className="mb-3">
                            {mainTab === 'catatan_pribadi' && (
                                <AddButton onClick={openNoteModal} label={__('Tambah Catatan')} />
                            )}
                            {mainTab === 'surat' && (
                                <AddButton onClick={openLetterModal} label={__('Tulis Surat')} />
                            )}
                        </div>
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
                                    const count  = (letters[lt.key] ?? []).length;
                                    const active = letterTab === lt.key;
                                    return (
                                        <button key={lt.key} type="button" onClick={() => setLetterTab(lt.key)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                                active
                                                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}>
                                            {__(lt.label)}
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                                active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                            }`}>{count}</span>
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
                                    <p className="text-sm">{__('No letters yet.')}</p>
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

            {/* ── Modal: Tambah Catatan ────────────────────────────── */}
            <Modal show={noteModal} onClose={closeNoteModal} title={__('Tambah Catatan')}>
                <form onSubmit={handleSaveNote} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {__('Subjek')} <span className="text-gray-400 text-xs font-normal">({__('opsional')})</span>
                        </label>
                        <input
                            type="text"
                            maxLength={255}
                            value={noteSubject}
                            onChange={e => setNoteSubject(e.target.value)}
                            placeholder={__('Judul catatan...')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {__('Catatan')}
                        </label>
                        <textarea
                            rows={5}
                            maxLength={2000}
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder={__('Tulis catatan pribadi kamu di sini...')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">{noteText.length}/2000</p>
                    </div>
                    {noteError && <p className="text-sm text-red-500">{noteError}</p>}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={closeNoteModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            {__('Cancel')}
                        </button>
                        <button type="submit" disabled={noteSaving || !noteText.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
                            {noteSaving ? __('Menyimpan...') : __('Simpan')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal: Tulis Surat ───────────────────────────────── */}
            <Modal show={letterModal} onClose={closeLetterModal}
                title={`${__('Tulis Surat')} — ${__(LETTER_TYPES.find(l => l.key === letterTab)?.label ?? '')}`}>
                <form onSubmit={handleSaveLetter} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {__('Subjek')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            maxLength={255}
                            value={letterSubject}
                            onChange={e => setLetterSubject(e.target.value)}
                            placeholder={__('Judul surat...')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {__('Isi Surat')}
                        </label>
                        <textarea
                            rows={6}
                            maxLength={5000}
                            value={letterContent}
                            onChange={e => setLetterContent(e.target.value)}
                            placeholder={__('Tulis isi surat kamu di sini...')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">{letterContent.length}/5000</p>
                    </div>
                    {letterError && <p className="text-sm text-red-500">{letterError}</p>}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={closeLetterModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            {__('Cancel')}
                        </button>
                        <button type="submit" disabled={letterSaving || !letterSubject.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
                            {letterSaving ? __('Mengirim...') : __('Kirim Surat')}
                        </button>
                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
