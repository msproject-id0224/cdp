<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\TwilioChannel;
use Illuminate\Support\Facades\Lang;

class OtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $otp;
    public $channels;

    /**
     * Create a new notification instance.
     */
    public function __construct($otp, $channels = ['mail'])
    {
        $this->otp = $otp;
        $this->channels = $channels;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        $via = [];
        if (in_array('mail', $this->channels)) {
            $via[] = 'mail';
        }
        // SMS/WhatsApp via Twilio
        if (in_array('twilio', $this->channels) || in_array('whatsapp', $this->channels) || in_array('sms', $this->channels)) {
            $via[] = TwilioChannel::class;
        }
        return $via;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(Lang::get('Verification Code'))
            ->view('emails.otp', ['code' => $this->otp]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'otp' => $this->otp,
            'channels' => $this->channels,
        ];
    }
}
