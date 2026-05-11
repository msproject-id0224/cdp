<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParticipantGift extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'gift_code',
        'gift_description',
        'gift_value',
        'letter_code',
        'type',
        'model',
        'status',
        'proof_photo_path',
        'usage_plan',
        'reception_date',
        'admin_notes',
    ];

    protected $casts = [
        'reception_date' => 'date',
        'proof_photo_path' => 'array', // Cast JSON to array automatically
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
