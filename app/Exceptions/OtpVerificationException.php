<?php

namespace App\Exceptions;

use Exception;

/**
 * Dilempar oleh OtpService::verifyOtp() saat verifikasi gagal. Pesan yang
 * ditampilkan ke pengguna SENGAJA tidak disimpan di sini -- OtpController
 * (web) dan Api\V1\AuthController (mobile) sudah punya wording & shape
 * response yang berbeda untuk beberapa kasus (mis. pesan `otp_expired` di
 * web lebih panjang dari yang di API) bahkan sebelum refactor ini, jadi
 * masing-masing controller yang memetakan `reasonCode` ke pesannya sendiri.
 * Yang dijamin SAMA antara web & API hanya keputusannya (reasonCode) dan
 * efek sampingnya (AuditLog, status OTP) -- itu semua terjadi di dalam
 * OtpService, sebelum exception ini dilempar.
 */
class OtpVerificationException extends Exception
{
    public const INVALID_OTP = 'invalid_otp';
    public const OTP_EXPIRED = 'otp_expired';
    public const USER_NOT_FOUND = 'user_not_found';
    public const INACTIVE_ACCOUNT = 'inactive_account';
    public const UNDERAGE = 'underage';

    /**
     * @param array<string, mixed> $context Data tambahan untuk logging (mis. age, min_required).
     */
    public function __construct(
        public readonly string $reasonCode,
        public readonly array $context = [],
    ) {
        parent::__construct("OTP verification failed: {$reasonCode}");
    }
}
