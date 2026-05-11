<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Letter extends Model
{
    use HasUuids;

    protected $fillable = [
        'sender_id',
        'recipient_id',
        'letter_number',
        'subject',
        'content',
        'file_path',
        'status',
        'read_at',
        'sent_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
