<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Audit trail for OTP requests. Deliberately does NOT include the OTP code itself —
// anyone with access to the audit mailbox must not be able to use it to log in as a user.
class OtpAuditNotification extends Notification
{
    public function __construct(
        protected string $channel,
        protected ?string $target,
        protected ?int $userId
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('OTP Request Audit Log')
            ->line('An OTP login code was requested.')
            ->line('Channel: ' . $this->channel)
            ->line('Target: ' . ($this->target ?? 'n/a'))
            ->line('User ID: ' . ($this->userId ?? 'n/a'))
            ->line('Time: ' . now()->toDateTimeString());
    }
}
