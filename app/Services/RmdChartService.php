<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RmdChartService
{
    /**
     * Get age distribution data for all participants.
     * Categories: 12-14, 15-18, 19+
     *
     * @return array
     */
    public function getAgeDistributionAllParticipants()
    {
        // Only consider participants >= 12 years old as per general requirement
        $dobs = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->pluck('date_of_birth');
            
        $ranges = [
            '12-14 Years Old' => 0,
            '15-18 Years Old' => 0,
            '≥ 19 Years Old' => 0,
        ];

        // Total for calculation should be based on filtered result
        $total = $dobs->count();

        foreach ($dobs as $dob) {
            $age = \Carbon\Carbon::parse($dob)->age;

            if ($age >= 12 && $age <= 14) $ranges['12-14 Years Old']++;
            elseif ($age >= 15 && $age <= 18) $ranges['15-18 Years Old']++;
            else $ranges['≥ 19 Years Old']++;
        }

        // Add percentages to labels
        $rangesWithPercentage = [];
        foreach ($ranges as $key => $value) {
            $percentage = $total > 0 ? round(($value / $total) * 100, 1) : 0;
            $newKey = "{$key} ({$percentage}%)";
            $rangesWithPercentage[$newKey] = $value;
        }

        return $this->formatChartData($rangesWithPercentage, 'Age Distribution');
    }

    /**
     * Get participation rate (Filled RMD vs Not Filled) for participants >= 12 years old.
     *
     * @return array
     */
    public function getRmdParticipationRate()
    {
        // Filter participants by age >= 12
        $totalParticipants = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->count();
        
        // Get user IDs who have filled at least one RMD module
        $modules = RmdProgressService::getModules();
        $queries = [];
        
        foreach ($modules as $moduleName => $modelClass) {
            $model = new $modelClass;
            $tableName = $model->getTable();
            if (Schema::hasColumn($tableName, 'user_id')) {
                $queries[] = DB::table($tableName)->select('user_id');
            }
        }

        if (empty($queries)) {
            $filledCount = 0;
        } else {
            $unionQuery = $queries[0];
            for ($i = 1; $i < count($queries); $i++) {
                $unionQuery->union($queries[$i]);
            }
            
            // Count unique user_id in the union result that are also participants AND >= 12 years old
            $filledCount = DB::table('users')
                ->joinSub($unionQuery, 'active_rmd_users', function ($join) {
                    $join->on('users.id', '=', 'active_rmd_users.user_id');
                })
                ->where('role', 'participant')
                ->whereNotNull('date_of_birth')
                ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
                ->count();
        }

        $notFilledCount = max(0, $totalParticipants - $filledCount);

        return [
            'labels' => ['Filled', 'Not Filled'],
            'datasets' => [
                [
                    'label' => 'RMD Participation',
                    'data' => [$filledCount, $notFilledCount],
                    'backgroundColor' => ['#10b981', '#ef4444'], // Green, Red
                ]
            ],
            'total' => $totalParticipants
        ];
    }

    /**
     * Get distribution of filled modules count per participant (12+ years old).
     * Intervals: 0, 1-3, 4-6, 7-9 (Completed)
     *
     * @return array
     */
    public function getRmdFillingProgressDistribution()
    {
        $modules = RmdProgressService::getModules();
        $totalModules = count($modules); // Should be 9
        
        // We need to count how many modules each participant has filled.
        // This is complex. We can reuse the logic from getParticipantSummaryData but optimized.
        // Or we can count (user_id) from each table and sum them up per user.
        
        $selects = [];
        foreach ($modules as $moduleName => $modelClass) {
            $model = new $modelClass;
            $tableName = $model->getTable();
            if (Schema::hasColumn($tableName, 'user_id')) {
                // We just want to know if a user exists in this table
                $selects[] = "SELECT user_id, 1 as filled_count FROM {$tableName}";
            }
        }
        
        if (empty($selects)) {
             return $this->formatChartData([]);
        }

        $unionSql = implode(' UNION ALL ', $selects);
        
        // Count filled modules per user
        $filledCounts = DB::table(DB::raw("({$unionSql}) as all_fills"))
            ->select('user_id', DB::raw('count(*) as total_filled'))
            ->groupBy('user_id')
            ->pluck('total_filled', 'user_id');
            
        // Get all participants >= 12 years old to include those with 0 filled
        $participantIds = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->pluck('id');
        
        $ranges = [
            '0 Modules' => 0,
            '1-3 Modules' => 0,
            '4-6 Modules' => 0,
            '7-9 Modules' => 0, // Assuming 9 is max
        ];

        // If max modules > 9, adjust label
        if ($totalModules > 9) {
             $ranges['> 9 Modules'] = 0;
        }

        foreach ($participantIds as $id) {
            $count = $filledCounts->get($id, 0);

            if ($count == 0) $ranges['0 Modules']++;
            elseif ($count >= 1 && $count <= 3) $ranges['1-3 Modules']++;
            elseif ($count >= 4 && $count <= 6) $ranges['4-6 Modules']++;
            elseif ($count >= 7 && $count <= 9) $ranges['7-9 Modules']++;
            else {
                if (isset($ranges['> 9 Modules'])) $ranges['> 9 Modules']++;
                else $ranges['7-9 Modules']++; // Fallback
            }
        }

        return $this->formatChartData($ranges, 'Module Completion Progress');
    }

    /**
     * Get distribution of final career choices from RmdCareerExplorationP2.
     * Returns the top 10 most common final career choices.
     *
     * @return array
     */
    public function getFinalCareerChoiceDistribution()
    {
        return $this->getTopValueDistribution('rmd_career_exploration_p2_s', 'final_career_choice', 'Final Career Choice');
    }

    /**
     * Get the top-10 most common "favorite subject" answers from The Only One.
     *
     * @return array
     */
    public function getFavoriteSubjectDistribution()
    {
        return $this->getTopValueDistribution('rmd_the_only_ones', 'favorite_subject', 'Mapel Favorit');
    }

    /**
     * Get the top-10 most common "least favorite subject" answers from The Only One.
     *
     * @return array
     */
    public function getLeastFavoriteSubjectDistribution()
    {
        return $this->getTopValueDistribution('rmd_the_only_ones', 'least_favorite_subject', 'Mapel Tidak Favorit');
    }

    /**
     * Get the number of participants (12+, eligible) who have a filled row in each of the
     * 9 RMD modules — a funnel showing exactly where in the 9-step flow participants drop off,
     * as opposed to getRmdFillingProgressDistribution() which buckets by total modules filled.
     *
     * @return array
     */
    public function getModuleCompletionFunnel()
    {
        $modules = RmdProgressService::getModules();

        $labels = [];
        $data   = [];

        foreach ($modules as $moduleName => $modelClass) {
            $model     = new $modelClass;
            $tableName = $model->getTable();

            $count = 0;
            if (Schema::hasColumn($tableName, 'user_id')) {
                $count = DB::table($tableName)
                    ->join('users', 'users.id', '=', "{$tableName}.user_id")
                    ->where('users.role', 'participant')
                    ->whereNotNull('users.date_of_birth')
                    ->where('users.date_of_birth', '<=', now()->subYears(12)->toDateString())
                    ->count();
            }

            $labels[] = $moduleName;
            $data[]   = $count;
        }

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Peserta Menyelesaikan Modul',
                    'data'            => $data,
                    'backgroundColor' => '#6366f1',
                ]
            ],
            'total_eligible' => User::where('role', 'participant')
                ->whereNotNull('date_of_birth')
                ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
                ->count(),
        ];
    }

    /**
     * Get how many participants considered each factor (gaya belajar, kecerdasan, prestasi
     * akademik, dukungan orang tua, kehendak Allah) when choosing a career (RmdCareerExploration).
     *
     * @return array
     */
    public function getCareerConsiderationFactors()
    {
        [$labels, $data, $total] = $this->getBooleanFieldCounts('rmdCareerExploration', [
            'consider_learning_style'       => 'Gaya Belajar',
            'consider_intelligence'         => 'Kecerdasan Majemuk',
            'consider_academic_achievement' => 'Prestasi Akademik',
            'consider_parental_support'     => 'Dukungan Orang Tua',
            'consider_gods_will'            => 'Kehendak Allah',
        ]);

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Peserta yang Mempertimbangkan',
                    'data'            => $data,
                    'backgroundColor' => '#10b981',
                ]
            ],
            'total' => $total,
        ];
    }

    /**
     * Get distribution of each participant's single dominant (#1) intelligence category,
     * based on true 1-5 weighted score sums. Complements getKecerdasanMajemukAverageScore(),
     * which shows the cohort average per category rather than who "wins" per participant.
     *
     * @return array
     */
    public function getTopIntelligenceDistribution()
    {
        $categories = [
            'linguistic_checklist'           => 'Linguistik',
            'logical_mathematical_checklist' => 'Logis-Matematis',
            'visual_spatial_checklist'       => 'Visual-Spasial',
            'kinesthetic_checklist'          => 'Kinestetik',
            'musical_checklist'              => 'Musikal',
            'interpersonal_checklist'        => 'Interpersonal',
            'intrapersonal_checklist'        => 'Intrapersonal',
            'naturalist_checklist'           => 'Naturalis',
            'existential_checklist'          => 'Eksistensial',
        ];

        $records = User::query()
            ->where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereHas('rmdMultipleIntelligence')
            ->with(['rmdMultipleIntelligence:user_id,' . implode(',', array_keys($categories))])
            ->get()
            ->pluck('rmdMultipleIntelligence');

        $ranges = array_fill_keys(array_values($categories), 0);

        foreach ($records as $record) {
            $scores = [];
            foreach ($categories as $field => $label) {
                $scores[$label] = array_sum(array_map('intval', (array) ($record->$field ?? [])));
            }

            $max = max($scores);
            if ($max === 0) continue;

            foreach ($scores as $label => $score) {
                if ($score === $max) $ranges[$label]++;
            }
        }

        return $this->formatChartData($ranges, 'Kecerdasan Dominan');
    }

    /**
     * Get how many participants checked each leadership trait in Refleksi Alkitab.
     *
     * @return array
     */
    public function getLeadershipTraitsDistribution()
    {
        [$labels, $data, $total] = $this->getBooleanFieldCounts('rmdBibleReflection', [
            'leadership_c1' => 'Poin 1',
            'leadership_c2' => 'Poin 2',
            'leadership_c3' => 'Poin 3',
            'leadership_c4' => 'Poin 4',
            'leadership_c5' => 'Poin 5',
        ]);

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Peserta yang Mencentang',
                    'data'            => $data,
                    'backgroundColor' => '#3b82f6',
                ]
            ],
            'total' => $total,
        ];
    }

    /**
     * Get how many participants checked each self-reflection checkpoint in Sosial Emosional
     * (chapter3_check1-4) and Eksplorasi Karir P2 (chapter4_check1-3), combined into one chart.
     *
     * @return array
     */
    public function getReflectionCheckpointsDistribution()
    {
        [$labelsA, $dataA, $totalA] = $this->getBooleanFieldCounts('rmdSocioEmotional', [
            'chapter3_check1' => 'Sosial Emosional – Cek 1',
            'chapter3_check2' => 'Sosial Emosional – Cek 2',
            'chapter3_check3' => 'Sosial Emosional – Cek 3',
            'chapter3_check4' => 'Sosial Emosional – Cek 4',
        ]);

        [$labelsB, $dataB, $totalB] = $this->getBooleanFieldCounts('rmdCareerExplorationP2', [
            'chapter4_check1' => 'Eksplorasi Karir P2 – Cek 1',
            'chapter4_check2' => 'Eksplorasi Karir P2 – Cek 2',
            'chapter4_check3' => 'Eksplorasi Karir P2 – Cek 3',
        ]);

        return [
            'labels'   => array_merge($labelsA, $labelsB),
            'datasets' => [
                [
                    'label'           => 'Peserta yang Mencentang',
                    'data'            => array_merge($dataA, $dataB),
                    'backgroundColor' => '#f59e0b',
                ]
            ],
            'total' => max($totalA, $totalB),
        ];
    }

    /**
     * Get the number of RMD module submissions (across all 9 tables) per month, for the
     * last 6 months — the only time-series view in the report, useful for spotting
     * engagement trends (e.g. spikes after mentoring sessions).
     *
     * @return array
     */
    public function getSubmissionTrend()
    {
        $modules   = RmdProgressService::getModules();
        $monthKeys = collect(range(5, 0))->map(fn ($i) => now()->subMonths($i)->format('Y-m'))->values();
        $counts    = array_fill_keys($monthKeys->toArray(), 0);
        $startDate = now()->subMonths(5)->startOfMonth();

        foreach ($modules as $moduleName => $modelClass) {
            $model     = new $modelClass;
            $tableName = $model->getTable();

            $rows = DB::table($tableName)
                ->join('users', 'users.id', '=', "{$tableName}.user_id")
                ->where('users.role', 'participant')
                ->where("{$tableName}.created_at", '>=', $startDate)
                ->selectRaw("DATE_FORMAT({$tableName}.created_at, '%Y-%m') as ym, COUNT(*) as total")
                ->groupBy('ym')
                ->pluck('total', 'ym');

            foreach ($rows as $ym => $total) {
                if (isset($counts[$ym])) $counts[$ym] += $total;
            }
        }

        $labels = array_map(
            fn ($ym) => \Carbon\Carbon::createFromFormat('Y-m', $ym)->translatedFormat('M Y'),
            array_keys($counts)
        );

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Jumlah Pengisian Modul',
                    'data'            => array_values($counts),
                    'borderColor'     => '#6366f1',
                    'backgroundColor' => 'rgba(99, 102, 241, 0.2)',
                    'fill'            => true,
                    'tension'         => 0.3,
                ]
            ],
            'total' => array_sum($counts),
        ];
    }

    /**
     * Get the average RMD completion percentage of each mentor's assigned participants,
     * sorted descending — lets admins compare mentoring effectiveness across mentors.
     *
     * @return array
     */
    public function getMentorProgressComparison()
    {
        $modules      = RmdProgressService::getModules();
        $totalModules = count($modules);

        $moduleQueries = [];
        foreach ($modules as $moduleName => $modelClass) {
            $model     = new $modelClass;
            $tableName = $model->getTable();
            if (Schema::hasColumn($tableName, 'user_id')) {
                $moduleQueries[] = "SELECT user_id FROM {$tableName}";
            }
        }

        $filledCounts = collect();
        if (!empty($moduleQueries)) {
            $unionSql     = implode(' UNION ALL ', $moduleQueries);
            $filledCounts = DB::table(DB::raw("({$unionSql}) as all_fills"))
                ->select('user_id', DB::raw('count(*) as total_filled'))
                ->groupBy('user_id')
                ->pluck('total_filled', 'user_id');
        }

        $participants = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereNotNull('mentor_id')
            ->get(['id', 'mentor_id']);

        // 'name' is a computed accessor (first_name + last_name), not a DB column — must load models.
        $mentorNames = User::where('role', 'mentor')->get(['id', 'first_name', 'last_name'])->pluck('name', 'id');

        $percentagesByMentor = [];
        foreach ($participants as $participant) {
            $pct = round(($filledCounts->get($participant->id, 0) / $totalModules) * 100);
            $percentagesByMentor[$participant->mentor_id][] = $pct;
        }

        $labels = [];
        $data   = [];
        foreach ($percentagesByMentor as $mentorId => $percentages) {
            $labels[] = $mentorNames->get($mentorId, "Mentor #{$mentorId}");
            $data[]   = round(array_sum($percentages) / count($percentages), 1);
        }

        array_multisort($data, SORT_DESC, $labels);

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Rata-rata Progres Peserta (%)',
                    'data'            => $data,
                    'backgroundColor' => '#8b5cf6',
                ]
            ],
            'total' => $participants->count(),
        ];
    }

    /**
     * Get distribution of dominant learning style (Visual/Auditori/Kinestetik) based on
     * the true 1-5 weighted checklist score sums (not just non-empty entry counts).
     * Participants tied for the highest score are counted in each tied category.
     *
     * @return array
     */
    public function getGayaBelajarDistribution()
    {
        $records = User::query()
            ->where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereHas('rmdTheOnlyOne')
            ->with('rmdTheOnlyOne:user_id,visual_checklist,auditory_checklist,kinesthetic_checklist')
            ->get()
            ->pluck('rmdTheOnlyOne');

        $ranges = [
            'Visual'     => 0,
            'Auditori'   => 0,
            'Kinestetik' => 0,
        ];

        foreach ($records as $record) {
            $visual      = array_sum(array_map('intval', (array) ($record->visual_checklist ?? [])));
            $auditory    = array_sum(array_map('intval', (array) ($record->auditory_checklist ?? [])));
            $kinesthetic = array_sum(array_map('intval', (array) ($record->kinesthetic_checklist ?? [])));

            $max = max($visual, $auditory, $kinesthetic);
            if ($max === 0) continue;

            if ($visual === $max) $ranges['Visual']++;
            if ($auditory === $max) $ranges['Auditori']++;
            if ($kinesthetic === $max) $ranges['Kinestetik']++;
        }

        return $this->formatChartData($ranges, 'Gaya Belajar');
    }

    /**
     * Get the average multiple-intelligence score (max 50 per category) across all
     * participants who have filled the Kecerdasan Majemuk module.
     *
     * @return array
     */
    public function getKecerdasanMajemukAverageScore()
    {
        $categories = [
            'linguistic_checklist'           => 'Linguistik',
            'logical_mathematical_checklist' => 'Logis-Matematis',
            'visual_spatial_checklist'       => 'Visual-Spasial',
            'kinesthetic_checklist'          => 'Kinestetik',
            'musical_checklist'              => 'Musikal',
            'interpersonal_checklist'        => 'Interpersonal',
            'intrapersonal_checklist'        => 'Intrapersonal',
            'naturalist_checklist'           => 'Naturalis',
            'existential_checklist'          => 'Eksistensial',
        ];

        $records = User::query()
            ->where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereHas('rmdMultipleIntelligence')
            ->with(['rmdMultipleIntelligence:user_id,' . implode(',', array_keys($categories))])
            ->get()
            ->pluck('rmdMultipleIntelligence');

        $labels = [];
        $data   = [];

        foreach ($categories as $field => $label) {
            $sums = $records
                ->map(fn ($record) => array_sum(array_map('intval', (array) ($record->$field ?? []))))
                ->filter(fn ($sum) => $sum > 0);

            $labels[] = $label;
            $data[]   = $sums->count() > 0 ? round($sums->avg(), 1) : 0;
        }

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => 'Rata-rata Skor Kecerdasan Majemuk',
                    'data'            => $data,
                    'backgroundColor' => '#6366f1',
                ]
            ],
            'total' => $records->count(),
        ];
    }

    /**
     * Get distribution of academic achievement (highest_score_value from The Only One)
     * bucketed into grade bands.
     *
     * @return array
     */
    public function getPrestasiAkademikDistribution()
    {
        $values = User::query()
            ->where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereHas('rmdTheOnlyOne', function ($q) {
                $q->whereNotNull('highest_score_value')->where('highest_score_value', '!=', '');
            })
            ->with('rmdTheOnlyOne:user_id,highest_score_value')
            ->get()
            ->pluck('rmdTheOnlyOne.highest_score_value');

        $ranges = [
            '< 70'   => 0,
            '70-79'  => 0,
            '80-89'  => 0,
            '90-100' => 0,
        ];

        foreach ($values as $value) {
            $score = (float) $value;
            if ($score < 70) $ranges['< 70']++;
            elseif ($score < 80) $ranges['70-79']++;
            elseif ($score < 90) $ranges['80-89']++;
            else $ranges['90-100']++;
        }

        return $this->formatChartData($ranges, 'Prestasi Akademik (Nilai Tertinggi)');
    }

    /**
     * Get the top-N most common values of a free-text column on an RMD table, restricted to
     * eligible participants (role=participant, 12+ years old). Shared by
     * getFinalCareerChoiceDistribution(), getFavoriteSubjectDistribution() and
     * getLeastFavoriteSubjectDistribution() — $table/$column are always hardcoded call-site
     * literals, never user input.
     *
     * @param string $table
     * @param string $column
     * @param string $label
     * @param int $limit
     * @return array
     */
    private function getTopValueDistribution(string $table, string $column, string $label, int $limit = 10)
    {
        $totalEligible = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->count();

        $results = DB::table($table)
            ->join('users', 'users.id', '=', "{$table}.user_id")
            ->select(DB::raw("TRIM({$table}.{$column}) as val"), DB::raw('COUNT(*) as total'))
            ->whereNotNull("{$table}.{$column}")
            ->where("{$table}.{$column}", '!=', '')
            ->where('users.role', 'participant')
            ->whereNotNull('users.date_of_birth')
            ->where('users.date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->groupBy(DB::raw("TRIM({$table}.{$column})"))
            ->orderByDesc('total')
            ->limit($limit)
            ->get();

        $labels      = [];
        $data        = [];
        $totalFilled = 0;

        foreach ($results as $row) {
            $labels[]     = $row->val;
            $data[]       = (int) $row->total;
            $totalFilled += (int) $row->total;
        }

        $colors = [
            '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
            '#10b981', '#14b8a6', '#3b82f6', '#f59e0b', '#84cc16',
        ];

        return [
            'labels'   => $labels,
            'datasets' => [
                [
                    'label'           => $label,
                    'data'            => $data,
                    'backgroundColor' => array_slice($colors, 0, count($labels)),
                ]
            ],
            'total'          => $totalFilled,
            'total_eligible' => $totalEligible,
        ];
    }

    /**
     * Count how many eligible participants (12+, role=participant) have each boolean field
     * (keyed by field name) set to true, for a given User hasOne relation. Shared by
     * getCareerConsiderationFactors(), getLeadershipTraitsDistribution() and
     * getReflectionCheckpointsDistribution().
     *
     * @param string $relation
     * @param array<string,string> $fieldsWithLabels
     * @return array{0: array<int,string>, 1: array<int,int>, 2: int}
     */
    private function getBooleanFieldCounts(string $relation, array $fieldsWithLabels): array
    {
        $records = User::query()
            ->where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->whereHas($relation)
            ->with(["{$relation}:user_id," . implode(',', array_keys($fieldsWithLabels))])
            ->get()
            ->pluck($relation);

        $labels = [];
        $data   = [];

        foreach ($fieldsWithLabels as $field => $label) {
            $labels[] = $label;
            $data[]   = $records->filter(fn ($record) => (bool) ($record->$field ?? false))->count();
        }

        return [$labels, $data, $records->count()];
    }

    /**
     * Format the data for Chart.js and include total count.
     *
     * @param array $ranges
     * @param string $label
     * @return array
     */
    private function formatChartData(array $ranges, $label = 'Number of Participants')
    {
        $dataValues = !empty($ranges) ? array_values($ranges) : [];
        $totalParticipants = array_sum($dataValues);

        return [
            'labels' => !empty($ranges) ? array_keys($ranges) : [],
            'datasets' => [
                [
                    'label' => $label,
                    'data' => $dataValues,
                    'backgroundColor' => ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'],
                ]
            ],
            'total' => $totalParticipants
        ];
    }
}
