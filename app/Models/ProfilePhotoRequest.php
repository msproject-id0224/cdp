<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfilePhotoRequest extends Model
{
    protected $fillable = [
        'user_id',
        'photo_path',
        'status',
        'reviewer_id',
        'rejection_reason',
        'reviewed_at',
    ];

    protected $appends = ['photo_url'];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function getPhotoUrlAttribute()
    {
        return $this->photo_path ? '/storage/' . str_replace('\\', '/', $this->photo_path) : null;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
