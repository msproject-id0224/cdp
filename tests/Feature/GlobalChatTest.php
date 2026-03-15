<?php

namespace Tests\Feature;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class GlobalChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_global_messages()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();
        /** @var \App\Models\User $otherUser */
        $otherUser = User::factory()->create();

        // Create some global messages
        ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => null,
            'message' => 'Hello World',
            'status' => 'sent'
        ]);

        ChatMessage::create([
            'sender_id' => $otherUser->id,
            'receiver_id' => null,
            'message' => 'Hello Universe',
            'status' => 'sent'
        ]);

        // Create a private message (should not be fetched)
        ChatMessage::create([
            'sender_id' => $user->id,
            'receiver_id' => $otherUser->id,
            'message' => 'Private Message',
            'status' => 'sent'
        ]);

        $response = $this->actingAs($user)->getJson(route('api.chat.global'));

        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([
                '*' => ['id', 'sender_id', 'receiver_id', 'message', 'sender' => ['id', 'name', 'role']]
            ]);
    }

    public function test_can_send_global_message()
    {
        Event::fake();

        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.chat.store'), [
            'message' => 'Test Global Message',
            'receiver_id' => null
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('chat_messages', [
            'sender_id' => $user->id,
            'receiver_id' => null,
            'message' => 'Test Global Message'
        ]);

        Event::assertDispatched(MessageSent::class, function ($event) {
            return $event->message->receiver_id === null;
        });
    }

    public function test_global_message_includes_sender_details_in_event()
    {
        Event::fake();
        
        /** @var \App\Models\User $user */
        $user = User::factory()->create();
        
        $this->actingAs($user)->postJson(route('api.chat.store'), [
            'message' => 'Event Payload Test',
            'receiver_id' => null
        ]);

        Event::assertDispatched(MessageSent::class, function ($event) {
            return $event->message->relationLoaded('sender');
        });
    }

    public function test_empty_message_validation()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('api.chat.store'), [
            'message' => '',
            'receiver_id' => null
        ]);

        $response->assertStatus(422);
    }
}
