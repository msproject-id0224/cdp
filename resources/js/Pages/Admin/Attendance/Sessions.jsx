import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import ConfirmModal from '@/Components/ConfirmModal';

const fmtTime = (dt) =>
    dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

const fmtFull = (dt) =>
    dt
        ? new Date(dt).toLocaleString('id-ID', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })
        : '-';

function Pill({ color, children }) {
    const map = {
        green:  'bg-green-100 text-green-700 border-green-300',
        blue:   'bg-blue-100 text-blue-700 border-blue-300',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        orange: 'bg-orange-100 text-orange-700 border-orange-300',
        gray:   'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[color] ?? map.gray}`}>
            {children}
        </span>
    );
}

function SessionStatus({ session, meetingStatus }) {
    if (!session) {
        if (meetingStatus === 'pending') return <Pill color="orange">Menunggu Persetujuan Admin</Pill>;
        return <Pill color="gray">Belum Ada Sesi</Pill>;
    }
    if (session.is_active && session.email_sent)  return <Pill color="green">Aktif · Email Terkirim ✓</Pill>;
    if (session.is_active && !session.email_sent) return <Pill color="blue">Aktif · Email Belum Terkirim</Pill>;
    if (!session.is_active && !session.email_sent) return <Pill color="yellow">Sesi Siap · Menunggu T-10 menit</Pill>;
    return <Pill color="gray">Nonaktif</Pill>;
}

