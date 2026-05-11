<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RmdCareerExplorationP2 extends Model
{
    protected $table = 'rmd_career_exploration_p2_s';

    protected $fillable = [
        'user_id',
        'final_career_choice',
        'final_career_reason',
        'swot_definition',
        'swot_analysis_data',
        'chapter4_check1',
        'chapter4_check2',
        'chapter4_check3',
        'mentoring_notes',
    ];

    protected $casts = [
        'swot_analysis_data' => 'array',
        'chapter4_check1' => 'boolean',
        'chapter4_check2' => 'boolean',
        'chapter4_check3' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
