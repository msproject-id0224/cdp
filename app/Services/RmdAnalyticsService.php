<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class RmdAnalyticsService
{
    /**
     * Get detailed analytics data for all participants >= 12 years old.
     * Includes module-level details.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAnalyticsData()
    {
        $modules = RmdProgressService::getModules();
        $relations = [];
        
        // Map module classes to relationship names
        // Assuming conventions used in RmdReportController
        // 'Profil RMD' -> RmdProfile::class -> rmdProfile
        
        $moduleMap = [
            'Profil RMD' => 'rmdProfile',
            'Refleksi Alkitab' => 'rmdBibleReflection',
            'Sukses Sejati' => 'rmdTrueSuccess',
            'The Only One' => 'rmdTheOnlyOne',
            'Kecerdasan Majemuk' => 'rmdMultipleIntelligence',
            'Sosial Emosional' => 'rmdSocioEmotional',
            'Eksplorasi Karir' => 'rmdCareerExploration',
            'Eksplorasi Karir P2' => 'rmdCareerExplorationP2',
            'Persiapan Pulau Impian' => 'rmdPreparationDreamIsland',
        ];

        foreach ($moduleMap as $relation) {
            $relations[] = $relation;
        }

        // Fetch participants >= 12 years old with all module relations
        return User::where('role', 'participant')
            ->whereNotNull('date_of_birth')
            ->where('date_of_birth', '<=', now()->subYears(12)->toDateString())
            ->with($relations)
            ->get()
            ->map(function ($user) use ($moduleMap) {
                $userAge = \Carbon\Carbon::parse($user->date_of_birth)->age;
                
                // Determine Age Category
                $ageCategory = '≥ 19 Tahun';
                if ($userAge >= 12 && $userAge <= 14) $ageCategory = '12-14 Tahun';
                elseif ($userAge >= 15 && $userAge <= 18) $ageCategory = '15-18 Tahun';
                
                $filledModulesCount = 0;
                $moduleDetails = [];

                foreach ($moduleMap as $relation) {
                    $record = $user->$relation;
                    
                    if ($record) {
                        $filledModulesCount++;
                        // Simple progress calculation based on existence for analytics overview
                        // We replicate logic from RmdProgressService locally to avoid static call overhead
                        
                        $attributes = $record->getAttributes();
                        $excluded = ['id', 'user_id', 'created_at', 'updated_at', 'deleted_at'];
                        $totalFields = 0;
                        $filledFields = 0;
                        foreach ($attributes as $key => $value) {
                            if (in_array($key, $excluded)) continue;
                            $totalFields++;
                            if (!empty($value)) $filledFields++;
                        }
                        
                        $percentage = $totalFields > 0 ? round(($filledFields / $totalFields) * 100) : 0;
                        $status = 'Sedang Mengisi';
                        if ($percentage == 100) $status = 'Selesai';
                        
                        $moduleDetails[$relation] = [
                            'status' => $status,
                            'percentage' => $percentage,
                            'last_updated' => $record->updated_at ? $record->updated_at->format('Y-m-d H:i') : '-',
                        ];
                    } else {
                        $moduleDetails[$relation] = [
                            'status' => 'Belum Mengisi',
                            'percentage' => 0,
                            'last_updated' => '-',
                        ];
                    }
                }

                // Progress Category
                $progressCategory = '0 Modul';
                if ($filledModulesCount >= 1 && $filledModulesCount <= 3) $progressCategory = '1-3 Modul';
                elseif ($filledModulesCount >= 4 && $filledModulesCount <= 6) $progressCategory = '4-6 Modul';
                elseif ($filledModulesCount >= 7 && $filledModulesCount <= 9) $progressCategory = '7-9 Modul';
                elseif ($filledModulesCount > 9) $progressCategory = '> 9 Modul';

                return (object) [ // Return as object for easier access
                    'id' => $user->id,
                    'name' => $user->name,
                    'id_number' => $user->id_number,
                    'age' => \Carbon\Carbon::parse($user->date_of_birth)->age,
                    'age_category' => $ageCategory,
                    'filled_modules_count' => $filledModulesCount,
                    'progress_category' => $progressCategory,
                    'modules' => $moduleDetails,
                ];
            });
    }
}
