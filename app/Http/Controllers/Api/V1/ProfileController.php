<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

/**
 * Tambahan Fase 1 (lihat FLUTTER_MIGRATION_PROMPTS.md Bagian B) -- bukan
 * bagian dari Fase 0. Endpoint ini dibutuhkan supaya app bisa memvalidasi
 * token yang sudah tersimpan (mis. saat app dibuka ulang) dan menampilkan
 * layar Profil, tanpa harus login OTP ulang tiap kali. Hanya GET/view untuk
 * sekarang -- edit profil & upload foto ditunda ke iterasi berikutnya
 * (butuh endpoint tersendiri yang meng-extract logic dari
 * ProfileController/ProfilePhotoController versi web, belum dikerjakan).
 */
class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return new UserResource($request->user());
    }
}
