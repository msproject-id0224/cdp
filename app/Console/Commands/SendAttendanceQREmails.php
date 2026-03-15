<?php

namespace App\Console\Commands;

use App\Mail\AttendanceQRMail;
use App\Models\AttendanceSession;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAttendanceQREmails extends Command
{
    protected $signature   = 'attendance:send-qr-emails';
    protected $description = 'Send QR attendance barcodes to mentors 10 minutes before their scheduled meeting.';

    public function handle(): int
    {
        // Find all sessions whose meeting starts within the next 10 minutes
        // and email has not been sent yet.
        // Window: scheduled_at <= now + 10 minutes (so we catch it as we approach T-10min)
        $deadline = now()->addMinutes(10);

        $sessions = AttendanceSession::with('meeting.mentor')
            ->where('email_sent', false)
            ->whereHas('meeting', function ($q) use ($deadline) {
                $q->where('scheduled_at', '<=', $deadline)
                  ->where('scheduled_at', '>=', now()); // not yet started
            })
            ->get();

        if ($sessions->isEmpty()) {
            $this->line('[' . now()->format('H:i') . '] No pending QR emails.');
            return self::SUCCESS;
        }

        foreach ($sessions as $session) {
            $meeting = $session->meeting;
            $mentor  = $meeting?->mentor;

            if (!$mentor || !$mentor->email) {
                $this->warn("Session #{$session->id}: mentor has no email — skipped.");
                continue;
            }

            try {
                // Activate the session so the QR display shows it
                $session->update([
                    'is_active'    => true,
                    'activated_at' => now(),
                ]);

                Mail::to($mentor->email)->send(new AttendanceQRMail($session));

                $session->update([
                    'email_sent'    => true,
                    'email_sent_at' => now(),
                ]);

                $this->info("Session #{$session->id} — QR email sent to {$mentor->email} ({$mentor->name}).");
                Log::info("AttendanceQR sent: session #{$session->id}, mentor #{$mentor->id}");

            } catch (\Exception $e) {
                Log::error("AttendanceQR failed for session #{$session->id}: " . $e->getMessage());
                $this->error("Session #{$session->id} failed: " . $e->getMessage());
            }
        }

        return self::SUCCESS;
    }
}
