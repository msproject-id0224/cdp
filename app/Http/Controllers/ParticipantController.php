<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AttendanceSession;
use App\Models\ChatMessage;
use App\Models\ParticipantNote;
use App\Models\ParticipantTask;
use App\Models\ParticipantMeeting;
use App\Models\AuditLog;
use App\Models\Schedule;
use Illuminate\Support\Str;
use App\Services\RmdProgressService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::where('role', User::ROLE_PARTICIPANT);
        
        // RBAC: Mentors can only see their assigned participants
        $currentUser = Auth::user();
        if ($currentUser->isMentor()) {
            $query->where('mentor_id', $currentUser->id);
            
            // Log access
            AuditLog::create([
                'user_id' => $currentUser->id,
                'action' => 'ACCESS_PARTICIPANT_LIST',
                'target_type' => User::class,
                'details' => ['mentor_id' => $currentUser->id],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }
        
        $mentors = [];
        if ($currentUser->isAdmin()) {
            $mentors = User::where('role', User::ROLE_MENTOR)->get();
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('nickname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        // Filter by Status
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Filter by Gender
        if ($request->filled('gender')) {
            $query->where('gender', $request->input('gender'));
        }

        // Filter by Age Group
        if ($request->filled('age_group')) {
            $query->where('age_group', $request->input('age_group'));
        }

        // Sort
        if ($request->filled('sort_by') && $request->filled('sort_direction')) {
            $query->orderBy($request->input('sort_by'), $request->input('sort_direction'));
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = (int) $request->input('per_page', 10);
        if ($perPage <= 0 || $perPage > 100) {
            $perPage = 10;
        }
        $participants = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Participant/Index', [
            'participants' => $participants,
            'filters' => $request->only(['search', 'status', 'gender', 'age_group', 'sort_by', 'sort_direction', 'per_page']),
            'mentors' => $mentors,
        ]);
    }

    public function show(User $participant): Response
    {
        if (!$participant->isParticipant()) {
            abort(404);
        }

        $viewer = Auth::user();

        // RBAC: If mentor, must be assigned
        if ($viewer->isMentor() && $participant->mentor_id !== $viewer->id) {
            abort(403, 'Unauthorized access to this participant.');
        }

        // Log access for mentors
        if ($viewer->isMentor()) {
            AuditLog::create([
                'user_id' => $viewer->id,
                'action' => 'VIEW_PARTICIPANT_DETAILS',
                'target_id' => $participant->id,
                'target_type' => User::class,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }

        $notes = ParticipantNote::where('participant_id', $participant->id)
            ->orderByDesc('created_at')
            ->get();

        $tasks = ParticipantTask::where('participant_id', $participant->id)
            ->orderByDesc('created_at')
            ->get();

        $meetings = ParticipantMeeting::where('participant_id', $participant->id)
            ->orderByDesc('scheduled_at')
            ->get();

        $messagesQuery = ChatMessage::where(function ($query) use ($participant, $viewer) {
            $query->where('sender_id', $viewer->id)
                ->where('receiver_id', $participant->id);
        })->orWhere(function ($query) use ($participant, $viewer) {
            $query->where('sender_id', $participant->id)
                ->where('receiver_id', $viewer->id);
        });

        $messages = $messagesQuery
            ->with(['sender'])
            ->orderByDesc('created_at')
            ->limit(20)
            ->get()
            ->reverse()
            ->values();

        $totalTasks = $tasks->count();
        $completedTasks = $tasks->where('status', 'completed')->count();
        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0;
        $meetingsCount = $meetings->count();
        $upcomingMeetingsCount = ParticipantMeeting::where('participant_id', $participant->id)
            ->where('scheduled_at', '>=', now())
            ->count();
        $messagesCount = $messagesQuery->count();
        $lastMessageAt = $messagesQuery->max('created_at');
        $lastMeetingAt = ParticipantMeeting::where('participant_id', $participant->id)->max('scheduled_at');

        // RMD Progress per module
        $rmdModules = RmdProgressService::getModules();
        $rmdProgress = collect($rmdModules)->map(function ($modelClass, $moduleName) use ($participant) {
            return array_merge(
                ['name' => $moduleName],
                RmdProgressService::calculateProgress($participant, $moduleName, $modelClass)
            );
        })->values();

        $rmdFilledCount = $rmdProgress->where('percentage', '>', 0)->count();
        $rmdTotalModules = $rmdProgress->count();
        $rmdOverallStatus = 'Belum Mulai';
        $rmdOverallPercentage = 0;
        if ($rmdFilledCount > 0) {
            $rmdOverallStatus = $rmdFilledCount === $rmdTotalModules ? 'Selesai' : 'Sedang Mengisi';
            $rmdOverallPercentage = round(($rmdFilledCount / $rmdTotalModules) * 100);
        }

        return Inertia::render('Participant/Show', [
            'participant' => $participant,
            'notes' => $notes,
            'tasks' => $tasks,
            'meetings' => $meetings,
            'messages' => $messages,
            'metrics' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'completion_rate' => $completionRate,
                'meetings_count' => $meetingsCount,
                'upcoming_meetings_count' => $upcomingMeetingsCount,
                'messages_count' => $messagesCount,
            ],
            'analytics' => [
                'last_message_at' => $lastMessageAt,
                'last_meeting_at' => $lastMeetingAt,
            ],
            'rmdProgress' => [
                'modules' => $rmdProgress,
                'filled_count' => $rmdFilledCount,
                'total_modules' => $rmdTotalModules,
                'overall_status' => $rmdOverallStatus,
                'overall_percentage' => $rmdOverallPercentage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Participant/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Only Admin can create participants
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'id_number' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'education' => 'nullable|string',
            'age_group' => 'nullable|string',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'communication' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $idNumber = $validated['id_number'] ?? null;
            if ($idNumber) {
                $prefix = 'ID-0224';
                // Remove prefix if present
                if (str_starts_with($idNumber, $prefix)) {
                    $idNumber = substr($idNumber, strlen($prefix));
                }
                $idNumber = $prefix . str_pad($idNumber, 5, '0', STR_PAD_LEFT);
            }

            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'nickname' => $validated['nickname'],
                'email' => $validated['email'],
                'role' => User::ROLE_PARTICIPANT,
                'id_number' => $idNumber,
                'is_active' => true,
                'date_of_birth' => $validated['date_of_birth'],
                'age' => $validated['age'],
                'gender' => $validated['gender'],
                'education' => $validated['education'],
                'age_group' => $validated['age_group'],
                'height' => $validated['height'],
                'weight' => $validated['weight'],
                'communication' => $validated['communication'],
            ]);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'CREATE_PARTICIPANT',
                'target_id' => $user->id,
                'target_type' => User::class,
                'details' => ['name' => $user->name, 'email' => $user->email],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();

            return to_route('participants.index')->with('success', 'Participant created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating participant: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'An error occurred while creating the participant. Please check the logs.');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $participant): Response
    {
        // Ensure the user is a participant
        if (!$participant->isParticipant()) {
            abort(404);
        }

        return Inertia::render('Participant/Edit', [
            'participant' => $participant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $participant): RedirectResponse
    {
        // Only Admin can update participants
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$participant->isParticipant()) {
            abort(404);
        }

        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'nickname' => 'nullable|string|max:255',
                'id_number' => 'nullable|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $participant->id,
                'date_of_birth' => 'nullable|date',
                'age' => 'nullable|integer',
                'gender' => 'nullable|string',
                'education' => 'nullable|string',
                'age_group' => 'nullable|string',
                'height' => 'nullable|numeric',
                'weight' => 'nullable|numeric',
                'communication' => 'nullable|string',
            ]);

            $idNumber = $validated['id_number'];
            if ($idNumber) {
                $prefix = 'ID-0224';
                // Remove prefix if present
                if (str_starts_with($idNumber, $prefix)) {
                    $idNumber = substr($idNumber, strlen($prefix));
                }
                $idNumber = $prefix . str_pad($idNumber, 5, '0', STR_PAD_LEFT);
            }

            $participant->update([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'nickname' => $validated['nickname'],
                'email' => $validated['email'],
                'id_number' => $idNumber,
                'date_of_birth' => $validated['date_of_birth'],
                'age' => $validated['age'],
                'gender' => $validated['gender'],
                'education' => $validated['education'],
                'age_group' => $validated['age_group'],
                'height' => $validated['height'],
                'weight' => $validated['weight'],
                'communication' => $validated['communication'],
            ]);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'UPDATE_PARTICIPANT',
                'target_id' => $participant->id,
                'target_type' => User::class,
                'details' => ['changes' => $participant->getChanges()],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return to_route('participants.index')->with('success', 'Participant updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating participant: ' . $e->getMessage(), [
                'participant_id' => $participant->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'An error occurred while updating the participant. Please check the logs.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $participant): RedirectResponse
    {
        // Only Admin can delete participants
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::beginTransaction();

            $participant->delete();

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'DELETE_PARTICIPANT',
                'target_id' => $participant->id,
                'target_type' => User::class,
                'details' => ['email' => $participant->email],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            return to_route('participants.index')->with('success', 'Participant deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting participant: ' . $e->getMessage(), [
                'participant_id' => $participant->id,
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'An error occurred while deleting the participant.');
        }
    }

    /**
     * Toggle the active status of the specified resource.
     */
    public function toggleStatus(User $participant): RedirectResponse
    {
        // Only Admin can toggle status
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$participant->isParticipant()) {
            abort(404);
        }

        try {
            DB::beginTransaction();

            $participant->update([
                'is_active' => !$participant->is_active,
            ]);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'TOGGLE_STATUS_PARTICIPANT',
                'target_id' => $participant->id,
                'target_type' => User::class,
                'details' => ['is_active' => $participant->is_active],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            return back()->with('success', 'Participant status updated.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error toggling participant status: ' . $e->getMessage(), [
                'participant_id' => $participant->id,
                'user_id' => Auth::id()
            ]);

            return back()->with('error', 'An error occurred while updating status.');
        }
    }

    public function updateStatus(Request $request, User $participant): JsonResponse
    {
        // Only Admin can update status
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if (!$participant->isParticipant()) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $participant->update([
            'is_active' => $validated['status'] === 'active',
        ]);

        return response()->json([
            'status' => 'success',
            'participant' => $participant,
        ]);
    }

    public function assignMentor(Request $request, User $participant): RedirectResponse
    {
        // Ensure only admin can assign
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'mentor_id' => 'nullable|exists:users,id',
        ]);

        // Check if mentor_id refers to a mentor
        if ($validated['mentor_id']) {
            $mentor = User::find($validated['mentor_id']);
            if (!$mentor->isMentor()) {
                return back()->withErrors(['mentor_id' => 'The selected user is not a mentor.']);
            }
        }

        $participant->update(['mentor_id' => $validated['mentor_id']]);

        // Log the assignment
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'ASSIGN_PARTICIPANT',
            'target_id' => $participant->id,
            'target_type' => User::class,
            'details' => ['mentor_id' => $validated['mentor_id']],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back()->with('success', 'Mentor assigned successfully.');
    }

    public function storeNote(Request $request, User $participant): JsonResponse
    {
        if (!$participant->isParticipant()) {
            abort(404);
        }

        // RBAC: If mentor, must be assigned
        if (Auth::user()->isMentor() && $participant->mentor_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this participant.');
        }

        $validated = $request->validate([
            'note' => 'required|string|max:2000',
        ]);

        $note = ParticipantNote::create([
            'participant_id' => $participant->id,
            'mentor_id' => Auth::id(),
            'note' => $validated['note'],
        ]);

        return response()->json($note, 201);
    }

    public function storeTask(Request $request, User $participant): JsonResponse
    {
        if (!$participant->isParticipant()) {
            abort(404);
        }

        // RBAC: If mentor, must be assigned
        if (Auth::user()->isMentor() && $participant->mentor_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this participant.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'due_date' => 'nullable|date',
        ]);

        $task = ParticipantTask::create([
            'participant_id' => $participant->id,
            'mentor_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json($task, 201);
    }

    public function updateTaskStatus(Request $request, User $participant, ParticipantTask $task): JsonResponse
    {
        if (!$participant->isParticipant()) {
            abort(404);
        }

        // RBAC: If mentor, must be assigned
        if (Auth::user()->isMentor() && $participant->mentor_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this participant.');
        }

        if ($task->participant_id !== $participant->id) {
            abort(404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task->update([
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ]);

        return response()->json($task);
    }

    public function storeMeeting(Request $request, User $participant): JsonResponse
    {
        if (!$participant->isParticipant()) {
            abort(404);
        }

        // RBAC: If mentor, must be assigned
        if (Auth::user()->isMentor() && $participant->mentor_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this participant.');
        }

        $validated = $request->validate([
            'scheduled_at' => 'required|date',
            'location' => 'nullable|string|max:255',
            'agenda' => 'nullable|string|max:2000',
        ]);

        $meeting = ParticipantMeeting::create([
            'participant_id' => $participant->id,
            'mentor_id'      => Auth::id(),
            'scheduled_at'   => $validated['scheduled_at'],
            'location'       => $validated['location'] ?? null,
            'agenda'         => $validated['agenda'] ?? null,
            'status'         => 'scheduled',
        ]);

        // Auto-create AttendanceSession — scheduler will send QR email 10 min before start
        AttendanceSession::create([
            'participant_meeting_id' => $meeting->id,
            'token'                  => Str::random(48),
            'is_active'              => false,
            'email_sent'             => false,
        ]);

        return response()->json($meeting, 201);
    }

    public function myNotes(): Response
    {
        $user = Auth::user();
        if (!$user->isParticipant()) {
            abort(403);
        }

        $notes = ParticipantNote::where('participant_id', $user->id)
            ->with('mentor')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Participant/Notes', [
            'notes' => $notes,
        ]);
    }

    public function mySchedule(): Response
    {
        $user = Auth::user();
        if (!$user->isParticipant()) {
            abort(403);
        }

        $meetings = ParticipantMeeting::query()
            ->with(['mentor', 'participants'])
            ->where(function ($query) use ($user) {
                $query->whereHas('participants', function ($q) use ($user) {
                      $q->where('users.id', $user->id);
                  })
                  ->orWhere('participant_id', $user->id);
            })
            ->orderByDesc('scheduled_at')
            ->get();

        $adminSchedules = Schedule::whereIn('notify_target', ['all_user', 'participant_only'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return Inertia::render('Participant/Schedule', [
            'meetings'       => $meetings,
            'adminSchedules' => $adminSchedules,
        ]);
    }
}
