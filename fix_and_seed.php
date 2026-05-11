<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// 1. Fix existing users
$users = User::all();
foreach ($users as $user) {
    $updates = [];
    
    // Ensure active
    if (!$user->is_active) {
        $updates['is_active'] = true;
    }
    
    // Ensure verified
    if (!$user->email_verified_at) {
        $updates['email_verified_at'] = now();
    }
    
    // Ensure role is valid (trim whitespace)
    $cleanRole = trim($user->role);
    if ($user->role !== $cleanRole) {
        $updates['role'] = $cleanRole;
    }
    
    // Ensure DOB for age calculation
    if (!$user->date_of_birth && $user->role === 'participant') {
        $updates['date_of_birth'] = now()->subYears(rand(5, 12));
    }

    if (!empty($updates)) {
        $user->update($updates);
        echo "Updated user {$user->email}: " . json_encode($updates) . "\n";
    }
}

// 2. Seed new participants if fewer than 5
$count = User::where('role', 'participant')->count();
if ($count < 5) {
    $needed = 5 - $count;
    echo "Creating $needed new participants...\n";
    
    for ($i = 0; $i < $needed; $i++) {
        User::create([
            'first_name' => 'Participant',
            'last_name' => 'Test ' . ($count + $i + 1),
            'email' => 'participant' . ($count + $i + 1) . '@test.com',
            'role' => 'participant',
            'is_active' => true,
            'email_verified_at' => now(),
            'date_of_birth' => now()->subYears(rand(5, 12)),
            'id_number' => 'ID' . rand(10000, 99999),
            // No password needed for listing, but good practice
            // 'password' => Hash::make('password'), 
        ]);
    }
}

echo "Total participants: " . User::where('role', 'participant')->count() . "\n";
