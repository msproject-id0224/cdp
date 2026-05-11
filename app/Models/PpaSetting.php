<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PpaSetting extends Model
{
    protected $fillable = [
        'fiscal_year',
        'church_name',
        'ppa_id',
        'cluster',
        'rmd_period',
        'pic_user_id',
    ];

    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_user_id');
    }

    /**
     * Ambil satu-satunya record settings (singleton pattern)
     */
    public static function getSetting(): self
    {
        return self::with('pic')->firstOrCreate([], [
            'fiscal_year' => 'FY 2025',
            'church_name' => 'Gpdi Mawar Saron Tompaso Baru',
            'ppa_id'      => 'ID 0224',
            'cluster'     => 'Minahasa Selatan',
            'rmd_period'  => 'Mei 2025 - Juni 2025',
        ]);
    }
}
