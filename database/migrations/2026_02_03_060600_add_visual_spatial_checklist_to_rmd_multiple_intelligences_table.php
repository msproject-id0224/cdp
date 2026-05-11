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
        Schema::table('rmd_multiple_intelligences', function (Blueprint $table) {
            $table->json('visual_spatial_checklist')->nullable()->after('logical_mathematical_checklist');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_multiple_intelligences', function (Blueprint $table) {
            $table->dropColumn('visual_spatial_checklist');
        });
    }
};
