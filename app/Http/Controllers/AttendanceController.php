<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\ParticipantMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Show the mentor attendance page.
     * Table: No, Activity Description, Start/End, Status/Documentation
     */
    public function index()
    {
        $user = Auth::user();

        $attendances = Attendance::with(['meeting'])
            ->where('user_id', $user->id)
            ->whereNotNull('check_in_at')
            ->orderBy('check_in_at', 'asc')
            ->get()
            ->map(function ($att, $idx) {
                return [
                    'no'             => $idx + 1,
                    'id'             => $att->id,
                    'agenda'         => $att->meeting?->agenda ?? '-',
                    'scheduled_at'   => $att->meeting?->scheduled_at,
                    'end_time'       => $att->meeting?->end_time,
                    'check_in_at'    => $att->check_in_at,
                    'status'         => $att->status,
                    'device_type'    => $att->device_type,
                    'documentation_path' => $att->documentation_path,
                ];
            })
            ->values();

        return Inertia::render('Attendance/Index', [
            'attendances' => $attendances,
        ]);
    }

    /**
     * Mentor scans the QR barcode (decoded by frontend via camera or file upload).
     * Receives the decoded QR payload (base64 JSON) and records attendance.
     */
    public function scan(Request $request)
    {
        $request->validate([
            'qr_payload'  => 'required|string',
            'device_type' => 'nullable|in:android,pc',
        ]);

        $user    = Auth::user();
        $decoded = json_decode(base64_decode($request->qr_payload), true);

        if (!$decoded || !isset($decoded['meeting_id']) || !isset($decoded['type'])) {
            return response()->json(['message' => 'Barcode tidak valid.'], 422);
        }

        $type = $decoded['type']; // 'mulai' or 'selesai'

        if ($type === 'mulai') {
            // ── CHECK-IN (MULAI) ──────────────────────────────────────────
            if (!isset($decoded['token'])) {
                return response()->json(['message' => 'Barcode MULAI tidak valid.'], 422);
            }

            $session = AttendanceSession::where('token', $decoded['token'])
                ->where('participant_meeting_id', $decoded['meeting_id'])
                ->first();

            if (!$session) {
                return response()->json(['message' => 'Sesi tidak ditemukan. Pastikan barcode benar.'], 404);
            }
            if (!$session->isValid()) {
                return response()->json(['message' => 'Sesi absensi sudah tidak aktif atau kedaluwarsa.'], 422);
            }

            $meeting = $session->meeting()->with('mentor')->first();

            if ($meeting->mentor_id !== $user->id) {
                return response()->json(['message' => 'Anda bukan mentor untuk kegiatan ini.'], 403);
            }

            $existing = Attendance::where('participant_meeting_id', $meeting->id)
                ->where('user_id', $user->id)
                ->whereNotNull('check_in_at')
                ->first();

            if ($existing) {
                return response()->json([
                    'message' => 'Anda sudah scan QR MULAI untuk kegiatan ini.',
                    'status'  => 'already_scanned',
                ], 200);
            }

            $scanOrder = Attendance::where('participant_meeting_id', $meeting->id)
                ->whereNotNull('check_in_at')->count() + 1;

            Attendance::create([
                'participant_meeting_id' => $meeting->id,
                'user_id'                => $user->id,
                'check_in_at'            => now(),
                'status'                 => 'Hadir',
                'scan_order'             => $scanOrder,
                'qr_token_used'          => $decoded['token'],
                'device_type'            => $request->device_type ?? 'android',
            ]);

            return response()->json([
                'message' => '✓ Absensi MULAI berhasil dicatat!',
                'status'  => 'success',
                'type'    => 'mulai',
                'agenda'  => $meeting->agenda,
                'time'    => now()->format('H:i'),
            ]);

        } elseif ($type === 'selesai') {
            // ── CHECK-OUT (SELESAI) ───────────────────────────────────────
            if (!isset($decoded['checkout_token'])) {
                return response()->json(['message' => 'Barcode SELESAI tidak valid.'], 422);
            }

            $session = AttendanceSession::where('checkout_token', $decoded['checkout_token'])
                ->where('participant_meeting_id', $decoded['meeting_id'])
                ->first();

            if (!$session) {
                return response()->json(['message' => 'Sesi tidak ditemukan. Pastikan barcode benar.'], 404);
            }
            if (!$session->isValid()) {
                return response()->json(['message' => 'Sesi absensi sudah tidak aktif atau kedaluwarsa.'], 422);
            }

            $meeting = $session->meeting()->with('mentor')->first();

            if ($meeting->mentor_id !== $user->id) {
                return response()->json(['message' => 'Anda bukan mentor untuk kegiatan ini.'], 403);
            }

            $attendance = Attendance::where('participant_meeting_id', $meeting->id)
                ->where('user_id', $user->id)
                ->whereNotNull('check_in_at')
                ->first();

            if (!$attendance) {
                return response()->json(['message' => 'Anda belum scan QR MULAI. Scan QR MULAI terlebih dahulu.'], 422);
            }

            if ($attendance->check_out_at) {
                return response()->json([
                    'message' => 'Anda sudah scan QR SELESAI untuk kegiatan ini.',
                    'status'  => 'already_scanned',
                ], 200);
            }

            $attendance->update(['check_out_at' => now()]);

            return response()->json([
                'message' => '✓ Absensi SELESAI berhasil dicatat!',
                'status'  => 'success',
                'type'    => 'selesai',
                'agenda'  => $meeting->agenda,
                'time'    => now()->format('H:i'),
            ]);

        } else {
            return response()->json(['message' => 'Tipe barcode tidak dikenal.'], 422);
        }
    }

    /**
     * Mentor uploads teaching documentation photo for an existing attendance record.
     */
    public function uploadDocumentation(Request $request, $attendanceId)
    {
        $request->validate([
            'documentation' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $user       = Auth::user();
        $attendance = Attendance::where('id', $attendanceId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $path = $request->file('documentation')->store('attendance_docs', 'public');
        $attendance->update([
            'documentation_path' => '/storage/' . $path,
            'check_out_at'       => now(), // mark end when documentation uploaded
        ]);

        return response()->json([
            'message'            => 'Dokumentasi berhasil diupload.',
            'documentation_path' => $attendance->documentation_path,
            'check_out_at'       => $attendance->check_out_at,
        ]);
    }
}
