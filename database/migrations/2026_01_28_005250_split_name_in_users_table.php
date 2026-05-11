<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('last_name')->after('name')->nullable();
        });

        // Split existing names
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $parts = explode(' ', $user->name, 2);
            $firstName = $parts[0];
            $lastName = isset($parts[1]) ? $parts[1] : '';

            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'name' => $firstName, // Temporarily store first name in 'name' before renaming
                    'last_name' => $lastName
                ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'first_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('first_name', 'name');
        });

        // Combine first and last name back to name
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            $fullName = trim($user->name . ' ' . $user->last_name);
            
            DB::table('users')
                ->where('id', $user->id)
                ->update(['name' => $fullName]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('last_name');
        });
    }
};
