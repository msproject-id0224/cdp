<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'schedule_id',
        'message',
        'is_read',
        'is_archived',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_archived' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
