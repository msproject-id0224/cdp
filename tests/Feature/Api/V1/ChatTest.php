<?php

namespace Tests\Feature\Api\V1;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $role = 'participant'): array
    {
        $user = User::factory()->create([
            'role' => $role,
            'email' => 'chat-' . Str::random(10) . '@gmail.com',
        ]);

        return [$user, $user->createToken('mobile')->plainTextToken];
    }

    public function test_chat_endpoints_require_authentication(): void
    {
        $this->getJson('/api/v1/chat/global')->assertStatus(401);
        $this->postJson('/api/v1/chat')->assertStatus(401);
    }

    public function test_store_and_poll_history_between_two_users(): void
    {
        [$a, $tokenA] = $this->makeUser();
        [$b] = $this->makeUser();

        $send = $this->withHeader('Authorization', "Bearer {$tokenA}")
            ->postJson('/api/v1/chat', ['receiver_id' => $b->id, 'message' => 'Halo!']);

        $send->assertStatus(201)->assertJsonPath('data.message', 'Halo!');

        // Guard di-reset dulu -- tanpa ini, guard yang sudah resolve user A
        // di request sebelumnya ke-cache di container test yang sama dan
        // tidak re-resolve dari token B (quirk test harness, sama seperti
        // catatan di RmdModuleTest -- TIDAK terjadi di produksi karena tiap
        // request sungguhan punya container/process sendiri).
        auth()->forgetGuards();
        $tokenB = $b->createToken('mobile')->plainTextToken;
        $history = $this->withHeader('Authorization', "Bearer {$tokenB}")->getJson("/api/v1/chat/{$a->id}");

        $history->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.message', 'Halo!');
    }

    public function test_store_rejects_empty_message_without_attachment(): void
    {
        [$a, $token] = $this->makeUser();
        [$b] = $this->makeUser();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/chat', ['receiver_id' => $b->id]);

        $response->assertStatus(422);
    }

    public function test_mark_read_updates_unread_count(): void
    {
        [$a, $tokenA] = $this->makeUser();
        [$b, $tokenB] = $this->makeUser();

        ChatMessage::create(['sender_id' => $b->id, 'receiver_id' => $a->id, 'message' => 'Hai', 'status' => 'sent', 'is_read' => false]);

        $unread = $this->withHeader('Authorization', "Bearer {$tokenA}")->getJson('/api/v1/chat/unread-count');
        $unread->assertOk()->assertJsonPath('count', 1);

        $this->withHeader('Authorization', "Bearer {$tokenA}")->patchJson("/api/v1/chat/{$b->id}/read")->assertOk();

        $after = $this->withHeader('Authorization', "Bearer {$tokenA}")->getJson('/api/v1/chat/unread-count');
        $after->assertOk()->assertJsonPath('count', 0);
    }

    public function test_search_excludes_current_user(): void
    {
        [$a, $tokenA] = $this->makeUser();
        [$b] = $this->makeUser(); // ensures at least one other user exists

        $response = $this->withHeader('Authorization', "Bearer {$tokenA}")->getJson('/api/v1/chat/search?query=' . urlencode($a->first_name));

        $response->assertOk();
        foreach ($response->json() as $result) {
            $this->assertNotSame($a->id, $result['id']);
        }
    }
}
