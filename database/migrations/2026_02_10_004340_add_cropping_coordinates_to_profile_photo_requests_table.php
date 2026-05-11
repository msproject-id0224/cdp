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
        Schema::table('profile_photo_requests', function (Blueprint $table) {
            $table->decimal('crop_x', 10, 2)->nullable();
            $table->decimal('crop_y', 10, 2)->nullable();
            $table->decimal('crop_width', 10, 2)->nullable();
            $table->decimal('crop_height', 10, 2)->nullable();
            $table->decimal('zoom', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_photo_requests', function (Blueprint $table) {
            $table->dropColumn(['crop_x', 'crop_y', 'crop_width', 'crop_height', 'zoom']);
        });
    }
};
