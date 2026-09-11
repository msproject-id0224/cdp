<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Services\ChatService;

class CommunicationController extends Controller
{
    /**
     * Display the communication page for mentors.
     */
    public function index(): Response
    {
        return Inertia::render('Communication/Index');
    }

    /**
     * Display the communication page for participants.
     */
    public function participantIndex(): Response
    {
        return Inertia::render('Participant/Communication/Index', [
            'auth' => [
                'user' => Auth::user(),
            ]
        ]);
    }
    
    /**
     * Search for users to chat with.
     */
    public function searchUsers(Request $request)
    {
        // Query & mapping-nya ada di ChatService::searchContacts() -- dipakai
        // bersama Api\V1\ChatController::search(). CATATAN: belum ada
        // pembatasan role (mis. partisipan bisa cari admin/mentor/partisipan
        // lain) -- ini keputusan eksplisit yang dipertahankan, bukan lupa
        // diimplementasi (lihat komentar di ChatService).
        return response()->json(ChatService::searchContacts(Auth::user(), $request->input('query')));
    }
}
