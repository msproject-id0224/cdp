<?php

use App\Models\User;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = User::where('email', 'adminfirst@cdp.com')->first();

if ($user) {
    $user->email_verified_at = now();
    $user->save();
    echo "User verified successfully. Role: " . $user->role . "\n";
} else {
    echo "User not found.\n";
}
