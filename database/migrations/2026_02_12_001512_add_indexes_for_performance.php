<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasIndex('users', 'users_role_index')) {
                $table->index('role');
            }
            if (!Schema::hasIndex('users', 'users_first_name_index')) {
                $table->index('first_name');
            }
            if (!Schema::hasIndex('users', 'users_last_name_index')) {
                $table->index('last_name');
            }
            if (!Schema::hasIndex('users', 'users_is_active_index')) {
                $table->index('is_active');
            }
            if (!Schema::hasIndex('users', 'users_mentor_id_index')) {
                $table->index('mentor_id');
            }
        });

        Schema::table('schedules', function (Blueprint $table) {
            if (!Schema::hasIndex('schedules', 'schedules_date_index')) {
                $table->index('date');
            }
            if (!Schema::hasIndex('schedules', 'schedules_start_time_index')) {
                $table->index('start_time');
            }
            if (!Schema::hasIndex('schedules', 'schedules_priority_index')) {
                $table->index('priority');
            }
            if (!Schema::hasIndex('schedules', 'schedules_status_index')) {
                $table->index('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropIndex(['first_name']);
            $table->dropIndex(['last_name']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['mentor_id']);
        });

        Schema::table('schedules', function (Blueprint $table) {
            $table->dropIndex(['date']);
            $table->dropIndex(['start_time']);
            $table->dropIndex(['priority']);
            $table->dropIndex(['status']);
        });
    }
};
