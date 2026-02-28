<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfilePhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_photo_url_is_generated_correctly()
    {
        $user = User::factory()->create([
            'profile_photo_path' => 'profile-photos/test.jpg',
        ]);

        $this->assertEquals('/storage/profile-photos/test.jpg', $user->profile_photo_url);
    }

    public function test_admin_can_upload_photo()
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'participant']);

        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->actingAs($admin)
            ->post(route('admin.profile-photos.upload', $user), [
                'photo' => $file,
            ]);

        $response->assertSessionHas('success');

        // Verify file was stored
        $user->refresh();
        $this->assertNotNull($user->profile_photo_path);
        Storage::disk('public')->assertExists($user->profile_photo_path);
        
        // Verify URL generation works with the new path
        $this->assertStringStartsWith('/storage/profile-photos/', $user->profile_photo_url);
    }

    public function test_user_can_request_photo_upload()
    {
        Storage::fake('public');

        $user = User::factory()->create(['role' => 'participant']);
        $file = UploadedFile::fake()->image('request.jpg');

        $response = $this->actingAs($user)
            ->post(route('participant.profile-photo.request'), [
                'photo' => $file,
            ]);

        $response->assertSessionHas('success');

        // Verify request was created but user photo not updated yet
        $this->assertDatabaseHas('profile_photo_requests', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
        
        $user->refresh();
        $this->assertNull($user->profile_photo_path); // Should be null until approved
        $this->assertEquals('pending', $user->profile_photo_status);
    }
}
