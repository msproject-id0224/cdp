<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ChatMessageResource extends JsonResource
{
    // Sengaja TIDAK di-set $wrap = null di sini -- ::collection() dari
    // resource ini dipakai untuk daftar pesan (bisa banyak), jadi respons
    // terbungkus {"data": [...]} lebih konsisten dengan endpoint daftar
    // lain (letters/gifts, yang memang terpaginasi). Beda dari
    // UserResource/ParticipantNoteResource yang sengaja unwrapped untuk
    // kasus single-resource / daftar pendek.

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_id' => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'message' => $this->message,
            'attachment_url' => $this->attachment_path ? Storage::disk('public')->url($this->attachment_path) : null,
            'attachment_type' => $this->attachment_type,
            'status' => $this->status,
            'is_read' => $this->is_read,
            'is_flagged' => $this->is_flagged,
            'read_at' => $this->read_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'sender' => $this->whenLoaded('sender', fn () => [
                'id' => $this->sender->id,
                'name' => $this->sender->name,
                'role' => $this->sender->role,
                'profile_photo_url' => $this->sender->profile_photo_url,
            ]),
            'receiver' => $this->whenLoaded('receiver', fn () => [
                'id' => $this->receiver->id,
                'name' => $this->receiver->name,
                'role' => $this->receiver->role,
            ]),
        ];
    }
}
