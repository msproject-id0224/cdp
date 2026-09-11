<?php

namespace App\Services;

use App\Models\Letter;
use App\Models\ParticipantGift;
use App\Models\ParticipantNote;
use App\Models\User;

/**
 * Query logic untuk data "keterlibatan" partisipan yang sebelumnya cuma
 * di-embed langsung di DashboardController::index() (surat & hadiah) --
 * diekstrak di sini supaya web (Dashboard) dan Api\V1\LetterController /
 * Api\V1\GiftController / Api\V1\NoteController memanggil query yang SAMA
 * PERSIS, bukan disalin ulang.
 */
class ParticipantEngagementService
{
    /**
     * Surat masuk & keluar milik partisipan. Query sama persis dengan
     * DashboardController::index() sebelum diekstrak -- lihat filter
     * `letter_search` di sana.
     */
    public static function lettersFor(User $user, ?string $search = null)
    {
        $query = Letter::where('recipient_id', $user->id)
            ->orWhere('sender_id', $user->id);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('letter_number', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        return $query->latest('sent_at');
    }

    /**
     * Riwayat hadiah milik partisipan. Query sama persis dengan
     * DashboardController::index() sebelum diekstrak -- lihat filter
     * `gift_date_start`/`gift_date_end` di sana.
     */
    public static function giftsFor(User $user, ?string $dateStart = null, ?string $dateEnd = null)
    {
        $query = ParticipantGift::where('user_id', $user->id);

        if (!empty($dateStart) && !empty($dateEnd)) {
            $query->whereBetween('created_at', [$dateStart, $dateEnd]);
        }

        return $query->latest();
    }

    /**
     * Catatan mentor tentang partisipan yang BOLEH dilihat partisipan itu
     * sendiri -- BEDA dari ParticipantController::myNotes() versi web, yang
     * saat ini tidak memfilter `visibility` sama sekali (lihat catatan gap
     * privasi di FLUTTER_MIGRATION_PROMPTS.md Bagian A.5). Endpoint API baru
     * sengaja hanya mengembalikan `visibility = 'public'` -- TIDAK
     * mereplikasi bug itu. Web belum diubah (keputusan eksplisit: fix bug
     * web di luar lingkup Fase 2 Flutter untuk sekarang).
     *
     * Catatan praktis: karena ParticipantController::storeNote() (sisi
     * mentor) tidak pernah men-set `visibility` secara eksplisit, semua
     * catatan yang ada hari ini memakai default kolom ('private') --
     * endpoint ini kemungkinan besar akan selalu kosong sampai ada jalan
     * dari sisi mentor untuk menandai sebuah catatan sebagai 'public'.
     */
    public static function publicNotesFor(User $user)
    {
        return ParticipantNote::where('participant_id', $user->id)
            ->where('visibility', 'public')
            ->with('mentor')
            ->orderByDesc('created_at');
    }
}
