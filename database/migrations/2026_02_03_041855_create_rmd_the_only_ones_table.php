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
        Schema::create('rmd_the_only_ones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Keunikan
            $table->text('unique_traits')->nullable();
            
            // Perkembanganku dalam aspek intelektual
            $table->string('current_education_level')->nullable();
            $table->string('favorite_subject')->nullable();
            $table->text('favorite_subject_reason')->nullable();
            $table->string('least_favorite_subject')->nullable();
            $table->text('least_favorite_subject_reason')->nullable();
            $table->string('highest_score_subject')->nullable();
            $table->string('highest_score_value')->nullable();
            $table->string('lowest_score_subject')->nullable();
            $table->string('lowest_score_value')->nullable();
            
            // Learning Styles Checklists (storing indices of checked items)
            $table->json('visual_checklist')->nullable();
            $table->json('auditory_checklist')->nullable();
            $table->json('kinesthetic_checklist')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_the_only_ones');
    }
};
