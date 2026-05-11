<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ppa_settings', function (Blueprint $table) {
            $table->id();
            $table->string('fiscal_year')->nullable();
            $table->string('church_name')->nullable();
            $table->string('ppa_id')->nullable();
            $table->string('cluster')->nullable();
            $table->string('rmd_period')->nullable();
            $table->unsignedBigInteger('pic_user_id')->nullable();
            $table->foreign('pic_user_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ppa_settings');
    }
};
