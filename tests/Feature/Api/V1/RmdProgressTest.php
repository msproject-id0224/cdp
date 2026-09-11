<?php

namespace Tests\Feature\Api\V1;

use App\Models\RmdProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class RmdProgressTest extends TestCase
{
    use RefreshDatabase;

    private function makeParticipant(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'role' => 'participant',
            'email' => 'rmd-progress-' . Str::random(10) . '@gmail.com',
        ], $attributes));
    }

    public function test_progress_requires_authentication(): void
    {
        $this->getJson('/api/v1/rmd/progress')->assertStatus(401);
    }

    public function test_fresh_participant_next_step_is_profile(): void
    {
        $user = $this->makeParticipant();
        $token = $user->createToken('mobile')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/rmd/progress');

        $response->assertOk()
            ->assertJsonPath('has_started', false)
            ->assertJsonPath('all_completed', false)
            ->assertJsonPath('next_step', 'rmd.profile')
            ->assertJsonCount(9, 'modules');
    }

    public function test_next_step_advances_once_profile_module_is_fully_filled(): void
    {
        $user = $this->makeParticipant();
        $token = $user->createToken('mobile')->plainTextToken;

        // "Profil RMD" tidak punya definisi section di getModuleSections(),
        // jadi calculateProgress() menghitung SEMUA kolom RmdProfile
        // (selain id/user_id/timestamps) -- kelimanya perlu terisi supaya
        // modul ini mencapai 100% dan next_step maju ke modul berikutnya.
        RmdProfile::create([
            'user_id' => $user->id,
            'graduation_plan_date' => now()->addYears(6),
            'first_filled_at' => now(),
            'first_filled_age' => 13,
            'first_filled_education' => 'SMP',
            'first_filled_education_institution' => 'SMP Negeri 1',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/rmd/progress');

        $response->assertOk()
            ->assertJsonPath('has_started', true)
            ->assertJsonPath('next_step', 'rmd.what-the-bible-says');
    }
}
