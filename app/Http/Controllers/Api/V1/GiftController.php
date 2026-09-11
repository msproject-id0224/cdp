<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ParticipantGiftResource;
use App\Services\ParticipantEngagementService;
use Illuminate\Http\Request;

/**
 * Baca-saja (Fase 2 point 3, keputusan "read-only dulu") -- upload bukti
 * terima hadiah BELUM ada endpoint untuk partisipan (gifts.upload-proof di
 * web hanya role:admin,mentor).
 */
class GiftController extends Controller
{
    public function index(Request $request)
    {
        $gifts = ParticipantEngagementService::giftsFor(
            $request->user(),
            $request->query('date_start'),
            $request->query('date_end'),
        )->paginate(10);

        return ParticipantGiftResource::collection($gifts);
    }
}
