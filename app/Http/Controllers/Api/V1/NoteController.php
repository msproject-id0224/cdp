<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ParticipantNoteResource;
use App\Services\ParticipantEngagementService;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = ParticipantEngagementService::publicNotesFor($request->user())->get();

        return ParticipantNoteResource::collection($notes);
    }
}
