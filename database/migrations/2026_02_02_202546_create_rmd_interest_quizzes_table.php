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
        Schema::create('rmd_interest_quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('score_analitis')->default(0);
            $table->integer('score_kreatif')->default(0);
            $table->integer('score_sosial')->default(0);
            $table->integer('score_teknis')->default(0);
            $table->integer('score_fisik')->default(0);
            $table->json('answers')->nullable(); // Store detailed answers if needed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_interest_quizzes');
    }
};
