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
        $tables = [
            'rmd_socio_emotionals',
            'rmd_career_exploration_p2_s',
            'rmd_preparation_dream_islands'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'user_id')) {
                        $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
                    }
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'rmd_socio_emotionals',
            'rmd_career_exploration_p2_s',
            'rmd_preparation_dream_islands'
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (Schema::hasColumn($tableName, 'user_id')) {
                        $table->dropForeign([$tableName . '_user_id_foreign']); // Assuming default naming convention
                        // Try dropping with table name prefix if default fails, but typically just dropColumn handles it if foreign key is dropped
                        $table->dropColumn('user_id');
                    }
                });
            }
        }
    }
};
