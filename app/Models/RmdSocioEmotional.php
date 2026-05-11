<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RmdSocioEmotional extends Model
{
    protected $fillable = [
        'user_id',
        'learning_style_practice',
        'learning_style_impact',
        'birth_order_siblings',
        'parents_occupation',
        'home_responsibilities',
        'family_uniqueness',
        'extracurricular_activities',
        'ppa_activities',
        'hobbies',
        'strengths',
        'weaknesses',
        'reflection_learned',
        'reflection_improvement',
        'height',
        'weight',
        'physical_traits',
        'favorite_sports',
        'sports_achievements',
        'eating_habits',
        'sleeping_habits',
        'health_issues',
        'physical_likes',
        'physical_development_goal',
        'spiritual_knowledge_jesus',
        'spiritual_relationship_growth',
        'spiritual_love_obedience',
        'spiritual_community',
        'spiritual_bible_study',
        'spiritual_mentor',
        'spiritual_reflection_learned',
        'spiritual_reflection_improvement',
        'chapter3_check1',
        'chapter3_check2',
        'chapter3_check3',
        'chapter3_check4',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
