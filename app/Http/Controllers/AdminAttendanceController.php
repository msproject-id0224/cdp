<?php

namespace App\Http\Controllers;

use App\Mail\AttendanceQRMail;
use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\ParticipantMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminAttendanceController extends Controller
{
    // ─────────────────────────────────────────
    // SESSION STATUS PAGE
    // ─────────────────────────────────────────

    /**
     * Page: Show today's meeting list with their auto-generated session status.
     * Sessions are created automatically on approval; emails are sent by the scheduler.
     */
    public function sessions()
    {
        $today = Carbon::today();

        $meetings = ParticipantMeeting::with(['mentor', 'attendanceSession'])
            ->whereDate('scheduled_at', $today)
            ->orderBy('scheduled_at', 'asc')
            ->get()
            ->map(function ($meeting) {
                $session = $meeting->attendanceSession;
                return [
                    'id'           => $meeting->id,
                    'agenda'       => $meeting->agenda,
                    'mentor_name'  => $meeting->mentor?->name ?? 'Unknown',
                    'mentor_email' => $meeting->mentor?->email ?? null,
                    'scheduled_at' => $meeting->scheduled_at,
                    'end_time'     => $meeting->end_time,
                    'meeting_status' => $meeting->status,
                    'session' => $session ? [
                        'id'            => $session->id,
                        'is_active'     => $session->is_active,
                        'activated_at'  => $session->activated_at,
                        'email_sent'    => $session->email_sent,
                        'email_sent_at' => $session->email_sent_at,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Attendance/Sessions', [
            'meetings' => $meetings,
        ]);
    }

    /**
     * API: Admin manually resends QR email to mentor (fallback if scheduler failed).
     */
    public function resendEmail(Request $request, $sessionId)
    {
        $session = AttendanceSession::with('meeting.mentor')->findOrFail($sessionId);

        if (!$session->meeting->mentor?->email) {
            return response()->json(['message' => 'Mentor tidak memiliki alamat email.'], 422);
        }

        // Ensure session is active when resending
        if (!$session->is_active) {
            $session->update(['is_active' => true, 'activated_at' => now()]);
        }

        Mail::to($session->meeting->mentor->email)->send(new AttendanceQRMail($session));
        $session->update(['email_sent' => true, 'email_sent_at' => now()]);

        return response()->json(['message' => 'Email QR berhasil dikirim ulang.']);
    }

    /**
     * API: Deactivate a session manually (emergency stop).
     */
    public function deactivateSession(Request $request, $sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);
        $session->update(['is_active' => false, 'expires_at' => now()]);

        return response()->json(['message' => 'Sesi absensi dinonaktifkan.']);
    }

    // ─────────────────────────────────────────
    // QR DISPLAY (admin screen for Android)
    // ─────────────────────────────────────────

    /**
     * Page: Show active QR codes on the admin screen for Android mentors to scan.
     */
    public function qrDisplay()
    {
        return Inertia::render('Admin/Attendance/QRCode');
    }

    /**
     * API: Return active sessions with QR payloads for the QR display page.
     * Filtered to sessions whose meeting is today and session is currently active.
     */
    public function getActiveSessions()
    {
        $now   = Carbon::now();
        $today = Carbon::today();

        $sessions = AttendanceSession::with('meeting.mentor')
            ->where('is_active', true)
            ->whereHas('meeting', fn($q) => $q->whereDate('scheduled_at', $today))
            ->get()
            ->filter(fn($s) => $s->isValid())
            ->map(function ($session) {
                $meeting   = $session->meeting;
                $qrPayload = base64_encode(json_encode([
                    'token'      => $session->token,
                    'meeting_id' => $meeting->id,
                    'type'       => 'mulai',
                ]));
                $checkoutQrPayload = base64_encode(json_encode([
                    'checkout_token' => $session->checkout_token,
                    'meeting_id'     => $meeting->id,
                    'type'           => 'selesai',
                ]));
                return [
                    'session_id'          => $session->id,
                    'meeting_id'          => $meeting->id,
                    'agenda'              => $meeting->agenda,
                    'mentor_name'         => $meeting->mentor?->name ?? 'Unknown',
                    'scheduled_at'        => $meeting->scheduled_at,
                    'end_time'            => $meeting->end_time,
                    'qr_payload'          => $qrPayload,
                    'checkout_qr_payload' => $checkoutQrPayload,
                    'expires_at'          => $session->expires_at,
                    'email_sent'          => $session->email_sent,
                ];
            })
            ->values();

        return response()->json(['sessions' => $sessions]);
    }

    // ─────────────────────────────────────────
    // MONITOR
    // ─────────────────────────────────────────

    /**
     * Page: Show all attendance records for today with the new column set.
     */
    public function monitor()
    {
        $today = Carbon::today();

        $attendances = Attendance::with(['user', 'meeting'])
            ->whereHas('meeting', fn($q) => $q->whereDate('scheduled_at', $today))
            ->whereNotNull('check_in_at')
            ->orderBy('check_in_at', 'asc')
            ->get()
            ->map(function ($att, $index) {
                return [
                    'no'                 => $index + 1,
                    'id'                 => $att->id,
                    'mentor_name'        => $att->user?->name ?? 'Unknown',
                    'agenda'             => $att->meeting?->agenda ?? '-',
                    'scheduled_at'       => $att->meeting?->scheduled_at,
                    'end_time'           => $att->meeting?->end_time,
                    'check_in_at'        => $att->check_in_at,
                    'check_out_at'       => $att->check_out_at,
                    'status'             => $att->status,
                    'device_type'        => $att->device_type,
                    'documentation_path' => $att->documentation_path,
                ];
            });

        $sessions = AttendanceSession::with('meeting')
            ->whereHas('meeting', fn($q) => $q->whereDate('scheduled_at', $today))
            ->get()
            ->map(fn($s) => [
                'meeting_id'   => $s->participant_meeting_id,
                'is_active'    => $s->is_active,
                'email_sent'   => $s->email_sent,
                'activated_at' => $s->activated_at,
            ]);

        return Inertia::render('Admin/Attendance/Monitor', [
            'attendances' => $attendances,
            'sessions'    => $sessions,
        ]);
    }
}
