<?php

namespace Tests\Feature;

use App\Models\ProfilePhotoRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfilePhotoRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_fetch_pending_requests()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'participant']);

        // Create a pending request
        ProfilePhotoRequest::create([
            'user_id' => $user->id,
            'photo_path' => 'path/to/photo.jpg',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->getJson(route('api.admin.profile-photos.pending'));

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_admin_can_approve_request()
    {
        \Illuminate\Support\Facades\Storage::fake('public');
        
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'participant']);
        
        $photoRequest = ProfilePhotoRequest::create([
            'user_id' => $user->id,
            'photo_path' => 'profile-photo-requests/test.jpg',
            'status' => 'pending',
        ]);
        
        // Mock file existence
        \Illuminate\Support\Facades\Storage::disk('public')->put('profile-photo-requests/test.jpg', 'fake-image-content');

        $response = $this->actingAs($admin)
            ->post(route('admin.profile-photos.approve', $photoRequest), [
                'crop_width' => 100,
                'crop_height' => 100,
                'crop_x' => 0,
                'crop_y' => 0,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('profile_photo_requests', [
            'id' => $photoRequest->id,
            'status' => 'approved',
        ]);
        
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'profile_photo_status' => 'active',
        ]);
    }
}
