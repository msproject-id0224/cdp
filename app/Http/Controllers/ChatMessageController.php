<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\MessageTyping;
use App\Exceptions\EmptyChatMessageException;
use App\Models\ChatMessage;
use App\Models\User;
use App\Services\ChatService;
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
 *
 * Query & persist logic diekstrak ke App\Services\ChatService (Fase 3
 * mobile) -- dipakai bersama Api\V1\ChatController, jangan disalin ulang.
 */
class ChatMessageController extends Controller
{
    public function index(User $user, Request $request)
    {
        $query = ChatService::historyBetween(Auth::user(), $user, $request->integer('after_id') ?: null);

        return response()->json($query->get());
    }

    public function indexGlobal(Request $request)
    {
        $query = ChatService::globalHistory($request->integer('after_id') ?: null);

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'message' => 'nullable|string|max:5000',
            'file' => 'nullable|file|max:10240', // Max 10MB
        ]);

        try {
            $chatMessage = ChatService::send(Auth::user(), $request->receiver_id, $request->message, $request->file('file'));

            return response()->json($chatMessage, 201);
        } catch (EmptyChatMessageException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send message', 'details' => $e->getMessage()], 500);
        }
    }

    public function typing(Request $request)
    {
        $request->validate(['receiver_id' => 'required|exists:users,id']);
        broadcast(new MessageTyping(Auth::id(), $request->receiver_id))->toOthers();
        return response()->json(['status' => 'success']);
    }

    public function flagMessage(ChatMessage $message)
    {
        if (!ChatService::assertCanFlag(Auth::user(), $message)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->update(['is_flagged' => true]);
        return response()->json($message);
    }

    public function markAsRead(User $user)
    {
        ChatService::markRead(Auth::user(), $user);

        return response()->json(['status' => 'success']);
    }

    public function getUnreadCount(): \Illuminate\Http\JsonResponse
    {
        return response()->json(ChatService::unreadCount(Auth::user()));
    }

    public function logError(Request $request): \Illuminate\Http\JsonResponse
    {
        \Illuminate\Support\Facades\Log::error('Frontend Error:', [
            'user_id' => Auth::id(),
            'type' => $request->type,
            'context' => $request->context,
            'message' => $request->message,
            'stack' => $request->stack,
        ]);
        return response()->json(['status' => 'success']);
    }
}
