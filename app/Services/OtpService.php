<?php

namespace App\Services;

use App\Notifications\OtpNotification;
use App\Notifications\OtpAuditNotification;
use App\Models\User;
use App\Exceptions\TwilioSendException;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Models\Otp;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public function __construct(protected TwilioVerifyService $twilioVerify)
    {
    }

    /**
     * Generate and send OTP to the given email.
     *
     * WhatsApp is delivered entirely by Twilio Verify: Twilio generates, stores and expires
     * the code itself, so no local Otp record is created for that channel. Email keeps the
     * existing locally-generated/hashed/stored flow.
     *
     * @param string $email
     * @param array $channels
     * @return string The generated OTP code, or '' when Twilio Verify owns the code (WhatsApp)
     * @throws ValidationException
     */
    public function generateAndSend(string $email, array $channels = ['mail']): string
    {
        $channel = in_array('whatsapp', $channels) ? 'whatsapp' : 'mail';

        // Find user and validate the requested channel BEFORE touching the rate limiter,
        // so a mistyped/missing WhatsApp number doesn't burn the user's request budget.
        $user = User::where('email', $email)->first();

        if ($channel === 'whatsapp' && (!$user || !$user->whatsapp_number)) {
            throw ValidationException::withMessages([
                'phone_number' => 'Nomor WhatsApp tidak ditemukan untuk akun ini. Silakan gunakan Email.',
            ]);
        }

        // Throttle keys are scoped per channel: a failed/blocked WhatsApp send must not
        // lock the user out of the Email channel (or vice versa).
        $throttleKey = 'otp-throttle:' . $email . ':' . $channel;
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => 'Mohon tunggu ' . $seconds . ' detik sebelum meminta OTP baru.',
            ]);
        }

        // Rate Limiting: 3 attempts per hour per channel (User Requirement)
        $key = 'otp-generation:' . $email . ':' . $channel;

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => 'Terlalu banyak permintaan OTP. Anda hanya dapat meminta OTP 3 kali dalam 1 jam. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.',
            ]);
        }

        RateLimiter::hit($throttleKey, 60);
        RateLimiter::hit($key, 3600);

        if ($channel === 'whatsapp') {
            return $this->sendViaWhatsapp($user, $email);
        }

        return $this->sendViaMail($user, $email);
    }

    /**
     * Twilio Verify owns code generation/expiry/attempts for WhatsApp — we only trigger the send.
     */
    protected function sendViaWhatsapp(User $user, string $email): string
    {
        $to = $user->whatsapp_number_e164;

        try {
            $this->twilioVerify->send($to, 'whatsapp');

            $this->sendAuditNotification('whatsapp', $to, $user->id);

            Log::info("OTP (Twilio Verify) dispatched to user {$user->id} ({$email}) via whatsapp");
        } catch (\Exception $e) {
            Log::error("Failed to send Twilio Verify OTP for {$email}: " . $e->getMessage(), [
                'exception' => $e,
            ]);

            $message = ($e instanceof TwilioSendException && $e->isNumberInvalid())
                ? 'Nomor ini sepertinya tidak terdaftar di WhatsApp. Silakan gunakan Email.'
                : 'Gagal mengirim kode verifikasi. Silakan coba lagi nanti.';

            throw ValidationException::withMessages([
                'phone_number' => $message,
            ]);
        }

        // No local code to return — Twilio Verify checks the code itself.
        return '';
    }

    protected function sendViaMail(?User $user, string $email): string
    {
        // Generate Secure OTP (6 digits)
        $otpCode = (string) random_int(100000, 999999);

        try {
            // Store OTP in Database with 5 minutes expiry (Hashed)
            Otp::updateOrCreate(
                ['email' => $email],
                [
                    'code' => Hash::make($otpCode),
                    'expires_at' => Carbon::now()->addMinutes(5),
                    'status' => 'pending'
                ]
            );
        } catch (\Exception $e) {
            Log::error("Database error saving OTP for {$email}: " . $e->getMessage());
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan sistem saat menyimpan OTP. Silakan coba lagi nanti.',
            ]);
        }

        Log::info("OTP generated for {$email}");

        try {
            $this->sendAuditNotification('mail', $email, $user?->id);

            if ($user) {
                Log::info("Dispatching OTP notification to user {$user->id} ({$email}) via mail");
                $user->notify(new OtpNotification($otpCode));
            } else {
                Log::info("Dispatching OTP notification to guest email {$email} via mail");
                // For registration or non-existent users, send to the email address directly
                Notification::route('mail', $email)
                    ->notify(new OtpNotification($otpCode));
            }

            Log::info("OTP notification sent successfully for {$email}");
        } catch (\Exception $e) {
            Log::error("Failed to queue OTP notification for {$email}: " . $e->getMessage(), [
                'exception' => $e
            ]);

            throw ValidationException::withMessages([
                'email' => 'Gagal mengirim kode verifikasi. Silakan coba lagi nanti.',
            ]);
        }

        return $otpCode;
    }

    protected function sendAuditNotification(string $channel, ?string $target, ?int $userId): void
    {
        $auditEmail = config('app.otp_audit_email', env('OTP_AUDIT_EMAIL'));
        if (!$auditEmail) {
            return;
        }

        try {
            Notification::route('mail', $auditEmail)
                ->notify(new OtpAuditNotification($channel, $target, $userId));
        } catch (\Exception $e) {
            Log::warning("Failed to send OTP audit log to {$auditEmail}: " . $e->getMessage());
        }
    }
}
