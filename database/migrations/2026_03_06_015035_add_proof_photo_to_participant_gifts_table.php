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
        Schema::table('participant_gifts', function (Blueprint $table) {
            $table->string('proof_photo_path', 2048)->nullable()->after('status');
            $table->text('admin_notes')->nullable()->after('proof_photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participant_gifts', function (Blueprint $table) {
            $table->dropColumn(['proof_photo_path', 'admin_notes']);
        });
    }
};
