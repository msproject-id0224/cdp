<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MentorAvailability extends Model
{
    protected $fillable = [
        'mentor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_recurring',
        'specific_date',
    ];

    protected $casts = [
        'is_recurring' => 'boolean',
        'specific_date' => 'date',
    ];

    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
