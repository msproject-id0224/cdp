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
        Schema::table('participant_meetings', function (Blueprint $table) {
            $table->dateTime('end_time')->after('scheduled_at')->nullable();
            $table->string('meeting_link')->nullable()->after('location');
            $table->text('notes')->nullable()->after('agenda');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participant_meetings', function (Blueprint $table) {
            $table->dropColumn(['end_time', 'meeting_link', 'notes']);
        });
    }
};
