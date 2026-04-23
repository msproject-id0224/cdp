<?php

namespace App\Http\Controllers;

use App\Exports\RmdReportExport;
use App\Models\User;
use App\Services\RmdProgressService;
use App\Services\RmdChartService;
use App\Services\RmdAnalyticsService;
use App\Exports\RmdAnalyticsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class RmdReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $currentUser = Auth::user();
        $isMentor = $currentUser->isMentor();

        $chartService = new RmdChartService();
        $chartData = [];

        if (!$isMentor) {
            try {
                $chartData = [
                    'age_distribution'          => $chartService->getAgeDistributionAllParticipants(),
                    'participation_rate'         => $chartService->getRmdParticipationRate(),
                    'progress_distribution'      => $chartService->getRmdFillingProgressDistribution(),
                    'career_choice_distribution' => $chartService->getFinalCareerChoiceDistribution(),
                ];
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Error fetching RMD chart data: ' . $e->getMessage());
                $chartData = [
                    'error' => 'Gagal memuat data grafik: ' . $e->getMessage()
                ];
            }
        }

        // Table Data: List of participants with summary status
        $paginatedItems = $this->getParticipantSummaryData($request);

        // Get total participants count (filtered by mentor if applicable)
        $totalQuery = User::where('role', 'participant')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString());
        if ($isMentor) {
            $totalQuery->where('mentor_id', $currentUser->id);
        }
        $totalParticipants = $totalQuery->count();

        return Inertia::render('RmdReport/Index', [
            'reports' => $paginatedItems,
            'chartData' => $chartData,
            'filters' => $request->only(['search', 'status', 'date_start', 'date_end', 'sort', 'direction']),
            'totalParticipants' => $totalParticipants,
            'userRole' => $currentUser->role,
        ]);
    }

    /**
     * Export report to Excel.
     */
    public function exportExcel(Request $request)
    {
        $reportData = $this->getParticipantSummaryData($request, false);
        return Excel::download(new RmdReportExport($reportData), 'laporan_rmd_' . date('Y-m-d_H-i') . '.xlsx');
    }

    /**
     * Export report to PDF.
     */
    public function exportPdf(Request $request)
    {
        $reportData = $this->getParticipantSummaryData($request, false);
        $pdf = Pdf::loadView('reports.rmd_pdf', ['reports' => $reportData]);
        return $pdf->download('laporan_rmd_' . date('Y-m-d_H-i') . '.pdf');
    }

    /**
     * Export detailed analytics data to Excel.
     */
    public function exportAnalytics(Request $request)
    {
        $analyticsService = new RmdAnalyticsService();
        $data = $analyticsService->getAnalyticsData();
        
        return Excel::download(new RmdAnalyticsExport($data), 'rmd_analytics_' . date('Y-m-d_H-i') . '.xlsx');
    }

    private function getParticipantSummaryData(Request $request, $paginate = true)
    {
        $search = $request->input('search');
        $statusFilter = $request->input('status'); // Belum Mulai, Sedang Mengisi, Selesai
        $sortColumn = $request->input('sort', 'user_name');
        $sortDirection = $request->input('direction', 'asc');
        $perPage = 20;

        // Base Query: Participants > 12 years old
        // Note: Using 'age' column if available or calculating from DOB
        $query = User::query()
            ->where('role', 'participant')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString());

        // If current user is a mentor, only show their assigned participants
        if (Auth::user()->isMentor()) {
            $query->where('mentor_id', Auth::id());
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        // We need to determine status for each user.
        // This is expensive to do in SQL for all users if logic is complex.
        // Simplified logic:
        // 1. Get total modules count
        // 2. Count how many modules user has touched (count > 0)
        // 3. Count how many modules are 100% completed
        
        // For performance, we'll fetch users first then calculate status, OR join with a summary subquery.
        // Let's use a subquery approach for status to allow sorting/filtering.
        
        $modules = RmdProgressService::getModules();
        $totalModules = count($modules);
        
        $moduleQueries = [];
        foreach ($modules as $moduleName => $modelClass) {
            $model = new $modelClass;
            $tableName = $model->getTable();
            if (Schema::hasColumn($tableName, 'user_id')) {
                // Determine if module is "completed" (simple check: record exists? Or logic from previous step?)
                // Reusing the percentage logic from previous optimization would be ideal but complex to union 9 times inside a subquery for every user row.
                // Let's check existence for "Started" and assume simple completion check.
                // Actually, let's just check if record exists for "Sedang Mengisi".
                // "Selesai" requires all modules? Or just specific ones?
                // Let's define:
                // - Belum Mulai: No records in any RMD table.
                // - Selesai: Has records in ALL tables (simple approximation)
                // - Sedang Mengisi: Has records in SOME tables.
                
                $moduleQueries[] = "SELECT user_id FROM {$tableName}";
            }
        }
        
        if (empty($moduleQueries)) {
            // Fallback if no modules
             if ($paginate) return new LengthAwarePaginator([], 0, $perPage);
             return collect([]);
        }

        // Create a temporary table or CTE-like structure isn't easy in Eloquent builder.
        // We will fetch the users and then append status.
        // Filtering by status will be done in PHP (post-fetch) if dataset isn't huge, 
        // OR we try to build a `withCount` query.
        
        // Let's use `withCount` for each module relation.
        // We need relations on User model.
        // User model has: rmdProfile, rmdBibleReflection, etc.
        
        $relations = [
            'rmdProfile', 'rmdBibleReflection', 'rmdTrueSuccess', 'rmdTheOnlyOne',
            'rmdMultipleIntelligence', 'rmdSocioEmotional', 'rmdCareerExploration',
            'rmdCareerExplorationP2', 'rmdPreparationDreamIsland'
        ];
        
        foreach ($relations as $relation) {
            $query->withCount($relation);
        }

        // Eager load cita-cita dan gaya belajar
        $query->with([
            'rmdCareerExplorationP2:user_id,final_career_choice',
            'rmdTheOnlyOne:user_id,visual_checklist,auditory_checklist,kinesthetic_checklist',
        ]);

        $users = $query->get();

        $processedData = $users->map(function ($user) use ($relations, $totalModules) {
            $filledCount = 0;
            foreach ($relations as $relation) {
                $countAttribute = Str::snake($relation) . '_count';
                $count = $user->$countAttribute;
                if ($count > 0) $filledCount++;
            }

            $status = 'Belum Mulai';
            $percentage = 0;

            if ($filledCount > 0) {
                if ($filledCount == $totalModules) {
                    $status = 'Selesai';
                    $percentage = 100;
                } else {
                    $status = 'Sedang Mengisi';
                    $percentage = round(($filledCount / $totalModules) * 100);
                }
            }

            return (object) [
                'user_id'            => $user->id,
                'user_name'          => $user->name,
                'user_id_number'     => $user->id_number,
                'status'             => $status,
                'percentage'         => $percentage,
                'filled_modules_count' => $filledCount,
                'total_modules'      => $totalModules,
                'last_updated'       => $user->updated_at->format('Y-m-d H:i:s'),
                'cita_cita'          => $user->rmdCareerExplorationP2?->final_career_choice ?? '-',
                'gaya_belajar'       => $this->resolveGayaBelajar($user->rmdTheOnlyOne),
                'module_name'        => 'Summary',
                'filled_at'          => null,
            ];
        });

        // Filter by Status (PHP)
        if ($statusFilter) {
            $processedData = $processedData->where('status', $statusFilter);
        }

        // Sort (PHP)
        $processedData = $processedData->sortBy(function($row) use ($sortColumn) {
            return $row->{$sortColumn} ?? '';
        }, SORT_REGULAR, $sortDirection === 'desc');

        // Pagination (Manual)
        if ($paginate) {
            $currentPage = LengthAwarePaginator::resolveCurrentPage();
            $currentItems = $processedData->slice(($currentPage - 1) * $perPage, $perPage)->values();
            return new LengthAwarePaginator(
                $currentItems,
                $processedData->count(),
                $perPage,
                $currentPage,
                ['path' => LengthAwarePaginator::resolveCurrentPath(), 'query' => $request->query()]
            );
        }

        return $processedData->values();
    }

    private function resolveGayaBelajar($rmdTheOnlyOne): string
    {
        if (!$rmdTheOnlyOne) return '-';

        $counts = [
            'Visual'     => count(array_filter((array) ($rmdTheOnlyOne->visual_checklist ?? []))),
            'Auditori'   => count(array_filter((array) ($rmdTheOnlyOne->auditory_checklist ?? []))),
            'Kinestetik' => count(array_filter((array) ($rmdTheOnlyOne->kinesthetic_checklist ?? []))),
        ];

        $max = max($counts);
        if ($max === 0) return '-';

        return implode(' & ', array_keys(array_filter($counts, fn($v) => $v === $max)));
    }

    /**
     * Get detailed RMD progress for a specific participant.
     */
    public function getParticipantDetails(User $user)
    {
        // Ensure user is a participant
        if ($user->role !== 'participant') {
             return response()->json(['error' => 'User is not a participant'], 400);
        }

        // If current user is a mentor, only allow access to their assigned participants
        if (Auth::user()->isMentor() && $user->mentor_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $modules = RmdProgressService::getModules();
        $moduleDetails = [];
        $totalFilled = 0;
        $totalModules = count($modules);

        foreach ($modules as $moduleName => $modelClass) {
            $progress = RmdProgressService::calculateProgress($user, $moduleName, $modelClass);
            $moduleDetails[] = array_merge(['name' => $moduleName], $progress);
            
            if ($progress['percentage'] > 0) {
                $totalFilled++;
            }
        }
        
        // Calculate overall status
        $status = 'Belum Mulai';
        $percentage = 0;
        if ($totalFilled > 0) {
             if ($totalFilled == $totalModules) {
                 $status = 'Selesai';
                 $percentage = 100;
             } else {
                 $status = 'Sedang Mengisi';
                 $percentage = round(($totalFilled / $totalModules) * 100);
             }
        }

        $mentor = $user->mentor_id ? \App\Models\User::find($user->mentor_id) : null;

        return response()->json([
            'user' => [
                'id'                => $user->id,
                'name'              => $user->name,
                'id_number'         => $user->id_number,
                'age'               => $user->date_of_birth ? \Carbon\Carbon::parse($user->date_of_birth)->age : '-',
                'email'             => $user->email,
                'profile_photo_url' => $user->profile_photo_url ?? null,
                'mentor_name'       => $mentor?->name ?? null,
            ],
            'summary' => [
                'status' => $status,
                'percentage' => $percentage,
                'filled_modules' => $totalFilled,
                'total_modules' => $totalModules,
            ],
            'modules' => $moduleDetails
        ]);
    }
}
