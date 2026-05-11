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
        if (Schema::hasColumn('users', 'detail')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('detail');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We cannot reliably reverse this migration as we don't know the column type
        // if it existed. Since it likely didn't exist or was unwanted, 
        // we leave this empty.
    }
};
