<?php

namespace App\Services;

use App\Events\MessageSent;
use App\Exceptions\EmptyChatMessageException;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Diekstrak dari ChatMessageController -- dipakai ulang PERSIS SAMA oleh
 * controller web (routes/web.php `/api/chat/*`, masih `web` middleware,
 * tidak diubah) dan Api\V1\ChatController (`/api/v1/chat/*`, stateless).
 *
 * Catatan arsitektur (lihat docblock asli ChatMessageController): fitur
 * chat ini SUDAH jalan lewat polling HTTP setiap 2 detik, bukan WebSocket
 * -- broadcasting (Reverb) TIDAK terpasang di project ini (tidak ada
 * package `laravel/reverb`, tidak ada config/broadcasting.php,
 * BROADCAST_CONNECTION=log secara default). `event(new MessageSent(...))`
 * tetap dipanggil (best-effort, tidak error kalau tidak ada listener),
 * tapi JANGAN anggap itu sebagai jalur pengiriman utama.
 */
class ChatService
{
    /**
     * Riwayat 1:1 antara $currentUser dan $other, opsional hanya pesan
     * setelah $afterId (dipakai untuk polling incremental).
     */
    public static function historyBetween(User $currentUser, User $other, ?int $afterId = null): Builder
    {
        $query = ChatMessage::where(function ($q) use ($currentUser, $other) {
            $q->where('sender_id', $currentUser->id)->where('receiver_id', $other->id);
        })->orWhere(function ($q) use ($currentUser, $other) {
            $q->where('sender_id', $other->id)->where('receiver_id', $currentUser->id);
        });

        if ($afterId !== null) {
            $query->where('id', '>', $afterId);
        }

        return $query->with(['sender', 'receiver'])->orderBy('created_at', 'asc');
    }

    /**
     * Riwayat chat global (receiver_id null). Kalau $afterId tidak
     * diberikan, dibatasi 100 pesan terakhir (muat awal).
     */
    public static function globalHistory(?int $afterId = null): Builder
    {
        $query = ChatMessage::whereNull('receiver_id')
            ->with(['sender:id,first_name,last_name,role,profile_photo_path'])
            ->orderBy('created_at', 'asc');

        if ($afterId !== null) {
            $query->where('id', '>', $afterId);
        } else {
            $query->take(100);
        }

        return $query;
    }

    /**
     * @throws EmptyChatMessageException
     */
    public static function send(User $sender, ?int $receiverId, ?string $rawMessage, ?UploadedFile $file): ChatMessage
    {
        return DB::transaction(function () use ($sender, $receiverId, $rawMessage, $file) {
            $attachmentPath = null;
            $attachmentType = null;

            if ($file) {
                $attachmentPath = $file->store('chat_attachments', 'public');
                $attachmentType = $file->getMimeType();
            }

            $messageContent = trim(strip_tags($rawMessage ?? ''));
            if ($messageContent === '' && !$attachmentPath) {
                throw new EmptyChatMessageException('Message cannot be empty');
            }

            $chatMessage = ChatMessage::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiverId,
                'message' => $messageContent,
                'attachment_path' => $attachmentPath,
                'attachment_type' => $attachmentType,
                'status' => 'sent',
                'is_read' => false,
            ]);

            // Best-effort -- lihat catatan class-level soal status broadcasting.
            event(new MessageSent($chatMessage));

            return $chatMessage;
        });
    }

    public static function markRead(User $currentUser, User $sender): void
    {
        ChatMessage::where('sender_id', $sender->id)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
                'status' => 'delivered',
            ]);
    }

    public static function unreadCount(User $currentUser): array
    {
        $rows = ChatMessage::where('receiver_id', $currentUser->id)
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

        return ['count' => $total, 'by_sender' => $bySender];
    }

    public static function assertCanFlag(User $currentUser, ChatMessage $message): bool
    {
        return $message->sender_id === $currentUser->id || $message->receiver_id === $currentUser->id;
    }

    /**
     * Cari user untuk diajak chat -- TIDAK ada pembatasan berdasarkan role
     * (mis. partisipan bisa cari admin/mentor/partisipan lain). Ini
     * perilaku yang SUDAH ADA di CommunicationController::searchUsers()
     * (RBAC lebih ketat sempat ditulis tapi sengaja dikomentari di kode
     * asli) -- direplikasi apa adanya sesuai keputusan eksplisit, BUKAN
     * diperketat sepihak di sini.
     */
    public static function searchContacts(User $currentUser, ?string $query): array
    {
        $users = User::where('id', '!=', $currentUser->id)
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                    ->orWhere('last_name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            });

        return $users->limit(10)->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->first_name_display,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $user->avatar_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->first_name_display),
                'is_online' => $user->last_seen_at && $user->last_seen_at->diffInMinutes(now()) < 5,
                'last_seen' => $user->last_seen_at ? $user->last_seen_at->diffForHumans() : 'Offline',
            ];
        })->all();
    }
}
