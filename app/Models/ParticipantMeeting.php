<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantMeeting extends Model
{
    protected $fillable = [
        'participant_id',
        'mentor_id',
        'scheduled_at',
        'end_time',
        'location',
        'meeting_link',
        'agenda',
        'agenda_type',
        'tools_materials',
        'notes',
        'status',
        'max_participants',
        'rejection_reason',
        'approved_at',
        'approved_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'end_time' => 'datetime',
        'max_participants' => 'integer',
        'approved_at' => 'datetime',
    ];

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'meeting_participants', 'participant_meeting_id', 'user_id')
                    ->withPivot('status')
                    ->withTimestamps();
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function attendanceSession()
    {
        return $this->hasOne(\App\Models\AttendanceSession::class, 'participant_meeting_id');
    }
}
