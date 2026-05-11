<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RmdTrueSuccess extends Model
{
    protected $fillable = [
        'user_id',
        'successful_life_definition',
        'general_success_measure',
        'luke_2_52_growth',
        'philippians_2_5_10_actions',
        'jesus_success_vs_society',
        'god_opinion_on_jesus',
        'new_learning_text',
        'new_learning_image_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
