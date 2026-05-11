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

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantMeeting $meeting)
    {
        $this->meeting = $meeting;
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
        
        return (new MailMessage)
            ->subject('New Mentor Schedule Pending Approval')
            ->greeting('Hello Admin,')
            ->line("A new schedule has been created by {$mentorName} and is pending your approval.")
            ->line("**Agenda:** {$this->meeting->agenda}")
            ->line("**Date:** {$date}")
            ->line("**Time:** {$time}")
            ->line("**Participants:** " . $this->meeting->participants->pluck('name')->join(', '))
            ->action('View Schedule', url('/admin/schedules')) // Assuming a route, or just /dashboard
            ->line('Please review and approve this schedule.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'meeting_id' => $this->meeting->id,
            'mentor_id' => $this->meeting->mentor_id,
            'mentor_name' => $this->meeting->mentor ? $this->meeting->mentor->name : 'Unknown',
            'agenda' => $this->meeting->agenda,
            'scheduled_at' => $this->meeting->scheduled_at->toIso8601String(),
            'type' => 'schedule_approval_request',
            'message' => "New schedule request from {$this->meeting->mentor->name}: {$this->meeting->agenda}",
        ];
    }
}
