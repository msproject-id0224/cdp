<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceSession extends Model
{
    protected $fillable = [
        'participant_meeting_id',
        'token',
        'checkout_token',
        'is_active',
        'activated_at',
        'expires_at',
        'email_sent',
        'email_sent_at',
    ];

    protected $casts = [
        'is_active'    => 'boolean',
        'email_sent'   => 'boolean',
        'activated_at' => 'datetime',
        'expires_at'   => 'datetime',
        'email_sent_at'=> 'datetime',
    ];

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(ParticipantMeeting::class, 'participant_meeting_id');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'qr_token_used', 'token');
    }

    /** Whether this session is currently valid for scanning */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }
        if ($this->expires_at && now()->isAfter($this->expires_at)) {
            return false;
        }
        return true;
    }
}
