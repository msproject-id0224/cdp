<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RmdCareerExploration extends Model
{
    protected $fillable = [
        'user_id',
        'visual_professions',
        'auditory_professions',
        'kinesthetic_professions_style',
        'interested_professions_from_style',
        'linguistic_ability',
        'linguistic_professions',
        'logical_math_ability',
        'logical_math_professions',
        'visual_spatial_ability',
        'visual_spatial_professions',
        'kinesthetic_ability',
        'kinesthetic_professions',
        'musical_ability',
        'musical_professions',
        'interpersonal_ability',
        'interpersonal_professions',
        'intrapersonal_ability',
        'intrapersonal_professions',
        'naturalist_ability',
        'naturalist_professions',
        'consider_learning_style',
        'consider_intelligence',
        'consider_academic_achievement',
        'consider_parental_support',
        'consider_gods_will',
        'additional_considerations',
        'career_decision_matrix',
    ];

    protected $casts = [
        'consider_learning_style' => 'boolean',
        'consider_intelligence' => 'boolean',
        'consider_academic_achievement' => 'boolean',
        'consider_parental_support' => 'boolean',
        'consider_gods_will' => 'boolean',
        'career_decision_matrix' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
