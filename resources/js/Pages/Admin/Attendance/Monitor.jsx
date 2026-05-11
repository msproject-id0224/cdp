import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Monitor({ auth, attendances = [], sessions = [] }) {
    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['attendances', 'sessions'] });
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const fmtTime = (dt) =>
        dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

    const fmtDate = (dt) =>
        dt
            ? new Date(dt).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })
            : '-';

    const deviceLabel = (type) => {
        if (type === 'android') return { label: 'Android', cls: 'bg-green-100 text-green-700' };
        if (type === 'pc')      return { label: 'PC/Web', cls: 'bg-blue-100 text-blue-700' };
        return { label: '-', cls: 'bg-gray-100 text-gray-500' };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Monitor Absensi Mentor
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('admin.attendance.sessions')}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                        >
                            Kelola Sesi
                        </Link>
                        <Link
                            href={route('admin.attendance.qr-display')}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                        >
                            Tampilkan QR
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Monitor Absensi" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Session status chips */}
                    {sessions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {sessions.map((s) => (
                                <span
                                    key={s.meeting_id}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                                        s.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                    }`}
                                >
                                    {s.is_active && (
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                        </span>
                                    )}
                                    Sesi #{s.meeting_id} {s.is_active ? 'aktif' : 'nonaktif'}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Attendance table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                Data Absensi Hari Ini &mdash; {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                Diperbarui otomatis setiap 30 detik
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-300 tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3 text-left w-12">No</th>
                                        <th className="px-5 py-3 text-left">Deskripsi Aktivitas</th>
                                        <th className="px-5 py-3 text-left">Mentor</th>
                                        <th className="px-5 py-3 text-left">Mulai (Scan)</th>
                                        <th className="px-5 py-3 text-left">Selesai (Upload Dok.)</th>
                                        <th className="px-5 py-3 text-left">Perangkat</th>
                                        <th className="px-5 py-3 text-left">Status / Dokumentasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {attendances.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-5 py-10 text-center text-gray-400 dark:text-gray-500">
                                                Belum ada absensi tercatat hari ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        attendances.map((att) => {
                                            const dev = deviceLabel(att.device_type);
                                            return (
                                                <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-medium">
                                                        {att.no}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="font-medium text-gray-900 dark:text-white">{att.agenda}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                            {fmtDate(att.scheduled_at)}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                                                        {att.mentor_name}
                                                    </td>
                                                    <td className="px-5 py-4 text-green-700 dark:text-green-400 font-medium">
                                                        {fmtTime(att.check_in_at)}
                                                    </td>
                                                    <td className="px-5 py-4 text-blue-700 dark:text-blue-400 font-medium">
                                                        {att.check_out_at ? fmtTime(att.check_out_at) : (
                                                            <span className="text-gray-400 text-xs italic">Menunggu dokumentasi</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dev.cls}`}>
                                                            {dev.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                            att.status === 'Hadir'
                                                                ? 'bg-green-100 text-green-700'
                                                                : att.status === 'Sakit'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {att.status}
                                                        </span>
                                                        {att.documentation_path && (
                                                            <a
                                                                href={att.documentation_path}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="block mt-1 text-xs text-indigo-600 hover:underline"
                                                            >
                                                                Lihat Dokumentasi ↗
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
