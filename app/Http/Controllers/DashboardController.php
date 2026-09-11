<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;
use App\Models\ProfilePhotoRequest;
use App\Models\User;
use App\Http\Controllers\Admin\MentorPerformanceController;
use App\Services\ParticipantEngagementService;

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
            $photoRequests = ProfilePhotoRequest::with('user:id,first_name,last_name,profile_photo_path')
                ->where('status', 'pending')
                ->latest()
                ->limit(20)
                ->get();
        }

        // Additional Data for Participant Panel
        $letters = [];
        $gifts = [];

        if ($user->isParticipant()) {
            // Letter & gift history -- query di ParticipantEngagementService,
            // dipakai juga oleh Api\V1\LetterController & Api\V1\GiftController.
            $letters = ParticipantEngagementService::lettersFor($user, $request->input('letter_search'))
                ->paginate(5, ['*'], 'letter_page')->withQueryString();

            $gifts = ParticipantEngagementService::giftsFor($user, $request->input('gift_date_start'), $request->input('gift_date_end'))
                ->paginate(5, ['*'], 'gift_page')->withQueryString();
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
