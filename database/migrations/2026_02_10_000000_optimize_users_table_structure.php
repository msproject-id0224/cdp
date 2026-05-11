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
        // Change role to ENUM using raw SQL for compatibility (MySQL only)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'mentor', 'participant') NOT NULL DEFAULT 'participant'");
        }

        Schema::table('users', function (Blueprint $table) {
            // Add Indexes
            $table->index('role');
            $table->index('is_active');
            $table->index('nickname');
            $table->index('last_seen_at');
            
            // Add Unique Index for id_number (allows multiple NULLs in MySQL)
            $table->unique('id_number');

            // NOTE: We keep 'age' column as a fallback when date_of_birth is not provided.
            // Logic is handled in User model accessor.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['id_number']);
            $table->dropIndex(['role']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['nickname']);
            $table->dropIndex(['last_seen_at']);
        });

        // Revert role to string
        DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(255) NOT NULL DEFAULT 'participant'");
    }
};
