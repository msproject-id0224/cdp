<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class TwilioChannel
{
    protected $client;

    public function __construct(Client $client = null)
    {
        $this->client = $client;
    }

    /**
     * Send the given notification.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        if (!method_exists($notification, 'toTwilio')) {
            return;
        }

        $message = $notification->toTwilio($notifiable);
        $to = $notifiable->routeNotificationFor('twilio', $notification);

        if (!$to) {
            Log::warning("Twilio notification skipped: No phone number for notifiable.");
            return;
        }

        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');
        $useWhatsApp = $message['whatsapp'] ?? false;

        try {
            $client = $this->client ?: new Client($sid, $token);
            
            $payload = [
                'from' => $useWhatsApp ? "whatsapp:$from" : $from,
                'body' => $message['content']
            ];

            $recipient = $useWhatsApp ? "whatsapp:$to" : $to;

            $response = $client->messages->create($recipient, $payload);

            Log::info("Twilio message sent successfully", [
                'sid' => $response->sid,
                'to' => $to,
                'channel' => $useWhatsApp ? 'whatsapp' : 'sms'
            ]);

        } catch (\Exception $e) {
            Log::error("Twilio message failed", [
                'error' => $e->getMessage(),
                'to' => $to,
                'channel' => $useWhatsApp ? 'whatsapp' : 'sms'
            ]);
            
            // Re-throw if it's not a common user error to allow queue retries
            throw $e;
        }
    }
}
