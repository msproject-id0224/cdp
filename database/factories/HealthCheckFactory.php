<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HealthCheck>
 */
class HealthCheckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'checked_at' => $this->faker->date(),
            'weight' => $this->faker->randomFloat(2, 10, 100),
            'height' => $this->faker->randomFloat(2, 50, 180),
            'malnutrition_status' => $this->faker->randomElement(['tidak', 'ringan', 'sedang', 'sangat_buruk']),
            'examiner_name' => $this->faker->name(),
            'examiner_qualification' => $this->faker->jobTitle(),
            'examiner_date' => $this->faker->date(),
        ];
    }
}
