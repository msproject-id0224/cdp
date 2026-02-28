<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class ParticipantTest extends TestCase
{
    use RefreshDatabase;

    public function test_mentor_can_view_participant_profile()
    {
        $mentor = User::factory()->create(['role' => 'mentor']);
        $participant = User::factory()->create([
            'role' => 'participant',
            'mentor_id' => $mentor->id
        ]);

        $this->actingAs($mentor);

        $response = $this->get(route('participants.show', $participant->id));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Participant/Show')
            ->has('participant')
            ->where('participant.id', $participant->id)
        );
    }
}
