<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'participant_meeting_id',
        'user_id',
        'check_in_at',
        'check_out_at',
        'status',
        'documentation_path',
        'notes',
        'scan_order',
        'qr_token_used',
        'device_type',
    ];

    protected $casts = [
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
    ];

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(ParticipantMeeting::class, 'participant_meeting_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
