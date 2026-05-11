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
        Schema::table('rmd_bible_reflections', function (Blueprint $table) {
            $table->string('leadership_c1')->nullable();
            $table->string('leadership_c2')->nullable();
            $table->string('leadership_c3')->nullable();
            $table->string('leadership_c4')->nullable();
            $table->string('leadership_c5')->nullable();
            
            $table->text('chapter_learning_text')->nullable();
            $table->string('chapter_learning_image_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_bible_reflections', function (Blueprint $table) {
            $table->dropColumn([
                'leadership_c1',
                'leadership_c2',
                'leadership_c3',
                'leadership_c4',
                'leadership_c5',
                'chapter_learning_text',
                'chapter_learning_image_path',
            ]);
        });
    }
};
