<?php

namespace App\Notifications;

use App\Models\ParticipantMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ScheduleApprovalRequest extends Notification implements ShouldQueue
{
    use Queueable;

    public $meeting;
    public $action;

    /**
     * Create a new notification instance.
     *
     * @param string $action 'new' for a new schedule submission, 'deletion' for a mentor's deletion request.
     */
    public function __construct(ParticipantMeeting $meeting, string $action = 'new')
    {
        $this->meeting = $meeting;
        $this->action = $action;
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
        $mentorName = $this->meeting->mentor ? $this->meeting->mentor->name : 'Unknown Mentor';
        $date = $this->meeting->scheduled_at->format('F j, Y');
        $time = $this->meeting->scheduled_at->format('H:i') . ' - ' . $this->meeting->end_time->format('H:i');

        $isDeletion = $this->action === 'deletion';

        return (new MailMessage)
            ->subject($isDeletion ? 'Mentor Schedule Deletion Request' : 'New Mentor Schedule Pending Approval')
            ->greeting('Hello Admin,')
            ->line($isDeletion
                ? "{$mentorName} has requested to delete a scheduled meeting and is awaiting your approval."
                : "A new schedule has been created by {$mentorName} and is pending your approval.")
            ->line("**Agenda:** {$this->meeting->agenda}")
            ->line("**Date:** {$date}")
            ->line("**Time:** {$time}")
            ->line("**Participants:** " . $this->meeting->participants->pluck('name')->join(', '))
            ->action('View Schedule', url('/admin/schedules')) // Assuming a route, or just /dashboard
            ->line($isDeletion ? 'Please review and approve or reject this deletion request.' : 'Please review and approve this schedule.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $isDeletion = $this->action === 'deletion';
        $mentorName = $this->meeting->mentor ? $this->meeting->mentor->name : 'Unknown';

        return [
            'meeting_id' => $this->meeting->id,
            'mentor_id' => $this->meeting->mentor_id,
            'mentor_name' => $mentorName,
            'agenda' => $this->meeting->agenda,
            'scheduled_at' => $this->meeting->scheduled_at->toIso8601String(),
            'type' => $isDeletion ? 'schedule_deletion_request' : 'schedule_approval_request',
            'message' => $isDeletion
                ? "{$mentorName} requested to delete a meeting: {$this->meeting->agenda}"
                : "New schedule request from {$mentorName}: {$this->meeting->agenda}",
        ];
    }
}
