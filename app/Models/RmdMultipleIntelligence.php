<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RmdMultipleIntelligence extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'linguistic_checklist',
        'logical_mathematical_checklist',
        'visual_spatial_checklist',
        'kinesthetic_checklist',
        'musical_checklist',
        'interpersonal_checklist',
        'intrapersonal_checklist',
        'naturalist_checklist',
        'existential_checklist',
        'reflection_suitability',
        'reflection_development',
        'reflection_new_learning',
        'reflection_plan',
    ];

    protected $casts = [
        'linguistic_checklist' => 'array',
        'logical_mathematical_checklist' => 'array',
        'visual_spatial_checklist' => 'array',
        'kinesthetic_checklist' => 'array',
        'musical_checklist' => 'array',
        'interpersonal_checklist' => 'array',
        'intrapersonal_checklist' => 'array',
        'naturalist_checklist' => 'array',
        'existential_checklist' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
