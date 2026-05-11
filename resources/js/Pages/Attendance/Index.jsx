import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

// ── Detect Android / mobile device ──────────────────────────────────────────
const isAndroid = () =>
    /android/i.test(navigator.userAgent);

const isMobile = () =>
    /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);

// ── Tiny helper components ───────────────────────────────────────────────────
const Badge = ({ status }) => {
    const map = {
        Hadir: 'bg-green-100 text-green-700',
        Sakit: 'bg-yellow-100 text-yellow-700',
        Izin:  'bg-blue-100  text-blue-700',
        Alpha: 'bg-red-100   text-red-700',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

export default function AttendanceIndex({ auth, attendances = [] }) {
    const deviceType = isAndroid() ? 'android' : 'pc';

    // ── UI state ──
    // activeScan: null | 'mulai' | 'selesai'
    const [activeScan, setActiveScan]           = useState(null);
    const [scanMsg, setScanMsg]                 = useState(null); // {type, text}
    const [scanning, setScanning]               = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState(null); // null=checking, true, false
    const [docModal, setDocModal]               = useState(null);
    const [docFile, setDocFile]                 = useState(null);
    const [docUploading, setDocUploading]       = useState(false);
    const [docMsg, setDocMsg]                   = useState(null);
    const [fileUploadName, setFileUploadName]   = useState({ mulai: null, selesai: null });

    const scannerRef     = useRef(null);
    const scannerStarted = useRef(false); // true only after .start() resolves
    const fileInputMulai   = useRef(null);
    const fileInputSelesai = useRef(null);

    const flash = (text, type = 'success') => {
        setScanMsg({ text, type });
        setTimeout(() => setScanMsg(null), 6000);
    };

    // ── Detect camera/webcam availability on mount ───────────────────────────
    useEffect(() => {
        if (!navigator.mediaDevices?.enumerateDevices) {
            setCameraAvailable(false);
            return;
        }
        navigator.mediaDevices.enumerateDevices()
            .then(devices => setCameraAvailable(devices.some(d => d.kind === 'videoinput')))
            .catch(() => setCameraAvailable(false));
    }, []);

    // ── Camera scanner ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!activeScan) return;

        const html5Qrcode = new Html5Qrcode('qr-reader');
        scannerRef.current  = html5Qrcode;
        scannerStarted.current = false;

        html5Qrcode
            .start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 260, height: 260 } },
                (decodedText) => handleDecodedPayload(decodedText, deviceType),
                () => {}
            )
            .then(() => {
                scannerStarted.current = true;
                setScanning(true);
            })
            .catch((err) => {
                console.error('Camera start error:', err);
                const msg = isMobile()
                    ? 'Tidak dapat mengakses kamera. Pastikan izin kamera diberikan pada browser Anda.'
                    : 'Tidak dapat mengakses webcam. Pastikan webcam terhubung dan izin kamera diberikan pada browser.';
                flash(msg, 'error');
                setActiveScan(null);
                scannerRef.current = null;
            });

        return () => {
            if (scannerStarted.current) {
                scannerStarted.current = false;
                html5Qrcode.stop().catch(() => {});
            }
            setScanning(false);
        };
    }, [activeScan]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Send decoded QR payload to server ────────────────────────────────────
    const handleDecodedPayload = async (payload, device) => {
        // Stop scanner safely — only if it was successfully started
        if (scannerRef.current && scannerStarted.current) {
            scannerStarted.current = false;
            await scannerRef.current.stop().catch(() => {});
            setScanning(false);
        }
        setActiveScan(null);

        try {
            const res = await axios.post(route('attendance.scan'), {
                qr_payload:  payload,
                device_type: device,
            });

            if (res.data.status === 'already_scanned') {
                flash(res.data.message, 'info');
            } else {
                const label = res.data.type === 'selesai' ? 'SELESAI' : 'MULAI';
                flash(`✓ Absensi ${label} berhasil! Kegiatan: ${res.data.agenda} — ${res.data.time}`);
                router.reload({ only: ['attendances'] });
            }
        } catch (err) {
            const msg = err.response?.data?.message ?? 'Gagal memproses barcode. Coba lagi.';
            flash(msg, 'error');
        }
    };

    // ── Upload barcode image file ─────────────────────────────────────────────
    const handleBarcodeFileChange = async (e, scanType) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileUploadName(prev => ({ ...prev, [scanType]: file.name }));
        setScanMsg({ text: `Memproses file ${file.name}…`, type: 'info' });

        const html5Qrcode = new Html5Qrcode('qr-file-reader');
        try {
            const decoded = await html5Qrcode.scanFile(file, true);
            await handleDecodedPayload(decoded, 'pc');
        } catch (err) {
            console.error('QR decode error:', err);
            flash('Gagal membaca barcode dari file. Pastikan file adalah gambar QR yang valid.', 'error');
        } finally {
            html5Qrcode.clear?.();
            e.target.value = '';
            setFileUploadName(prev => ({ ...prev, [scanType]: null }));
        }
    };

    // ── Documentation upload ──────────────────────────────────────────────────
    const submitDocumentation = async () => {
        if (!docFile || !docModal) return;
        setDocUploading(true);
        setDocMsg(null);

        const form = new FormData();
        form.append('documentation', docFile);

        try {
            await axios.post(
                route('attendance.documentation', { attendance: docModal }),
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setDocMsg({ text: 'Dokumentasi berhasil diupload!', type: 'success' });
            setDocFile(null);
            router.reload({ only: ['attendances'] });
            setTimeout(() => {
                setDocModal(null);
                setDocMsg(null);
            }, 2000);
        } catch (err) {
            setDocMsg({
                text: err.response?.data?.message ?? 'Upload gagal, coba lagi.',
                type: 'error',
            });
        } finally {
            setDocUploading(false);
        }
    };

    const fmtTime = (dt) =>
        dt ? new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

    const fmtDate = (dt) =>
        dt
            ? new Date(dt).toLocaleDateString('id-ID', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
              })
            : '-';

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Absensi Mentor</h2>}
        >
            <Head title="Absensi Mentor" />

            {/* Hidden div required by Html5Qrcode.scanFile */}
            <div id="qr-file-reader" className="hidden" />

            <div className="py-10">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Flash message */}
                    {scanMsg && (
                        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                            scanMsg.type === 'error'
                                ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700'
                                : scanMsg.type === 'info'
                                ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700'
                                : 'bg-green-50 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700'
                        }`}>
                            <span className="mt-0.5 shrink-0">
                                {scanMsg.type === 'error' ? '⚠' : scanMsg.type === 'info' ? 'ℹ' : '✓'}
                            </span>
                            <span>{scanMsg.text}</span>
                        </div>
                    )}

                    {/* Camera / webcam warning banner */}
                    {cameraAvailable === false && (
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm border bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            <div>
                                <p className="font-semibold">
                                    {isMobile() ? 'Kamera tidak aktif' : 'Webcam tidak terdeteksi'}
                                </p>
                                <p className="mt-0.5 font-normal">
                                    {isMobile()
                                        ? 'Pastikan izin kamera telah diberikan pada browser dan kamera perangkat Anda aktif.'
                                        : 'Pastikan kamera atau webcam terhubung ke komputer dan izin kamera telah diberikan pada browser.'}
                                    {' '}Anda tetap dapat menggunakan fitur <strong>Upload QR</strong> sebagai alternatif.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Scan / Upload cards — MULAI & SELESAI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* ── MULAI card ── */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-green-200 dark:border-green-700 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 uppercase">MULAI</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Scan saat tiba / memulai kegiatan</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        if (activeScan !== 'mulai' && cameraAvailable === false) {
                                            flash(isMobile()
                                                ? 'Kamera tidak aktif. Berikan izin kamera pada browser Anda, lalu coba lagi.'
                                                : 'Webcam tidak terdeteksi. Pastikan kamera/webcam terhubung ke komputer Anda.',
                                                'error');
                                            return;
                                        }
                                        setActiveScan(v => v === 'mulai' ? null : 'mulai');
                                    }}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition ${
                                        activeScan === 'mulai'
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : cameraAvailable === false
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {activeScan === 'mulai' ? 'Tutup Kamera' : 'Scan Kamera'}
                                </button>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition cursor-pointer">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    {fileUploadName.mulai ? 'Memproses…' : 'Upload QR Mulai'}
                                    <input ref={fileInputMulai} type="file" accept="image/*" className="hidden"
                                        onChange={e => handleBarcodeFileChange(e, 'mulai')}
                                        disabled={!!fileUploadName.mulai} />
                                </label>
                            </div>
                            {activeScan === 'mulai' && (
                                <div className="mt-4 border-t pt-4 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Arahkan kamera ke QR <strong>MULAI</strong> (bingkai hijau) di layar admin</p>
                                    <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-green-300 dark:border-green-700" />
                                    {scanning && <p className="text-center text-xs text-green-500 mt-2 animate-pulse">Sedang memindai…</p>}
                                </div>
                            )}
                        </div>

                        {/* ── SELESAI card ── */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-700 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 uppercase">SELESAI</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Scan saat kegiatan selesai</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        if (activeScan !== 'selesai' && cameraAvailable === false) {
                                            flash(isMobile()
                                                ? 'Kamera tidak aktif. Berikan izin kamera pada browser Anda, lalu coba lagi.'
                                                : 'Webcam tidak terdeteksi. Pastikan kamera/webcam terhubung ke komputer Anda.',
                                                'error');
                                            return;
                                        }
                                        setActiveScan(v => v === 'selesai' ? null : 'selesai');
                                    }}
                                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition ${
                                        activeScan === 'selesai'
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                                            : cameraAvailable === false
                                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {activeScan === 'selesai' ? 'Tutup Kamera' : 'Scan Kamera'}
                                </button>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition cursor-pointer">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    {fileUploadName.selesai ? 'Memproses…' : 'Upload QR Selesai'}
                                    <input ref={fileInputSelesai} type="file" accept="image/*" className="hidden"
                                        onChange={e => handleBarcodeFileChange(e, 'selesai')}
                                        disabled={!!fileUploadName.selesai} />
                                </label>
                            </div>
                            {activeScan === 'selesai' && (
                                <div className="mt-4 border-t pt-4 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Arahkan kamera ke QR <strong>SELESAI</strong> (bingkai merah) di layar admin</p>
                                    <div id="qr-reader" className="w-full rounded-xl overflow-hidden border border-red-300 dark:border-red-700" />
                                    {scanning && <p className="text-center text-xs text-red-500 mt-2 animate-pulse">Sedang memindai…</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Attendance Table ─────────────────────────────────── */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                Riwayat Absensi
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-500 dark:text-gray-300 tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3 text-left w-12">No</th>
                                        <th className="px-5 py-3 text-left">Deskripsi Aktivitas</th>
                                        <th className="px-5 py-3 text-left">Mulai / Selesai</th>
                                        <th className="px-5 py-3 text-left">Status / Dokumentasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                    {attendances.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                                                Belum ada catatan absensi.
                                            </td>
                                        </tr>
                                    ) : (
                                        attendances.map((att) => (
                                            <tr key={att.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                {/* No */}
                                                <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-medium">
                                                    {att.no}
                                                </td>

                                                {/* Deskripsi */}
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-gray-900 dark:text-white leading-snug">
                                                        {att.agenda}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {fmtDate(att.scheduled_at)}
                                                    </p>
                                                    {att.end_time && (
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                                            Jadwal selesai: {fmtTime(att.end_time)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Mulai / Selesai */}
                                                <td className="px-5 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                                            <span className="text-green-700 dark:text-green-400 font-medium">
                                                                {fmtTime(att.check_in_at)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`w-2 h-2 rounded-full shrink-0 ${att.end_time ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                                            <span className={att.end_time ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-400 text-xs italic'}>
                                                                {att.end_time ? fmtTime(att.end_time) : 'Menunggu dokumentasi'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status / Dokumentasi */}
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <Badge status={att.status} />
                                                        {att.documentation_path ? (
                                                            <a
                                                                href={att.documentation_path}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Lihat Dokumentasi
                                                            </a>
                                                        ) : att.status === 'Hadir' ? (
                                                            <button
                                                                onClick={() => { setDocModal(att.id); setDocMsg(null); setDocFile(null); }}
                                                                className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 font-medium"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                                </svg>
                                                                Upload Dokumentasi
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Documentation Upload Modal ──────────────────────────────── */}
            {docModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                            Upload Dokumentasi Kegiatan
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Upload foto atau file sebagai bukti kegiatan mengajar.
                        </p>

                        {docMsg && (
                            <div className={`mb-4 px-3 py-2 rounded-lg text-sm ${
                                docMsg.type === 'error'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                                {docMsg.text}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="block w-full text-sm text-gray-600 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-l-xl file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:font-medium hover:file:bg-indigo-700"
                            onChange={(e) => setDocFile(e.target.files[0] ?? null)}
                        />
                        {docFile && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                File dipilih: <span className="font-medium">{docFile.name}</span>
                            </p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDocModal(null)}
                                disabled={docUploading}
                                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={submitDocumentation}
                                disabled={!docFile || docUploading}
                                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {docUploading ? 'Mengupload…' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
