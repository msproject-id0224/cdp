<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantTask extends Model
{
    protected $fillable = [
        'participant_id',
        'mentor_id',
        'title',
        'description',
        'status',
        'due_date',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
