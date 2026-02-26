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
        // Create pivot table
        if (!Schema::hasTable('meeting_participants')) {
            Schema::create('meeting_participants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('participant_meeting_id')->constrained('participant_meetings')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->string('status')->default('accepted'); // invited, accepted, declined
                $table->timestamps();
            });
        }

        // Add max_participants to participant_meetings
        Schema::table('participant_meetings', function (Blueprint $table) {
            if (!Schema::hasColumn('participant_meetings', 'max_participants')) {
                $table->integer('max_participants')->default(1)->after('mentor_id');
            }
            // Make participant_id nullable as we are migrating away from it
            // Assuming participant_id exists and we just modify it
            $table->foreignId('participant_id')->nullable()->change();
        });

        // Migrate existing data
        $meetings = DB::table('participant_meetings')->whereNotNull('participant_id')->get();
        foreach ($meetings as $meeting) {
            DB::table('meeting_participants')->insert([
                'participant_meeting_id' => $meeting->id,
                'user_id' => $meeting->participant_id,
                'status' => 'accepted',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore data (simplified, might lose multi-participant data)
        $meetingParticipants = DB::table('meeting_participants')->get();
        foreach ($meetingParticipants as $mp) {
            DB::table('participant_meetings')
                ->where('id', $mp->participant_meeting_id)
                ->update(['participant_id' => $mp->user_id]);
        }

        Schema::table('participant_meetings', function (Blueprint $table) {
            $table->dropColumn('max_participants');
            $table->foreignId('participant_id')->nullable(false)->change();
        });

        Schema::dropIfExists('meeting_participants');
    }
};
