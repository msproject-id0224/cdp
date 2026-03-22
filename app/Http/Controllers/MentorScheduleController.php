<?php

namespace App\Http\Controllers;

use App\Models\MentorAvailability;
use App\Models\ParticipantMeeting;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MentorScheduleController extends Controller
{
    /**
     * Display the schedule management page.
     */
    public function index()
    {
        $adminSchedules = Schedule::whereIn('notify_target', ['all_user', 'mentor_only'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        return Inertia::render('Mentor/Schedule', [
            'adminSchedules' => $adminSchedules,
        ]);
    }

    /**
     * Fetch schedules for API/Dashboard.
     */
    public function getSchedules(Request $request): JsonResponse
    {
        $user = Auth::user();
        $start = $request->input('start');
        $end = $request->input('end');

        // Fetch availabilities
        $availabilities = MentorAvailability::where('mentor_id', $user->id)->get();

        // Fetch meetings where user is mentor or participant
        $meetingsQuery = ParticipantMeeting::query()
            ->with(['mentor', 'participants'])
            ->where(function ($query) use ($user) {
                $query->where('mentor_id', $user->id)
                      ->orWhereHas('participants', function ($q) use ($user) {
                          $q->where('users.id', $user->id);
                      })
                      ->orWhere('participant_id', $user->id); // Legacy support
            });
            
        if ($start && $end) {
            // Check for any overlap with the requested range
            // An event overlaps if (EventStart < RangeEnd) AND (EventEnd > RangeStart)
            $meetingsQuery->where(function($q) use ($start, $end) {
                 $q->where('scheduled_at', '<', $end)
                   ->where('end_time', '>', $start);
            });
        }
        
        $meetings = $meetingsQuery->get();

        $participants = $user->assignedParticipants()
            ->select(
                'id', 
                'first_name', 
                'last_name', 
                'nickname', 
                'email', 
                'gender', 
                'date_of_birth', 
                'age', 
                'age_group', 
                'profile_photo_path'
            )
            ->get()
            ->append('profile_photo_url');

        return response()->json([
            'availabilities' => $availabilities,
            'meetings' => $meetings,
            'participants' => $participants
        ]);
    }

    /**
     * Store a newly created availability.
     */
    public function storeAvailability(Request $request): JsonResponse
    {
        if (Auth::user()->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized. Only mentors can manage availability.'], 403);
        }

        $validated = $request->validate([
            'day_of_week' => 'nullable|integer|between:0,6',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'is_recurring' => 'boolean',
            'specific_date' => 'nullable|date|required_if:is_recurring,false',
        ]);

        try {
            $availability = MentorAvailability::create(array_merge(
                ['mentor_id' => Auth::id()],
                $validated
            ));

            return response()->json($availability);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error saving mentor availability: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'An error occurred while saving availability. Please try again.'], 500);
        }
    }

    /**
     * Delete an availability.
     */
    public function deleteAvailability(MentorAvailability $availability): JsonResponse
    {
        try {
            if ($availability->mentor_id !== Auth::id()) {
                abort(403);
            }
            $availability->delete();
            return response()->json(['message' => 'Deleted']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error deleting mentor availability: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete availability.'], 500);
        }
    }

    /**
     * Store a newly created meeting.
     */
    public function storeMeeting(Request $request): JsonResponse
    {
        if (Auth::user()->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized. Only mentors can schedule meetings.'], 403);
        }

        $validated = $request->validate([
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
            'scheduled_at' => 'required|date',
            'end_time' => 'required|date|after:scheduled_at',
            'location' => 'nullable|string',
            'meeting_link' => 'nullable|string',
            'agenda_type' => 'nullable|string|in:pengisian_rmd,pertemuan_umum,rapat_youth,lainnya',
            'agenda' => 'nullable|string',
            'tools_materials' => 'nullable|string',
            'notes' => 'nullable|string',
            'max_participants' => 'nullable|integer|min:1',
        ]);

        try {
            // Parse dates to ensure consistent comparison format (Y-m-d H:i:s)
            $start = \Carbon\Carbon::parse($validated['scheduled_at']);
            $end = \Carbon\Carbon::parse($validated['end_time']);
            $maxParticipants = $validated['max_participants'] ?? count($validated['participant_ids']);
            if ($maxParticipants < count($validated['participant_ids'])) {
                $maxParticipants = count($validated['participant_ids']);
            }

            // Robust double-booking check
            // Overlap exists if (StartA < EndB) and (EndA > StartB)
            $hasConflict = ParticipantMeeting::where('mentor_id', Auth::id())
                ->where('status', '!=', 'cancelled')
                ->where(function ($query) use ($start, $end) {
                    $query->where('scheduled_at', '<', $end)
                          ->where('end_time', '>', $start);
                })
                ->exists();

            if ($hasConflict) {
                return response()->json(['message' => 'This time slot overlaps with another meeting.'], 422);
            }

            $meeting = ParticipantMeeting::create([
                'mentor_id' => Auth::id(),
                'status' => 'pending',
                'scheduled_at' => $validated['scheduled_at'],
                'end_time' => $validated['end_time'],
                'location' => $validated['location'] ?? null,
                'meeting_link' => $validated['meeting_link'] ?? null,
                'agenda_type' => $validated['agenda_type'] ?? null,
                'agenda' => $validated['agenda'] ?? null,
                'tools_materials' => $validated['tools_materials'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'max_participants' => $maxParticipants,
                'participant_id' => $validated['participant_ids'][0], // Legacy support
            ]);

            $meeting->participants()->attach($validated['participant_ids']);

            // Build response BEFORE defer so we return immediately
            $meetingData = $meeting->load('participants');

            // Defer all notification sending until AFTER the HTTP response is flushed
            $mentor = Auth::user();
            $meetingId = $meeting->id;
            defer(function () use ($meetingId, $mentor) {
                try {
                    $m = ParticipantMeeting::with('participants')->find($meetingId);
                    if (!$m) return;
                    $mentor->notify(new \App\Notifications\MeetingScheduled($m, 'new'));
                    foreach ($m->participants as $participant) {
                        $participant->notify(new \App\Notifications\MeetingScheduled($m, 'new'));
                    }
                    $admins = \App\Models\User::where('role', 'admin')->get();
                    \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\ScheduleApprovalRequest($m));
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to send meeting notifications: ' . $e->getMessage());
                }
            });

            return response()->json([
                'meeting' => $meetingData,
                'message' => 'Schedule created and sent to admin for approval.'
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error saving mentor meeting: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'An error occurred while saving the meeting. Please try again.'], 500);
        }
    }
    
    /**
     * Update the specified meeting.
     */
    public function updateMeeting(Request $request, ParticipantMeeting $meeting): JsonResponse
    {
        // Check authorization
        if ($meeting->mentor_id !== Auth::id() && $meeting->participant_id !== Auth::id()) {
            // Also check if user is in participants list
            if (!$meeting->participants()->where('users.id', Auth::id())->exists()) {
                abort(403);
            }
        }

        $validated = $request->validate([
            'status' => 'sometimes|string',
            'scheduled_at' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:scheduled_at',
            'location' => 'nullable|string',
            'meeting_link' => 'nullable|string',
            'agenda_type' => 'nullable|string|in:pengisian_rmd,pertemuan_umum,rapat_youth,lainnya',
            'agenda' => 'nullable|string',
            'tools_materials' => 'nullable|string',
            'notes' => 'nullable|string',
            'participant_ids' => 'sometimes|array',
            'participant_ids.*' => 'exists:users,id',
            'max_participants' => 'nullable|integer|min:1',
        ]);

        try {
            // If time is being updated, check for conflicts (excluding self)
            if ((isset($validated['scheduled_at']) || isset($validated['end_time'])) && Auth::user()->role === 'mentor') {
                $newStart = isset($validated['scheduled_at']) ? \Carbon\Carbon::parse($validated['scheduled_at']) : \Carbon\Carbon::parse($meeting->scheduled_at);
                $newEnd = isset($validated['end_time']) ? \Carbon\Carbon::parse($validated['end_time']) : \Carbon\Carbon::parse($meeting->end_time);
                
                $hasConflict = ParticipantMeeting::where('mentor_id', Auth::id())
                    ->where('id', '!=', $meeting->id)
                    ->where('status', '!=', 'cancelled')
                    ->where(function ($query) use ($newStart, $newEnd) {
                        $query->where('scheduled_at', '<', $newEnd)
                              ->where('end_time', '>', $newStart);
                    })
                    ->exists();

                if ($hasConflict) {
                    return response()->json(['message' => 'This time slot overlaps with another meeting.'], 422);
                }
            }

            // Sync participants if provided
            if (isset($validated['participant_ids'])) {
                // Check capacity
                $maxParticipants = $validated['max_participants'] ?? $meeting->max_participants;
                if ($maxParticipants < count($validated['participant_ids'])) {
                     $maxParticipants = count($validated['participant_ids']);
                }
                $meeting->max_participants = $maxParticipants;
                
                $meeting->participants()->sync($validated['participant_ids']);
                
                // Update legacy participant_id
                if (count($validated['participant_ids']) > 0) {
                    $meeting->participant_id = $validated['participant_ids'][0];
                } else {
                    $meeting->participant_id = null;
                }
            }
            
            // Only update fields that exist in table
            $meeting->fill(collect($validated)->except(['participant_ids', 'max_participants'])->toArray());
            $meeting->save();

            // Load participants for the response, then return immediately
            $meeting->load('participants');

            // Defer all notification sending until AFTER the HTTP response is flushed
            $meetingId = $meeting->id;
            defer(function () use ($meetingId) {
                try {
                    $m = ParticipantMeeting::with(['mentor', 'participants'])->find($meetingId);
                    if (!$m || !$m->mentor) return;
                    $m->mentor->notify(new \App\Notifications\MeetingScheduled($m, 'update'));
                    foreach ($m->participants as $participant) {
                        $participant->notify(new \App\Notifications\MeetingScheduled($m, 'update'));
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Failed to send meeting notifications: ' . $e->getMessage());
                }
            });

            return response()->json(['meeting' => $meeting, 'message' => 'Meeting updated successfully.']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error updating meeting: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while updating the meeting.'], 500);
        }
    }

    /**
     * Request deletion of a meeting (requires admin approval).
     */
    public function destroyMeeting(ParticipantMeeting $meeting): JsonResponse
    {
        if ($meeting->mentor_id !== Auth::id()) {
            abort(403);
        }

        if ($meeting->status === 'deletion_requested') {
            return response()->json(['message' => 'Deletion request already pending admin approval.'], 422);
        }

        try {
            $meeting->update(['status' => 'deletion_requested']);

            // Notify all admins of the deletion request
            $meetingId = $meeting->id;
            defer(function () use ($meetingId) {
                try {
                    $m = ParticipantMeeting::with(['mentor', 'participants'])->find($meetingId);
                    if (!$m) return;
                    $admins = \App\Models\User::where('role', 'admin')->get();
                    foreach ($admins as $admin) {
                        $admin->notify(new \App\Notifications\ScheduleApprovalRequest($m));
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("Failed to notify admins of deletion request for meeting {$meetingId}: " . $e->getMessage());
                }
            });

            return response()->json([
                'message' => 'Deletion request submitted. Awaiting admin approval.',
                'meeting' => $meeting->fresh(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error requesting meeting deletion: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to submit deletion request.'], 500);
        }
    }

    /**
     * Export schedule to ICS format.
     */
    public function exportSchedule(Request $request)
    {
        $user = Auth::user();
        $meetings = ParticipantMeeting::where('mentor_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->with('participant')
            ->get();

        $icsContent = "BEGIN:VCALENDAR\r\n";
        $icsContent .= "VERSION:2.0\r\n";
        $icsContent .= "PRODID:-//Child Development Program//Mentor Schedule//EN\r\n";
        $icsContent .= "CALSCALE:GREGORIAN\r\n";
        $icsContent .= "METHOD:PUBLISH\r\n";

        foreach ($meetings as $meeting) {
            $start = gmdate('Ymd\THis\Z', strtotime($meeting->scheduled_at));
            $end = gmdate('Ymd\THis\Z', strtotime($meeting->end_time));
            $summary = "Meeting with " . ($meeting->participant ? $meeting->participant->name : 'Participant');
            $description = $meeting->agenda ?? 'No agenda';
            
            $icsContent .= "BEGIN:VEVENT\r\n";
            $icsContent .= "DTSTART:{$start}\r\n";
            $icsContent .= "DTEND:{$end}\r\n";
            $icsContent .= "SUMMARY:{$summary}\r\n";
            $icsContent .= "DESCRIPTION:{$description}\r\n";
            $icsContent .= "LOCATION:{$meeting->location}\r\n";
            $icsContent .= "STATUS:CONFIRMED\r\n";
            $icsContent .= "UID:meeting-{$meeting->id}@child-dev-program\r\n";
            $icsContent .= "END:VEVENT\r\n";
        }

        $icsContent .= "END:VCALENDAR";

        return response($icsContent)
            ->header('Content-Type', 'text/calendar; charset=utf-8')
            ->header('Content-Disposition', 'attachment; filename="mentor-schedule.ics"');
    }
}
