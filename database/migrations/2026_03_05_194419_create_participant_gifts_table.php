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
        Schema::create('participant_gifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('gift_code')->unique(); // ID Hadiah
            $table->string('letter_code')->nullable(); // ID Surat Terhubung
            $table->enum('type', ['birthday', 'family', 'general']); // Jenis Hadiah
            $table->enum('status', ['pending', 'received', 'returned'])->default('pending'); // Status Hadiah
            $table->timestamps();
            
            // Ensure a user can receive multiple gifts, but gift_code MUST be unique globally as per "validasi keberadaan hadiah/duplikasi"
            // Wait, "Pastikan tidak ada duplikasi penerima hadiah untuk hadiah yang sama".
            // If `gift_code` represents a specific ITEM (e.g. Box #123), then it must be unique globally.
            // If `gift_code` represents a TYPE (e.g. 'Toy'), then (user_id, gift_code) unique?
            // "Input ID Hadiah" usually implies a specific ID. I will assume it is a unique ID for the item.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participant_gifts');
    }
};
