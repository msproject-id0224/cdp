<?php

namespace App\Services;

use App\Models\RmdProfile;
use App\Models\RmdBibleReflection;
use App\Models\RmdTrueSuccess;
use App\Models\RmdTheOnlyOne;
use App\Models\RmdMultipleIntelligence;
use App\Models\RmdSocioEmotional;
use App\Models\RmdCareerExploration;
use App\Models\RmdCareerExplorationP2;
use App\Models\RmdPreparationDreamIsland;
use Illuminate\Database\Eloquent\Model;

class RmdProgressService
{
    public static function getModules()
    {
        return [
            'Profil RMD' => RmdProfile::class,
            'Refleksi Alkitab' => RmdBibleReflection::class,
            'Sukses Sejati' => RmdTrueSuccess::class,
            'The Only One' => RmdTheOnlyOne::class,
            'Kecerdasan Majemuk' => RmdMultipleIntelligence::class,
            'Sosial Emosional' => RmdSocioEmotional::class,
            'Eksplorasi Karir' => RmdCareerExploration::class,
            'Eksplorasi Karir P2' => RmdCareerExplorationP2::class,
            'Persiapan Pulau Impian' => RmdPreparationDreamIsland::class,
        ];
    }

    /**
     * Per-module section definitions for granular progress tracking.
     * Each section lists the DB field names that belong to it.
     */
    public static function getModuleSections()
    {
        return [
            'Refleksi Alkitab' => [
                ['label' => 'Yeremia 29:11',      'fields' => ['jeremiah_29_11_who_knows', 'jeremiah_29_11_plans']],
                ['label' => 'Efesus 2:10',         'fields' => ['ephesians_2_10_made_by', 'ephesians_2_10_purpose', 'ephesians_2_10_god_wants']],
                ['label' => 'Kejadian 1:26-28',    'fields' => ['genesis_1_26_28_image', 'genesis_1_26_28_purpose']],
                ['label' => 'Ringkasan',            'fields' => ['summary_point_1', 'summary_point_2']],
                ['label' => 'Ayat Favorit',        'fields' => ['favorite_verse', 'reason_favorite_verse']],
                ['label' => 'Kepemimpinan',        'fields' => ['leadership_c1', 'leadership_c2', 'leadership_c3', 'leadership_c4', 'leadership_c5']],
                ['label' => 'Refleksi Bab',        'fields' => ['chapter_learning_text']],
            ],
            'Sukses Sejati' => [
                ['label' => 'Definisi Sukses',    'fields' => ['successful_life_definition', 'general_success_measure']],
                ['label' => 'Apa Kata Alkitab',   'fields' => ['luke_2_52_growth', 'philippians_2_5_10_actions', 'jesus_success_vs_society', 'god_opinion_on_jesus']],
                ['label' => 'Refleksi',            'fields' => ['new_learning_text']],
            ],
            'The Only One' => [
                ['label' => 'Keunikan Diri',       'fields' => ['unique_traits', 'current_education_level', 'favorite_subject', 'favorite_subject_reason', 'least_favorite_subject', 'least_favorite_subject_reason', 'highest_score_subject', 'highest_score_value', 'lowest_score_subject', 'lowest_score_value']],
                ['label' => 'Gaya Belajar Visual', 'fields' => ['visual_checklist']],
                ['label' => 'Gaya Belajar Auditori','fields' => ['auditory_checklist']],
                ['label' => 'Gaya Belajar Kinestetik','fields' => ['kinesthetic_checklist']],
                ['label' => 'Refleksi',            'fields' => ['learned_aspects', 'aspects_to_improve']],
            ],
            'Kecerdasan Majemuk' => [
                ['label' => 'Kecerdasan Linguistik',      'fields' => ['linguistic_checklist']],
                ['label' => 'Kecerdasan Logis-Matematis', 'fields' => ['logical_mathematical_checklist']],
                ['label' => 'Kecerdasan Visual-Spasial',  'fields' => ['visual_spatial_checklist']],
                ['label' => 'Kecerdasan Kinestetik',      'fields' => ['kinesthetic_checklist']],
                ['label' => 'Kecerdasan Musikal',         'fields' => ['musical_checklist']],
                ['label' => 'Kecerdasan Interpersonal',   'fields' => ['interpersonal_checklist']],
                ['label' => 'Kecerdasan Intrapersonal',   'fields' => ['intrapersonal_checklist']],
                ['label' => 'Kecerdasan Naturalis',       'fields' => ['naturalist_checklist']],
                ['label' => 'Kecerdasan Eksistensial',    'fields' => ['existential_checklist']],
                ['label' => 'Refleksi',                   'fields' => ['reflection_new_learning', 'reflection_plan']],
            ],
            'Sosial Emosional' => [
                ['label' => 'Gaya Belajar',       'fields' => ['learning_style_practice', 'learning_style_impact']],
                ['label' => 'Keluarga',            'fields' => ['birth_order_siblings', 'parents_occupation', 'home_responsibilities', 'family_uniqueness']],
                ['label' => 'Aktivitas',           'fields' => ['extracurricular_activities', 'ppa_activities', 'hobbies']],
                ['label' => 'Kekuatan & Kelemahan','fields' => ['strengths', 'weaknesses', 'reflection_learned', 'reflection_improvement']],
                ['label' => 'Fisik',               'fields' => ['height', 'weight', 'physical_traits', 'favorite_sports', 'sports_achievements', 'eating_habits', 'sleeping_habits', 'health_issues', 'physical_likes', 'physical_development_goal']],
                ['label' => 'Spiritual',           'fields' => ['spiritual_knowledge_jesus', 'spiritual_relationship_growth', 'spiritual_love_obedience', 'spiritual_community', 'spiritual_bible_study', 'spiritual_mentor', 'spiritual_reflection_learned', 'spiritual_reflection_improvement']],
            ],
            'Eksplorasi Karir' => [
                ['label' => 'Profesi Gaya Belajar',         'fields' => ['visual_professions', 'auditory_professions', 'kinesthetic_professions_style', 'interested_professions_from_style']],
                ['label' => 'Kecerdasan Majemuk & Profesi', 'fields' => ['linguistic_ability', 'linguistic_professions', 'logical_math_ability', 'logical_math_professions', 'visual_spatial_ability', 'visual_spatial_professions', 'kinesthetic_ability', 'kinesthetic_professions', 'musical_ability', 'musical_professions', 'interpersonal_ability', 'interpersonal_professions', 'intrapersonal_ability', 'intrapersonal_professions', 'naturalist_ability', 'naturalist_professions']],
                ['label' => 'Pertimbangan Karir',           'fields' => ['additional_considerations', 'career_decision_matrix']],
            ],
            'Eksplorasi Karir P2' => [
                ['label' => 'Pilihan Karir',    'fields' => ['final_career_choice', 'final_career_reason']],
                ['label' => 'Analisis SWOT',    'fields' => ['swot_definition', 'swot_analysis_data']],
                ['label' => 'Catatan Mentoring','fields' => ['mentoring_notes']],
            ],
            'Persiapan Pulau Impian' => [
                ['label' => 'Pertanyaan Profesi', 'fields' => ['profession_questions']],
                ['label' => 'Analisis SWOT',      'fields' => ['swot_analysis']],
                ['label' => 'Rencana Perbaikan',  'fields' => ['improvement_plan']],
            ],
        ];
    }

