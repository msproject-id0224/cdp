<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participant_notes', function (Blueprint $table) {
            $table->enum('visibility', ['private', 'public'])->default('private')->after('subject');
        });
    }

    public function down(): void
    {
        Schema::table('participant_notes', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};
