<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('participant_meetings', function (Blueprint $table) {
            $table->string('agenda_type')->nullable()->after('agenda');
            $table->text('tools_materials')->nullable()->after('agenda_type');
        });
    }

    public function down(): void
    {
        Schema::table('participant_meetings', function (Blueprint $table) {
            $table->dropColumn(['agenda_type', 'tools_materials']);
        });
    }
};
