<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HealthScreening extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'examiner_id',
        'checked_at',
        'status',
        'weight',
        'height',
        'bmi',
        'temperature',
        'pulse',
        'respiration',
        'head_circumference',
        'blood_pressure',
        'malnutrition_status',
        'immunization_status',
        'immunization_other',
        'vitamin_a_dose',
        'vitamin_a_date',
        'deworming_dose',
        'deworming_date',
        'medical_history',
        'major_findings',
        'diagnosis',
        'therapy',
        'comments',
        'examiner_name',
        'examiner_qualification',
        'examiner_signature',
        'examiner_signed_at',
    ];

    protected $casts = [
        'checked_at' => 'date',
        'examiner_signed_at' => 'date',
        'vitamin_a_date' => 'date',
        'deworming_date' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'bmi' => 'decimal:2',
        'temperature' => 'decimal:1',
        'head_circumference' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function examiner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'examiner_id');
    }

    public function immunizations(): HasMany
    {
        return $this->hasMany(HealthScreeningImmunization::class);
    }

    public function findings(): HasMany
    {
        return $this->hasMany(HealthScreeningFinding::class);
    }
}
