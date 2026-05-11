<?php

namespace App\Notifications;

use App\Models\ParticipantMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ScheduleDecisionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $meeting;
    public $decision; // 'approved' or 'rejected'
    public $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantMeeting $meeting, string $decision, ?string $reason = null)
    {
        $this->meeting = $meeting;
        $this->decision = $decision;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = ucfirst(str_replace('_', ' ', $this->decision));
        $subject = "Schedule Update: {$status} - {$this->meeting->agenda}";
        
        $mail = (new MailMessage)
            ->subject($subject)
            ->greeting("Hello {$notifiable->name},");

        if ($this->decision === 'approved') {
            $mail->line("Your schedule for '{$this->meeting->agenda}' has been approved and is now confirmed.");
        } elseif ($this->decision === 'rejected') {
            $mail->line("Your schedule for '{$this->meeting->agenda}' has been rejected.");
            if ($this->reason) {
                $mail->line("**Reason:** {$this->reason}");
            }
        } elseif ($this->decision === 'modification_requested') {
            $mail->line("Your schedule for '{$this->meeting->agenda}' requires modification.");
            if ($this->reason) {
                $mail->line("**Feedback:** {$this->reason}");
            }
            $mail->line("Please update your schedule based on the feedback and resubmit.");
        }

        $mail->action('View Schedule', url('/mentor/schedule'));

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusReadable = ucfirst(str_replace('_', ' ', $this->decision));
        return [
            'meeting_id' => $this->meeting->id,
            'status' => $this->decision,
            'reason' => $this->reason,
            'agenda' => $this->meeting->agenda,
            'scheduled_at' => $this->meeting->scheduled_at->toIso8601String(),
            'message' => "Your schedule '{$this->meeting->agenda}' status is now: {$statusReadable}.",
        ];
    }
}
