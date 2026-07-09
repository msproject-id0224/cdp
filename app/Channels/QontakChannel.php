<?php

namespace App\Channels;

use App\Exceptions\QontakSendException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QontakChannel
{
    /**
     * Send the given notification via Mekari Qontak's WhatsApp Business API.
     *
     * @param  mixed  $notifiable
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return void
     */
    public function send($notifiable, Notification $notification)
    {
        if (!method_exists($notification, 'toQontak')) {
            return;
        }

        if (!($notifiable instanceof \App\Models\User)) {
            Log::warning('Qontak notification skipped: notifiable is not a User instance.');
            return;
        }

        $to = $notifiable->whatsapp_number;

        if (!$to) {
            Log::warning("Qontak notification skipped: no valid WhatsApp number for user {$notifiable->id}.");
            return;
        }

        $message = $notification->toQontak($notifiable);

        $baseUrl = rtrim(config('services.qontak.base_url'), '/');
        $token = config('services.qontak.token');
        $templateId = config('services.qontak.message_template_id');
        $channelIntegrationId = config('services.qontak.channel_integration_id');
        $language = config('services.qontak.language', 'id');

        try {
            $response = Http::withToken($token)
                ->timeout(10)
                ->post("{$baseUrl}/broadcasts/whatsapp/direct", [
                    'to_name' => $message['to_name'],
                    'to_number' => $to,
                    'message_template_id' => $templateId,
                    'channel_integration_id' => $channelIntegrationId,
                    'language' => ['code' => $language],
                    'parameters' => [
                        'body' => [
                            ['key' => '1', 'value' => 'otp', 'value_text' => $message['otp']],
                        ],
                    ],
                ]);

            if ($response->failed()) {
                $body = $response->json() ?? [];
                $errorMessage = $body['error']['message']
                    ?? $body['message']
                    ?? $body['error']
                    ?? ('HTTP ' . $response->status());
                $errorMessage = is_string($errorMessage) ? $errorMessage : json_encode($errorMessage);

                Log::error('Qontak WhatsApp send failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'to' => $to,
                ]);

                throw new QontakSendException($errorMessage, $response->status(), $body);
            }

            Log::info('Qontak WhatsApp OTP sent successfully', [
                'to' => $to,
                'status' => $response->status(),
            ]);
        } catch (ConnectionException $e) {
            Log::error('Qontak WhatsApp send failed: connection error', [
                'error' => $e->getMessage(),
                'to' => $to,
            ]);

            throw $e;
        }
    }
}
