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
        Schema::create('rmd_true_successes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('successful_life_definition')->nullable();
            $table->text('general_success_measure')->nullable();
            $table->text('luke_2_52_growth')->nullable();
            $table->text('philippians_2_5_10_actions')->nullable();
            $table->text('jesus_success_vs_society')->nullable();
            $table->text('god_opinion_on_jesus')->nullable();
            $table->text('new_learning_text')->nullable();
            $table->string('new_learning_image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_true_successes');
    }
};
