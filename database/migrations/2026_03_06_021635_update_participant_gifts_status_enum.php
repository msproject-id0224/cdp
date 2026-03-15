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
        // Modify ENUM by using raw SQL statement (SQLite/MySQL specific usually, assuming MySQL/Postgres here)
        // Laravel doesn't support changing ENUM values natively in Blueprint easily without raw DB statement or doctrine/dbal (which might be limited for enum)
        // Alternative: Change column to string to allow any value, or recreate column.
        // Let's assume standard MySQL behavior:
        DB::statement("ALTER TABLE participant_gifts MODIFY COLUMN status ENUM('pending', 'received', 'returned', 'draft', 'pending_verification') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original ENUM
        // Warning: Data with new statuses might be truncated or cause error
        DB::statement("ALTER TABLE participant_gifts MODIFY COLUMN status ENUM('pending', 'received', 'returned') DEFAULT 'pending'");
    }
};
