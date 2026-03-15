<?php

namespace App\Http\Controllers;

use App\Models\ParticipantGift;
use App\Models\User;
use App\Models\AuditLog;
use App\Notifications\GiftAssignedNotification;
use App\Notifications\GiftProofUploadedNotification;
use App\Notifications\GiftVerifiedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GiftController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Admin sees all gifts, Participant sees their own, Mentor sees their participants'
        $user = Auth::user();
        $query = ParticipantGift::with('user');

        if ($user->isParticipant()) {
            $query->where('user_id', $user->id);
        } elseif ($user->isMentor()) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }
        // Admin sees all

        // Filter and Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('gift_code', 'like', "%{$search}%")
                  ->orWhere('letter_code', 'like', "%{$search}%")
                  ->orWhereHas('user', function($uq) use ($search) {
                      $uq->where('first_name', 'like', "%{$search}%")
                         ->orWhere('last_name', 'like', "%{$search}%")
                         ->orWhere('id_number', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortColumn = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_order', 'desc');
        
        // Allow sorting by user name
        if ($sortColumn === 'user.name') {
            $query->join('users', 'participant_gifts.user_id', '=', 'users.id')
                  ->orderBy('users.first_name', $sortDirection)
                  ->select('participant_gifts.*'); // Avoid column collision
        } else {
            // Validate sort column to prevent SQL injection or errors
            if (in_array($sortColumn, ['created_at', 'gift_code', 'letter_code', 'type', 'status', 'model'])) {
                $query->orderBy($sortColumn, $sortDirection);
            } else {
                $query->latest();
            }
        }

        $perPage = $request->input('per_page', 25);
        if (!in_array($perPage, [10, 25, 50, 100])) {
            $perPage = 25;
        }

        $gifts = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Gifts/Index', [
            'gifts' => $gifts,
            'filters' => $request->only(['search', 'type', 'model', 'status', 'sort_by', 'sort_order', 'per_page'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get list of participants for dropdown
        // Admin only? Assuming admin only based on prompt "dibuat oleh Admin"
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $participants = User::where('role', 'participant')
            ->where('is_active', true)
            ->select('id', 'first_name', 'last_name', 'id_number')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->first_name . ' ' . ($p->last_name ?? '') . ' (' . ($p->id_number ?? '-') . ')',
                ];
            });

        return Inertia::render('Gifts/Create', [
            'participants' => $participants
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'gift_code' => ['required', 'string', 'unique:participant_gifts,gift_code', 'regex:/^([A-Z]{2})\s*-\s*([0-9]+)$/'],
            'letter_code' => ['required', 'string', 'regex:/^(C\d{9}|D\d{10})$/'],
            'type' => 'required|in:birthday,family,general',
            'model' => 'required|in:small,large',
            'status' => 'required|in:pending,received,returned',
        ]);

        try {
            DB::beginTransaction();

            $gift = ParticipantGift::create($validated);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'ASSIGN_GIFT',
                'target_id' => $gift->id,
                'target_type' => ParticipantGift::class,
                'details' => $validated,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Notifications
            try {
                $participant = User::find($validated['user_id']);
                
                // Notify Participant
                $participant->notify(new GiftAssignedNotification($gift, 'participant'));

                // Notify Mentor if exists
                if ($participant->mentor_id) {
                    $mentor = User::find($participant->mentor_id);
                    if ($mentor) {
                        $mentor->notify(new GiftAssignedNotification($gift, 'mentor'));
                    }
                }
            } catch (\Exception $e) {
                // Log error but don't fail the transaction
                Log::error('Gift Notification Failed: ' . $e->getMessage());
            }

            DB::commit();

            return redirect()->route('gifts.index')->with('success', 'Hadiah berhasil ditambahkan.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gift assignment failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menyimpan data hadiah.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ParticipantGift $gift)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $participants = User::where('role', 'participant')
            ->where('is_active', true)
            ->select('id', 'first_name', 'last_name', 'id_number')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->first_name . ' ' . ($p->last_name ?? '') . ' (' . ($p->id_number ?? '-') . ')',
                ];
            });

        return Inertia::render('Gifts/Edit', [
            'gift' => $gift,
            'participants' => $participants
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParticipantGift $gift)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        // Allow update full data, not just status
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'gift_code' => ['required', 'string', 'unique:participant_gifts,gift_code,' . $gift->id, 'regex:/^[A-Z]{2} - [0-9]+$/'],
            'letter_code' => ['required', 'string', 'regex:/^(C\d{9}|D\d{10})$/'],
            'type' => 'required|in:birthday,family,general',
            'model' => 'required|in:small,large',
            'status' => 'required|in:pending,received,returned',
        ]);

        try {
            DB::beginTransaction();
            
            $oldData = $gift->getOriginal();
            $gift->update($validated);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'UPDATE_GIFT',
                'target_id' => $gift->id,
                'target_type' => ParticipantGift::class,
                'details' => [
                    'old' => $oldData,
                    'new' => $validated
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();
            return redirect()->route('gifts.index')->with('success', 'Data hadiah berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui data.']);
        }
    }

    /**
     * Upload proof photo by Mentor (now Form Penerimaan)
     */
    public function uploadProof(Request $request, ParticipantGift $gift)
    {
        if (!Auth::user()->isMentor()) {
            abort(403);
        }

        $request->validate([
            'usage_plan' => 'required|string|max:1000',
            'proof_photos' => 'nullable|array|max:3',
            'proof_photos.*' => 'image|mimes:jpeg,png,jpg,pdf|max:5120',
            'gift_description' => 'required|string|max:1000',
            'gift_value' => 'nullable|numeric',
        ]);

        try {
            $paths = [];
            if ($request->hasFile('proof_photos')) {
                foreach ($request->file('proof_photos') as $photo) {
                    $paths[] = $photo->store('gift-proofs', 'public');
                }
            }

            // Merge with existing if any? Or replace? Assuming replace for now or append logic needed
            // For simplicity, replace or append to existing array if exists
            $currentPaths = $gift->proof_photo_path ?? [];
            if (!is_array($currentPaths)) $currentPaths = []; // Safety check
            
            $newPaths = array_merge($currentPaths, $paths);

            $status = $request->input('action') === 'draft' ? 'draft' : 'pending_verification';

            $gift->update([
                'proof_photo_path' => $newPaths,
                'usage_plan' => $request->usage_plan,
                'reception_date' => now(), // Auto set to now
                'status' => $status,
                'gift_description' => $request->gift_description,
                'gift_value' => $request->gift_value,
            ]);

            // Notify Admin only if submitted for verification
            if ($status === 'pending_verification') {
                $admins = User::where('role', 'admin')->get();
                foreach ($admins as $admin) {
                    $admin->notify(new GiftProofUploadedNotification($gift));
                }
                return back()->with('success', 'Formulir penerimaan hadiah berhasil dikirim. Menunggu verifikasi admin.');
            }

            return back()->with('success', 'Draft formulir berhasil disimpan.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengirim formulir: ' . $e->getMessage()]);
        }
    }

    /**
     * Verify gift reception by Admin
     */
    public function verify(Request $request, ParticipantGift $gift)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:received,returned', // Admin decides if valid (received) or rejected (returned/pending)
            'admin_notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $oldStatus = $gift->status;
            $gift->update([
                'status' => $validated['status'],
                'admin_notes' => $validated['admin_notes'],
            ]);

            // Audit Log
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'VERIFY_GIFT',
                'target_id' => $gift->id,
                'target_type' => ParticipantGift::class,
                'details' => [
                    'old_status' => $oldStatus,
                    'new_status' => $validated['status'],
                    'notes' => $validated['admin_notes']
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Notifications
            $participant = User::find($gift->user_id);
            $participant->notify(new GiftVerifiedNotification($gift, $validated['status']));

            if ($participant->mentor_id) {
                $mentor = User::find($participant->mentor_id);
                if ($mentor) {
                    $mentor->notify(new GiftVerifiedNotification($gift, $validated['status']));
                }
            }

            DB::commit();
            return back()->with('success', 'Status penerimaan hadiah berhasil diverifikasi.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memverifikasi hadiah.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ParticipantGift $gift)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        try {
            // Check logic constraint (e.g. if already received)
            if ($gift->status === 'received') {
                return back()->withErrors(['error' => 'Tidak dapat menghapus hadiah yang sudah diterima.']);
            }

            $gift->delete();

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'DELETE_GIFT',
                'target_id' => $gift->id,
                'target_type' => ParticipantGift::class,
                'details' => ['deleted_code' => $gift->gift_code],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return redirect()->route('gifts.index')->with('success', 'Data hadiah berhasil dihapus.');

        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return back()->withErrors(['error' => 'Data tidak dapat dihapus karena terhubung dengan data lain.']);
            }
            return back()->withErrors(['error' => 'Terjadi kesalahan sistem saat menghapus data.']);
        }
    }

    /**
     * Log view action for audit trail
     */
    public function logView(Request $request, ParticipantGift $gift)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'VIEW_GIFT_DETAIL',
            'target_id' => $gift->id,
            'target_type' => ParticipantGift::class,
            'details' => ['viewed_code' => $gift->gift_code, 'status' => $gift->status],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['status' => 'logged']);
    }
}
