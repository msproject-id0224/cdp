<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RmdMeetingFile extends Model
{
    protected $fillable = [
        'user_id',
        'meeting_type',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