export default function Sessions({ auth, meetings }) {
    const [loading, setLoading] = useState({});
    const [flash, setFlash]     = useState(null);
    const [confirmState, setConfirmState] = useState({ show: false, title: '', message: '', onConfirm: null });
    const askConfirm = (title, message, fn) => setConfirmState({ show: true, title, message, onConfirm: fn });
    const closeConfirm = () => setConfirmState(s => ({ ...s, show: false }));

    const notify = (text, type = 'success') => {
        setFlash({ text, type });
        setTimeout(() => setFlash(null), 4000);
    };

    const resendEmail = async (meeting) => {
        setLoading((p) => ({ ...p, [meeting.id]: 'email' }));
        try {
            const res = await axios.post(
                route('api.admin.attendance.resend-email', { session: meeting.session.id })
            );
            notify(res.data.message);
            router.reload({ only: ['meetings'] });
        } catch (err) {
            notify(err.response?.data?.message ?? 'Gagal mengirim email.', 'error');
        } finally {
            setLoading((p) => ({ ...p, [meeting.id]: null }));
        }
    };

    const deactivate = (meeting) => {
        askConfirm(
            'Nonaktifkan Sesi Absensi',
            'Yakin ingin menonaktifkan sesi absensi ini? Peserta tidak akan bisa melakukan absen setelah sesi dinonaktifkan.',
            async () => {
                setLoading((p) => ({ ...p, [meeting.id]: 'deactivate' }));
                try {
                    const res = await axios.post(
                        route('api.admin.attendance.deactivate', { session: meeting.session.id })
                    );
                    notify(res.data.message);
                    router.reload({ only: ['meetings'] });
                } catch (err) {
                    notify(err.response?.data?.message ?? 'Gagal menonaktifkan.', 'error');
                } finally {
                    setLoading((p) => ({ ...p, [meeting.id]: null }));
                }
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Status Sesi Absensi
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.attendance.qr-display')}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                        >
                            Tampilkan QR (Android)
                        </Link>
                        <Link
                            href={route('admin.attendance.monitor')}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-300"
                        >
                            Monitor Absensi
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Sesi Absensi" />

            <div className="py-10">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-5">

                    {flash && (
                        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${
                            flash.type === 'error'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-green-50 text-green-800 border-green-300'
                        }`}>
                            {flash.text}
                        </div>
                    )}

                    {/* How-it-works banner */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 text-sm text-indigo-800 dark:text-indigo-200">
                        <p className="font-semibold mb-1.5">Alur Otomatis</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>Admin menyetujui jadwal mentor → <strong>sesi absensi + barcode otomatis dibuat</strong>.</li>
                            <li>Sistem mengirim barcode ke email mentor <strong>10 menit sebelum kegiatan mulai</strong> (via scheduler).</li>
                            <li>Mentor <strong>Android</strong>: scan barcode dari layar admin (halaman Tampilkan QR).</li>
                            <li>Mentor <strong>PC</strong>: unduh barcode dari email → upload di halaman Absensi.</li>
                            <li>Setelah scan berhasil, mentor upload foto dokumentasi kegiatan.</li>
                        </ol>
                        <p className="mt-2.5 text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-100 dark:bg-indigo-800/60 inline-block px-2 py-0.5 rounded">
                            php artisan schedule:work
                        </p>
                        <span className="ml-2 text-xs text-indigo-500">← jalankan di server untuk aktifkan scheduler</span>
                    </div>

                    {/* Meeting list */}
                    {meetings.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center text-gray-400 dark:text-gray-500">
                            Tidak ada kegiatan terjadwal hari ini.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {meetings.map((meeting) => {
                                const session = meeting.session;
                                const busy    = loading[meeting.id];
                                // QR email scheduled time = scheduled_at - 10 minutes
                                const qrSendTime = meeting.scheduled_at
                                    ? new Date(new Date(meeting.scheduled_at).getTime() - 10 * 60_000)
                                          .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                    : '-';

                                return (
                                    <div
                                        key={meeting.id}
                                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 p-5 ${
                                            session?.is_active && session?.email_sent
                                                ? 'border-green-500'
                                                : session?.is_active
                                                ? 'border-blue-500'
                                                : session
                                                ? 'border-yellow-400'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            {/* Info */}
                                            <div className="flex-1 min-w-0 space-y-1.5">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {meeting.agenda || <span className="italic text-gray-400">Tanpa Judul</span>}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Mentor:&nbsp;
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{meeting.mentor_name}</span>
                                                    {meeting.mentor_email && (
                                                        <span className="ml-1 text-xs text-gray-400">({meeting.mentor_email})</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    Jadwal: {fmtTime(meeting.scheduled_at)} – {fmtTime(meeting.end_time)}
                                                    &nbsp;·&nbsp;Email QR dikirim pukul <strong className="text-gray-600 dark:text-gray-300">{qrSendTime}</strong>
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <SessionStatus session={session} meetingStatus={meeting.meeting_status} />
                                                    {session?.email_sent && (
                                                        <span className="text-xs text-gray-400">
                                                            Terkirim: {fmtFull(session.email_sent_at)}
                                                        </span>
                                                    )}
                                                    {session?.activated_at && !session.email_sent && (
                                                        <span className="text-xs text-gray-400">
                                                            Sesi dibuat: {fmtFull(session.activated_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2 shrink-0 items-start">
                                                {session ? (
                                                    <>
                                                        <button
                                                            onClick={() => resendEmail(meeting)}
                                                            disabled={!!busy}
                                                            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
                                                        >
                                                            {busy === 'email' ? 'Mengirim…' : 'Kirim Ulang Email QR'}
                                                        </button>
                                                        {session.is_active && (
                                                            <button
                                                                onClick={() => deactivate(meeting)}
                                                                disabled={!!busy}
                                                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition"
                                                            >
                                                                {busy === 'deactivate' ? 'Menonaktifkan…' : 'Nonaktifkan'}
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic self-center">
                                                        {meeting.meeting_status === 'pending'
                                                            ? 'Setujui jadwal untuk membuat sesi'
                                                            : 'Sesi belum terbuat'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <ConfirmModal
                show={confirmState.show}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={() => { confirmState.onConfirm?.(); closeConfirm(); }}
                onCancel={closeConfirm}
                confirmLabel="Ya, Nonaktifkan"
                danger={false}
            />
        </AuthenticatedLayout>
    );
}
