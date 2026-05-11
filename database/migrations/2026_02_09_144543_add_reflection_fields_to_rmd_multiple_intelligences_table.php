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
            $table->text('reflection_suitability')->nullable();
            $table->text('reflection_development')->nullable();
            $table->text('reflection_new_learning')->nullable();
            $table->text('reflection_plan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_multiple_intelligences', function (Blueprint $table) {
            $table->dropColumn([
                'reflection_suitability',
                'reflection_development',
                'reflection_new_learning',
                'reflection_plan'
            ]);
        });
    }
};
