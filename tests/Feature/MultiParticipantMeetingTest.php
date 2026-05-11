<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ParticipantMeeting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\MeetingScheduled;
use Tests\TestCase;

class MultiParticipantMeetingTest extends TestCase
{
    use RefreshDatabase;

    public function test_mentor_can_schedule_meeting_with_multiple_participants()
    {
        Notification::fake();

        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participants = User::factory()->count(3)->create(['role' => 'participant']);

        $response = $this->actingAs($mentor)->postJson(route('api.mentor-meetings.store'), [
            'participant_ids' => $participants->pluck('id')->toArray(),
            'scheduled_at' => now()->addDay()->setHour(10)->format('Y-m-d H:i:s'),
            'end_time' => now()->addDay()->setHour(11)->format('Y-m-d H:i:s'),
            'agenda' => 'Group Session',
            'max_participants' => 5,
        ]);

        $response->assertStatus(200);
        
        $meeting = ParticipantMeeting::first();
        $this->assertCount(3, $meeting->participants);
        $this->assertEquals(5, $meeting->max_participants);
        $this->assertEquals('pending', $meeting->status);

        Notification::assertSentTo($participants, MeetingScheduled::class);
        Notification::assertSentTo($mentor, MeetingScheduled::class);
    }

    public function test_mentor_can_add_participants_to_existing_meeting()
    {
        Notification::fake();

        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant1 = User::factory()->create(['role' => 'participant']);
        
        $meeting = ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant1->id,
            'scheduled_at' => now()->addDay()->setHour(10),
            'end_time' => now()->addDay()->setHour(11),
            'max_participants' => 2,
        ]);
        $meeting->participants()->attach($participant1);

        $participant2 = User::factory()->create(['role' => 'participant']);

        $response = $this->actingAs($mentor)->patchJson(route('api.mentor-meetings.update', $meeting->id), [
            'participant_ids' => [$participant1->id, $participant2->id],
        ]);

        $response->assertStatus(200);
        
        $this->assertCount(2, $meeting->fresh()->participants);
        
        Notification::assertSentTo($participant2, MeetingScheduled::class);
    }

    public function test_capacity_is_auto_adjusted_if_participants_exceed_max()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participants = User::factory()->count(4)->create(['role' => 'participant']);

        $response = $this->actingAs($mentor)->postJson(route('api.mentor-meetings.store'), [
            'participant_ids' => $participants->pluck('id')->toArray(),
            'scheduled_at' => now()->addDay()->setHour(10)->format('Y-m-d H:i:s'),
            'end_time' => now()->addDay()->setHour(11)->format('Y-m-d H:i:s'),
            'max_participants' => 2, // Intentional under-capacity
        ]);

        $response->assertStatus(200);
        
        $meeting = ParticipantMeeting::first();
        $this->assertEquals(4, $meeting->max_participants); // Should auto-adjust
    }

    public function test_meeting_cancellation_sends_notifications()
    {
        Notification::fake();

        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create(['role' => 'participant']);
        
        $meeting = ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => now()->addDay()->setHour(10),
            'end_time' => now()->addDay()->setHour(11),
        ]);
        $meeting->participants()->attach($participant);

        $response = $this->actingAs($mentor)->deleteJson(route('api.mentor-meetings.destroy', $meeting->id));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('participant_meetings', ['id' => $meeting->id]);

        Notification::assertSentTo($participant, MeetingScheduled::class, function ($notification) {
            return $notification->type === 'cancel';
        });
    }
}
