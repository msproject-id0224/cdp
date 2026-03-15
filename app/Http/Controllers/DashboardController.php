<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\ProfilePhotoRequest;
use App\Models\Letter;
use App\Models\ParticipantGift;
use App\Models\User;
use App\Http\Controllers\Admin\MentorPerformanceController;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Base Dashboard Data
        $schedules = Schedule::where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->take(10)
            ->get();

        $photoRequests = [];
        if ($user && $user->role === User::ROLE_ADMIN) {
            $photoRequests = ProfilePhotoRequest::with('user')
                ->where('status', 'pending')
                ->latest()
                ->get();
        }

        // Additional Data for Participant Panel
        $letters = [];
        $gifts = [];

        if ($user->isParticipant()) {
            // Letter History
            $lettersQuery = Letter::where('recipient_id', $user->id)
                ->orWhere('sender_id', $user->id);
            
            if ($request->filled('letter_search')) {
                $search = $request->letter_search;
                $lettersQuery->where(function($q) use ($search) {
                    $q->where('letter_number', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
                });
            }
            
            $letters = $lettersQuery->latest('sent_at')->paginate(5, ['*'], 'letter_page')->withQueryString();

            // Gift History
            $giftsQuery = ParticipantGift::where('user_id', $user->id);

            if ($request->filled('gift_date_start') && $request->filled('gift_date_end')) {
                $giftsQuery->whereBetween('created_at', [$request->gift_date_start, $request->gift_date_end]);
            }

            $gifts = $giftsQuery->latest()->paginate(5, ['*'], 'gift_page')->withQueryString();
        }

        // Performance scores for mentor self-view
        $mentorPerformance = null;
        if ($user->isMentor()) {
            $mentorPerformance = (new MentorPerformanceController())->getScoresForMentor($user);
        }

        return Inertia::render('Dashboard', [
            'schedules'         => $schedules,
            'photoRequests'     => $photoRequests,
            'letters'           => $letters,
            'gifts'             => $gifts,
            'filters'           => $request->only(['letter_search', 'gift_date_start', 'gift_date_end']),
            'mentorPerformance' => $mentorPerformance,
        ]);
    }
}
