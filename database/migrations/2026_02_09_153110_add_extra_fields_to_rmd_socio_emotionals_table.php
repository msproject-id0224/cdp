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
        Schema::table('rmd_socio_emotionals', function (Blueprint $table) {
            if (!Schema::hasColumn('rmd_socio_emotionals', 'family_uniqueness')) {
                $table->text('family_uniqueness')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'extracurricular_activities')) {
                $table->text('extracurricular_activities')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'ppa_activities')) {
                $table->text('ppa_activities')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'hobbies')) {
                $table->text('hobbies')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'strengths')) {
                $table->text('strengths')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'weaknesses')) {
                $table->text('weaknesses')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'reflection_learned')) {
                $table->text('reflection_learned')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'reflection_improvement')) {
                $table->text('reflection_improvement')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_socio_emotionals', function (Blueprint $table) {
            $table->dropColumn([
                'family_uniqueness',
                'extracurricular_activities',
                'ppa_activities',
                'hobbies',
                'strengths',
                'weaknesses',
                'reflection_learned',
                'reflection_improvement'
            ]);
        });
    }
};
