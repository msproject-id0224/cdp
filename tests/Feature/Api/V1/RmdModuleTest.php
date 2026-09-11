<?php

namespace Tests\Feature\Api\V1;

use App\Models\RmdProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class RmdModuleTest extends TestCase
{
    use RefreshDatabase;

    private function actingParticipant(array $attributes = []): array
    {
        $user = User::factory()->create(array_merge([
            'role' => 'participant',
            'email' => 'rmd-module-' . Str::random(10) . '@gmail.com',
        ], $attributes));
        $token = $user->createToken('mobile')->plainTextToken;

        return [$user, $token];
    }

    private function headers(string $token): array
    {
        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_module_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/rmd/profile')->assertStatus(401);
        $this->postJson('/api/v1/rmd/true-success')->assertStatus(401);
    }

    public function test_profile_show_returns_null_when_not_yet_filled(): void
    {
        [$user, $token] = $this->actingParticipant();

        $response = $this->withHeaders($this->headers($token))->getJson('/api/v1/rmd/profile');

        $response->assertOk()
            ->assertJsonPath('profile', null)
            ->assertJsonPath('is_first_fill', true);
    }

    public function test_store_profile_updates_user_and_rmd_profile_and_locks_first_filled_at(): void
    {
        [$user, $token] = $this->actingParticipant(['date_of_birth' => '2012-01-01']);

        $payload = [
            'first_name' => 'Budi',
            'last_name' => 'Santoso',
            'first_filled_at' => now()->toDateString(),
            'first_filled_age' => 13,
            'first_filled_education' => 'SMP',
            // "Profil RMD" tidak punya definisi section di
            // getModuleSections(), jadi completeness dihitung dari SEMUA
            // kolom RmdProfile (lihat catatan yang sama di RmdProgressTest)
            // -- termasuk field nullable ini, kalau tidak dikirim modul
            // tidak akan mencapai 100% dan next_step tidak maju.
            'first_filled_education_institution' => 'SMP Negeri 1',
        ];

        $response = $this->withHeaders($this->headers($token))->postJson('/api/v1/rmd/profile', $payload);

        $response->assertOk()->assertJsonPath('progress.next_step', 'rmd.what-the-bible-says');

        $user->refresh();
        $this->assertSame('Budi', $user->first_name);

        $profile = RmdProfile::where('user_id', $user->id)->first();
        $this->assertNotNull($profile->first_filled_at);
        $firstFilledAt = $profile->first_filled_at;

        // Kirim ulang dengan first_filled_at berbeda -- harus TETAP terkunci
        // ke pengisian pertama (perilaku asli RmdController::storeProfile()).
        $this->withHeaders($this->headers($token))->postJson('/api/v1/rmd/profile', array_merge($payload, [
            'first_filled_at' => now()->addDays(3)->toDateString(),
        ]))->assertOk();

        $profile->refresh();
        $this->assertTrue($firstFilledAt->equalTo($profile->first_filled_at));
    }

    public function test_store_bible_reflection_persists_fields_and_image(): void
    {
        Storage::fake('public');
        [$user, $token] = $this->actingParticipant();

        $response = $this->withHeaders($this->headers($token))->post('/api/v1/rmd/what-the-bible-says', [
            'favorite_verse' => 'Yeremia 29:11',
            'chapter_learning_image' => UploadedFile::fake()->image('learning.jpg'),
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('rmd_bible_reflections', [
            'user_id' => $user->id,
            'favorite_verse' => 'Yeremia 29:11',
        ]);
    }

    public function test_store_the_only_one_persists_checklist_arrays(): void
    {
        [$user, $token] = $this->actingParticipant();

        $response = $this->withHeaders($this->headers($token))->postJson('/api/v1/rmd/the-only-one', [
            'visual_checklist' => ['suka membaca', 'suka diagram'],
            'favorite_subject' => 'Matematika',
        ]);

        $response->assertOk();

        $show = $this->withHeaders($this->headers($token))->getJson('/api/v1/rmd/the-only-one');
        $show->assertOk()->assertJsonPath('the_only_one.visual_checklist', ['suka membaca', 'suka diagram']);
    }

    public function test_meeting_file_upload_download_and_delete_cycle(): void
    {
        Storage::fake('public');
        [$user, $token] = $this->actingParticipant();

        $upload = $this->withHeaders($this->headers($token))->post('/api/v1/rmd/meeting-files', [
            'meeting_type' => 'the-only-one-meeting-2',
            'file' => UploadedFile::fake()->create('bukti.pdf', 100),
        ]);
        $upload->assertStatus(201);
        $fileId = $upload->json('file.id');

        $show = $this->withHeaders($this->headers($token))->getJson('/api/v1/rmd/the-only-one-meeting-2');
        $show->assertOk()->assertJsonCount(1, 'files');

        // Partisipan lain tidak boleh download/hapus file ini. Guard
        // Sanctum di-reset dulu (auth()->forgetGuards()) -- tanpa ini, guard
        // yang sudah resolve user pertama di request sebelumnya ke-cache di
        // dalam container test yang sama dan tidak re-resolve dari token
        // baru (quirk test harness, TIDAK terjadi di produksi karena tiap
        // request sungguhan punya container/process sendiri).
        [, $otherToken] = $this->actingParticipant();
        auth()->forgetGuards();
        $this->withHeaders($this->headers($otherToken))
            ->getJson("/api/v1/rmd/meeting-files/{$fileId}/download")
            ->assertStatus(403);
        auth()->forgetGuards();

        $delete = $this->withHeaders($this->headers($token))->deleteJson("/api/v1/rmd/meeting-files/{$fileId}");
        $delete->assertOk();
        $this->assertDatabaseMissing('rmd_meeting_files', ['id' => $fileId]);
    }
}
