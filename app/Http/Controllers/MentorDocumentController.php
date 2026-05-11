<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\MentorDocument;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MentorDocumentController extends Controller
{
    private const DOCUMENT_LABELS = [
        'ijazah_terakhir'                            => 'Ijazah Terakhir',
        'surat_pernyataan'                           => 'Surat Pernyataan',
        'surat_pernyataan_komitmen_perlindungan_anak'=> 'Surat Pernyataan Komitmen Perlindungan Anak',
        'surat_keterangan_catatan_kepolisian'        => 'Surat Keterangan Catatan Kepolisian',
        'ktp'                                        => 'KTP',
    ];

    /**
     * Return documents for the authenticated mentor (or a given mentor for admin).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = Auth::id();

        // Admin may inspect any mentor's documents via ?mentor_id=
        if (Auth::user()->role === 'admin' && $request->filled('mentor_id')) {
            $userId = (int) $request->mentor_id;
        }

        $uploaded = MentorDocument::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->keyBy('document_type');

        $rows = [];
        $no   = 1;
        foreach (self::DOCUMENT_LABELS as $type => $label) {
            $doc = $uploaded->get($type);
            $rows[] = [
                'no'            => $no++,
                'document_type' => $type,
                'label'         => $label,
                'document'      => $doc ? [
                    'id'              => $doc->id,
                    'file_name'       => $doc->file_name,
                    'file_size'       => $doc->file_size,
                    'file_mime'       => $doc->file_mime,
                    'uploaded_at'     => $doc->created_at->format('Y-m-d'),
                    'expires_at'      => $doc->expires_at?->format('Y-m-d'),
                    'is_expired'      => $doc->is_expired,
                    'is_expiring_soon'=> $doc->is_expiring_soon,
                ] : null,
                'is_one_time'   => in_array($type, MentorDocument::$oneTimeTypes),
                'is_yearly'     => in_array($type, MentorDocument::$yearlyTypes),
            ];
        }

        return response()->json($rows);
    }

    /**
     * Upload (or replace) a document.
     */
    public function upload(Request $request): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'mentor') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'document_type' => 'required|in:' . implode(',', array_keys(self::DOCUMENT_LABELS)),
            'file'          => 'required|file|mimes:pdf|max:5120',
        ]);

        $type = $request->document_type;

        // One-time documents may only be uploaded once
        if (in_array($type, MentorDocument::$oneTimeTypes)) {
            $exists = MentorDocument::where('user_id', $user->id)
                ->where('document_type', $type)
                ->exists();
            if ($exists) {
                return response()->json(['message' => 'This document can only be uploaded once.'], 422);
            }
        }

        $file    = $request->file('file');
        $path    = $file->store("mentor-documents/{$user->id}", 'public');
        $expiresAt = null;

        if (in_array($type, MentorDocument::$yearlyTypes)) {
            $expiresAt = Carbon::today()->addYear()->format('Y-m-d');
        }

        // Replace previous document for re-uploadable types
        $old = MentorDocument::where('user_id', $user->id)
            ->where('document_type', $type)
            ->first();
        if ($old) {
            Storage::disk('public')->delete($old->file_path);
            $old->delete();
        }

        $doc = MentorDocument::create([
            'user_id'       => $user->id,
            'document_type' => $type,
            'file_path'     => $path,
            'file_name'     => $file->getClientOriginalName(),
            'file_mime'     => $file->getClientMimeType(),
            'file_size'     => $file->getSize(),
            'expires_at'    => $expiresAt,
        ]);

        AuditLog::create([
            'user_id'    => $user->id,
            'action'     => 'upload_mentor_document',
            'target_id'  => $doc->id,
            'target_type'=> MentorDocument::class,
            'details'    => ['document_type' => $type, 'file_name' => $doc->file_name],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message'  => 'Document uploaded successfully.',
            'document' => [
                'id'              => $doc->id,
                'file_name'       => $doc->file_name,
                'file_size'       => $doc->file_size,
                'file_mime'       => $doc->file_mime,
                'uploaded_at'     => $doc->created_at->format('Y-m-d'),
                'expires_at'      => $doc->expires_at?->format('Y-m-d'),
                'is_expired'      => $doc->is_expired,
                'is_expiring_soon'=> $doc->is_expiring_soon,
            ],
        ]);
    }

    /**
     * Download a document — mentor owner or admin only.
     */
    public function download(MentorDocument $document): mixed
    {
        $user = Auth::user();
        if ($document->user_id !== $user->id && $user->role !== 'admin') {
            abort(403);
        }

        if (!Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    /**
     * Admin: list all mentors with their document completion status.
     */
    public function adminIndex(): JsonResponse
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $mentors = User::where('role', 'mentor')
            ->select('id', 'first_name', 'last_name', 'email')
            ->with(['mentorDocuments' => fn($q) => $q->select('id', 'user_id', 'document_type', 'file_name', 'expires_at', 'created_at')])
            ->get()
            ->map(function ($mentor) {
                $uploaded = $mentor->mentorDocuments->keyBy('document_type');
                $total    = count(self::DOCUMENT_LABELS);
                $done     = $uploaded->count();
                return [
                    'id'         => $mentor->id,
                    'name'       => $mentor->first_name . ' ' . $mentor->last_name,
                    'email'      => $mentor->email,
                    'completed'  => $done,
                    'total'      => $total,
                    'documents'  => $uploaded->map(fn($d) => [
                        'id'         => $d->id,
                        'file_name'  => $d->file_name,
                        'uploaded_at'=> $d->created_at->format('Y-m-d'),
                        'expires_at' => $d->expires_at?->format('Y-m-d'),
                    ])->toArray(),
                ];
            });

        return response()->json($mentors);
    }
}
