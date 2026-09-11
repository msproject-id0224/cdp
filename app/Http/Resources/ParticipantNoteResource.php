<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantNoteResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'note' => $this->note,
            'mentor_name' => $this->mentor?->name,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
