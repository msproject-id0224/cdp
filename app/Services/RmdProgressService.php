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
            'Profil RMD'             => RmdProfile::class,
            'Refleksi Alkitab'       => RmdBibleReflection::class,
            'Sukses Sejati'          => RmdTrueSuccess::class,
            'The Only One'           => RmdTheOnlyOne::class,
            'Kecerdasan Majemuk'     => RmdMultipleIntelligence::class,
            'Sosial Emosional'       => RmdSocioEmotional::class,
            'Eksplorasi Karir'       => RmdCareerExploration::class,
            'Eksplorasi Karir P2'    => RmdCareerExplorationP2::class,
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
            'Profil RMD' => [
                ['label' => 'Data Profil', 'fields' => [
                    'graduation_plan_date', 'first_filled_at', 'first_filled_age',
                    'first_filled_education', 'first_filled_education_institution',
                ]],
            ],
            'Refleksi Alkitab' => [
                ['label' => 'Yeremia 29:11',       'fields' => ['jeremiah_29_11_who_knows', 'jeremiah_29_11_plans']],
                ['label' => 'Efesus 2:10',          'fields' => ['ephesians_2_10_made_by', 'ephesians_2_10_purpose', 'ephesians_2_10_god_wants']],
                ['label' => 'Kejadian 1:26-28',     'fields' => ['genesis_1_26_28_image', 'genesis_1_26_28_purpose']],
                ['label' => 'Ringkasan',             'fields' => ['summary_point_1', 'summary_point_2']],
                ['label' => 'Ayat Favorit',         'fields' => ['favorite_verse', 'reason_favorite_verse']],
                ['label' => 'Kepemimpinan',         'fields' => ['leadership_c1', 'leadership_c2', 'leadership_c3', 'leadership_c4', 'leadership_c5']],
                ['label' => 'Refleksi Bab',         'fields' => ['chapter_learning_text']],
            ],
            'Sukses Sejati' => [
                ['label' => 'Definisi Sukses',     'fields' => ['successful_life_definition', 'general_success_measure']],
                ['label' => 'Apa Kata Alkitab',    'fields' => ['luke_2_52_growth', 'philippians_2_5_10_actions', 'jesus_success_vs_society', 'god_opinion_on_jesus']],
                ['label' => 'Refleksi',             'fields' => ['new_learning_text', 'new_learning_image_path']],
            ],
            'The Only One' => [
                ['label' => 'Keunikan Diri',        'fields' => ['unique_traits', 'current_education_level', 'favorite_subject', 'favorite_subject_reason', 'least_favorite_subject', 'least_favorite_subject_reason', 'highest_score_subject', 'highest_score_value', 'lowest_score_subject', 'lowest_score_value']],
                ['label' => 'Gaya Belajar Visual',  'fields' => ['visual_checklist']],
                ['label' => 'Gaya Belajar Auditori','fields' => ['auditory_checklist']],
                ['label' => 'Gaya Belajar Kinestetik','fields' => ['kinesthetic_checklist']],
                ['label' => 'Refleksi',             'fields' => ['learned_aspects', 'aspects_to_improve']],
            ],
            'Kecerdasan Majemuk' => [
                ['label' => 'Kecerdasan Linguistik',       'fields' => ['linguistic_checklist']],
                ['label' => 'Kecerdasan Logis-Matematis',  'fields' => ['logical_mathematical_checklist']],
                ['label' => 'Kecerdasan Visual-Spasial',   'fields' => ['visual_spatial_checklist']],
                ['label' => 'Kecerdasan Kinestetik',       'fields' => ['kinesthetic_checklist']],
                ['label' => 'Kecerdasan Musikal',          'fields' => ['musical_checklist']],
                ['label' => 'Kecerdasan Interpersonal',    'fields' => ['interpersonal_checklist']],
                ['label' => 'Kecerdasan Intrapersonal',    'fields' => ['intrapersonal_checklist']],
                ['label' => 'Kecerdasan Naturalis',        'fields' => ['naturalist_checklist']],
                ['label' => 'Kecerdasan Eksistensial',     'fields' => ['existential_checklist']],
                ['label' => 'Refleksi',                    'fields' => ['reflection_new_learning', 'reflection_plan']],
            ],
            'Sosial Emosional' => [
                ['label' => 'Gaya Belajar',        'fields' => ['learning_style_practice', 'learning_style_impact']],
                ['label' => 'Keluarga',             'fields' => ['birth_order_siblings', 'parents_occupation', 'home_responsibilities', 'family_uniqueness']],
                ['label' => 'Aktivitas',            'fields' => ['extracurricular_activities', 'ppa_activities', 'hobbies']],
                ['label' => 'Kekuatan & Kelemahan', 'fields' => ['strengths', 'weaknesses', 'reflection_learned', 'reflection_improvement']],
                ['label' => 'Fisik',                'fields' => ['height', 'weight', 'physical_traits', 'favorite_sports', 'sports_achievements', 'eating_habits', 'sleeping_habits', 'health_issues', 'physical_likes', 'physical_development_goal']],
                ['label' => 'Spiritual',            'fields' => ['spiritual_knowledge_jesus', 'spiritual_relationship_growth', 'spiritual_love_obedience', 'spiritual_community', 'spiritual_bible_study', 'spiritual_mentor', 'spiritual_reflection_learned', 'spiritual_reflection_improvement']],
            ],
            'Eksplorasi Karir' => [
                ['label' => 'Profesi dari Gaya Belajar',         'fields' => ['visual_professions', 'auditory_professions', 'kinesthetic_professions_style', 'interested_professions_from_style']],
                ['label' => 'Kecerdasan Majemuk & Profesi',      'fields' => ['linguistic_ability', 'linguistic_professions', 'logical_math_ability', 'logical_math_professions', 'visual_spatial_ability', 'visual_spatial_professions', 'kinesthetic_ability', 'kinesthetic_professions', 'musical_ability', 'musical_professions', 'interpersonal_ability', 'interpersonal_professions', 'intrapersonal_ability', 'intrapersonal_professions', 'naturalist_ability', 'naturalist_professions']],
                ['label' => 'Pertimbangan Karir',                'fields' => ['consider_learning_style', 'consider_intelligence', 'consider_academic_achievement', 'consider_parental_support', 'consider_gods_will', 'additional_considerations', 'career_decision_matrix']],
            ],
            'Eksplorasi Karir P2' => [
                ['label' => 'Pilihan Karir',     'fields' => ['final_career_choice', 'final_career_reason']],
                ['label' => 'Analisis SWOT',     'fields' => ['swot_definition', 'swot_analysis_data']],
                ['label' => 'Catatan Mentoring', 'fields' => ['mentoring_notes']],
            ],
            'Persiapan Pulau Impian' => [
                ['label' => 'Pertanyaan Profesi', 'fields' => ['profession_questions']],
                ['label' => 'Analisis SWOT',      'fields' => ['swot_analysis']],
                ['label' => 'Rencana Perbaikan',  'fields' => ['improvement_plan']],
            ],
        ];
    }

    /** Human-readable Indonesian labels for every tracked field. */
    public static function getFieldLabels(): array
    {
        return [
            // Profil RMD
            'graduation_plan_date'               => 'Rencana Tanggal Kelulusan',
            'first_filled_at'                    => 'Tanggal Pertama Mengisi',
            'first_filled_age'                   => 'Usia Saat Pertama Mengisi',
            'first_filled_education'             => 'Tingkat Pendidikan Saat Mengisi',
            'first_filled_education_institution' => 'Institusi Pendidikan',
            // Refleksi Alkitab
            'jeremiah_29_11_who_knows'           => 'Yeremia 29:11 – Siapa yang Mengetahui?',
            'jeremiah_29_11_plans'               => 'Yeremia 29:11 – Rancangan Allah',
            'ephesians_2_10_made_by'             => 'Efesus 2:10 – Diciptakan Oleh',
            'ephesians_2_10_purpose'             => 'Efesus 2:10 – Tujuan',
            'ephesians_2_10_god_wants'           => 'Efesus 2:10 – Kehendak Allah',
            'genesis_1_26_28_image'              => 'Kejadian 1:26-28 – Gambar Allah',
            'genesis_1_26_28_purpose'            => 'Kejadian 1:26-28 – Tujuan',
            'summary_point_1'                    => 'Poin Ringkasan 1',
            'summary_point_2'                    => 'Poin Ringkasan 2',
            'favorite_verse'                     => 'Ayat Alkitab Favorit',
            'reason_favorite_verse'              => 'Alasan Memilih Ayat',
            'leadership_c1'                      => 'Kepemimpinan – Poin 1',
            'leadership_c2'                      => 'Kepemimpinan – Poin 2',
            'leadership_c3'                      => 'Kepemimpinan – Poin 3',
            'leadership_c4'                      => 'Kepemimpinan – Poin 4',
            'leadership_c5'                      => 'Kepemimpinan – Poin 5',
            'chapter_learning_text'              => 'Refleksi Pembelajaran Bab',
            // Sukses Sejati
            'successful_life_definition'         => 'Definisi Hidup Sukses',
            'general_success_measure'            => 'Ukuran Sukses Umum',
            'luke_2_52_growth'                   => 'Lukas 2:52 – Pertumbuhan',
            'philippians_2_5_10_actions'         => 'Filipi 2:5-10 – Tindakan',
            'jesus_success_vs_society'           => 'Sukses Yesus vs Pandangan Masyarakat',
            'god_opinion_on_jesus'               => 'Pendapat Allah tentang Yesus',
            'new_learning_text'                  => 'Pembelajaran Baru',
            'new_learning_image_path'            => 'Gambar Pembelajaran',
            // The Only One
            'unique_traits'                      => 'Keunikan Diri',
            'current_education_level'            => 'Tingkat Pendidikan Saat Ini',
            'favorite_subject'                   => 'Mata Pelajaran Favorit',
            'favorite_subject_reason'            => 'Alasan Favorit',
            'least_favorite_subject'             => 'Mata Pelajaran Tidak Disukai',
            'least_favorite_subject_reason'      => 'Alasan Tidak Disukai',
            'highest_score_subject'              => 'Mapel Nilai Tertinggi',
            'highest_score_value'                => 'Nilai Tertinggi',
            'lowest_score_subject'               => 'Mapel Nilai Terendah',
            'lowest_score_value'                 => 'Nilai Terendah',
            'visual_checklist'                   => 'Ceklis Gaya Belajar Visual',
            'auditory_checklist'                 => 'Ceklis Gaya Belajar Auditori',
            'kinesthetic_checklist'              => 'Ceklis Gaya Belajar Kinestetik',
            'learned_aspects'                    => 'Hal yang Dipelajari',
            'aspects_to_improve'                 => 'Hal yang Perlu Ditingkatkan',
            // Kecerdasan Majemuk
            'linguistic_checklist'               => 'Ceklis Kecerdasan Linguistik',
            'logical_mathematical_checklist'     => 'Ceklis Kecerdasan Logis-Matematis',
            'visual_spatial_checklist'           => 'Ceklis Kecerdasan Visual-Spasial',
            'musical_checklist'                  => 'Ceklis Kecerdasan Musikal',
            'interpersonal_checklist'            => 'Ceklis Kecerdasan Interpersonal',
            'intrapersonal_checklist'            => 'Ceklis Kecerdasan Intrapersonal',
            'naturalist_checklist'               => 'Ceklis Kecerdasan Naturalis',
            'existential_checklist'              => 'Ceklis Kecerdasan Eksistensial',
            'reflection_suitability'             => 'Refleksi – Kesesuaian',
            'reflection_development'             => 'Refleksi – Pengembangan',
            'reflection_new_learning'            => 'Refleksi – Pembelajaran Baru',
            'reflection_plan'                    => 'Refleksi – Rencana ke Depan',
            // Sosial Emosional
            'learning_style_practice'            => 'Penerapan Gaya Belajar',
            'learning_style_impact'              => 'Dampak Gaya Belajar',
            'birth_order_siblings'               => 'Urutan Kelahiran / Saudara',
            'parents_occupation'                 => 'Pekerjaan Orang Tua',
            'home_responsibilities'              => 'Tanggung Jawab di Rumah',
            'family_uniqueness'                  => 'Keunikan Keluarga',
            'extracurricular_activities'         => 'Kegiatan Ekstrakurikuler',
            'ppa_activities'                     => 'Kegiatan PPA',
            'hobbies'                            => 'Hobi',
            'strengths'                          => 'Kekuatan',
            'weaknesses'                         => 'Kelemahan',
            'reflection_learned'                 => 'Refleksi – Yang Dipelajari',
            'reflection_improvement'             => 'Refleksi – Yang Perlu Ditingkatkan',
            'height'                             => 'Tinggi Badan (cm)',
            'weight'                             => 'Berat Badan (kg)',
            'physical_traits'                    => 'Ciri Fisik',
            'favorite_sports'                    => 'Olahraga Favorit',
            'sports_achievements'                => 'Prestasi Olahraga',
            'eating_habits'                      => 'Kebiasaan Makan',
            'sleeping_habits'                    => 'Kebiasaan Tidur',
            'health_issues'                      => 'Masalah Kesehatan',
            'physical_likes'                     => 'Yang Disukai dari Fisik',
            'physical_development_goal'          => 'Tujuan Pengembangan Fisik',
            'spiritual_knowledge_jesus'          => 'Pengenalan Yesus',
            'spiritual_relationship_growth'      => 'Pertumbuhan Hubungan Rohani',
            'spiritual_love_obedience'           => 'Kasih & Ketaatan',
            'spiritual_community'                => 'Komunitas Rohani',
            'spiritual_bible_study'              => 'Pendalaman Alkitab',
            'spiritual_mentor'                   => 'Pembimbing Rohani',
            'spiritual_reflection_learned'       => 'Refleksi Rohani – Yang Dipelajari',
            'spiritual_reflection_improvement'   => 'Refleksi Rohani – Peningkatan',
            'chapter3_check1'                    => 'Pengecekan Bab 3 – 1',
            'chapter3_check2'                    => 'Pengecekan Bab 3 – 2',
            'chapter3_check3'                    => 'Pengecekan Bab 3 – 3',
            'chapter3_check4'                    => 'Pengecekan Bab 3 – 4',
            // Eksplorasi Karir
            'visual_professions'                 => 'Profesi dari Gaya Belajar Visual',
            'auditory_professions'               => 'Profesi dari Gaya Belajar Auditori',
            'kinesthetic_professions_style'      => 'Profesi dari Gaya Belajar Kinestetik',
            'interested_professions_from_style'  => 'Profesi Tertarik dari Gaya Belajar',
            'linguistic_ability'                 => 'Kemampuan Linguistik',
            'linguistic_professions'             => 'Profesi Linguistik',
            'logical_math_ability'               => 'Kemampuan Logis-Matematis',
            'logical_math_professions'           => 'Profesi Logis-Matematis',
            'visual_spatial_ability'             => 'Kemampuan Visual-Spasial',
            'visual_spatial_professions'         => 'Profesi Visual-Spasial',
            'kinesthetic_ability'                => 'Kemampuan Kinestetik',
            'kinesthetic_professions'            => 'Profesi Kinestetik',
            'musical_ability'                    => 'Kemampuan Musikal',
            'musical_professions'                => 'Profesi Musikal',
            'interpersonal_ability'              => 'Kemampuan Interpersonal',
            'interpersonal_professions'          => 'Profesi Interpersonal',
            'intrapersonal_ability'              => 'Kemampuan Intrapersonal',
            'intrapersonal_professions'          => 'Profesi Intrapersonal',
            'naturalist_ability'                 => 'Kemampuan Naturalis',
            'naturalist_professions'             => 'Profesi Naturalis',
            'consider_learning_style'            => 'Pertimbangan: Gaya Belajar',
            'consider_intelligence'              => 'Pertimbangan: Kecerdasan',
            'consider_academic_achievement'      => 'Pertimbangan: Prestasi Akademik',
            'consider_parental_support'          => 'Pertimbangan: Dukungan Orang Tua',
            'consider_gods_will'                 => 'Pertimbangan: Kehendak Allah',
            'additional_considerations'          => 'Pertimbangan Tambahan',
            'career_decision_matrix'             => 'Matriks Keputusan Karir',
            // Eksplorasi Karir P2
            'final_career_choice'                => 'Pilihan Karir Akhir',
            'final_career_reason'                => 'Alasan Pilihan Karir',
            'swot_definition'                    => 'Definisi SWOT',
            'swot_analysis_data'                 => 'Data Analisis SWOT',
            'chapter4_check1'                    => 'Pengecekan Bab 4 – 1',
            'chapter4_check2'                    => 'Pengecekan Bab 4 – 2',
            'chapter4_check3'                    => 'Pengecekan Bab 4 – 3',
            'mentoring_notes'                    => 'Catatan Mentoring',
            // Persiapan Pulau Impian
            'profession_questions'               => 'Pertanyaan tentang Profesi',
            'swot_analysis'                      => 'Analisis SWOT',
            'improvement_plan'                   => 'Rencana Perbaikan',
        ];
    }

    /** Display type for each field: text | number | date | boolean | array | json | image */
    public static function getFieldTypes(): array
    {
        return [
            'graduation_plan_date'               => 'date',
            'first_filled_at'                    => 'date',
            'first_filled_age'                   => 'number',
            'highest_score_value'                => 'number',
            'lowest_score_value'                 => 'number',
            'height'                             => 'number',
            'weight'                             => 'number',
            // Booleans
            'consider_learning_style'            => 'boolean',
            'consider_intelligence'              => 'boolean',
            'consider_academic_achievement'      => 'boolean',
            'consider_parental_support'          => 'boolean',
            'consider_gods_will'                 => 'boolean',
            'chapter3_check1'                    => 'boolean',
            'chapter3_check2'                    => 'boolean',
            'chapter3_check3'                    => 'boolean',
            'chapter3_check4'                    => 'boolean',
            'chapter4_check1'                    => 'boolean',
            'chapter4_check2'                    => 'boolean',
            'chapter4_check3'                    => 'boolean',
            // Arrays (checklists — stored as JSON arrays of item strings)
            'visual_checklist'                   => 'array',
            'auditory_checklist'                 => 'array',
            'kinesthetic_checklist'              => 'array',
            'linguistic_checklist'               => 'array',
            'logical_mathematical_checklist'     => 'array',
            'visual_spatial_checklist'           => 'array',
            'musical_checklist'                  => 'array',
            'interpersonal_checklist'            => 'array',
            'intrapersonal_checklist'            => 'array',
            'naturalist_checklist'               => 'array',
            'existential_checklist'              => 'array',
            // Complex JSON
            'career_decision_matrix'             => 'json',
            'swot_analysis_data'                 => 'json',
            'profession_questions'               => 'json',
            'swot_analysis'                      => 'json',
            // Image
            'new_learning_image_path'            => 'image',
        ];
    }

    /** Prepare a field value for JSON serialisation / display in the frontend. */
    public static function formatFieldValue(mixed $value, string $type): mixed
    {
        if ($value === null || $value === '') return null;

        return match ($type) {
            'boolean' => (bool) $value,
            'number'  => $value,
            'date'    => $value instanceof \Carbon\Carbon
                ? $value->toDateString()
                : (string) $value,
            'array'   => is_array($value) ? $value : (json_decode($value, true) ?? []),
            'json'    => is_array($value) ? $value : (json_decode($value, true) ?? $value),
            'image'   => $value ? true : null,   // just signal presence; URL served separately
            default   => (string) $value,
        };
    }

    public static function calculateProgress($user, $moduleName, $modelClass)
    {
        $record = $modelClass::where('user_id', $user->id)->first();

        if (!$record) {
            return [
                'status'       => 'Belum Mengisi',
                'percentage'   => 0,
                'last_updated' => null,
                'filled_at'    => null,
                'sections'     => [],
            ];
        }

        $allSections  = self::getModuleSections();
        $fieldLabels  = self::getFieldLabels();
        $fieldTypes   = self::getFieldTypes();
        $sections     = [];
        $totalFields  = 0;
        $filledFields = 0;

        if (isset($allSections[$moduleName])) {
            foreach ($allSections[$moduleName] as $section) {
                $sectionFilled = 0;
                $sectionTotal  = count($section['fields']);
                $fieldDetails  = [];

                foreach ($section['fields'] as $field) {
                    $raw    = $record->getAttribute($field);
                    $type   = $fieldTypes[$field] ?? 'text';
                    $filled = !empty($raw) || $raw === 0 || $raw === false;

                    $totalFields++;
                    if ($filled) {
                        $filledFields++;
                        $sectionFilled++;
                    }

                    $fieldDetails[] = [
                        'key'    => $field,
                        'label'  => $fieldLabels[$field] ?? $field,
                        'value'  => self::formatFieldValue($raw, $type),
                        'filled' => $filled,
                        'type'   => $type,
                    ];
                }

                $sectionPct = $sectionTotal > 0 ? round(($sectionFilled / $sectionTotal) * 100) : 0;

                $sections[] = [
                    'label'      => $section['label'],
                    'filled'     => $sectionFilled,
                    'total'      => $sectionTotal,
                    'percentage' => $sectionPct,
                    'fields'     => $fieldDetails,
                ];
            }
        } else {
            // Fallback: count all DB attributes (no field-level detail)
            $excluded = ['id', 'user_id', 'created_at', 'updated_at', 'deleted_at'];
            foreach ($record->getAttributes() as $key => $value) {
                if (in_array($key, $excluded)) continue;
                $totalFields++;
                if (!empty($value)) $filledFields++;
            }
        }

        $percentage = $totalFields > 0 ? round(($filledFields / $totalFields) * 100) : 0;

        $status = 'Sedang Mengisi';
        if ($percentage === 100) $status = 'Selesai Mengisi';
        elseif ($percentage === 0)  $status = 'Belum Mengisi';

        return [
            'status'       => $status,
            'percentage'   => $percentage,
            'last_updated' => $record->updated_at,
            'filled_at'    => $record->created_at,
            'sections'     => $sections,
        ];
    }
}
