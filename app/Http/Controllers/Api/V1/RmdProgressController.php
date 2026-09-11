<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\RmdProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Versi terstruktur dari RmdController::index() -- alih-alih redirect
 * Inertia ke modul pertama yang belum selesai, endpoint ini mengembalikan
 * status setiap modul dalam satu payload JSON supaya Flutter bisa membangun
 * stepper-nya sendiri. Perhitungan progres 100% memakai
 * RmdProgressService::calculateProgress() yang sama dipakai RmdController
 * -- jangan hitung ulang logic completeness di sini (aturan #2).
 */
class RmdProgressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(RmdProgressService::buildProgressPayload($request->user()));
    }
}