    public static function calculateProgress($user, $moduleName, $modelClass)
    {
        $record = $modelClass::where('user_id', $user->id)->first();

        if (!$record) {
            return [
                'status' => 'Belum Mengisi',
                'percentage' => 0,
                'last_updated' => null,
                'filled_at' => null,
                'sections' => [],
            ];
        }

        $allSections = self::getModuleSections();
        $sections    = [];
        $totalFields = 0;
        $filledFields = 0;

        if (isset($allSections[$moduleName])) {
            // Use only the fields defined in sections so DB-only columns
            // that have no form input are not counted against progress.
            foreach ($allSections[$moduleName] as $section) {
                $sectionFilled = 0;
                $sectionTotal  = count($section['fields']);

                foreach ($section['fields'] as $field) {
                    $value = $record->getAttribute($field);
                    $totalFields++;
                    if (!empty($value)) {
                        $filledFields++;
                        $sectionFilled++;
                    }
                }

                $sectionPct = $sectionTotal > 0 ? round(($sectionFilled / $sectionTotal) * 100) : 0;

                $sections[] = [
                    'label'      => $section['label'],
                    'filled'     => $sectionFilled,
                    'total'      => $sectionTotal,
                    'percentage' => $sectionPct,
                ];
            }
        } else {
            // No section definition: fall back to counting all DB attributes.
            $attributes = $record->getAttributes();
            $excluded   = ['id', 'user_id', 'created_at', 'updated_at', 'deleted_at'];

            foreach ($attributes as $key => $value) {
                if (in_array($key, $excluded)) continue;
                $totalFields++;
                if (!empty($value)) {
                    $filledFields++;
                }
            }
        }

        $percentage = $totalFields > 0 ? round(($filledFields / $totalFields) * 100) : 0;

        $status = 'Sedang Mengisi';
        if ($percentage == 100) {
            $status = 'Selesai Mengisi';
        } elseif ($percentage == 0) {
            $status = 'Belum Mengisi';
        }

        return [
            'status'       => $status,
            'percentage'   => $percentage,
            'last_updated' => $record->updated_at,
            'filled_at'    => $record->created_at,
            'sections'     => $sections,
        ];
    }
}
