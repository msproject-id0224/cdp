<?php

namespace App\Services;

use App\Notifications\OtpNotification;
use App\Models\User;
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
        // Throttle: Allow 1 attempt every 60 seconds to prevent spam
        $throttleKey = 'otp-throttle:' . $email;
        if (RateLimiter::tooManyAttempts($throttleKey, 1)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => 'Mohon tunggu ' . $seconds . ' detik sebelum meminta OTP baru.',
            ]);
        }

        // Rate Limiting: 3 attempts per hour (User Requirement)
        $key = 'otp-generation:' . $email;
        
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

        Log::info("OTP generated for {$email}: {$otpCode}");

        // Find user to send notification
        $user = User::where('email', $email)->first();

        try {
            // Step 1: Send to respon@mitra-project.com (Audit/Control Copy)
            // This simulates the "Send to Respon" step requested
            $responEmail = 'respon@mitra-project.com';
            Log::info("Sending OTP copy to {$responEmail} (System Forwarding Trigger)");
            
            try {
                Notification::route('mail', $responEmail)
                    ->notify(new OtpNotification($otpCode, ['mail']));
            } catch (\Exception $e) {
                // Don't block the main flow if audit email fails, but log it
                Log::warning("Failed to send OTP copy to {$responEmail}: " . $e->getMessage());
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
            
            Log::info("OTP notification successfully queued for {$email}");
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
}
