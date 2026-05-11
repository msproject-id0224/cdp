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
        // Skip for SQLite (testing environment) as it doesn't support ALTER TABLE MODIFY COLUMN
        // and fresh migrations should already have the correct enum values if base migrations were updated.
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        // Update profile_photo_requests status enum
        if (Schema::hasTable('profile_photo_requests')) {
            DB::statement("ALTER TABLE profile_photo_requests MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'reupload_requested') NOT NULL DEFAULT 'pending'");
        }

        // Update users profile_photo_status enum
        if (Schema::hasTable('users')) {
            DB::statement("ALTER TABLE users MODIFY COLUMN profile_photo_status ENUM('active', 'pending', 'rejected', 'reupload_requested') NOT NULL DEFAULT 'active'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert profile_photo_requests status enum (Careful: data loss if 'reupload_requested' exists)
        if (Schema::hasTable('profile_photo_requests')) {
            // Mapping back to 'pending' or 'rejected' if needed, but schema revert just changes the type definition
            // Any existing 'reupload_requested' values will become invalid or empty string depending on strict mode
            DB::statement("ALTER TABLE profile_photo_requests MODIFY COLUMN status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'");
        }

        // Revert users profile_photo_status enum
        if (Schema::hasTable('users')) {
            DB::statement("ALTER TABLE users MODIFY COLUMN profile_photo_status ENUM('active', 'pending', 'rejected') NOT NULL DEFAULT 'active'");
        }
    }
};
