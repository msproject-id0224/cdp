<?php

namespace Tests\Feature;

use App\Models\ParticipantGift;
use App\Models\User;
use App\Notifications\GiftAssignedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class GiftManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_gift_assignment()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $participant = User::factory()->create(['role' => 'participant']);
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant->update(['mentor_id' => $mentor->id]);

        $response = $this->actingAs($admin)->post(route('gifts.store'), [
            'user_id' => $participant->id,
            'gift_code' => 'GF - 001',
            'letter_code' => 'LE - 001',
            'type' => 'birthday',
            'model' => 'small',
            'status' => 'pending',
        ]);

        $response->assertRedirect(route('gifts.index'));
        $this->assertDatabaseHas('participant_gifts', [
            'user_id' => $participant->id,
            'gift_code' => 'GF - 001',
        ]);

        Notification::assertSentTo($participant, GiftAssignedNotification::class);
        Notification::assertSentTo($mentor, GiftAssignedNotification::class);
    }

    public function test_gift_code_format_validation()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $participant = User::factory()->create(['role' => 'participant']);

        // Invalid format: No letters
        $response = $this->actingAs($admin)->post(route('gifts.store'), [
            'user_id' => $participant->id,
            'gift_code' => '123456',
            'letter_code' => '123456',
            'type' => 'general',
            'model' => 'small',
            'status' => 'pending',
        ]);

        $response->assertSessionHasErrors(['gift_code', 'letter_code']);
    }

    public function test_participant_cannot_create_gift()
    {
        $participant = User::factory()->create(['role' => 'participant']);

        $response = $this->actingAs($participant)->post(route('gifts.store'), [
            'user_id' => $participant->id,
            'gift_code' => 'GIFT-002',
            'type' => 'general',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_gift()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $gift = ParticipantGift::factory()->create([
            'gift_code' => 'GF - 001',
            'letter_code' => 'LE - 001',
            'status' => 'pending'
        ]);

        $response = $this->actingAs($admin)->put(route('gifts.update', $gift->id), [
            'user_id' => $gift->user_id,
            'gift_code' => 'GF - 001',
            'letter_code' => 'LE - 001',
            'type' => $gift->type,
            'model' => $gift->model,
            'status' => 'received',
        ]);

        $response->assertRedirect(route('gifts.index'));
        $this->assertDatabaseHas('participant_gifts', [
            'id' => $gift->id,
            'status' => 'received'
        ]);
    }

    public function test_admin_can_delete_gift()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $gift = ParticipantGift::factory()->create([
            'status' => 'pending'
        ]);

        $response = $this->actingAs($admin)->delete(route('gifts.destroy', $gift->id));

        $response->assertRedirect(route('gifts.index'));
        $this->assertDatabaseMissing('participant_gifts', ['id' => $gift->id]);
    }

    public function test_cannot_delete_received_gift()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $gift = ParticipantGift::factory()->create([
            'status' => 'received'
        ]);

        $response = $this->actingAs($admin)->delete(route('gifts.destroy', $gift->id));

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseHas('participant_gifts', ['id' => $gift->id]);
    }
}
