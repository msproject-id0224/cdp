<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MentorDocument extends Model
{
    protected $fillable = [
        'user_id',
        'document_type',
        'file_path',
        'file_name',
        'file_mime',
        'file_size',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Document types that can only be uploaded once.
     */
    public static array $oneTimeTypes = [
        'ijazah_terakhir',
    ];

    /**
     * Document types that expire after one year.
     */
    public static array $yearlyTypes = [
        'surat_pernyataan',
        'surat_pernyataan_komitmen_perlindungan_anak',
    ];

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function getIsExpiringSoonAttribute(): bool
    {
        return $this->expires_at !== null
            && !$this->expires_at->isPast()
            && $this->expires_at->diffInDays(Carbon::today()) <= 30;
    }
}
