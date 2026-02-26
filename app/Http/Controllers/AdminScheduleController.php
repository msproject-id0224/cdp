<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\ParticipantMeeting;
use App\Models\User;
use App\Notifications\ScheduleDecisionNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminScheduleController extends Controller
{
    /**
     * Display the admin schedule approval page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/ScheduleApproval');
    }

    /**
     * Fetch pending schedules with filtering.
     */
    public function getPendingSchedules(Request $request): JsonResponse
    {
        $query = ParticipantMeeting::with(['mentor', 'participants'])
            ->where('status', 'pending');

        // Filter by mentor name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('mentor', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
                })
                ->orWhere('agenda', 'like', "%{$search}%");
            });
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('scheduled_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('scheduled_at', '<=', $request->end_date);
        }

        // Sorting
        $sortField = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if ($sortField === 'mentor.name') {
            $query->join('users', 'participant_meetings.mentor_id', '=', 'users.id')
                  ->select('participant_meetings.*')
                  ->orderBy('users.first_name', $sortOrder)
                  ->orderBy('users.last_name', $sortOrder);
        } else {
            $query->orderBy($sortField, $sortOrder);
        }

        $schedules = $query->paginate(15);

        return response()->json($schedules);
    }

    /**
     * Approve a schedule.
     */
    public function approve(ParticipantMeeting $meeting): JsonResponse
    {
        try {
            DB::beginTransaction();
            $this->approveSchedule($meeting);
            DB::commit();
            return response()->json(['message' => 'Schedule approved successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to approve schedule {$meeting->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to approve schedule.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Internal method to approve a schedule.
     */
    private function approveSchedule(ParticipantMeeting $meeting)
    {
        $meeting->update([
            'status' => 'scheduled',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
            'rejection_reason' => null,
        ]);

        // Notify Mentor
        if ($meeting->mentor) {
            try {
                $meeting->mentor->notify(new ScheduleDecisionNotification($meeting, 'approved'));
            } catch (\Exception $e) {
                Log::error("Failed to send approval notification for meeting {$meeting->id}: " . $e->getMessage());
            }
        }

        // Log Audit
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'APPROVE_SCHEDULE',
            'target_id' => $meeting->id,
            'target_type' => ParticipantMeeting::class,
            'details' => ['status' => 'scheduled'],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Reject a schedule.
     */
    public function reject(Request $request, ParticipantMeeting $meeting): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();
            $this->rejectSchedule($meeting, $validated['reason']);
            DB::commit();
            return response()->json(['message' => 'Schedule rejected successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to reject schedule {$meeting->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to reject schedule.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Internal method to reject a schedule.
     */
    private function rejectSchedule(ParticipantMeeting $meeting, string $reason)
    {
        $meeting->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        // Notify Mentor
        if ($meeting->mentor) {
            try {
                $meeting->mentor->notify(new ScheduleDecisionNotification($meeting, 'rejected', $reason));
            } catch (\Exception $e) {
                Log::error("Failed to send rejection notification for meeting {$meeting->id}: " . $e->getMessage());
            }
        }

        // Log Audit
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'REJECT_SCHEDULE',
            'target_id' => $meeting->id,
            'target_type' => ParticipantMeeting::class,
            'details' => ['status' => 'rejected', 'reason' => $reason],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Request modification for a schedule.
     */
    public function requestModification(Request $request, ParticipantMeeting $meeting): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();
            
            $meeting->update([
                'status' => 'modification_requested',
                'rejection_reason' => $validated['reason'],
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            // Notify Mentor
            if ($meeting->mentor) {
                try {
                    $meeting->mentor->notify(new ScheduleDecisionNotification($meeting, 'modification_requested', $validated['reason']));
                } catch (\Exception $e) {
                    Log::error("Failed to send modification request notification for meeting {$meeting->id}: " . $e->getMessage());
                }
            }

            // Log Audit
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'REQUEST_MODIFICATION',
                'target_id' => $meeting->id,
                'target_type' => ParticipantMeeting::class,
                'details' => ['status' => 'modification_requested', 'reason' => $validated['reason']],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();
            return response()->json(['message' => 'Modification requested successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to request modification for schedule {$meeting->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to request modification.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk approve schedules.
     */
    public function bulkApprove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:participant_meetings,id',
        ]);

        try {
            DB::beginTransaction();
            $meetings = ParticipantMeeting::whereIn('id', $validated['ids'])
                ->where('status', 'pending')
                ->get();

            foreach ($meetings as $meeting) {
                $this->approveSchedule($meeting);
            }
            DB::commit();
            return response()->json(['message' => count($meetings) . ' schedules approved successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to bulk approve schedules: " . $e->getMessage());
            return response()->json(['message' => 'Failed to approve schedules.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Bulk reject schedules.
     */
    public function bulkReject(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:participant_meetings,id',
            'reason' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();
            $meetings = ParticipantMeeting::whereIn('id', $validated['ids'])
                ->where('status', 'pending')
                ->get();

            foreach ($meetings as $meeting) {
                $this->rejectSchedule($meeting, $validated['reason']);
            }
            DB::commit();
            return response()->json(['message' => count($meetings) . ' schedules rejected successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to bulk reject schedules: " . $e->getMessage());
            return response()->json(['message' => 'Failed to reject schedules.', 'error' => $e->getMessage()], 500);
        }
    }
}
