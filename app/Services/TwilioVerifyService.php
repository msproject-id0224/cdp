<?php

namespace App\Services;

use App\Exceptions\TwilioSendException;
use Illuminate\Support\Facades\Log;
use Twilio\Exceptions\RestException;
use Twilio\Rest\Client;

class TwilioVerifyService
{
    protected Client $client;
    protected ?string $serviceSid;

    public function __construct(?Client $client = null)
    {
        $this->client = $client ?: new Client(config('services.twilio.sid'), config('services.twilio.token'));
        $this->serviceSid = config('services.twilio.verify_service_sid');
    }

    /**
     * Ask Twilio Verify to generate and send a code to the given E.164 number.
     * Twilio owns the code, its expiry, and its attempt limits — nothing is stored locally.
     */
    public function send(string $to, string $channel = 'whatsapp'): void
    {
        try {
            $this->client->verify->v2->services($this->serviceSid)
                ->verifications
                ->create($to, $channel);

            Log::info('Twilio Verify code sent', ['to' => $to, 'channel' => $channel]);
        } catch (RestException $e) {
            Log::error('Twilio Verify send failed', [
                'to' => $to,
                'channel' => $channel,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            throw new TwilioSendException($e->getMessage(), $e->getStatusCode(), $e->getCode());
        }
    }

    /**
     * Ask Twilio Verify to check a user-submitted code against the given number.
     * Returns true only when Twilio reports the code as approved (also false on
     * "no pending verification" — e.g. expired/already used/never sent).
     */
    public function check(string $to, string $code): bool
    {
        try {
            $result = $this->client->verify->v2->services($this->serviceSid)
                ->verificationChecks
                ->create(['code' => $code, 'to' => $to]);

            Log::info('Twilio Verify check result', ['to' => $to, 'status' => $result->status]);

            return $result->status === 'approved';
        } catch (RestException $e) {
            Log::warning('Twilio Verify check failed', [
                'to' => $to,
                'error' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);

            return false;
        }
    }
}
