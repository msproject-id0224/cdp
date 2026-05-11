<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ParticipantMeeting;

class MeetingScheduled extends Notification implements ShouldQueue
{
    use Queueable;

    public $meeting;
    public $type; // 'new', 'update', 'cancel'

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantMeeting $meeting, string $type = 'new')
    {
        $this->meeting = $meeting;
        $this->type = $type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $subject = match($this->type) {
            'new' => 'New Meeting Scheduled',
            'update' => 'Meeting Updated',
            'cancel' => 'Meeting Cancelled',
            default => 'Meeting Notification'
        };

        $startTime = \Carbon\Carbon::parse($this->meeting->scheduled_at)->format('l, F j, Y g:i A');
        $endTime = \Carbon\Carbon::parse($this->meeting->end_time)->format('g:i A');

        $mail = (new MailMessage)
                    ->subject($subject)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('You have a meeting scheduled.')
                    ->line('Topic: ' . ($this->meeting->agenda ?? 'Mentoring Session'))
                    ->line('Time: ' . $startTime . ' - ' . $endTime)
                    ->line('Location: ' . ($this->meeting->location ?? 'Online'));
        
        if ($this->meeting->meeting_link) {
            $mail->line('Meeting Link: ' . $this->meeting->meeting_link);
        }

        if ($this->meeting->notes) {
            $mail->line('Notes: ' . $this->meeting->notes);
        }

        $mail->action('View Schedule', url('/dashboard'))
                    ->line('Thank you for using our application!');

        // Attach ICS file
        $icsContent = $this->generateIcs();
        $mail->attachData($icsContent, 'meeting.ics', [
            'mime' => 'text/calendar',
        ]);

        return $mail;
    }

    protected function generateIcs()
    {
        $start = gmdate('Ymd\THis\Z', strtotime($this->meeting->scheduled_at));
        $end = gmdate('Ymd\THis\Z', strtotime($this->meeting->end_time));
        $summary = "Meeting: " . ($this->meeting->agenda ?? 'Mentoring Session');
        $description = $this->meeting->notes ?? '';
        $location = $this->meeting->location ?? 'Online';
        $uid = "meeting-{$this->meeting->id}@child-dev-program";
        $dtstamp = gmdate('Ymd\THis\Z');
        
        // Status mapping
        $status = 'CONFIRMED';
        if ($this->type === 'cancel') $status = 'CANCELLED';
        
        $organizerName = $this->meeting->mentor->name ?? 'Mentor';
        $organizerEmail = $this->meeting->mentor->email ?? 'noreply@example.com';

        $ics = "BEGIN:VCALENDAR\r\n";
        $ics .= "VERSION:2.0\r\n";
        $ics .= "PRODID:-//Child Development Program//Meeting//EN\r\n";
        $ics .= "CALSCALE:GREGORIAN\r\n";
        $ics .= "METHOD:REQUEST\r\n";
        $ics .= "BEGIN:VEVENT\r\n";
        $ics .= "UID:{$uid}\r\n";
        $ics .= "DTSTAMP:{$dtstamp}\r\n";
        $ics .= "ORGANIZER;CN={$organizerName}:mailto:{$organizerEmail}\r\n";
        $ics .= "DTSTART:{$start}\r\n";
        $ics .= "DTEND:{$end}\r\n";
        $ics .= "SUMMARY:{$summary}\r\n";
        $ics .= "DESCRIPTION:{$description}\r\n";
        $ics .= "LOCATION:{$location}\r\n";
        $ics .= "STATUS:{$status}\r\n";
        $ics .= "END:VEVENT\r\n";
        $ics .= "END:VCALENDAR";

        return $ics;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
