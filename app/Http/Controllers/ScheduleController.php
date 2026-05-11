<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\User;
use App\Notifications\ScheduleActivityNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $schedules = Schedule::orderBy('date', 'asc')->orderBy('start_time', 'asc')->get();
        return Inertia::render('Schedule/Index', [
            'schedules' => $schedules
        ]);
    }

    /**
     * Fetch schedules for API/Dashboard.
     */
    public function getSchedules(Request $request): JsonResponse
    {
        $query = Schedule::query();

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Filter by date
        if ($request->filled('date')) {
            $query->where('date', $request->date);
        }

        // Sort
        $sortBy = $request->input('sort_by', 'date');
        $sortOrder = $request->input('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Secondary sort by time if sorting by date
        if ($sortBy === 'date') {
            $query->orderBy('start_time', 'asc');
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $schedules = $query->paginate($perPage);

        return response()->json($schedules);
    }

    /**
     * Update the schedule priority via API.
     */
    public function updatePriority(Request $request, Schedule $schedule): JsonResponse
    {
        $validated = $request->validate([
            'priority' => 'required|in:low,medium,high',
        ]);

        $schedule->update(['priority' => $validated['priority']]);

        return response()->json([
            'message' => 'Priority updated successfully.',
            'schedule' => $schedule
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'date'          => 'required|date',
            'start_time'    => 'required',
            'end_time'      => 'required|after:start_time',
            'description'   => 'nullable|string',
            'priority'      => 'required|in:low,medium,high',
            'pic'           => 'required|string|max:255',
            'location'      => 'nullable|string|max:255',
            'status'        => 'nullable|in:scheduled,ongoing,completed,cancelled',
            'notify_target' => 'nullable|in:all_user,mentor_only,participant_only,staff_only',
        ]);

        $validated['description']   = $validated['description'] ?? '';
        $validated['location']      = $validated['location'] ?? '';
        $validated['status']        = $validated['status'] ?? 'scheduled';
        $validated['notify_target'] = $validated['notify_target'] ?? 'all_user';

        $schedule = Schedule::create($validated);

        $this->sendScheduleNotifications($schedule);

        return redirect()->back()->with('success', 'Activity added successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Schedule $schedule): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'date'          => 'required|date',
            'start_time'    => 'required',
            'end_time'      => 'required|after:start_time',
            'description'   => 'nullable|string',
            'priority'      => 'required|in:low,medium,high',
            'pic'           => 'required|string|max:255',
            'location'      => 'nullable|string|max:255',
            'status'        => 'nullable|in:scheduled,ongoing,completed,cancelled',
            'notify_target' => 'nullable|in:all_user,mentor_only,participant_only,staff_only',
        ]);

        $validated['description']   = $validated['description'] ?? '';
        $validated['location']      = $validated['location'] ?? '';
        $validated['status']        = $validated['status'] ?? 'scheduled';
        $validated['notify_target'] = $validated['notify_target'] ?? $schedule->notify_target ?? 'all_user';

        $schedule->update($validated);

        return redirect()->back()->with('success', 'Activity updated successfully.');
    }

    private function sendScheduleNotifications(Schedule $schedule): void
    {
        $target = $schedule->notify_target ?? 'all_user';

        $query = User::query();

        if ($target === 'mentor_only') {
            $query->where('role', User::ROLE_MENTOR);
        } elseif ($target === 'participant_only') {
            $query->where('role', User::ROLE_PARTICIPANT);
        } elseif ($target === 'staff_only') {
            $query->where('role', User::ROLE_ADMIN);
        }
        // all_user → no role filter

        $users = $query->get();

        foreach ($users as $user) {
            $user->notify(new ScheduleActivityNotification($schedule));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule): RedirectResponse
    {
        $schedule->delete();

        return redirect()->back()->with('success', 'Activity deleted successfully.');
    }
}
