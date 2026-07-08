<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Channels\TwilioChannel;
use App\Channels\QontakChannel;
use Illuminate\Support\Facades\Lang;

// OTP must be sent synchronously — time-sensitive, cannot depend on queue worker
class OtpNotification extends Notification
{

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
        // WhatsApp via Mekari Qontak
        if (in_array('whatsapp', $this->channels)) {
            $via[] = QontakChannel::class;
        }
        // SMS via Twilio
        if (in_array('twilio', $this->channels) || in_array('sms', $this->channels)) {
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
     * Get the Qontak (WhatsApp) representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toQontak(object $notifiable): array
    {
        return [
            'otp' => $this->otp,
            'to_name' => $notifiable->name ?? 'User',
        ];
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
