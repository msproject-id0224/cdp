<?php

namespace App\Notifications;

use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ScheduleActivityNotification extends Notification
{
    use Queueable;

    public function __construct(public Schedule $schedule) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'        => 'schedule_activity',
            'title'       => 'Jadwal Baru: ' . $this->schedule->name,
            'message'     => 'Jadwal baru telah dibuat: ' . $this->schedule->name
                           . ' pada ' . $this->schedule->date
                           . ' pukul ' . substr($this->schedule->start_time, 0, 5)
                           . '–' . substr($this->schedule->end_time, 0, 5)
                           . ($this->schedule->location ? ' di ' . $this->schedule->location : '') . '.',
            'schedule_id' => $this->schedule->id,
            'date'        => $this->schedule->date,
            'start_time'  => $this->schedule->start_time,
            'end_time'    => $this->schedule->end_time,
            'location'    => $this->schedule->location,
            'priority'    => $this->schedule->priority,
        ];
    }
}
