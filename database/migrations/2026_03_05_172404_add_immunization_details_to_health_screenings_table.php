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
        Schema::table('health_screenings', function (Blueprint $table) {
            $table->enum('immunization_status', ['incomplete', 'complete', 'fully_complete'])->nullable()->after('malnutrition_status');
            $table->text('immunization_other')->nullable()->after('immunization_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('health_screenings', function (Blueprint $table) {
            $table->dropColumn(['immunization_status', 'immunization_other']);
        });
    }
};
