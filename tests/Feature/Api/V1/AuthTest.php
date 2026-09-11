<?php

namespace Tests\Feature\Api\V1;

use App\Models\Otp;
use App\Models\User;
use App\Notifications\OtpNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Rute request/verify OTP memvalidasi `email:rfc,dns` (aturan yang
     * sudah ada sejak OtpController::verify() sebelum refactor ini), yang
     * benar-benar melakukan DNS lookup pada domainnya. Domain palsu bawaan
     * Faker (`@example.org`, dst.) tidak selalu py record DNS di lingkungan
     * test -- jadi di sini dipakai domain nyata (`gmail.com`) dengan
     * local-part acak supaya tetap unik antar test.
     */
    private function makeParticipant(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role' => 'participant',
            'email' => 'rmd-test-' . Str::random(10) . '@gmail.com',
        ], $attributes));
    }

    public function test_request_otp_creates_pending_otp_and_sends_notification(): void
    {
        Notification::fake();

        $user = $this->makeParticipant();

        $response = $this->postJson('/api/v1/auth/otp/request', ['email' => $user->email]);

        $response->assertOk()->assertJsonStructure(['message', 'timestamp']);
        $this->assertDatabaseHas('otps', ['email' => $user->email, 'status' => 'pending']);
        Notification::assertSentTo($user, OtpNotification::class);
    }

    public function test_verify_otp_issues_sanctum_token_and_logs_audit_success(): void
    {
        $user = $this->makeParticipant(['date_of_birth' => now()->subYears(15)]);

        $otp = Otp::create([
            'email' => $user->email,
            'code' => Hash::make('123456'),
            'expires_at' => now()->addMinutes(5),
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/v1/auth/otp/verify', [
            'email' => $user->email,
            'otp' => '123456',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'token_type', 'user' => ['id', 'email', 'role']])
            ->assertJsonPath('user.email', $user->email);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'LOGIN_SUCCESS',
        ]);
        $this->assertSame('used', $otp->fresh()->status);
    }

    public function test_verify_otp_rejects_wrong_code(): void
    {
        $user = $this->makeParticipant();

        Otp::create([
            'email' => $user->email,
            'code' => Hash::make('123456'),
            'expires_at' => now()->addMinutes(5),
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/v1/auth/otp/verify', [
            'email' => $user->email,
            'otp' => '000000',
        ]);

        $response->assertStatus(401)->assertJsonPath('message', 'Kode OTP salah.');
    }

    public function test_verify_otp_blocks_underage_participant_and_logs_audit(): void
    {
        // Di bawah User::MINIMUM_PARTICIPANT_AGE (13).
        $user = $this->makeParticipant(['date_of_birth' => now()->subYears(10)]);

        Otp::create([
            'email' => $user->email,
            'code' => Hash::make('123456'),
            'expires_at' => now()->addMinutes(5),
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/v1/auth/otp/verify', [
            'email' => $user->email,
            'otp' => '123456',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action' => 'LOGIN_BLOCKED_UNDERAGE',
        ]);
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_type' => User::class,
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_logout_revokes_current_token(): void
    {
        $user = $this->makeParticipant();
        $token = $user->createToken('mobile')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $response->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
