<?php

namespace App\Notifications;

use App\Models\ParticipantGift;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GiftAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $gift;
    public $role; // 'participant' or 'mentor'

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantGift $gift, string $role)
    {
        $this->gift = $gift;
        $this->role = $role;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Add 'mail' if needed
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Placeholder for future email implementation
        return (new MailMessage)
                    ->line('You have a new gift assigned.')
                    ->action('View Gift', url('/dashboard'))
                    ->line('Thank you for being part of our program!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $message = '';
        if ($this->role === 'participant') {
            $message = "Anda telah menerima hadiah baru ({$this->gift->type}) dengan Kode: {$this->gift->gift_code}. Status: {$this->gift->status}.";
        } else {
            $participantName = $this->gift->user->name;
            $message = "Partisipan Anda, {$participantName}, telah menerima hadiah baru ({$this->gift->type}) dengan Kode: {$this->gift->gift_code}.";
        }

        return [
            'title' => 'Hadiah Baru',
            'message' => $message,
            'gift_id' => $this->gift->id,
            'gift_code' => $this->gift->gift_code,
            'type' => 'gift_assigned',
        ];
    }
}
