<?php

namespace Tests\Feature\Api\V1;

use App\Models\Letter;
use App\Models\ParticipantGift;
use App\Models\ParticipantNote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * GET /api/v1/notes, /letters, /gifts -- baca-saja (keputusan Fase 2:
 * "read-only dulu"). Lihat ParticipantEngagementService untuk query-nya.
 */
class EngagementTest extends TestCase
{
    use RefreshDatabase;

    private function actingParticipant(): array
    {
        $user = User::factory()->create([
            'role' => 'participant',
            'email' => 'rmd-engage-' . Str::random(10) . '@gmail.com',
        ]);
        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }

    public function test_notes_only_returns_public_visibility(): void
    {
        [$user, $token] = $this->actingParticipant();
        $mentor = User::factory()->create(['role' => 'mentor', 'email' => 'mentor-' . Str::random(10) . '@gmail.com']);

        ParticipantNote::create(['participant_id' => $user->id, 'mentor_id' => $mentor->id, 'note' => 'Catatan privat', 'visibility' => 'private']);
        ParticipantNote::create(['participant_id' => $user->id, 'mentor_id' => $mentor->id, 'note' => 'Catatan publik', 'visibility' => 'public']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/notes');

        $response->assertOk()->assertJsonCount(1)->assertJsonFragment(['note' => 'Catatan publik']);
        $response->assertJsonMissing(['note' => 'Catatan privat']);
    }

    public function test_letters_returns_sent_and_received_with_direction(): void
    {
        [$user, $token] = $this->actingParticipant();
        $admin = User::factory()->create(['role' => 'admin', 'email' => 'admin-' . Str::random(10) . '@gmail.com']);

        Letter::create([
            'sender_id' => $admin->id, 'recipient_id' => $user->id,
            'letter_number' => 'L-001', 'subject' => 'Selamat datang', 'content' => 'Halo!',
            'status' => 'sent', 'sent_at' => now(),
        ]);
        Letter::create([
            'sender_id' => $user->id, 'recipient_id' => $admin->id,
            'letter_number' => 'L-002', 'subject' => 'Terima kasih', 'content' => 'Terima kasih ya!',
            'status' => 'sent', 'sent_at' => now(),
        ]);
        // Surat orang lain -- tidak boleh ikut kebawa.
        Letter::create([
            'sender_id' => $admin->id, 'recipient_id' => User::factory()->create(['role' => 'participant', 'email' => 'other-' . Str::random(10) . '@gmail.com'])->id,
            'letter_number' => 'L-003', 'subject' => 'Bukan punya kita', 'content' => '...',
            'status' => 'sent', 'sent_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/letters');

        $response->assertOk()->assertJsonCount(2, 'data');
        $numbers = collect($response->json('data'))->pluck('letter_number')->all();
        $this->assertEqualsCanonicalizing(['L-001', 'L-002'], $numbers);
    }

    public function test_gifts_scoped_to_current_user(): void
    {
        [$user, $token] = $this->actingParticipant();
        $other = User::factory()->create(['role' => 'participant', 'email' => 'other-' . Str::random(10) . '@gmail.com']);

        ParticipantGift::create(['user_id' => $user->id, 'gift_code' => 'G-1', 'gift_description' => 'Tas sekolah', 'status' => 'received']);
        ParticipantGift::create(['user_id' => $other->id, 'gift_code' => 'G-2', 'gift_description' => 'Bukan punya kita', 'status' => 'received']);

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/gifts');

        $response->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.gift_code', 'G-1');
    }
}
