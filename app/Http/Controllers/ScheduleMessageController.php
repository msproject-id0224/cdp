<?php

namespace App\Http\Controllers;

use App\Models\ScheduleMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ScheduleMessageController extends Controller
{
    /**
     * Store a newly created message in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'message' => 'required|string|max:1000',
        ]);

        $message = ScheduleMessage::create([
            'user_id' => Auth::id(),
            'schedule_id' => $validated['schedule_id'],
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $message->load('user', 'schedule')
        ], 201);
    }

    /**
     * Get unread messages for admin.
     */
    public function getUnreadMessages(): JsonResponse
    {
        // Only admins should access this, protected by middleware in routes
        $messages = ScheduleMessage::with(['user', 'schedule'])
            ->where('is_read', false)
            ->where('is_archived', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }
    
    /**
     * Mark message as read.
     */
    public function markAsRead(ScheduleMessage $message): JsonResponse
    {
        $message->update(['is_read' => true]);
        return response()->json(['message' => 'Message marked as read.']);
    }

    /**
     * Archive message.
     */
    public function archive(ScheduleMessage $message): JsonResponse
    {
        $message->update(['is_archived' => true]);
        return response()->json(['message' => 'Message archived.']);
    }

    /**
     * Get messages for a specific schedule (History).
     */
    public function getMessagesBySchedule(Request $request, $scheduleId): JsonResponse
    {
        // Check permissions if necessary
        
        $messages = ScheduleMessage::with(['user'])
            ->where('schedule_id', $scheduleId)
            ->where('is_archived', false) // By default show non-archived? Or all? User said "history", so maybe all.
            // But usually history implies seeing everything. 
            // However, "Archive" usually means "hide from main view".
            // Let's return all, but maybe filterable.
            // For now, let's return all for history, or maybe active ones.
            // Actually, "Communication History" usually means the chat log.
            // "Archive" might mean "I'm done with this conversation".
            // Let's just return all for now, sorted by date.
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
}
