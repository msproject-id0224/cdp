<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OnlineUserController extends Controller
{
    /**
     * Get list of online users based on session activity.
     */
    public function index(Request $request)
    {
        $query = $request->input('query');

        // Get users active in the last 5 minutes
        // We use a subquery to get the latest activity for each user
        $latestSessions = DB::table('sessions')
            ->select('user_id', DB::raw('MAX(last_activity) as last_activity'))
            ->where('last_activity', '>=', now()->subMinutes(5)->timestamp)
            ->whereNotNull('user_id')
            ->groupBy('user_id');

        $users = DB::table('users')
            ->joinSub($latestSessions, 'sessions', function ($join) {
                $join->on('users.id', '=', 'sessions.user_id');
            })
            ->where('users.id', '!=', $request->user()->id)
            ->when($query, function ($q) use ($query) {
                $q->where(function($sub) use ($query) {
                    $sub->where('users.first_name', 'like', "%{$query}%")
                        ->orWhere('users.last_name', 'like', "%{$query}%")
                        ->orWhere('users.role', 'like', "%{$query}%");
                });
            })
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.role', 'sessions.last_activity')
            ->orderByDesc('sessions.last_activity')
            ->limit(50)
            ->get()
            ->map(function ($user) {
                $fullName = trim($user->first_name . ' ' . $user->last_name);
                return [
                    'id' => $user->id,
                    'name' => $fullName,
                    'role' => $user->role ?? 'participant',
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($fullName) . '&background=random',
                    'status' => 'online',
                    'last_active' => Carbon::createFromTimestamp($user->last_activity)->diffForHumans()
                ];
            });

        return response()->json($users);
    }
}
