<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rmd_socio_emotionals', function (Blueprint $table) {
            if (!Schema::hasColumn('rmd_socio_emotionals', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'learning_style_practice')) {
                $table->text('learning_style_practice')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'learning_style_impact')) {
                $table->text('learning_style_impact')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'birth_order_siblings')) {
                $table->string('birth_order_siblings')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'parents_occupation')) {
                $table->string('parents_occupation')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'home_responsibilities')) {
                $table->text('home_responsibilities')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'height')) {
                $table->string('height')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'weight')) {
                $table->string('weight')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'physical_traits')) {
                $table->text('physical_traits')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'favorite_sports')) {
                $table->text('favorite_sports')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'sports_achievements')) {
                $table->text('sports_achievements')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'eating_habits')) {
                $table->text('eating_habits')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'sleeping_habits')) {
                $table->text('sleeping_habits')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'health_issues')) {
                $table->text('health_issues')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'physical_likes')) {
                $table->text('physical_likes')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'physical_development_goal')) {
                $table->text('physical_development_goal')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_knowledge_jesus')) {
                $table->text('spiritual_knowledge_jesus')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_relationship_growth')) {
                $table->text('spiritual_relationship_growth')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_love_obedience')) {
                $table->text('spiritual_love_obedience')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_community')) {
                $table->text('spiritual_community')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_bible_study')) {
                $table->text('spiritual_bible_study')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_mentor')) {
                $table->text('spiritual_mentor')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_reflection_learned')) {
                $table->text('spiritual_reflection_learned')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'spiritual_reflection_improvement')) {
                $table->text('spiritual_reflection_improvement')->nullable();
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'chapter3_check1')) {
                $table->boolean('chapter3_check1')->default(false);
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'chapter3_check2')) {
                $table->boolean('chapter3_check2')->default(false);
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'chapter3_check3')) {
                $table->boolean('chapter3_check3')->default(false);
            }
            if (!Schema::hasColumn('rmd_socio_emotionals', 'chapter3_check4')) {
                $table->boolean('chapter3_check4')->default(false);
            }
        });
    }

    public function down(): void
    {
        Schema::table('rmd_socio_emotionals', function (Blueprint $table) {
            $table->dropColumn([
                'user_id',
                'learning_style_practice',
                'learning_style_impact',
                'birth_order_siblings',
                'parents_occupation',
                'home_responsibilities',
                'height',
                'weight',
                'physical_traits',
                'favorite_sports',
                'sports_achievements',
                'eating_habits',
                'sleeping_habits',
                'health_issues',
                'physical_likes',
                'physical_development_goal',
                'spiritual_knowledge_jesus',
                'spiritual_relationship_growth',
                'spiritual_love_obedience',
                'spiritual_community',
                'spiritual_bible_study',
                'spiritual_mentor',
                'spiritual_reflection_learned',
                'spiritual_reflection_improvement',
                'chapter3_check1',
                'chapter3_check2',
                'chapter3_check3',
                'chapter3_check4',
            ]);
        });
    }
};
