<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthScreeningFinding extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_screening_id',
        'category',
        'item_key',
        'status',
        'description',
    ];

    public function healthScreening(): BelongsTo
    {
        return $this->belongsTo(HealthScreening::class);
    }
}
