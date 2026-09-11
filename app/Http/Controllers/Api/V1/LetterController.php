<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\LetterResource;
use App\Services\ParticipantEngagementService;
use Illuminate\Http\Request;

/**
 * Baca-saja (Fase 2 point 3, keputusan "read-only dulu") -- kirim surat
 * BELUM ada endpoint-nya. Di web pun `participant.letters.store/update/
 * destroy` menunjuk ke method yang tidak ada di ParticipantController
 * (rusak/belum pernah diimplementasi), jadi ini bukan port dari sesuatu
 * yang sudah jalan.
 */
class LetterController extends Controller
{
    public function index(Request $request)
    {
        $letters = ParticipantEngagementService::lettersFor($request->user(), $request->query('search'))
            ->with(['sender:id,first_name,last_name', 'recipient:id,first_name,last_name'])
            ->paginate(10);

        return LetterResource::collection($letters);
    }
}
