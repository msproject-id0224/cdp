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
        Schema::table('participant_gifts', function (Blueprint $table) {
            $table->enum('model', ['small', 'large'])->default('small')->after('type'); // Model Hadiah
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('participant_gifts', function (Blueprint $table) {
            $table->dropColumn('model');
        });
    }
};
