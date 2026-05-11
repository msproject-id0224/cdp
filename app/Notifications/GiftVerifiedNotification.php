<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ParticipantGift;

class GiftVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $gift;
    public $status;

    /**
     * Create a new notification instance.
     */
    public function __construct(ParticipantGift $gift, string $status)
    {
        $this->gift = $gift;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $statusMsg = $this->status === 'received' ? 'diterima dan diverifikasi' : 'ditolak/dikembalikan';
        return [
            'gift_id' => $this->gift->id,
            'gift_code' => $this->gift->gift_code,
            'message' => "Status penerimaan hadiah telah diperbarui menjadi: {$statusMsg}.",
            'action_url' => '#', // No specific action needed
        ];
    }
}
