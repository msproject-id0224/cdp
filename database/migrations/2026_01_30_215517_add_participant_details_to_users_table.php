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
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('education')->nullable();
            $table->string('age_group')->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->text('communication')->nullable();
        });

        // Migrate data
        $details = DB::table('participant_details')->get();
        foreach ($details as $detail) {
            DB::table('users')
                ->where('id', $detail->user_id)
                ->update([
                    'date_of_birth' => $detail->date_of_birth,
                    'age' => $detail->age,
                    'gender' => $detail->gender,
                    'education' => $detail->education,
                    'age_group' => $detail->age_group,
                    'height' => $detail->height,
                    'weight' => $detail->weight,
                    'communication' => $detail->communication,
                ]);
        }

        Schema::dropIfExists('participant_details');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('participant_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->string('education')->nullable();
            $table->string('age_group')->nullable();
            $table->text('communication')->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->string('gender')->nullable();
            $table->timestamps();
        });

        // Move data back
        $users = DB::table('users')->whereNotNull('date_of_birth')->orWhereNotNull('age')->get();
        foreach ($users as $user) {
            DB::table('participant_details')->insert([
                'user_id' => $user->id,
                'date_of_birth' => $user->date_of_birth,
                'age' => $user->age,
                'education' => $user->education,
                'age_group' => $user->age_group,
                'communication' => $user->communication,
                'height' => $user->height,
                'weight' => $user->weight,
                'gender' => $user->gender,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'age',
                'gender',
                'education',
                'age_group',
                'height',
                'weight',
                'communication'
            ]);
        });
    }
};
