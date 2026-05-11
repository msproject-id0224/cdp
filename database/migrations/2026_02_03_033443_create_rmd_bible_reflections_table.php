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
        Schema::create('rmd_bible_reflections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Yeremia 29:11
            $table->text('jeremiah_29_11_who_knows')->nullable();
            $table->text('jeremiah_29_11_plans')->nullable();
            
            // Efesus 2:10
            $table->text('ephesians_2_10_made_by')->nullable();
            $table->text('ephesians_2_10_purpose')->nullable();
            $table->text('ephesians_2_10_god_wants')->nullable();
            
            // Kejadian 1:26-28
            $table->text('genesis_1_26_28_image')->nullable();
            $table->text('genesis_1_26_28_purpose')->nullable();
            
            // Summary points
            $table->text('summary_point_1')->nullable();
            $table->text('summary_point_2')->nullable();
            
            // Reflection
            $table->text('favorite_verse')->nullable();
            $table->text('reason_favorite_verse')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rmd_bible_reflections');
    }
};
