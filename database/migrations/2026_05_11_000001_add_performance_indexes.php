<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Composite index for chat conversation queries:
        // WHERE sender_id = ? AND receiver_id = ? ORDER BY created_at DESC
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->index(['sender_id', 'receiver_id', 'created_at'], 'chat_messages_conversation_idx');
        });

        // Indexes for attendance lookups (QR scan & reporting)
        Schema::table('attendances', function (Blueprint $table) {
            $table->index(['user_id', 'check_in_at'], 'attendances_user_checkin_idx');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex('chat_messages_conversation_idx');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex('attendances_user_checkin_idx');
        });
    }
};
