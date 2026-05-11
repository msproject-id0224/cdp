<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RmdProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'graduation_plan_date',
        'first_filled_at',
        'first_filled_age',
        'first_filled_education',
        'first_filled_education_institution',
    ];

    protected $casts = [
        'graduation_plan_date' => 'date',
        'first_filled_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
