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
        Schema::create('rmd_multiple_intelligence_quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('linguistic');
            $table->integer('logical_mathematical');
            $table->integer('spatial_visual');
            $table->integer('kinesthetic');
            $table->integer('musical');
            $table->integer('interpersonal');
            $table->integer('intrapersonal');
            $table->integer('naturalist');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_multiple_intelligence_quizzes');
    }
};
