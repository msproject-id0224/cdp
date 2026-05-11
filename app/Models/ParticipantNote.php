<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantNote extends Model
{
    protected $fillable = [
        'participant_id',
        'mentor_id',
        'note',
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
