<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Services\OtpService;
use App\Exceptions\OtpVerificationException;

class OtpController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function show(Request $request)
    {
        return Inertia::render('Auth/VerifyOtp', [
            'email' => session('email', 'user@example.com'),
            'channel' => session('otp_channel', 'mail'),
            'displayTarget' => session('otp_display', session('email', 'user@example.com')),
        ]);
    }

    public function verify(Request $request)
    {
        $isApi = $request->wantsJson() && !$request->header('X-Inertia');

        // 1. Validation
        try {
            $request->validate([
                'otp' => 'required|string|size:6|regex:/^[0-9]+$/',
                'email' => $isApi ? 'nullable|email:rfc,dns' : 'nullable',
            ], [
                'otp.regex' => 'Kode OTP harus berupa angka.',
                'otp.size' => 'Kode OTP harus 6 digit.',
            ]);
        } catch (ValidationException $e) {
            if ($isApi) {
                return response()->json([
                    'message' => 'Invalid format',
                    'errors' => $e->errors(),
                    'timestamp' => now()->toIso8601String(),
                ], 400);
            }
            throw $e;
        }

        $otpCode = $request->otp;
        // Prioritize explicit email in request (for API), fallback to session
        $email = $request->input('email') ?? session('email');
        $channel = session('otp_channel', 'mail');

        if (!$email) {
            if ($isApi) {
                return response()->json([
                    'message' => 'Email is required',
                    'timestamp' => now()->toIso8601String(),
                ], 400);
            }
            return redirect()->route('login')->withErrors(['email' => 'Sesi login telah berakhir.']);
        }

        // 2. Rate Limiting (IP based, 5 attempts per 15 mins)
        // We use IP to prevent brute force from same source
        $ipKey = 'otp-verify-ip:' . $request->ip();

        if (RateLimiter::tooManyAttempts($ipKey, 5)) {
            $seconds = RateLimiter::availableIn($ipKey);

            Log::warning("OTP Rate limit exceeded for IP: {$request->ip()}", ['email' => $email]);

            $message = 'Terlalu banyak percobaan. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.';

            if ($isApi) {
                return response()->json([
                    'message' => $message,
                    'timestamp' => now()->toIso8601String(),
                    'retry_after' => $seconds
                ], 429);
            }
            return back()->withErrors(['otp' => $message]);
        }

        // Increment attempts (expires in 15 minutes = 900 seconds)
        RateLimiter::hit($ipKey, 900);

        Log::info("OTP Verification attempt", [
            'email' => $email,
            'ip' => $request->ip(),
            'timestamp' => now()->toIso8601String()
        ]);

        // 3-4. Verify OTP & resolve user (logic bersama: OtpService::verifyOtp(),
        // dipakai ulang persis oleh Api\V1\AuthController::verifyOtp() untuk mobile).
        try {
            $user = $this->otpService->verifyOtp($email, $otpCode, $channel, $request->ip(), $request->userAgent());

            // Success - Clear Rate Limit
            RateLimiter::clear($ipKey);

            Auth::login($user);

            if ($isApi) {
                return response()->json([
                    'message' => 'Verification successful',
                    'timestamp' => now()->toIso8601String(),
                    'user' => $user,
                    'redirect_url' => route('dashboard'),
                ], 200);
            }

            return redirect()->intended(route('dashboard'));
        } catch (OtpVerificationException $e) {
            if ($e->reasonCode === OtpVerificationException::INVALID_OTP) {
                $attemptCount = RateLimiter::attempts($ipKey);

                if ($isApi) {
                    return response()->json([
                        'message' => 'Kode OTP salah.',
                        'timestamp' => now()->toIso8601String(),
                        'attempt_count' => $attemptCount,
                        'attempts_remaining' => 5 - $attemptCount,
                    ], 401);
                }
                return back()->withErrors(['otp' => 'Kode OTP salah.']);
            }

            if ($e->reasonCode === OtpVerificationException::OTP_EXPIRED) {
                if ($isApi) {
                    return response()->json([
                        'message' => 'Kode OTP telah kadaluarsa.',
                        'timestamp' => now()->toIso8601String(),
                    ], 401);
                }
                return back()->withErrors(['otp' => 'Kode OTP telah kadaluarsa. Silakan minta OTP baru.']);
            }

            if ($e->reasonCode === OtpVerificationException::INACTIVE_ACCOUNT) {
                if ($isApi) return response()->json(['message' => 'Account inactive'], 403);
                return back()->withErrors(['email' => 'Akun Anda tidak aktif. Silakan hubungi admin.']);
            }

            if ($e->reasonCode === OtpVerificationException::UNDERAGE) {
                $msg = "Access denied. Participants must be at least " . ($e->context['min_required'] ?? 13) . " years old.";
                if ($isApi) return response()->json(['message' => $msg], 403);
                return back()->withErrors(['otp' => $msg]);
            }

            if ($e->reasonCode === OtpVerificationException::USER_NOT_FOUND) {
                if ($isApi) {
                    return response()->json([
                        'message' => 'User not found.',
                        'timestamp' => now()->toIso8601String(),
                    ], 404);
                }
                // Should not happen in normal flow if user exists
                return redirect()->route('login')->withErrors(['email' => 'User not found.']);
            }

            // Tidak ada reasonCode lain yang didefinisikan OtpService::verifyOtp() saat ini.
            Log::error("Unhandled OtpVerificationException reasonCode: {$e->reasonCode}", ['email' => $email]);
            if ($isApi) {
                return response()->json(['message' => 'System error occurred. Please try again later.', 'timestamp' => now()->toIso8601String()], 500);
            }
            return back()->withErrors(['otp' => 'Terjadi kesalahan sistem. Silakan coba lagi nanti.']);
        } catch (\Exception $e) {
            Log::error("OTP Verification System Error for {$email}: " . $e->getMessage());

            if ($isApi) {
                return response()->json([
                    'message' => 'System error occurred. Please try again later.',
                    'timestamp' => now()->toIso8601String(),
                ], 500);
            }
            return back()->withErrors(['otp' => 'Terjadi kesalahan sistem. Silakan coba lagi nanti.']);
        }
    }

    public function resend(Request $request)
    {
        $email = session('email');
        $isApi = $request->wantsJson() && !$request->header('X-Inertia');

        if (!$email) {
            if ($isApi) return response()->json(['message' => 'Session expired'], 401);
            return redirect()->route('login')->withErrors(['email' => 'Sesi login telah berakhir.']);
        }

        try {
            $channel = session('otp_channel', 'mail');
            $this->otpService->generateAndSend($email, [$channel]);

            if ($isApi) {
                return response()->json([
                    'message' => 'Kode OTP baru telah dikirim.',
                    'timestamp' => now()->toIso8601String(),
                ], 200);
            }
            $message = $channel === 'whatsapp'
                ? 'Kode OTP baru telah dikirim ke WhatsApp Anda.'
                : 'Kode OTP baru telah dikirim ke email Anda.';
            return back()->with('success', $message);
        } catch (ValidationException $e) {
            if ($isApi) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], 429);
            }
            throw $e;
        }
    }
}
