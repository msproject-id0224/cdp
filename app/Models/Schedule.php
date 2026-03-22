<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'name',
        'description',
        'date',
        'start_time',
        'end_time',
        'location',
        'priority',
        'status',
        'pic',
        'notify_target',
    ];
}
