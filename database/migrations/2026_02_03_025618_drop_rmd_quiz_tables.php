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
        Schema::dropIfExists('rmd_multiple_intelligence_quizzes');
        Schema::dropIfExists('rmd_learning_style_quizzes');
        Schema::dropIfExists('rmd_interest_quizzes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We are not implementing down method as we want to permanently delete these tables
        // and we deleted the original migration files or logic (conceptually).
        // But to be safe, we could re-create them, but for this task "permanent deletion" is implied.
    }
};
