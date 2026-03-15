<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rmd_career_exploration_p2_s', function (Blueprint $table) {
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'final_career_choice')) {
                $table->text('final_career_choice')->nullable();
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'final_career_reason')) {
                $table->text('final_career_reason')->nullable();
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'swot_definition')) {
                $table->text('swot_definition')->nullable();
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'swot_analysis_data')) {
                $table->json('swot_analysis_data')->nullable();
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'chapter4_check1')) {
                $table->boolean('chapter4_check1')->default(false);
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'chapter4_check2')) {
                $table->boolean('chapter4_check2')->default(false);
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'chapter4_check3')) {
                $table->boolean('chapter4_check3')->default(false);
            }
            if (!Schema::hasColumn('rmd_career_exploration_p2_s', 'mentoring_notes')) {
                $table->text('mentoring_notes')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('rmd_career_exploration_p2_s', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'final_career_choice',
                'final_career_reason',
                'swot_definition',
                'swot_analysis_data',
                'chapter4_check1',
                'chapter4_check2',
                'chapter4_check3',
                'mentoring_notes',
            ]);
        });
    }
};
