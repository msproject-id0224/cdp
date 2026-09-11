<?php

namespace App\Exceptions;

class TwilioSendException extends \RuntimeException
{
    protected int $twilioErrorCode;

    public function __construct(string $message, int $statusCode, int $twilioErrorCode = 0)
    {
        parent::__construct($message, $statusCode);
        $this->twilioErrorCode = $twilioErrorCode;
    }

    public function getTwilioErrorCode(): int
    {
        return $this->twilioErrorCode;
    }

    /**
     * Best-effort heuristic: does this failure look like "recipient has no WhatsApp account"
     * or an invalid number, rather than a config/auth/network problem?
     *
     * NOTE: These Twilio error codes/keywords haven't been verified against a live account yet.
     * Tune them once a real "unregistered number" response has been observed in production logs.
     */
    public function isNumberInvalid(): bool
    {
        $knownCodes = [
            21211, // Invalid 'To' Phone Number
            21614, // 'To' number is not a valid mobile number
            63003, // 'To' number is not currently reachable via WhatsApp
        ];

        if (in_array($this->twilioErrorCode, $knownCodes, true)) {
            return true;
        }

        $haystack = strtolower($this->getMessage());

        $needles = [
            'not a valid phone number',
            'not a valid mobile number',
            'not reachable',
            'not registered',
            'invalid number',
            'invalid recipient',
            'invalid phone',
        ];

        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }
}
