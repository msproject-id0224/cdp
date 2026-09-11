<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LetterResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        $viewer = $request->user();

        return [
            'id' => $this->id,
            'letter_number' => $this->letter_number,
            'subject' => $this->subject,
            'content' => $this->content,
            'file_path' => $this->file_path,
            'status' => $this->status,
            // Dari sudut pandang partisipan yang login: surat ini dia kirim
            // atau dia terima -- dipakai Flutter buat label "Terkirim"/"Diterima".
            'direction' => $viewer && $this->sender_id === $viewer->id ? 'sent' : 'received',
            'sender_name' => $this->sender?->name,
            'recipient_name' => $this->recipient?->name,
            'sent_at' => $this->sent_at?->toIso8601String(),
            'read_at' => $this->read_at?->toIso8601String(),
        ];
    }
}
