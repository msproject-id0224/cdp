<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\MentorAvailability;
use App\Models\ParticipantMeeting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use Carbon\Carbon;

class MentorScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_mentor_can_retrieve_schedules_for_month_view()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create(['role' => 'participant', 'mentor_id' => $mentor->id]);

        // Create a meeting in the middle of the month
        $meeting = ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => Carbon::parse('2024-05-15 10:00:00'),
            'end_time' => Carbon::parse('2024-05-15 11:00:00'),
            'status' => 'scheduled',
        ]);

        // Create a meeting outside the month
        $meetingOutside = ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => Carbon::parse('2024-06-15 10:00:00'),
            'end_time' => Carbon::parse('2024-06-15 11:00:00'),
            'status' => 'scheduled',
        ]);

        $this->actingAs($mentor);

        // Simulate FullCalendar month view request (start/end often include padding days)
        $response = $this->getJson(route('api.mentor-schedules', [
            'start' => '2024-04-28T00:00:00Z',
            'end' => '2024-06-02T00:00:00Z',
        ]));

        $response->assertStatus(200);
        
        // Assert the meeting in May is present in the meetings array
        $response->assertJsonFragment([
            'id' => $meeting->id,
            'scheduled_at' => '2024-05-15T10:00:00.000000Z'
        ]);
        
        // Assert the meeting in June is NOT present in the meetings array
        // We need to be careful not to match participant IDs, so we check specifically
        $meetings = $response->json('meetings');
        $meetingIds = collect($meetings)->pluck('id')->toArray();
        
        $this->assertContains($meeting->id, $meetingIds);
        $this->assertNotContains($meetingOutside->id, $meetingIds);
    }

    public function test_mentor_can_retrieve_spanning_events()
    {
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create(['role' => 'participant', 'mentor_id' => $mentor->id]);

        // Create a meeting that spans across the requested range (starts before, ends after)
        $spanningMeeting = ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => Carbon::parse('2024-04-01 10:00:00'),
            'end_time' => Carbon::parse('2024-07-01 10:00:00'),
            'status' => 'scheduled',
        ]);

        $this->actingAs($mentor);

        // Request for May
        $response = $this->getJson(route('api.mentor-schedules', [
            'start' => '2024-05-01T00:00:00Z',
            'end' => '2024-05-31T23:59:59Z',
        ]));

        $response->assertStatus(200);
        
        $meetings = $response->json('meetings');
        $meetingIds = collect($meetings)->pluck('id')->toArray();
        
        // This should be present because it overlaps with May
        $this->assertContains($spanningMeeting->id, $meetingIds);
    }

    public function test_mentor_can_save_availability()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $this->actingAs($mentor);

        $response = $this->postJson(route('api.mentor-availability.store'), [
            'day_of_week' => 1,
            'start_time' => '10:00',
            'end_time' => '12:00',
            'is_recurring' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('mentor_availabilities', [
            'mentor_id' => $mentor->id,
            'day_of_week' => 1,
            'is_recurring' => 1,
        ]);
    }

    public function test_non_mentor_cannot_save_availability()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create(['role' => 'participant']);
        $this->actingAs($user);

        $response = $this->postJson(route('api.mentor-availability.store'), [
            'day_of_week' => 1,
            'start_time' => '10:00',
            'end_time' => '12:00',
            'is_recurring' => true,
        ]);

        $response->assertStatus(403);
    }

    public function test_mentor_can_save_meeting()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create(['role' => 'participant']);
        $this->actingAs($mentor);

        $scheduledAt = now()->addDay()->setHour(10)->setMinute(0)->setSecond(0);
        $endTime = now()->addDay()->setHour(11)->setMinute(0)->setSecond(0);

        $response = $this->postJson(route('api.mentor-meetings.store'), [
            'participant_id' => $participant->id,
            'scheduled_at' => $scheduledAt->toISOString(),
            'end_time' => $endTime->toISOString(),
            'location' => 'Online',
            'meeting_link' => 'https://meet.google.com/abc-defg-hij',
            'agenda' => 'Initial Meeting',
            'notes' => 'Some notes',
        ]);

        $response->assertStatus(200); // Created
        $this->assertDatabaseHas('participant_meetings', [
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => $scheduledAt->toDateTimeString(),
            'end_time' => $endTime->toDateTimeString(),
            'location' => 'Online',
            'agenda' => 'Initial Meeting',
        ]);
    }

    public function test_mentor_cannot_save_overlapping_meeting()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create(['role' => 'participant']);
        $this->actingAs($mentor);

        $scheduledAt = now()->addDay()->setHour(10)->setMinute(0)->setSecond(0);
        $endTime = now()->addDay()->setHour(12)->setMinute(0)->setSecond(0);

        // Create initial meeting
        ParticipantMeeting::create([
            'mentor_id' => $mentor->id,
            'participant_id' => $participant->id,
            'scheduled_at' => $scheduledAt,
            'end_time' => $endTime,
            'status' => 'scheduled',
        ]);

        // Try to create overlapping meeting (11:00 - 13:00)
        // Overlap Logic: StartA < EndB && EndA > StartB
        // Meeting A: 10:00 - 12:00
        // Meeting B: 11:00 - 13:00
        // 10:00 < 13:00 (True) && 12:00 > 11:00 (True) -> Overlap!
        
        $overlapStart = now()->addDay()->setHour(11)->setMinute(0)->setSecond(0);
        $overlapEnd = now()->addDay()->setHour(13)->setMinute(0)->setSecond(0);

        $response = $this->postJson(route('api.mentor-meetings.store'), [
            'participant_id' => $participant->id,
            'scheduled_at' => $overlapStart->toISOString(),
            'end_time' => $overlapEnd->toISOString(),
        ]);

        $response->assertStatus(422); // Conflict
        $response->assertJson(['message' => 'This time slot overlaps with another meeting.']);
    }

    /**
     * Test that mentor can retrieve full participant details in schedule view.
     * This is a regression test for a bug where participant details were missing.
     */
    public function test_mentor_can_retrieve_participant_details_in_schedule()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create([
            'role' => 'participant',
            'mentor_id' => $mentor->id,
            'email' => 'participant@example.com',
            'date_of_birth' => '2010-01-01', // Age ~14
            'gender' => 'male',
            'age_group' => '12-15',
            'profile_photo_path' => 'photos/test.jpg'
        ]);

        $this->actingAs($mentor);

        $response = $this->getJson(route('api.mentor-schedules'));

        $response->assertStatus(200);

        // Check if participants data is present
        $response->assertJsonStructure([
            'participants' => [
                '*' => [
                    'id',
                    'first_name',
                    'last_name',
                    'nickname',
                    'email',
                    'date_of_birth',
                    'gender',
                    'age_group',
                    'profile_photo_url'
                ]
            ]
        ]);
        
        // Assert specific data
        $participantData = $response->json('participants')[0];
        $this->assertEquals($participant->email, $participantData['email']);
        $this->assertEquals($participant->gender, $participantData['gender']);
        $this->assertStringContainsString('test.jpg', $participantData['profile_photo_url']);
    }

    public function test_mentor_can_save_meeting_with_invalid_participant()
    {
        /** @var \App\Models\User $mentor */
        $mentor = User::factory()->create(['role' => 'mentor']);
        $this->actingAs($mentor);

        $scheduledAt = now()->addDay()->setHour(10)->setMinute(0)->setSecond(0);
        $endTime = now()->addDay()->setHour(11)->setMinute(0)->setSecond(0);

        $response = $this->postJson(route('api.mentor-meetings.store'), [
            'participant_id' => 99999, // Non-existent user
            'scheduled_at' => $scheduledAt->toISOString(),
            'end_time' => $endTime->toISOString(),
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['participant_id']);
    }
}
