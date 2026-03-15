import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

export default function Scanner({ auth }) {
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    
    // Use ref to track processing state inside the callback
    const isProcessingRef = useRef(false);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const playBeep = () => {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.1); // 100ms beep
            } catch (e) {
                console.error("Audio play failed", e);
            }
        };

        const onScanSuccess = async (decodedText, decodedResult) => {
            if (isProcessingRef.current) return;
            
            // Prevent multiple scans of the same code immediately
            isProcessingRef.current = true;
            playBeep();

            try {
                const response = await axios.post(route('api.admin.attendance.scan'), {
                    qr_token: decodedText
                });

                setScanResult({
                    status: 'success',
                    message: response.data.message || 'Attendance recorded successfully!',
                    data: response.data
                });
                setScanError(null);
                
                // Pause scanning briefly to show result
                setTimeout(() => {
                    isProcessingRef.current = false;
                    setScanResult(null); // Clear result to allow next scan
                }, 3000);

            } catch (error) {
                console.error("Scan processing error:", error);
                setScanError(error.response?.data?.message || 'Invalid QR Code or System Error');
                setScanResult(null);
                
                // Re-enable scanning after error
                setTimeout(() => {
                    isProcessingRef.current = false;
                    setScanError(null);
                }, 3000);
            }
        };

        const onScanFailure = (error) => {
            // Ignore frame read errors
        };

        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Attendance Scanner</h2>}
        >
            <Head title="Attendance Scanner" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
                            <Link
                                href={route('admin.attendance.monitor')}
                                className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                                Back to Monitor
                            </Link>
                        </div>

                        {/* Visual Notifications */}
                        {scanResult && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Success! </strong>
                                <span className="block sm:inline">{scanResult.message}</span>
                            </div>
                        )}

                        {scanError && (
                            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{scanError}</span>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
                            <div id="reader" className="w-full"></div>
                        </div>

                        <div className="mt-4 text-center text-sm text-gray-500">
                            Point your camera at the session QR code to record attendance.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
