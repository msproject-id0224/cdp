<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\AttendanceSession;
use App\Models\ParticipantMeeting;
use App\Notifications\ScheduleDecisionNotification;
use Illuminate\Support\Str;
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
     * Fetch all mentor meetings for calendar display (pending + approved).
     */
    public function getAllMeetings(Request $request): JsonResponse
    {
        $query = ParticipantMeeting::with(['mentor:id,first_name,last_name,email'])
            ->select(['id', 'mentor_id', 'scheduled_at', 'end_time', 'status', 'agenda', 'agenda_type', 'location']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('scheduled_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('scheduled_at', '<=', $request->end_date);
        }

        return response()->json($query->orderBy('scheduled_at', 'asc')->get());
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
                ->orWhere('agenda', 'like', "%{$search}%")
                ->orWhere('agenda_type', 'like', "%{$search}%");
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

        $perPage = min((int) $request->input('per_page', 15), 500);
        $schedules = $query->paginate($perPage);

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

        // Auto-create (or refresh) an AttendanceSession so the scheduler
        // can send the QR email 10 minutes before the meeting starts.
        AttendanceSession::updateOrCreate(
            ['participant_meeting_id' => $meeting->id],
            [
                'token'         => Str::random(48),
                'is_active'     => false,
                'activated_at'  => null,
                'expires_at'    => null,
                'email_sent'    => false,
                'email_sent_at' => null,
            ]
        );

        // Defer notification until after response
        $meetingId = $meeting->id;
        defer(function () use ($meetingId) {
            try {
                $m = ParticipantMeeting::with('mentor')->find($meetingId);
                if ($m && $m->mentor) {
                    $m->mentor->notify(new ScheduleDecisionNotification($m, 'approved'));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send approval notification for meeting {$meetingId}: " . $e->getMessage());
            }
        });

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

        // Defer notification until after response
        $meetingId = $meeting->id;
        defer(function () use ($meetingId, $reason) {
            try {
                $m = ParticipantMeeting::with('mentor')->find($meetingId);
                if ($m && $m->mentor) {
                    $m->mentor->notify(new ScheduleDecisionNotification($m, 'rejected', $reason));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send rejection notification for meeting {$meetingId}: " . $e->getMessage());
            }
        });

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

            // Defer notification until after response
            $meetingId = $meeting->id;
            $modReason = $validated['reason'];
            defer(function () use ($meetingId, $modReason) {
                try {
                    $m = ParticipantMeeting::with('mentor')->find($meetingId);
                    if ($m && $m->mentor) {
                        $m->mentor->notify(new ScheduleDecisionNotification($m, 'modification_requested', $modReason));
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to send modification request notification for meeting {$meetingId}: " . $e->getMessage());
                }
            });

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
     * Fetch meetings where mentor has requested deletion.
     */
    public function getDeletionRequests(Request $request): JsonResponse
    {
        $query = ParticipantMeeting::with(['mentor:id,first_name,last_name,email', 'participants'])
            ->where('status', 'deletion_requested');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('mentor', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
                })->orWhere('agenda', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->input('per_page', 500), 500);
        return response()->json($query->orderBy('updated_at', 'desc')->paginate($perPage));
    }

    /**
     * Approve a mentor's deletion request — permanently deletes the meeting.
     */
    public function approveDeletion(ParticipantMeeting $meeting): JsonResponse
    {
        if ($meeting->status !== 'deletion_requested') {
            return response()->json(['message' => 'No pending deletion request for this meeting.'], 422);
        }

        try {
            DB::beginTransaction();

            $meetingId       = $meeting->id;
            $meeting->load(['mentor', 'participants']);
            $mentorRef       = $meeting->mentor;
            $participantRefs = $meeting->participants->all();
            $meetingSnapshot = $meeting;

            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => 'APPROVE_DELETION',
                'target_id'   => $meetingId,
                'target_type' => ParticipantMeeting::class,
                'details'     => ['status' => 'deleted'],
                'ip_address'  => request()->ip(),
                'user_agent'  => request()->userAgent(),
            ]);

            $meeting->delete();
            DB::commit();

            defer(function () use ($mentorRef, $meetingSnapshot, $participantRefs) {
                try {
                    if ($mentorRef) {
                        $mentorRef->notify(new ScheduleDecisionNotification($meetingSnapshot, 'deletion_approved'));
                    }
                    foreach ($participantRefs as $participant) {
                        $participant->notify(new \App\Notifications\MeetingScheduled($meetingSnapshot, 'cancel'));
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to send deletion approval notifications: ' . $e->getMessage());
                }
            });

            return response()->json(['message' => 'Meeting deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to approve deletion for meeting {$meeting->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to approve deletion.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Reject a mentor's deletion request — restores the meeting to scheduled.
     */
    public function rejectDeletion(Request $request, ParticipantMeeting $meeting): JsonResponse
    {
        if ($meeting->status !== 'deletion_requested') {
            return response()->json(['message' => 'No pending deletion request for this meeting.'], 422);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $meeting->update([
                'status'           => 'scheduled',
                'rejection_reason' => $validated['reason'],
            ]);

            AuditLog::create([
                'user_id'     => Auth::id(),
                'action'      => 'REJECT_DELETION',
                'target_id'   => $meeting->id,
                'target_type' => ParticipantMeeting::class,
                'details'     => ['status' => 'scheduled', 'reason' => $validated['reason']],
                'ip_address'  => request()->ip(),
                'user_agent'  => request()->userAgent(),
            ]);

            DB::commit();

            $meetingId = $meeting->id;
            $reason    = $validated['reason'];
            defer(function () use ($meetingId, $reason) {
                try {
                    $m = ParticipantMeeting::with('mentor')->find($meetingId);
                    if ($m && $m->mentor) {
                        $m->mentor->notify(new ScheduleDecisionNotification($m, 'deletion_rejected', $reason));
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to send deletion rejection notification for meeting {$meetingId}: " . $e->getMessage());
                }
            });

            return response()->json(['message' => 'Deletion request rejected. Meeting has been restored.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to reject deletion for meeting {$meeting->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to reject deletion request.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Fetch unread schedule approval notifications for the authenticated admin.
     */
    public function getScheduleApprovalNotifications(): JsonResponse
    {
        $notifications = Auth::user()
            ->unreadNotifications()
            ->where('type', 'App\\Notifications\\ScheduleApprovalRequest')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn($n) => [
                'id'         => $n->id,
                'data'       => $n->data,
                'created_at' => $n->created_at,
            ]);

        return response()->json($notifications);
    }

    /**
     * Mark a single notification as read.
     */
    public function markNotificationRead(string $notificationId): JsonResponse
    {
        $notification = Auth::user()
            ->notifications()
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notification marked as read.']);
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
