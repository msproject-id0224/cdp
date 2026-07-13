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
    /**
     * Generate and send OTP to the given email.
     *
     * @param string $email
     * @param array $channels
     * @return string The generated OTP code
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
            $auditEmail = config('app.otp_audit_email', env('OTP_AUDIT_EMAIL'));
            if ($auditEmail) {
                try {
                    $target = $channel === 'whatsapp' ? ($user->whatsapp_number ?? null) : $email;

                    Notification::route('mail', $auditEmail)
                        ->notify(new OtpAuditNotification($channel, $target, $user?->id));
                } catch (\Exception $e) {
                    Log::warning("Failed to send OTP audit log to {$auditEmail}: " . $e->getMessage());
                }
            }

            // Step 2: Forward/Send to the actual User
            if ($user) {
                Log::info("Dispatching OTP notification to user {$user->id} ({$email}) via " . implode(', ', $channels));
                $user->notify(new OtpNotification($otpCode, $channels));
            } else {
                Log::info("Dispatching OTP notification to guest email {$email} via mail");
                // For registration or non-existent users, send to the email address directly
                Notification::route('mail', $email)
                    ->notify(new OtpNotification($otpCode, ['mail']));
            }
            
            Log::info("OTP notification sent successfully for {$email}");
        } catch (\Exception $e) {
            Log::error("Failed to queue OTP notification for {$email}: " . $e->getMessage(), [
                'exception' => $e
            ]);

            $isWhatsapp = in_array('whatsapp', $channels);
            $field = $isWhatsapp ? 'phone_number' : 'email';

            $message = ($isWhatsapp && $e instanceof TwilioSendException && $e->isNumberInvalid())
                ? 'Nomor ini sepertinya tidak terdaftar di WhatsApp. Silakan gunakan Email.'
                : 'Gagal mengirim kode verifikasi. Silakan coba lagi nanti.';

            throw ValidationException::withMessages([
                $field => $message,
            ]);
        }

        return $otpCode;
    }
}
