<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParticipantNote extends Model
{
    protected $fillable = [
        'participant_id',
        'mentor_id',
        'note',
        // `subject`/`visibility` sudah ada di skema (lihat migrations
        // add_subject_to_.../add_visibility_to_...) tapi belum pernah masuk
        // $fillable -- ditambahkan di sini supaya bisa dipakai.
        // ParticipantController::storeNote() (sisi mentor) masih belum
        // mengirim field ini sama sekali, jadi ini tidak mengubah perilaku
        // yang sudah ada, cuma membuka jalan untuk dipakai nanti.
        'subject',
        'visibility',
    ];

    public function participant()
    {
        return $this->belongsTo(User::class, 'participant_id');
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
