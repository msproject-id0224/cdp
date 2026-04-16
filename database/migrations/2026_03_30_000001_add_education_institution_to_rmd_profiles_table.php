<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rmd_profiles', function (Blueprint $table) {
            $table->string('first_filled_education_institution')->nullable()->after('first_filled_education');
        });
    }

    public function down(): void
    {
        Schema::table('rmd_profiles', function (Blueprint $table) {
            $table->dropColumn('first_filled_education_institution');
        });
    }
};
