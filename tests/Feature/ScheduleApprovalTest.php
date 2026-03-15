<?php

namespace Tests\Feature;

use App\Models\ParticipantMeeting;
use App\Models\User;
use App\Notifications\ScheduleApprovalRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ScheduleApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_is_notified_when_schedule_is_created()
    {
        Notification::fake();

        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $admin = User::factory()->create(['role' => 'admin']);
        $participant = User::factory()->create(['role' => 'participant']);

        $this->actingAs($mentor);

        $response = $this->postJson(route('api.mentor-meetings.store'), [
            'scheduled_at' => now()->addDay()->setHour(10)->format('Y-m-d H:i:s'),
            'end_time' => now()->addDay()->setHour(11)->format('Y-m-d H:i:s'),
            'participant_ids' => [$participant->id],
            'agenda' => 'Test Meeting',
            'notes' => 'Test Notes',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['meeting', 'message']);
        $response->assertJsonFragment(['message' => 'Schedule created and sent to admin for approval.']);

        Notification::assertSentTo(
            [$admin],
            ScheduleApprovalRequest::class,
            function ($notification, $channels) use ($mentor) {
                return $notification->meeting->mentor_id === $mentor->id;
            }
        );
    }
}
