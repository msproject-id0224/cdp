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
            // Change proof_photo_path to text to store JSON (multi-file) or longer path
            $table->text('proof_photo_path')->nullable()->change();
            
            // Add new columns
            $table->text('usage_plan')->nullable()->after('proof_photo_path');
            $table->date('reception_date')->nullable()->after('usage_plan');
            $table->text('gift_description')->nullable()->after('gift_code'); // For detail keterangan hadiah
            $table->decimal('gift_value', 10, 2)->nullable()->after('gift_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participant_gifts', function (Blueprint $table) {
            $table->string('proof_photo_path', 2048)->nullable()->change();
            $table->dropColumn(['usage_plan', 'reception_date', 'gift_description', 'gift_value']);
        });
    }
};
