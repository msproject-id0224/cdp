<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipantGiftFactory extends Factory
{
    public function definition(): array
    {
        $letters = strtoupper(fake()->lexify('??'));
        $number  = fake()->unique()->numberBetween(1, 999);

        return [
            'user_id'    => User::factory()->create(['role' => 'participant'])->id,
            'gift_code'  => "{$letters} - {$number}",
            'letter_code'=> strtoupper(fake()->lexify('??')) . ' - ' . fake()->unique()->numberBetween(1, 999),
            'type'       => fake()->randomElement(['birthday', 'family', 'general']),
            'model'      => fake()->randomElement(['small', 'large']),
            'status'     => 'pending',
        ];
    }
}
