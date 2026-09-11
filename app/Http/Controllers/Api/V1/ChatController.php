<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\MessageTyping;
use App\Exceptions\EmptyChatMessageException;
use App\Http\Controllers\Controller;
use App\Http\Resources\ChatMessageResource;
use App\Models\ChatMessage;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\Request;

/**
 * Versi stateless dari ChatMessageController -- query/persist logic SAMA
 * PERSIS lewat ChatService (aturan #2). Klien (Flutter) polling
 * GET /chat/{user} atau GET /chat/global setiap ~2 detik, sama seperti web
 * -- lihat catatan class-level ChatService soal status broadcasting/Reverb.
 */
class ChatController extends Controller
{
    public function global(Request $request)
    {
        $messages = ChatService::globalHistory($request->integer('after_id') ?: null)->get();

        return ChatMessageResource::collection($messages);
    }

    public function history(Request $request, User $user)
    {
        $messages = ChatService::historyBetween($request->user(), $user, $request->integer('after_id') ?: null)->get();

        return ChatMessageResource::collection($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'message' => 'nullable|string|max:5000',
            'file' => 'nullable|file|max:10240',
        ]);

        try {
            $chatMessage = ChatService::send($request->user(), $request->receiver_id, $request->message, $request->file('file'));

            return new ChatMessageResource($chatMessage);
        } catch (EmptyChatMessageException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function typing(Request $request)
    {
        $request->validate(['receiver_id' => 'required|exists:users,id']);
        broadcast(new MessageTyping($request->user()->id, $request->receiver_id))->toOthers();

        return response()->json(['status' => 'success']);
    }

    public function markRead(Request $request, User $user)
    {
        ChatService::markRead($request->user(), $user);

        return response()->json(['status' => 'success']);
    }

    public function unreadCount(Request $request)
    {
        return response()->json(ChatService::unreadCount($request->user()));
    }

    public function search(Request $request)
    {
        return response()->json(ChatService::searchContacts($request->user(), $request->query('query')));
    }

    public function flag(Request $request, ChatMessage $message)
    {
        if (!ChatService::assertCanFlag($request->user(), $message)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message->update(['is_flagged' => true]);

        return new ChatMessageResource($message);
    }
}
