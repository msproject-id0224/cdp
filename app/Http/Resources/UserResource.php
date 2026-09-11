<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Varian partisipan -- field yang diekspos SENGAJA dibatasi (aturan #3 di
 * FLUTTER_MIGRATION_PROMPTS.md). Kolom seperti `specialization`/`experience`/
 * `job_title`/`bio` (dipakai mentor & admin) serta `height`/`weight` (area
 * abu-abu dengan domain health_screenings yang memang tidak diekspos ke
 * partisipan, lihat Bagian A.5 dokumen migrasi) tidak disertakan di sini.
 * Kalau mentor/admin nanti butuh resource sendiri, buat class baru --
 * jangan tambah kondisional role di sini.
 */
class UserResource extends JsonResource
{
    /**
     * Tanpa ini, Laravel membungkus resource top-level (mis. respons
     * GET /api/v1/me) dalam {"data": {...}}. Nesting-nesting resource ini
     * di dalam array lain (mis. field `user` pada respons verify OTP) TIDAK
     * terpengaruh oleh flag ini -- wrapping cuma berlaku saat resource jadi
     * response top-level.
     */
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'id_number' => $this->id_number,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'age' => $this->age,
            'gender' => $this->gender,
            'education' => $this->education,
            'age_group' => $this->age_group,
            'phone_number' => $this->phone_number,
            'mentor_id' => $this->mentor_id,
            'profile_photo_url' => $this->profile_photo_url,
            'profile_photo_status' => $this->profile_photo_status,
        ];
    }
}
