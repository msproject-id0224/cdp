<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_meeting_id')
                  ->constrained('participant_meetings')
                  ->onDelete('cascade');
            $table->string('token', 64)->unique(); // Signed token encoded in QR
            $table->boolean('is_active')->default(false);
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // null = no expiry while active
            $table->boolean('email_sent')->default(false);
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamps();

            $table->unique('participant_meeting_id'); // one session per meeting at a time
        });

        // Add scan_order + qr_token_used to attendances
        Schema::table('attendances', function (Blueprint $table) {
            $table->unsignedInteger('scan_order')->nullable()->after('id'); // sequential order of check-in
            $table->string('qr_token_used', 64)->nullable()->after('notes'); // token that was scanned
            $table->string('device_type', 20)->nullable()->after('qr_token_used'); // 'android' | 'pc'
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['scan_order', 'qr_token_used', 'device_type']);
        });
    }
};
