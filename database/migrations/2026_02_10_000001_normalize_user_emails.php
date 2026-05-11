<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Normalize emails: lowercase and trim
        // Using raw SQL for efficiency
        
        // SQLite support (since we might be using it for testing, but likely MySQL in production)
        $driver = DB::connection()->getDriverName();

        if ($driver === 'mysql') {
            DB::statement("UPDATE users SET email = LOWER(TRIM(email))");
        } elseif ($driver === 'sqlite') {
            DB::statement("UPDATE users SET email = LOWER(TRIM(email))");
        } else {
             // Fallback for other databases if needed, or Eloquent
             DB::table('users')->chunkById(100, function ($users) {
                foreach ($users as $user) {
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['email' => strtolower(trim($user->email))]);
                }
             });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot strictly reverse normalization (we lost the original casing/spacing)
    }
};
