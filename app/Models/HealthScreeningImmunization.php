<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HealthScreeningImmunization extends Model
{
    use HasFactory;

    protected $fillable = [
        'health_screening_id',
        'vaccine_code',
        'received_at',
        'dose',
        'is_given_today',
    ];

    protected $casts = [
        'received_at' => 'date',
        'is_given_today' => 'boolean',
    ];

    public function healthScreening(): BelongsTo
    {
        return $this->belongsTo(HealthScreening::class);
    }
}
