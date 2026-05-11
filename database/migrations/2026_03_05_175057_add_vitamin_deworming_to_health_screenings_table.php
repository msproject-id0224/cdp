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
            $table->string('vitamin_a_dose')->nullable()->after('immunization_other'); // 'blue', 'red', 'none'
            $table->date('vitamin_a_date')->nullable()->after('vitamin_a_dose');
            
            $table->string('deworming_dose')->nullable()->after('vitamin_a_date'); // 'yes', 'no'
            $table->date('deworming_date')->nullable()->after('deworming_dose');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('health_screenings', function (Blueprint $table) {
            $table->dropColumn(['vitamin_a_dose', 'vitamin_a_date', 'deworming_dose', 'deworming_date']);
        });
    }
};
