<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantGiftResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gift_code' => $this->gift_code,
            'gift_description' => $this->gift_description,
            'gift_value' => $this->gift_value,
            'type' => $this->type,
            'status' => $this->status,
            'proof_photo_path' => $this->proof_photo_path,
            'usage_plan' => $this->usage_plan,
            'reception_date' => $this->reception_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
