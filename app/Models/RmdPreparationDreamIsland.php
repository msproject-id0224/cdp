<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RmdPreparationDreamIsland extends Model
{
    protected $fillable = [
        'user_id',
        'profession_questions',
        'swot_analysis',
        'improvement_plan',
    ];

    protected $casts = [
        'profession_questions' => 'array',
        'swot_analysis' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
