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
        if (!Schema::hasTable('rmd_career_explorations')) {
            Schema::create('rmd_career_explorations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                
                // Gaya Belajar & Profesi (Table 1)
                $table->text('visual_professions')->nullable();
                $table->text('auditory_professions')->nullable();
                $table->text('kinesthetic_professions_style')->nullable(); // Renamed to avoid duplicate
                $table->text('interested_professions_from_style')->nullable(); // Tandai 3 profesi yang diminati
                
                // Kecerdasan Majemuk & Profesi (Table 2)
                $table->text('linguistic_ability')->nullable();
                $table->text('linguistic_professions')->nullable();
                $table->text('logical_math_ability')->nullable();
                $table->text('logical_math_professions')->nullable();
                $table->text('visual_spatial_ability')->nullable();
                $table->text('visual_spatial_professions')->nullable();
                $table->text('kinesthetic_ability')->nullable();
                $table->text('kinesthetic_professions')->nullable();
                $table->text('musical_ability')->nullable();
                $table->text('musical_professions')->nullable();
                $table->text('interpersonal_ability')->nullable();
                $table->text('interpersonal_professions')->nullable();
                $table->text('intrapersonal_ability')->nullable();
                $table->text('intrapersonal_professions')->nullable();
                $table->text('naturalist_ability')->nullable();
                $table->text('naturalist_professions')->nullable();
                
                // Pertimbangan Menentukan Cita-Cita (Checklist)
                $table->boolean('consider_learning_style')->default(false);
                $table->boolean('consider_intelligence')->default(false);
                $table->boolean('consider_academic_achievement')->default(false);
                $table->boolean('consider_parental_support')->default(false);
                $table->boolean('consider_gods_will')->default(false);
                $table->text('additional_considerations')->nullable();
                
                // Tabel Pengambilan Keputusan Karier
                $table->json('career_decision_matrix')->nullable();
                
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_career_explorations');
    }
};
