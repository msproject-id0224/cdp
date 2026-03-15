<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rmd_preparation_dream_islands', function (Blueprint $table) {
            if (!Schema::hasColumn('rmd_preparation_dream_islands', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('rmd_preparation_dream_islands', 'profession_questions')) {
                $table->json('profession_questions')->nullable();
            }
            if (!Schema::hasColumn('rmd_preparation_dream_islands', 'swot_analysis')) {
                $table->json('swot_analysis')->nullable();
            }
            if (!Schema::hasColumn('rmd_preparation_dream_islands', 'improvement_plan')) {
                $table->text('improvement_plan')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('rmd_preparation_dream_islands', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'profession_questions',
                'swot_analysis',
                'improvement_plan',
            ]);
        });
    }
};
