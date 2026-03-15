<?php

namespace Tests\Feature;

use App\Models\HealthScreening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthScreeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_health_screening_index()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        $response = $this->actingAs($admin)->get(route('health-screenings.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_create_health_screening()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $participant = User::factory()->create(['role' => 'participant']);

        $data = [
            'user_id' => $participant->id,
            'checked_at' => now()->format('Y-m-d'),
            'status' => 'final',
            'weight' => 25.5,
            'height' => 120,
            'malnutrition_status' => 'normal',
            'immunizations' => [
                [
                    'code' => 'BCG',
                    'checked' => true,
                    'date' => now()->subYear()->format('Y-m-d'),
                    'dose' => '1',
                ]
            ],
            'findings' => [
                [
                    'category' => 'physical_appearance',
                    'key' => 'edema',
                    'status' => 'normal',
                ]
            ]
        ];

        $response = $this->actingAs($admin)->post(route('health-screenings.store'), $data);

        $response->assertRedirect(route('health-screenings.index'));
        $this->assertDatabaseHas('health_screenings', [
            'user_id' => $participant->id,
            'weight' => 25.5,
        ]);
    }

    public function test_bmi_is_calculated_automatically()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $participant = User::factory()->create(['role' => 'participant']);

        $data = [
            'user_id' => $participant->id,
            'checked_at' => now()->format('Y-m-d'),
            'status' => 'final',
            'weight' => 20,
            'height' => 100, // 1m
            'malnutrition_status' => 'normal',
        ];

        $this->actingAs($admin)->post(route('health-screenings.store'), $data);

        $screening = HealthScreening::where('user_id', $participant->id)->latest()->first();
        
        // BMI = 20 / (1*1) = 20.00
        $this->assertEquals(20.00, $screening->bmi);
    }
}
