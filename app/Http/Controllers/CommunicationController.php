<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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
        $query = $request->input('query');
        $currentUser = Auth::user();
        
        // Base query: exclude current user
        $users = User::where('id', '!=', $currentUser->id)
            ->where(function($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                  ->orWhere('last_name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            });

        // Filter based on role if necessary (e.g., Participants can only chat with their Mentor or other Participants)
        if ($currentUser->isParticipant()) {
             // Participants can see their mentor and other participants
             // If RBAC is strict:
             // $users->where(function($q) use ($currentUser) {
             //     $q->where('id', $currentUser->mentor_id)
             //       ->orWhere('role', User::ROLE_PARTICIPANT);
             // });
             
             // For now, let's allow searching Admins, Mentors, and Participants as requested ("Penyelenggara acara atau sesama peserta")
             // "Penyelenggara" = Admin/Mentor
             // "Sesama peserta" = Participant
        }

        $results = $users->limit(10)->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name_display, // Use the accessor
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->first_name_display),
                'is_online' => $user->last_seen_at && $user->last_seen_at->diffInMinutes(now()) < 5,
                'last_seen' => $user->last_seen_at ? $user->last_seen_at->diffForHumans() : 'Offline',
            ];
        });

        return response()->json($results);
    }
}
