<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentor_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('document_type', [
                'ijazah_terakhir',
                'surat_pernyataan',
                'surat_pernyataan_komitmen_perlindungan_anak',
                'surat_keterangan_catatan_kepolisian',
                'ktp',
            ]);
            $table->string('file_path');
            $table->string('file_name');
            $table->string('file_mime')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->date('expires_at')->nullable(); // null = no expiry (one-time docs)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentor_documents');
    }
};
