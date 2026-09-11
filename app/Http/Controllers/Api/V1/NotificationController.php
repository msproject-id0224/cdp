<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * Versi terstruktur dari closure route web `/api/notifications/unread`
 * (routes/web.php) -- query-nya sudah generik untuk semua role (bukan
 * role:admin-only seperti disangka draf awal dokumen migrasi), jadi
 * porting apa adanya ke sini.
 */
class NotificationController extends Controller
{
    public function unread(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'unread_notifications' => $user->unreadNotifications()->limit(10)->get(),
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notifikasi tidak ditemukan.'], 404);
        }

        $notification->markAsRead();

        return response()->json(['status' => 'success']);
    }
}
