<?php

namespace App\Http\Controllers;

use App\Models\HealthScreening;
use App\Models\HealthScreeningImmunization;
use App\Models\HealthScreeningFinding;
use App\Models\User;
use App\Models\AuditLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use SimpleSoftwareIO\QrCode\Facades\QrCode;

class HealthScreeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = HealthScreening::with('user')
            ->orderBy('checked_at', 'desc')
            ->orderBy('created_at', 'desc');

        // RBAC: Mentors only see their assigned participants
        if ($user->isMentor()) {
            $query->whereHas('user', function($q) use ($user) {
                $q->where('mentor_id', $user->id);
            });
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where(function($sq) use ($search) {
                    $sq->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', "%{$search}%")
                      ->orWhere('id_number', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('malnutrition_status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('checked_at', $request->date);
        }

        $screenings = $query->paginate(15)->withQueryString();

        return Inertia::render('HealthScreening/Index', [
            'screenings' => $screenings,
            'filters' => $request->only(['search', 'status', 'date'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('HealthScreening/Form', [
            'mode' => 'create'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $validated = $this->calculateBmi($validated);

        try {
            DB::beginTransaction();

            $screening = HealthScreening::create($validated);

            // Store Immunizations
            if (!empty($request->immunizations)) {
                foreach ($request->immunizations as $imm) {
                    if (!empty($imm['checked'])) {
                        $screening->immunizations()->create([
                            'vaccine_code' => $imm['code'],
                            'received_at' => $imm['date'] ?? null,
                            'dose' => $imm['dose'] ?? null,
                            'is_given_today' => $imm['given_today'] ?? false,
                        ]);
                    }
                }
            }

            // Store Findings
            if (!empty($request->findings)) {
                foreach ($request->findings as $finding) {
                    $screening->findings()->create([
                        'category' => $finding['category'],
                        'item_key' => $finding['key'],
                        'status' => $finding['status'],
                        'description' => $finding['description'] ?? null,
                    ]);
                }
            }

            $screening->load('user');

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'CREATE_HEALTH_SCREENING',
                'target_id' => $screening->id,
                'target_type' => HealthScreening::class,
                'details' => [
                    'participant_id' => $screening->user_id,
                    'participant_name' => $screening->user->name,
                    'checked_at' => $screening->checked_at->format('Y-m-d'),
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            return redirect()->route('health-screenings.index')
                ->with('success', 'Data pemeriksaan kesehatan berhasil disimpan.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('HealthScreening creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HealthScreening $healthScreening)
    {
        $healthScreening->load(['immunizations', 'findings', 'user']);
        
        return Inertia::render('HealthScreening/Form', [
            'mode' => 'edit',
            'screening' => $healthScreening
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HealthScreening $healthScreening)
    {
        $validated = $this->validateRequest($request);
        $validated = $this->calculateBmi($validated);

        try {
            DB::beginTransaction();

            $healthScreening->update($validated);

            // Sync Immunizations (Delete old, insert new for simplicity)
            $healthScreening->immunizations()->delete();
            if (!empty($request->immunizations)) {
                foreach ($request->immunizations as $imm) {
                    if (!empty($imm['checked'])) {
                        $healthScreening->immunizations()->create([
                            'vaccine_code' => $imm['code'],
                            'received_at' => $imm['date'] ?? null,
                            'dose' => $imm['dose'] ?? null,
                            'is_given_today' => $imm['given_today'] ?? false,
                        ]);
                    }
                }
            }

            // Sync Findings
            $healthScreening->findings()->delete();
            if (!empty($request->findings)) {
                foreach ($request->findings as $finding) {
                    $healthScreening->findings()->create([
                        'category' => $finding['category'],
                        'item_key' => $finding['key'],
                        'status' => $finding['status'],
                        'description' => $finding['description'] ?? null,
                    ]);
                }
            }

            $healthScreening->load('user');

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'UPDATE_HEALTH_SCREENING',
                'target_id' => $healthScreening->id,
                'target_type' => HealthScreening::class,
                'details' => [
                    'participant_id' => $healthScreening->user_id,
                    'participant_name' => $healthScreening->user->name,
                    'checked_at' => $healthScreening->checked_at->format('Y-m-d'),
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();

            return redirect()->route('health-screenings.index')
                ->with('success', 'Data pemeriksaan kesehatan berhasil diperbarui.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('HealthScreening update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HealthScreening $healthScreening)
    {
        $user = auth()->user();

        if ($user->isMentor() && $healthScreening->user->mentor_id !== $user->id) {
            return back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus data ini.']);
        }

        try {
            DB::beginTransaction();

            $id = $healthScreening->id;
            $details = [
                'participant_id' => $healthScreening->user_id,
                'participant_name' => $healthScreening->user->name,
                'checked_at' => $healthScreening->checked_at->format('Y-m-d'),
            ];

            $healthScreening->delete();

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => 'DELETE_HEALTH_SCREENING',
                'target_id' => $id,
                'target_type' => HealthScreening::class,
                'details' => $details,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Data pemeriksaan berhasil dihapus.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('HealthScreening deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal menghapus data.']);
        }
    }

    /**
     * Get list of participants for dropdown search
     */
    public function participants(Request $request)
    {
        $search = $request->search;
        $id = $request->id;
        $user = auth()->user();
        
        $query = User::where('role', 'participant')
            ->select('id', 'first_name', 'last_name', 'id_number', 'date_of_birth', 'gender')
            ->orderBy('first_name');

        if ($user->isMentor()) {
            $query->where('mentor_id', $user->id);
        }

        if ($id) {
            $query->where('id', $id);
        } elseif ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        return response()->json($query->limit(20)->get());
    }

    /**
     * Export to PDF
     */
    public function exportPdf(HealthScreening $healthScreening)
    {
        $healthScreening->load(['user', 'immunizations', 'findings', 'examiner']);
        
        // Generate QR Code as SVG Base64 (Does not require GD)
        $qrCodeData = 'BL-006-04';
        $qrCodeBase64 = base64_encode(QrCode::format('svg')->size(80)->generate($qrCodeData));
        $qrCodeImg = 'data:image/svg+xml;base64,' . $qrCodeBase64;

        // Generate Footer QR Code (Examiner Name + Date)
        $examinerName = $healthScreening->examiner_name ?? 'Dokter Pemeriksa';
        $checkDate = $healthScreening->checked_at->format('d-m-Y');
        $footerQrData = "Signed by: $examinerName | Date: $checkDate";
        $footerQrBase64 = base64_encode(QrCode::format('svg')->size(100)->generate($footerQrData));
        $footerQrImg = 'data:image/svg+xml;base64,' . $footerQrBase64;

        $pdf = Pdf::loadView('pdf.health-screening', [
            'screening' => $healthScreening,
            'qrCodeImg' => $qrCodeImg,
            'qrCodeText' => $qrCodeData,
            'footerQrImg' => $footerQrImg
        ]);

        $filename = 'Medical-Form-' . 
            str_replace(' ', '-', strtolower($healthScreening->user->name ?? 'participant')) .
            '-' . $healthScreening->checked_at->format('Y-m-d') . '.pdf';

        return $pdf->download($filename);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function validateRequest(Request $request): array
    {
        return $request->validate([
            'user_id' => 'required|exists:users,id',
            'examiner_id' => 'nullable|exists:users,id',
            'checked_at' => 'required|date',
            'status' => 'required|in:draft,final',
            
            // Vital Signs
            'weight' => 'nullable|numeric|min:0|max:300',
            'height' => 'nullable|numeric|min:0|max:300',
            'temperature' => 'nullable|numeric|min:30|max:45',
            'pulse' => 'nullable|integer|min:0|max:300',
            'respiration' => 'nullable|integer|min:0|max:100',
            'head_circumference' => 'nullable|numeric|min:0|max:100',
            'blood_pressure' => 'nullable|string|max:20',
            'malnutrition_status' => 'required|in:normal,mild,moderate,severe',
            'immunization_status' => 'nullable|in:incomplete,complete,fully_complete',
            'immunization_other' => 'nullable|string|max:1000',
            
            // Vitamin & Deworming
            'vitamin_a_dose' => 'nullable|string|max:50',
            'vitamin_a_date' => 'nullable|date',
            'deworming_dose' => 'nullable|string|max:50',
            'deworming_date' => 'nullable|date',

            // Text fields
            'medical_history' => 'nullable|string|max:5000',
            'major_findings' => 'nullable|string|max:5000',
            'diagnosis' => 'nullable|string|max:5000',
            'therapy' => 'nullable|string|max:5000',
            'comments' => 'nullable|string|max:5000',
            
            // Examiner
            'examiner_name' => 'nullable|string|max:255',
            'examiner_qualification' => 'nullable|string|max:255',
            'examiner_signature' => 'nullable|string', // Base64
            'examiner_signed_at' => 'nullable|date',
            
            // Arrays (validated structurally but content checked in loop)
            'immunizations' => 'nullable|array',
            'findings' => 'nullable|array',
        ]);
    }

    private function calculateBmi(array $data): array
    {
        if (!empty($data['weight']) && !empty($data['height']) && $data['height'] > 0) {
            $h = $data['height'] / 100; // cm to m
            $data['bmi'] = round($data['weight'] / ($h * $h), 2);
        } else {
            $data['bmi'] = null;
        }
        return $data;
    }
}
