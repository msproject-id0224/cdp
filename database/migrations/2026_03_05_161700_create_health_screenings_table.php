<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Main Health Screening Table
        Schema::create('health_screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('examiner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('checked_at');
            $table->enum('status', ['draft', 'final'])->default('draft');
            
            // Vital Signs (Normalisasi)
            $table->decimal('weight', 5, 2)->nullable(); // kg
            $table->decimal('height', 5, 2)->nullable(); // cm
            $table->decimal('bmi', 5, 2)->nullable();    // Calculated
            $table->decimal('temperature', 4, 1)->nullable(); // Celcius
            $table->integer('pulse')->nullable();        // bpm
            $table->integer('respiration')->nullable();  // bpm
            $table->decimal('head_circumference', 5, 2)->nullable(); // cm
            $table->string('blood_pressure', 20)->nullable(); // mmHg
            $table->enum('malnutrition_status', ['normal', 'mild', 'moderate', 'severe'])->default('normal');
            
            // Clinical Conclusions
            $table->text('medical_history')->nullable();
            $table->text('major_findings')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('therapy')->nullable();
            $table->text('comments')->nullable();
            
            // Examiner Details (Snapshot data saat pengesahan)
            $table->string('examiner_name')->nullable();
            $table->string('examiner_qualification')->nullable();
            $table->text('examiner_signature')->nullable(); // Base64 or path
            $table->date('examiner_signed_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Immunizations Record Table (Normalized)
        Schema::create('health_screening_immunizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_screening_id')->constrained('health_screenings')->onDelete('cascade');
            $table->string('vaccine_code', 10); // BCG, DPT1, etc.
            $table->date('received_at')->nullable();
            $table->string('dose', 50)->nullable();
            $table->boolean('is_given_today')->default(false);
            $table->timestamps();
            
            // Index untuk pencarian cepat riwayat imunisasi anak
            $table->index(['health_screening_id', 'vaccine_code'], 'hsi_hs_id_vcode_index');
        });

        // 3. Body Systems & Physical Exam Findings (Normalized)
        Schema::create('health_screening_findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_screening_id')->constrained('health_screenings')->onDelete('cascade');
            $table->string('category', 50); // 'physical_appearance', 'body_system', 'lab_test'
            $table->string('item_key', 50); // 'head', 'respiratory', 'hemoglobin'
            $table->enum('status', ['normal', 'abnormal'])->default('normal');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_screening_findings');
        Schema::dropIfExists('health_screening_immunizations');
        Schema::dropIfExists('health_screenings');
    }
};
