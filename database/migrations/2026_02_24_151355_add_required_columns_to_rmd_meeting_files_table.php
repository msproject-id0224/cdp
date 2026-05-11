<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi untuk menambah kolom yang kurang.
     */
    public function up(): void
    {
        Schema::table('rmd_meeting_files', function (Blueprint $table) {
            // 1. Tambah user_id (Foreign Key ke tabel users)
            $table->foreignId('user_id')->after('id')->constrained()->cascadeOnDelete();

            // 2. Tambah meeting_type (Untuk menyimpan 'the-only-one-meeting-2', dll)
            $table->string('meeting_type')->after('user_id');

            // 3. Tambah file_path (Untuk lokasi penyimpanan file fisik)
            $table->string('file_path')->after('meeting_type');

            // 4. Tambah original_name (Opsional: agar nama file asli tersimpan)
            $table->string('original_name')->nullable()->after('file_path');
        });
    }

    /**
     * Balikkan perubahan jika migrasi di-rollback.
     */
    public function down(): void
    {
        Schema::table('rmd_meeting_files', function (Blueprint $table) {
            // Hapus constraint foreign key dulu baru kolomnya
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'meeting_type', 'file_path', 'original_name']);
        });
    }
};
