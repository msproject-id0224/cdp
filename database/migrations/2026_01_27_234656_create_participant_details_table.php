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
        Schema::create('participant_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->string('education')->nullable();
            $table->string('age_group')->nullable();
            $table->text('communication')->nullable();
            $table->decimal('height', 5, 2)->nullable(); // e.g., 170.50
            $table->decimal('weight', 5, 2)->nullable(); // e.g., 65.50
            $table->string('gender')->nullable(); // Laki-laki / Perempuan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participant_details');
    }
};
