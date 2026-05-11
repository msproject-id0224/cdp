<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ParticipantGift;

class GiftProofUploadedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $gift;

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantGift $gift)
    {
        $this->gift = $gift;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Simplified for now, can add 'mail' later
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'gift_id' => $this->gift->id,
            'gift_code' => $this->gift->gift_code,
            'message' => 'Bukti foto penerimaan hadiah telah diunggah oleh mentor. Menunggu verifikasi.',
            'action_url' => route('gifts.edit', $this->gift->id), // Admin verify via edit/show page
        ];
    }
}
