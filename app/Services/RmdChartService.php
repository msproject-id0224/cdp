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
        // Total eligible participants (>= 12 years old) — used as the denominator for percentages
        $totalEligible = User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->count();

        $results = DB::table('rmd_career_exploration_p2_s')
            ->join('users', 'users.id', '=', 'rmd_career_exploration_p2_s.user_id')
            ->select(DB::raw('TRIM(rmd_career_exploration_p2_s.final_career_choice) as career, COUNT(*) as total'))
            ->whereNotNull('rmd_career_exploration_p2_s.final_career_choice')
            ->where('rmd_career_exploration_p2_s.final_career_choice', '!=', '')
            ->where('users.role', 'participant')
            ->whereNotNull('users.date_of_birth')
            ->where('users.date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->groupBy(DB::raw('TRIM(rmd_career_exploration_p2_s.final_career_choice)'))
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $labels     = [];
        $data       = [];
        $totalFilled = 0;

        foreach ($results as $row) {
            $labels[]     = $row->career;
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
                    'label'           => 'Final Career Choice',
                    'data'            => $data,
                    'backgroundColor' => array_slice($colors, 0, count($labels)),
                ]
            ],
            'total'          => $totalFilled,
            'total_eligible' => $totalEligible,
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
