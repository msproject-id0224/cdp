<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralMeetingDate extends Model
{
    protected $fillable = ['date', 'created_by'];

    protected $casts = ['date' => 'date:Y-m-d'];
}
