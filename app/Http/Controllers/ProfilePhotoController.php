<?php

namespace App\Http\Controllers;

use App\Models\ProfilePhotoRequest;
use App\Models\User;
use App\Models\AuditLog;
use App\Events\NewProfilePhotoRequest;
use App\Mail\ProfilePhotoStatusMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProfilePhotoController extends Controller
{
    /**
     * Admin: Direct upload for any user.
     */
    public function adminUpload(Request $request, User $user)
    {
        $request->validate([
            'photo' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png'])
                    ->max(2048),
            ],
        ]);

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->update([
            'profile_photo_path' => $path,
            'profile_photo_status' => 'active',
        ]);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'admin_upload_photo',
            'target_id' => $user->id,
            'target_type' => User::class,
            'details' => [
                'path' => $path,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Clear any pending requests
        ProfilePhotoRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'approved',
                'reviewer_id' => Auth::id(),
                'reviewed_at' => now(),
            ]);

        return back()->with('success', 'Profile photo updated successfully.');
    }

    /**
     * Mentor/Participant: Upload request.
     */
    public function userRequestUpload(Request $request)
    {
        $user = Auth::user();

        // Check for existing pending request
        $existingPendingRequest = ProfilePhotoRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($existingPendingRequest || $user->profile_photo_status === 'pending') {
            return back()->with('error', 'You already have a pending photo request. Please wait for admin review.');
        }

        $request->validate([
            'photo' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png'])
                    ->max(2048),
            ],
        ]);

        // Store as temporary request photo
        $path = $request->file('photo')->store('profile-photo-requests', 'public');

        $photoRequest = ProfilePhotoRequest::create([
            'user_id' => $user->id,
            'photo_path' => $path,
            'status' => 'pending',
        ]);

        $user->update(['profile_photo_status' => 'pending']);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'user_request_photo',
            'target_id' => $photoRequest->id,
            'target_type' => ProfilePhotoRequest::class,
            'details' => [
                'path' => $path,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        event(new NewProfilePhotoRequest($photoRequest));

        return back()->with('success', 'Profile photo request submitted for approval.');
    }

    /**
     * API: Get pending photo requests for admin notifications.
     */
    public function pending()
    {
        $requests = ProfilePhotoRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();
            
        return response()->json($requests);
    }

    /**
     * Admin: List requests with filtering and pagination.
     */
    public function index(Request $request)
    {
        $query = ProfilePhotoRequest::with(['user', 'reviewer']);

        // Filter by status - default to pending if not provided
        if ($request->has('status')) {
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', 'pending');
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->role);
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by user name, email, or ID number
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $searchTerm = '%' . $request->search . '%';
                $q->where(function($subQ) use ($searchTerm) {
                    $subQ->where('first_name', 'like', $searchTerm)
                         ->orWhere('last_name', 'like', $searchTerm)
                         ->orWhere('nickname', 'like', $searchTerm)
                         ->orWhere('id_number', 'like', $searchTerm)
                         ->orWhere('email', 'like', $searchTerm);
                });
            });
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/ProfilePhotoRequests', [
            'requests' => $requests,
            'filters' => array_merge(
                $request->only(['role', 'date_from', 'date_to', 'search']),
                ['status' => $request->input('status', 'pending')]
            ),
        ]);
    }

    /**
     * Admin: Bulk approve requests.
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:profile_photo_requests,id',
        ]);

        $ids = $request->ids;
        $count = 0;

        DB::transaction(function () use ($ids, &$count) {
            foreach ($ids as $id) {
                $photoRequest = ProfilePhotoRequest::find($id);
                if ($photoRequest->status === 'pending') {
                    $this->processApproval($photoRequest);
                    $count++;
                }
            }
        });

        return back()->with('success', "Successfully approved {$count} photo requests.");
    }

    /**
     * Admin: Bulk reject requests.
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:profile_photo_requests,id',
            'reason' => 'required|string|max:255',
        ]);

        $ids = $request->ids;
        $reason = $request->reason;
        $count = 0;

        DB::transaction(function () use ($ids, $reason, &$count) {
            foreach ($ids as $id) {
                $photoRequest = ProfilePhotoRequest::find($id);
                if ($photoRequest->status === 'pending') {
                    $photoRequest->update([
                        'status' => 'rejected',
                        'rejection_reason' => $reason,
                        'reviewer_id' => Auth::id(),
                        'reviewed_at' => now(),
                    ]);

                    $photoRequest->user->update(['profile_photo_status' => 'rejected']);

                    AuditLog::create([
                        'user_id' => Auth::id(),
                        'action' => 'admin_bulk_reject_photo',
                        'target_id' => $photoRequest->id,
                        'target_type' => ProfilePhotoRequest::class,
                        'details' => ['reason' => $reason],
                        'ip_address' => request()->ip(),
                        'user_agent' => request()->userAgent(),
                    ]);

                    Mail::to($photoRequest->user->email)->send(new ProfilePhotoStatusMail($photoRequest->user, 'rejected', $reason));
                    $count++;
                }
            }
        });

        return back()->with('success', "Successfully rejected {$count} photo requests.");
    }

    /**
     * Admin: Export requests data.
     */
    public function export(Request $request)
    {
        $query = ProfilePhotoRequest::with(['user', 'reviewer']);

        // Filter by status - default to pending if not provided
        if ($request->has('status')) {
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }
        } else {
            $query->where('status', 'pending');
        }
        if ($request->filled('role')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('role', $request->role);
            });
        }
        if ($request->filled('date_from')) $query->whereDate('created_at', '>=', $request->date_from);
        if ($request->filled('date_to')) $query->whereDate('created_at', '<=', $request->date_to);

        // Search by user name, email, or ID number
        if ($request->filled('search')) {
            $query->whereHas('user', function ($q) use ($request) {
                $searchTerm = '%' . $request->search . '%';
                $q->where(function($subQ) use ($searchTerm) {
                    $subQ->where('first_name', 'like', $searchTerm)
                         ->orWhere('last_name', 'like', $searchTerm)
                         ->orWhere('nickname', 'like', $searchTerm)
                         ->orWhere('id_number', 'like', $searchTerm)
                         ->orWhere('email', 'like', $searchTerm);
                });
            });
        }

        $data = $query->latest()->get();

        $filename = "profile_photo_requests_" . date('Ymd_His') . ".csv";
        
        $callback = function() use ($data) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'User', 'Email', 'Role', 'Status', 'Requested At', 'Reviewed By', 'Reviewed At', 'Rejection Reason']);

            foreach ($data as $row) {
                fputcsv($handle, [
                    $row->id,
                    $row->user->name,
                    $row->user->email,
                    $row->user->role,
                    $row->status,
                    $row->created_at->format('Y-m-d H:i:s'),
                    $row->reviewer ? $row->reviewer->name : '-',
                    $row->reviewed_at ? $row->reviewed_at->format('Y-m-d H:i:s') : '-',
                    $row->rejection_reason ?? '-',
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Admin: Approve request.
     */
    public function approve(Request $request, ProfilePhotoRequest $photoRequest)
    {
        $request->validate([
            'crop_x' => 'nullable|numeric',
            'crop_y' => 'nullable|numeric',
            'crop_width' => 'nullable|numeric',
            'crop_height' => 'nullable|numeric',
            'zoom' => 'nullable|numeric',
        ]);

        try {
            DB::transaction(function () use ($request, $photoRequest) {
                $this->processApproval($photoRequest, $request->only(['crop_x', 'crop_y', 'crop_width', 'crop_height', 'zoom']));
            });
            return back()->with('success', 'Profile photo approved and optimized.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to process photo: ' . $e->getMessage());
        }
    }

    /**
     * Admin: Reject request.
     */
    public function reject(Request $request, ProfilePhotoRequest $photoRequest)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $photoRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
            'reviewer_id' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $photoRequest->user->update(['profile_photo_status' => 'rejected']);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'admin_reject_photo',
            'target_id' => $photoRequest->id,
            'target_type' => ProfilePhotoRequest::class,
            'details' => ['reason' => $request->reason],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Mail::to($photoRequest->user->email)->send(new ProfilePhotoStatusMail($photoRequest->user, 'rejected', $request->reason));

        return back()->with('success', 'Profile photo request rejected.');
    }

    /**
     * Admin: Request re-upload.
     */
    public function requestReupload(Request $request, ProfilePhotoRequest $photoRequest)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
        ]);

        $photoRequest->update([
            'status' => 'reupload_requested',
            'rejection_reason' => $request->reason,
            'reviewer_id' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $photoRequest->user->update(['profile_photo_status' => 'reupload_requested']);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'admin_request_reupload_photo',
            'target_id' => $photoRequest->id,
            'target_type' => ProfilePhotoRequest::class,
            'details' => ['reason' => $request->reason],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        Mail::to($photoRequest->user->email)->send(new ProfilePhotoStatusMail($photoRequest->user, 'reupload_requested', $request->reason));

        return back()->with('success', 'Re-upload request sent to user.');
    }

    /**
     * Helper: Process approval.
     */
    private function processApproval(ProfilePhotoRequest $photoRequest, $cropData = [])
    {
        $user = $photoRequest->user;

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $newFileName = 'profile-photos/' . uniqid() . '.jpg';

        if (!Storage::disk('public')->exists('profile-photos')) {
            Storage::disk('public')->makeDirectory('profile-photos');
        }

        if (extension_loaded('gd') || extension_loaded('imagick')) {
            $manager = new ImageManager(extension_loaded('gd') ? new Driver() : new \Intervention\Image\Drivers\Imagick\Driver());
            $image = $manager->read(Storage::disk('public')->get($photoRequest->photo_path));

            if (!empty($cropData) && isset($cropData['crop_width'])) {
                $image->crop(
                    (int)$cropData['crop_width'],
                    (int)$cropData['crop_height'],
                    (int)$cropData['crop_x'],
                    (int)$cropData['crop_y']
                );
            }

            $encoded = $image->scale(width: 400, height: 400)
                  ->toJpeg(80);
            
            Storage::disk('public')->put($newFileName, (string) $encoded);
        } else {
            // Fallback: Just copy the file if image extensions are not available
            Storage::disk('public')->copy($photoRequest->photo_path, $newFileName);
        }

        $user->update([
            'profile_photo_path' => $newFileName,
            'profile_photo_status' => 'active',
        ]);

        $photoRequest->update(array_merge([
            'status' => 'approved',
            'reviewer_id' => Auth::id(),
            'reviewed_at' => now(),
        ], $cropData));

        Storage::disk('public')->delete($photoRequest->photo_path);

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'admin_approve_photo',
            'target_id' => $photoRequest->id,
            'target_type' => ProfilePhotoRequest::class,
            'details' => $cropData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        Mail::to($user->email)->send(new ProfilePhotoStatusMail($user, 'approved'));
    }

    /**
     * Admin: Bulk Upload via CSV.
     */
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt',
            'photos' => 'required|array',
            'photos.*' => 'image|max:2048',
        ]);

        $file = $request->file('csv_file');
        $csvData = array_map('str_getcsv', file($file->getPathname()));
        $header = array_shift($csvData);

        $successCount = 0;
        $errors = [];

        foreach ($csvData as $row) {
            $data = array_combine($header, $row);
            $idNumber = $data['id_number'] ?? null;
            $photoName = $data['photo_name'] ?? null;

            if (!$idNumber || !$photoName) continue;

            $user = User::where('id_number', $idNumber)->first();
            if (!$user) {
                $errors[] = "User with ID Number {$idNumber} not found.";
                continue;
            }

            $photoFile = collect($request->file('photos'))->first(function($file) use ($photoName) {
                return $file->getClientOriginalName() === $photoName;
            });

            if (!$photoFile) {
                $errors[] = "Photo file {$photoName} not found in upload.";
                continue;
            }

            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }

            $path = $photoFile->store('profile-photos', 'public');
            $user->update([
                'profile_photo_path' => $path,
                'profile_photo_status' => 'active',
            ]);

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'admin_bulk_upload_photo',
                'target_id' => $user->id,
                'target_type' => User::class,
                'details' => ['path' => $path],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $successCount++;
        }

        if (count($errors) > 0) {
            return back()->with('success', "Bulk upload completed. {$successCount} photos updated.")
                         ->with('warning', implode(' ', $errors));
        }

        return back()->with('success', "Successfully updated {$successCount} profile photos.");
    }
}
