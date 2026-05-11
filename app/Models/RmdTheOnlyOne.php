<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RmdTheOnlyOne extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'unique_traits',
        'current_education_level',
        'favorite_subject',
        'favorite_subject_reason',
        'least_favorite_subject',
        'least_favorite_subject_reason',
        'highest_score_subject',
        'highest_score_value',
        'lowest_score_subject',
        'lowest_score_value',
        'visual_checklist',
        'auditory_checklist',
        'kinesthetic_checklist',
        'learned_aspects',
        'aspects_to_improve',
    ];

    protected $casts = [
        'visual_checklist' => 'array',
        'auditory_checklist' => 'array',
        'kinesthetic_checklist' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
