<?php

namespace App\Exceptions;

class QontakSendException extends \RuntimeException
{
    protected array $responseBody;

    public function __construct(string $message, int $statusCode, array $responseBody = [])
    {
        parent::__construct($message, $statusCode);
        $this->responseBody = $responseBody;
    }

    public function getResponseBody(): array
    {
        return $this->responseBody;
    }

    /**
     * Best-effort heuristic: does this failure look like "recipient has no WhatsApp account"
     * rather than a config/auth/network problem?
     *
     * NOTE: Qontak's exact error message wording for this case hasn't been verified against
     * a live account yet. Tune these keywords once a real "unregistered number" response has
     * been observed in production logs.
     */
    public function isNumberInvalid(): bool
    {
        $haystack = strtolower($this->getMessage() . ' ' . json_encode($this->responseBody));

        $needles = [
            'not registered',
            'not on whatsapp',
            'not a valid whatsapp',
            'invalid number',
            'invalid recipient',
            'invalid phone',
            'recipient not found',
            'number is not valid',
            'undeliverable',
            'not a whatsapp user',
        ];

        foreach ($needles as $needle) {
            if (str_contains($haystack, $needle)) {
                return true;
            }
        }

        return false;
    }
}
