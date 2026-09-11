<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unread_notifications_requires_authentication(): void
    {
        $this->getJson('/api/v1/notifications/unread')->assertStatus(401);
    }

    public function test_unread_notifications_scoped_to_current_user(): void
    {
        $user = User::factory()->create(['role' => 'participant', 'email' => 'notif-' . Str::random(10) . '@gmail.com']);
        $token = $user->createToken('mobile')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")->getJson('/api/v1/notifications/unread');

        $response->assertOk()->assertJsonStructure(['unread_notifications', 'unread_count']);
    }
}
