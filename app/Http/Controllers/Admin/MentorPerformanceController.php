<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ParticipantMeeting;
use App\Models\Attendance;
use App\Models\Letter;
use App\Models\ParticipantGift;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MentorPerformanceController extends Controller
{
    public function index()
    {
        $mentors = User::where('role', 'mentor')
            ->where('is_active', true)
            ->orderBy('first_name')
            ->get();

        $performances = $mentors->map(function (User $mentor) {
            $scores = $this->calculateScores($mentor);
            $total  = round(array_sum($scores) / count($scores), 2);

            return [
                'id'          => $mentor->id,
                'name'        => trim("{$mentor->first_name} {$mentor->last_name}"),
                'email'       => $mentor->email,
                'photo'       => $mentor->profile_photo_url ?? null,
                'scores'      => $scores,
                'total'       => $total,
                'participants_count' => $mentor->assignedParticipants()->count(),
            ];
        });

        return Inertia::render('Admin/MentorPerformance', [
            'performances' => $performances,
        ]);
    }

    // ─── Public: also called from Dashboard (mentor self-view) ──────────────
    public function getScoresForMentor(User $mentor): array
    {
        $scores = $this->calculateScores($mentor);
        $total  = round(array_sum($scores) / count($scores), 2);

        return array_merge($scores, ['total' => $total]);
    }

    // ────────────────────────────────────────────────────────────────────────
    //  Score Calculations
    // ────────────────────────────────────────────────────────────────────────

    private function calculateScores(User $mentor): array
    {
        return [
            'jadwal'      => $this->scoreJadwal($mentor),
            'kehadiran'   => $this->scoreKehadiran($mentor),
            'surat'       => $this->scoreSurat($mentor),
            'gift'        => $this->scoreGift($mentor),
            'update_anak' => $this->scoreUpdateAnak($mentor),
        ];
    }

    /**
     * Penilaian Jadwal — 10 pts max
     * Semua field wajib jadwal terisi (agenda, lokasi, catatan, dll).
     */
    private function scoreJadwal(User $mentor): float
    {
        $requiredFields = ['agenda', 'location', 'scheduled_at', 'end_time', 'tools_materials', 'notes'];

        $meetings = ParticipantMeeting::where('mentor_id', $mentor->id)->get();
        $total    = $meetings->count();

        if ($total === 0) {
            return 0.00;
        }

        $complete = $meetings->filter(function ($m) use ($requiredFields) {
            foreach ($requiredFields as $field) {
                if (empty($m->$field)) {
                    return false;
                }
            }
            return true;
        })->count();

        return round(($complete / $total) * 10, 2);
    }

    /**
     * Penilaian Kehadiran — 10 pts max
     * Hadir=1.0, Izin/Sakit=0.6, Alpha=0 per pertemuan.
     * Bonus: ketepatan waktu check-in (≤15 menit dari scheduled_at).
     */
    private function scoreKehadiran(User $mentor): float
    {
        // Ambil semua meeting milik mentor ini
        $meetingIds = ParticipantMeeting::where('mentor_id', $mentor->id)->pluck('id');

        if ($meetingIds->isEmpty()) {
            return 0.00;
        }

        // Absensi mentor di meeting-meeting tersebut
        $attendances = Attendance::whereIn('participant_meeting_id', $meetingIds)
            ->where('user_id', $mentor->id)
            ->with('meeting')
            ->get();

        $totalMeetings = $meetingIds->count();
        $weightedSum   = 0;

        foreach ($attendances as $att) {
            $statusWeight = match ($att->status) {
                'Hadir' => 1.0,
                'Izin'  => 0.6,
                'Sakit' => 0.6,
                default => 0.0, // Alpha / tidak hadir
            };

            // Ketepatan waktu: jika Hadir dan check_in_at tersedia
            if ($statusWeight === 1.0 && $att->check_in_at && $att->meeting?->scheduled_at) {
                $lateMinutes = $att->check_in_at->diffInMinutes($att->meeting->scheduled_at, false);
                // lateMinutes positif = datang sebelum jadwal (ontime), negatif = terlambat
                if ($lateMinutes < -30) {
                    $statusWeight = 0.7; // terlambat >30 menit
                } elseif ($lateMinutes < -15) {
                    $statusWeight = 0.85; // terlambat 15–30 menit
                }
                // ≤ 15 menit: tetap 1.0
            }

            $weightedSum += $statusWeight;
        }

        // Meeting yang tidak ada absensi sama sekali dihitung 0
        return round(($weightedSum / $totalMeetings) * 10, 2);
    }

    /**
     * Penilaian Penulisan Surat Anak — 10 pts max
     * Berapa persen peserta (anak) yang mempunyai surat (berdasarkan letter_number).
     */
    private function scoreSurat(User $mentor): float
    {
        $participantIds = $mentor->assignedParticipants()->pluck('id');
        $total          = $participantIds->count();

        if ($total === 0) {
            return 0.00;
        }

        // Peserta yang sudah menerima minimal 1 surat dengan letter_number
        $withLetters = Letter::whereIn('recipient_id', $participantIds)
            ->whereNotNull('letter_number')
            ->where('letter_number', '!=', '')
            ->distinct('recipient_id')
            ->count('recipient_id');

        return round(($withLetters / $total) * 10, 2);
    }

    /**
     * Penilaian Pendampingan Gift Anak — 10 pts max
     * Kecepatan penerimaan gift: created_at → reception_date.
     *   ≤ 7  hari  : 1.00 per gift
     *   8–14 hari  : 0.85
     *   15–30 hari : 0.70
     *   > 30 hari  : 0.50
     * Gift belum diterima (pending) dihitung 0.4 (masih proses).
     * Gift returned dihitung 0.1.
     */
    private function scoreGift(User $mentor): float
    {
        $participantIds = $mentor->assignedParticipants()->pluck('id');

        if ($participantIds->isEmpty()) {
            return 0.00;
        }

        $gifts = ParticipantGift::whereIn('user_id', $participantIds)->get();
        $total = $gifts->count();

        if ($total === 0) {
            return 0.00;
        }

        $weightedSum = 0;

        foreach ($gifts as $gift) {
            if ($gift->status === 'received' && $gift->reception_date) {
                $days = $gift->created_at->diffInDays($gift->reception_date);
                $weightedSum += match (true) {
                    $days <= 7  => 1.00,
                    $days <= 14 => 0.85,
                    $days <= 30 => 0.70,
                    default     => 0.50,
                };
            } elseif ($gift->status === 'pending') {
                $weightedSum += 0.40;
            } elseif ($gift->status === 'returned') {
                $weightedSum += 0.10;
            }
        }

        return round(($weightedSum / $total) * 10, 2);
    }

    /**
     * Penilaian Update Anak — 10 pts max
     * Berapa persen peserta yang memiliki minimal 1 meeting berstatus
     * 'approved' atau 'completed' dengan catatan (notes) terisi.
     */
    private function scoreUpdateAnak(User $mentor): float
    {
        $participantIds = $mentor->assignedParticipants()->pluck('id');
        $total          = $participantIds->count();

        if ($total === 0) {
            return 0.00;
        }

        // Ambil meeting milik mentor yang sudah approved/completed dengan notes terisi
        $updatedParticipantIds = DB::table('meeting_participants')
            ->join('participant_meetings', 'meeting_participants.participant_meeting_id', '=', 'participant_meetings.id')
            ->where('participant_meetings.mentor_id', $mentor->id)
            ->whereIn('participant_meetings.status', ['approved', 'completed'])
            ->whereNotNull('participant_meetings.notes')
            ->where('participant_meetings.notes', '!=', '')
            ->whereIn('meeting_participants.user_id', $participantIds)
            ->distinct()
            ->pluck('meeting_participants.user_id');

        $updated = $updatedParticipantIds->count();

        return round(($updated / $total) * 10, 2);
    }
}
