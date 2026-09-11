<?php

namespace App\Http\Controllers\Api\V1;

use App\Exceptions\OtpVerificationException;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

/**
 * Auth stateless untuk klien mobile (Bearer token via Sanctum) -- lihat
 * FLUTTER_MIGRATION_PROMPTS.md Bagian B, Fase 0. Verifikasi OTP memakai
 * OtpService::verifyOtp() yang sama persis dipakai
 * App\Http\Controllers\Auth\OtpController (web) -- jangan duplikasi
 * business logic itu di sini.
 */
class AuthController extends Controller
{
    public function __construct(private readonly OtpService $otpService)
    {
    }

    public function requestOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email:rfc,dns',
        ]);

        try {
            $this->otpService->generateAndSend($request->string('email')->toString());

            return response()->json([
                'message' => 'Kode OTP telah dikirim ke email Anda.',
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
                'timestamp' => now()->toIso8601String(),
            ], 429);
        }
    }

    public function resendOtp(Request $request): JsonResponse
    {
        // Sama seperti requestOtp() -- API tidak punya "sesi" yang menyimpan
        // email seperti web (OtpController::resend() baca dari session()),
        // jadi klien mobile selalu mengirim email eksplisit di kedua endpoint.
        return $this->requestOtp($request);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email:rfc,dns',
            'otp' => 'required|string|size:6|regex:/^[0-9]+$/',
        ], [
            'otp.regex' => 'Kode OTP harus berupa angka.',
            'otp.size' => 'Kode OTP harus 6 digit.',
        ]);

        $email = $request->string('email')->toString();
        $otpCode = $request->string('otp')->toString();

        // Rate limit per-IP terpisah dari bucket web (otp-verify-ip:*) supaya
        // partisipan yang pakai web & mobile berbarengan tidak saling
        // menghabiskan jatah percobaan satu sama lain. Ambang batasnya sama
        // (5 percobaan / 15 menit) untuk postur keamanan yang setara.
        $ipKey = 'api-otp-verify-ip:' . $request->ip();

        if (RateLimiter::tooManyAttempts($ipKey, 5)) {
            $seconds = RateLimiter::availableIn($ipKey);
            Log::warning("API OTP rate limit exceeded for IP: {$request->ip()}", ['email' => $email]);

            return response()->json([
                'message' => 'Terlalu banyak percobaan. Silakan coba lagi dalam ' . ceil($seconds / 60) . ' menit.',
                'timestamp' => now()->toIso8601String(),
                'retry_after' => $seconds,
            ], 429);
        }

        RateLimiter::hit($ipKey, 900);

        try {
            $user = $this->otpService->verifyOtp($email, $otpCode, 'mail', $request->ip(), $request->userAgent());

            RateLimiter::clear($ipKey);

            $token = $user->createToken('mobile', ["role:{$user->role}"])->plainTextToken;

            return response()->json([
                'message' => 'Verification successful',
                'timestamp' => now()->toIso8601String(),
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ]);
        } catch (OtpVerificationException $e) {
            return match ($e->reasonCode) {
                OtpVerificationException::INVALID_OTP => response()->json([
                    'message' => 'Kode OTP salah.',
                    'timestamp' => now()->toIso8601String(),
                    'attempt_count' => RateLimiter::attempts($ipKey),
                    'attempts_remaining' => 5 - RateLimiter::attempts($ipKey),
                ], 401),
                OtpVerificationException::OTP_EXPIRED => response()->json([
                    'message' => 'Kode OTP telah kadaluarsa.',
                    'timestamp' => now()->toIso8601String(),
                ], 401),
                OtpVerificationException::INACTIVE_ACCOUNT => response()->json([
                    'message' => 'Account inactive',
                    'timestamp' => now()->toIso8601String(),
                ], 403),
                OtpVerificationException::UNDERAGE => response()->json([
                    'message' => 'Access denied. Participants must be at least '
                        . ($e->context['min_required'] ?? 13) . ' years old.',
                    'timestamp' => now()->toIso8601String(),
                ], 403),
                OtpVerificationException::USER_NOT_FOUND => response()->json([
                    'message' => 'User not found.',
                    'timestamp' => now()->toIso8601String(),
                ], 404),
                default => response()->json([
                    'message' => 'System error occurred. Please try again later.',
                    'timestamp' => now()->toIso8601String(),
                ], 500),
            };
        } catch (\Exception $e) {
            Log::error("API OTP Verification System Error for {$email}: " . $e->getMessage());

            return response()->json([
                'message' => 'System error occurred. Please try again later.',
                'timestamp' => now()->toIso8601String(),
            ], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
