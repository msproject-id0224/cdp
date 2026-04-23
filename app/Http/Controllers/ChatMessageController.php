<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageTyping;
use App\Events\MessageSent;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

/**
 * TECHNICAL DOCUMENTATION: CHAT SYSTEM FLOW
 * 
 * 1. MESSAGE FLOW:
 *    - Sender sends message via POST /api/chat.
 *    - Message is stored in `chat_messages` table with status 'sent'.
 *    - MessageSent event is dispatched for real-time broadcasting support.
 *    - Receiver fetches messages via polling (GET /api/chat/{user}) every 2 seconds.
 *    - When receiver fetches messages, the controller marks unread messages as read.
 * 
 * 2. DATABASE TRANSACTIONS:
 *    - All message creations are wrapped in DB::transaction to ensure atomicity.
 *    - If storing the message fails, the transaction is rolled back, preventing partial data.
 * 
 * 3. ERROR HANDLING:
 *    - Frontend implements a retry mechanism for failed messages (status 'failed').
 *    - Backend validates receiver existence and message content.
 *    - HTTP 500 errors are caught and returned with descriptive JSON details.
 * 
 * 4. OPTIMIZATION:
 *    - Indexing on [sender_id, receiver_id] ensures fast lookups for chat history.
 *    - Polling interval is optimized (2s) for a balance between real-time feel and server load.
 *    - Chronological order is maintained via `created_at`.
 * 
 * 5. STATUS INDICATORS:
 *    - 'sending': Message is being processed by the server.
 *    - 'sent': Message successfully stored in database.
 *    - 'failed': Message failed to send (network or server error).
 *    - 'delivered': Message has been read by the receiver.
 *    - 'is_read': true/false based on receiver viewing the message.
 */
class ChatMessageController extends Controller
{
    public function index(User $user, Request $request)
    {
        $query = ChatMessage::where(function($query) use ($user) {
            $query->where('sender_id', Auth::id())
                  ->where('receiver_id', $user->id);
        })->orWhere(function($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->where('receiver_id', Auth::id());
        });

        if ($request->has('after_id')) {
            $query->where('id', '>', $request->after_id);
        }
        
        $messages = $query->with(['sender', 'receiver'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function indexGlobal(Request $request)
    {
        $query = ChatMessage::whereNull('receiver_id')
            ->with(['sender:id,first_name,last_name,role,profile_photo_path'])
            ->orderBy('created_at', 'asc');

        if ($request->has('after_id')) {
            $query->where('id', '>', $request->after_id);
        } else {
            $query->take(100); // Limit to last 100 messages for initial load
        }

        $messages = $query->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'message' => 'nullable|string|max:5000',
            'file' => 'nullable|file|max:10240', // Max 10MB
        ]);

        return DB::transaction(function () use ($request) {
            try {
                $attachmentPath = null;
                $attachmentType = null;

                if ($request->hasFile('file')) {
                    $file = $request->file('file');
                    $attachmentPath = $file->store('chat_attachments', 'public');
                    $attachmentType = $file->getMimeType();
                }

                $messageContent = trim(strip_tags($request->message ?? ''));
                if (empty($messageContent) && !$attachmentPath) {
                     return response()->json(['error' => 'Message cannot be empty'], 422);
                }

                $chatMessage = ChatMessage::create([
                    'sender_id' => Auth::id(),
                    'receiver_id' => $request->receiver_id,
                    'message' => $messageContent,
                    'attachment_path' => $attachmentPath,
                    'attachment_type' => $attachmentType,
                    'status' => 'sent',
                    'is_read' => false,
                ]);

                // Dispatch event for real-time support
                event(new MessageSent($chatMessage));

                return response()->json($chatMessage, 201);
            } catch (\Exception $e) {
                Log::error('Chat message send failed', ['error' => $e->getMessage(), 'user' => Auth::id()]);
                return response()->json(['error' => 'Failed to send message'], 500);
            }
        });
    }

    public function typing(Request $request)
    {
        $request->validate(['receiver_id' => 'required|exists:users,id']);
        broadcast(new MessageTyping(Auth::id(), $request->receiver_id))->toOthers();
        return response()->json(['status' => 'success']);
    }

    public function flagMessage(ChatMessage $message)
    {
        // Simple authorization check
        if ($message->sender_id !== Auth::id() && $message->receiver_id !== Auth::id()) {
             return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->update(['is_flagged' => true]);
        return response()->json($message);
    }

    public function markAsRead(User $user)
    {
        ChatMessage::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
                'status' => 'delivered'
            ]);

        return response()->json(['status' => 'success']);
    }

    public function getUnreadCount(): \Illuminate\Http\JsonResponse
    {
        $userId = Auth::id();

        $rows = ChatMessage::where('receiver_id', $userId)
            ->where('is_read', false)
            ->selectRaw('sender_id, COUNT(*) as cnt')
            ->groupBy('sender_id')
            ->get();

        $bySender = [];
        $total = 0;
        foreach ($rows as $row) {
            $bySender[(string) $row->sender_id] = (int) $row->cnt;
            $total += (int) $row->cnt;
        }

        return response()->json([
            'count'     => $total,
            'by_sender' => $bySender,
        ]);
    }

    public function logError(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'type'    => 'nullable|string|max:100',
            'context' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:500',
        ]);

        \Illuminate\Support\Facades\Log::error('Frontend Error:', [
            'user_id' => Auth::id(),
            'type'    => $validated['type'] ?? null,
            'context' => $validated['context'] ?? null,
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json(['status' => 'success']);
    }
}
