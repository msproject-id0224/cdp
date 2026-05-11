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
        Schema::table('rmd_multiple_intelligences', function (Blueprint $table) {
            $table->json('interpersonal_checklist')->nullable()->after('musical_checklist');
            $table->json('intrapersonal_checklist')->nullable()->after('interpersonal_checklist');
            $table->json('naturalist_checklist')->nullable()->after('intrapersonal_checklist');
            $table->json('existential_checklist')->nullable()->after('naturalist_checklist');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_multiple_intelligences', function (Blueprint $table) {
            $table->dropColumn([
                'interpersonal_checklist',
                'intrapersonal_checklist',
                'naturalist_checklist',
                'existential_checklist'
            ]);
        });
    }
};
