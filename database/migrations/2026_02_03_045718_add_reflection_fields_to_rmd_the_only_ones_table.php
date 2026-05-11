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
        Schema::table('rmd_the_only_ones', function (Blueprint $table) {
            $table->text('learned_aspects')->nullable()->after('kinesthetic_checklist');
            $table->text('aspects_to_improve')->nullable()->after('learned_aspects');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rmd_the_only_ones', function (Blueprint $table) {
            $table->dropColumn(['learned_aspects', 'aspects_to_improve']);
        });
    }
};
