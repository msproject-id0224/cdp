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
        Schema::table('rmd_meeting_files', function (Blueprint $table) {
            if (!Schema::hasColumn('rmd_meeting_files', 'user_id')) {
                $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();
            }
            if (!Schema::hasColumn('rmd_meeting_files', 'meeting_type')) {
                $table->string('meeting_type')->after('user_id');
            }
            if (!Schema::hasColumn('rmd_meeting_files', 'file_path')) {
                $table->string('file_path')->after('meeting_type');
            }
            if (!Schema::hasColumn('rmd_meeting_files', 'file_name')) {
                $table->string('file_name')->after('file_path');
            }
            if (!Schema::hasColumn('rmd_meeting_files', 'file_type')) {
                $table->string('file_type')->nullable()->after('file_name');
            }
            if (!Schema::hasColumn('rmd_meeting_files', 'file_size')) {
                $table->integer('file_size')->nullable()->after('file_type');
            }
            // Drop original_name if it exists (from previous run) and we want to replace it
            if (Schema::hasColumn('rmd_meeting_files', 'original_name')) {
                $table->dropColumn('original_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_meeting_files', function (Blueprint $table) {
            if (Schema::hasColumn('rmd_meeting_files', 'user_id')) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Ignore
                }
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('rmd_meeting_files', 'meeting_type')) {
                $table->dropColumn('meeting_type');
            }
            if (Schema::hasColumn('rmd_meeting_files', 'file_path')) {
                $table->dropColumn('file_path');
            }
            if (Schema::hasColumn('rmd_meeting_files', 'file_name')) {
                $table->dropColumn('file_name');
            }
            if (Schema::hasColumn('rmd_meeting_files', 'file_type')) {
                $table->dropColumn('file_type');
            }
            if (Schema::hasColumn('rmd_meeting_files', 'file_size')) {
                $table->dropColumn('file_size');
            }
        });
    }
};
