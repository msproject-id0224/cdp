<?php

namespace App\Services;

use App\Models\RmdBibleReflection;
use App\Models\RmdCareerExploration;
use App\Models\RmdCareerExplorationP2;
use App\Models\RmdMeetingFile;
use App\Models\RmdMultipleIntelligence;
use App\Models\RmdPreparationDreamIsland;
use App\Models\RmdProfile;
use App\Models\RmdSocioEmotional;
use App\Models\RmdTheOnlyOne;
use App\Models\RmdTrueSuccess;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Validasi + persist untuk 9 modul RMD -- diekstrak dari RmdController
 * (yang sebelumnya berisi logic ini langsung di tiap store*() method) supaya
 * web (RmdController) dan API (Api\V1\RmdModuleController) memanggil logic
 * bisnis YANG SAMA, bukan disalin ulang. Urutan method di file ini sengaja
 * mengikuti urutan modul di RmdProgressService::getModules().
 *
 * JANGAN ubah aturan validasi/field di sini tanpa konfirmasi eksplisit --
 * ini konten program RMD yang sensitif secara bisnis (lihat batasan Fase 2
 * di FLUTTER_MIGRATION_PROMPTS.md).
 */
class RmdModuleService
{
    // ── 1. Profil RMD ───────────────────────────────────────────────────
    // Modul ini beda dari 8 lainnya: nulis ke `users` (data diri) DAN ke
    // `rmd_profiles` (tanggal lulus rencana, umur/pendidikan saat pertama
    // isi -- terkunci setelah pengisian pertama).

    public static function profileRules(bool $isFirstFill): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
            'profile_photo' => 'nullable|image|max:2048',
            'first_filled_at' => $isFirstFill ? 'required|date' : 'nullable|date',
            'first_filled_age' => 'required|integer|min:1',
            'first_filled_education' => 'required|string|max:255',
            'first_filled_education_institution' => 'nullable|string|max:255',
        ];
    }

    public static function isProfileFirstFill(User $user): bool
    {
        $existing = RmdProfile::where('user_id', $user->id)->first();

        return !$existing || !$existing->first_filled_at;
    }

    public static function saveProfile(User $user, array $data, ?UploadedFile $photo): void
    {
        DB::transaction(function () use ($user, $data, $photo) {
            $user->fill(array_intersect_key($data, array_flip([
                'first_name', 'last_name', 'phone_number', 'address', 'date_of_birth', 'gender',
            ])));

            if ($photo) {
                if ($user->profile_photo_path) {
                    Storage::disk('public')->delete($user->profile_photo_path);
                }
                $user->profile_photo_path = $photo->store('profile-photos', 'public');
            }

            $user->save();

            $graduationPlanDate = $user->date_of_birth
                ? Carbon::parse($user->date_of_birth)->addYears(21)->format('Y-m-d')
                : null;

            $isFirstFill = self::isProfileFirstFill($user);

            $profileData = [
                'graduation_plan_date' => $graduationPlanDate,
                'first_filled_age' => $data['first_filled_age'],
                'first_filled_education' => $data['first_filled_education'],
                'first_filled_education_institution' => $data['first_filled_education_institution'] ?? null,
            ];

            // first_filled_at hanya ditulis sekali, tidak pernah ditimpa.
            if ($isFirstFill) {
                $profileData['first_filled_at'] = $data['first_filled_at'];
            }

            RmdProfile::updateOrCreate(['user_id' => $user->id], $profileData);
        });
    }

    public static function graduationPlanDateFor(User $user): ?string
    {
        return $user->date_of_birth
            ? Carbon::parse($user->date_of_birth)->addYears(21)->format('Y-m-d')
            : null;
    }

    // ── 2. Refleksi Alkitab ─────────────────────────────────────────────

    public static function bibleReflectionRules(): array
    {
        return [
            'jeremiah_29_11_who_knows' => 'nullable|string',
            'jeremiah_29_11_plans' => 'nullable|string',
            'ephesians_2_10_made_by' => 'nullable|string',
            'ephesians_2_10_purpose' => 'nullable|string',
            'ephesians_2_10_god_wants' => 'nullable|string',
            'genesis_1_26_28_image' => 'nullable|string',
            'genesis_1_26_28_purpose' => 'nullable|string',
            'summary_point_1' => 'nullable|string',
            'summary_point_2' => 'nullable|string',
            'favorite_verse' => 'nullable|string',
            'reason_favorite_verse' => 'nullable|string',
            'leadership_c1' => 'nullable|string',
            'leadership_c2' => 'nullable|string',
            'leadership_c3' => 'nullable|string',
            'leadership_c4' => 'nullable|string',
            'leadership_c5' => 'nullable|string',
            'chapter_learning_text' => 'nullable|string',
            'chapter_learning_image' => 'nullable|image|max:5120',
        ];
    }

    public static function saveBibleReflection(User $user, array $data, ?UploadedFile $image): RmdBibleReflection
    {
        $reflection = RmdBibleReflection::firstOrNew(['user_id' => $user->id]);
        $reflection->fill(collect($data)->except(['chapter_learning_image'])->toArray());

        if ($image) {
            if ($reflection->chapter_learning_image_path) {
                Storage::disk('public')->delete($reflection->chapter_learning_image_path);
            }
            $reflection->chapter_learning_image_path = $image->store('rmd-reflections', 'public');
        }

        $reflection->save();

        return $reflection;
    }

    // ── 3. Sukses Sejati ────────────────────────────────────────────────

    public static function trueSuccessRules(): array
    {
        return [
            'successful_life_definition' => 'nullable|string',
            'general_success_measure' => 'nullable|string',
            'luke_2_52_growth' => 'nullable|string',
            'philippians_2_5_10_actions' => 'nullable|string',
            'jesus_success_vs_society' => 'nullable|string',
            'god_opinion_on_jesus' => 'nullable|string',
            'new_learning_text' => 'nullable|string',
            'new_learning_image' => 'nullable|image|max:5120',
        ];
    }

    public static function saveTrueSuccess(User $user, array $data, ?UploadedFile $image): RmdTrueSuccess
    {
        $trueSuccess = RmdTrueSuccess::firstOrNew(['user_id' => $user->id]);
        $trueSuccess->fill(collect($data)->except(['new_learning_image'])->toArray());

        if ($image) {
            if ($trueSuccess->new_learning_image_path) {
                Storage::disk('public')->delete($trueSuccess->new_learning_image_path);
            }
            $trueSuccess->new_learning_image_path = $image->store('rmd-true-success', 'public');
        }

        $trueSuccess->save();

        return $trueSuccess;
    }

    // ── 4. The Only One ─────────────────────────────────────────────────

    public static function theOnlyOneRules(): array
    {
        return [
            'unique_traits' => 'nullable|string',
            'current_education_level' => 'nullable|string',
            'favorite_subject' => 'nullable|string',
            'favorite_subject_reason' => 'nullable|string',
            'least_favorite_subject' => 'nullable|string',
            'least_favorite_subject_reason' => 'nullable|string',
            'highest_score_subject' => 'nullable|string',
            'highest_score_value' => 'nullable|string',
            'lowest_score_subject' => 'nullable|string',
            'lowest_score_value' => 'nullable|string',
            'visual_checklist' => 'nullable|array',
            'auditory_checklist' => 'nullable|array',
            'kinesthetic_checklist' => 'nullable|array',
            'learned_aspects' => 'nullable|string',
            'aspects_to_improve' => 'nullable|string',
        ];
    }

    public static function saveTheOnlyOne(User $user, array $data): RmdTheOnlyOne
    {
        return RmdTheOnlyOne::updateOrCreate(['user_id' => $user->id], $data);
    }

    // ── 5. Kecerdasan Majemuk (the-only-one-meeting-2) ──────────────────

    public static function multipleIntelligenceRules(): array
    {
        return [
            'linguistic_checklist' => 'nullable|array',
            'logical_mathematical_checklist' => 'nullable|array',
            'visual_spatial_checklist' => 'nullable|array',
            'kinesthetic_checklist' => 'nullable|array',
            'musical_checklist' => 'nullable|array',
            'interpersonal_checklist' => 'nullable|array',
            'intrapersonal_checklist' => 'nullable|array',
            'naturalist_checklist' => 'nullable|array',
            'existential_checklist' => 'nullable|array',
            'reflection_suitability' => 'nullable|string',
            'reflection_development' => 'nullable|string',
            'reflection_new_learning' => 'nullable|string',
            'reflection_plan' => 'nullable|string',
        ];
    }

    public static function saveMultipleIntelligence(User $user, array $data): RmdMultipleIntelligence
    {
        return RmdMultipleIntelligence::updateOrCreate(
            ['user_id' => $user->id],
            [
                'linguistic_checklist' => $data['linguistic_checklist'] ?? [],
                'logical_mathematical_checklist' => $data['logical_mathematical_checklist'] ?? [],
                'visual_spatial_checklist' => $data['visual_spatial_checklist'] ?? [],
                'kinesthetic_checklist' => $data['kinesthetic_checklist'] ?? [],
                'musical_checklist' => $data['musical_checklist'] ?? [],
                'interpersonal_checklist' => $data['interpersonal_checklist'] ?? [],
                'intrapersonal_checklist' => $data['intrapersonal_checklist'] ?? [],
                'naturalist_checklist' => $data['naturalist_checklist'] ?? [],
                'existential_checklist' => $data['existential_checklist'] ?? [],
                'reflection_suitability' => $data['reflection_suitability'] ?? null,
                'reflection_development' => $data['reflection_development'] ?? null,
                'reflection_new_learning' => $data['reflection_new_learning'] ?? null,
                'reflection_plan' => $data['reflection_plan'] ?? null,
            ],
        );
    }

    // ── 6. Sosial Emosional (the-only-one-meeting-3) ────────────────────

    public static function socioEmotionalRules(): array
    {
        return [
            'learning_style_practice' => 'nullable|string',
            'learning_style_impact' => 'nullable|string',
            'birth_order_siblings' => 'nullable|string',
            'parents_occupation' => 'nullable|string',
            'home_responsibilities' => 'nullable|string',
            'family_uniqueness' => 'nullable|string',
            'extracurricular_activities' => 'nullable|string',
            'ppa_activities' => 'nullable|string',
            'hobbies' => 'nullable|string',
            'strengths' => 'nullable|string',
            'weaknesses' => 'nullable|string',
            'reflection_learned' => 'nullable|string',
            'reflection_improvement' => 'nullable|string',
            'height' => 'nullable|string',
            'weight' => 'nullable|string',
            'physical_traits' => 'nullable|string',
            'favorite_sports' => 'nullable|string',
            'sports_achievements' => 'nullable|string',
            'eating_habits' => 'nullable|string',
            'sleeping_habits' => 'nullable|string',
            'health_issues' => 'nullable|string',
            'physical_likes' => 'nullable|string',
            'physical_development_goal' => 'nullable|string',
            'spiritual_knowledge_jesus' => 'nullable|string',
            'spiritual_relationship_growth' => 'nullable|string',
            'spiritual_love_obedience' => 'nullable|string',
            'spiritual_community' => 'nullable|string',
            'spiritual_bible_study' => 'nullable|string',
            'spiritual_mentor' => 'nullable|string',
            'spiritual_reflection_learned' => 'nullable|string',
            'spiritual_reflection_improvement' => 'nullable|string',
            'chapter3_check1' => 'nullable|boolean',
            'chapter3_check2' => 'nullable|boolean',
            'chapter3_check3' => 'nullable|boolean',
            'chapter3_check4' => 'nullable|boolean',
        ];
    }

    public static function saveSocioEmotional(User $user, array $data): RmdSocioEmotional
    {
        return RmdSocioEmotional::updateOrCreate(['user_id' => $user->id], $data);
    }

    // ── 7. Eksplorasi Karir ──────────────────────────────────────────────

    public static function careerExplorationRules(): array
    {
        return [
            'visual_professions' => 'nullable|string',
            'auditory_professions' => 'nullable|string',
            'kinesthetic_professions_style' => 'nullable|string',
            'interested_professions_from_style' => 'nullable|string',
            'linguistic_ability' => 'nullable|string',
            'linguistic_professions' => 'nullable|string',
            'logical_math_ability' => 'nullable|string',
            'logical_math_professions' => 'nullable|string',
            'visual_spatial_ability' => 'nullable|string',
            'visual_spatial_professions' => 'nullable|string',
            'kinesthetic_ability' => 'nullable|string',
            'kinesthetic_professions' => 'nullable|string',
            'musical_ability' => 'nullable|string',
            'musical_professions' => 'nullable|string',
            'interpersonal_ability' => 'nullable|string',
            'interpersonal_professions' => 'nullable|string',
            'intrapersonal_ability' => 'nullable|string',
            'intrapersonal_professions' => 'nullable|string',
            'naturalist_ability' => 'nullable|string',
            'naturalist_professions' => 'nullable|string',
            'consider_learning_style' => 'nullable|boolean',
            'consider_intelligence' => 'nullable|boolean',
            'consider_academic_achievement' => 'nullable|boolean',
            'consider_parental_support' => 'nullable|boolean',
            'consider_gods_will' => 'nullable|boolean',
            'additional_considerations' => 'nullable|string',
            'career_decision_matrix' => 'nullable|array',
        ];
    }

    public static function saveCareerExploration(User $user, array $data): RmdCareerExploration
    {
        return RmdCareerExploration::updateOrCreate(['user_id' => $user->id], $data);
    }

    // ── 8. Eksplorasi Karir P2 ───────────────────────────────────────────

    public static function careerExplorationP2Rules(): array
    {
        return [
            'final_career_choice' => 'nullable|string',
            'final_career_reason' => 'nullable|string',
            'swot_definition' => 'nullable|string',
            'swot_analysis_data' => 'nullable|array',
            'chapter4_check1' => 'nullable|boolean',
            'chapter4_check2' => 'nullable|boolean',
            'chapter4_check3' => 'nullable|boolean',
            'mentoring_notes' => 'nullable|string',
        ];
    }

    public static function saveCareerExplorationP2(User $user, array $data): RmdCareerExplorationP2
    {
        return RmdCareerExplorationP2::updateOrCreate(['user_id' => $user->id], $data);
    }

    // ── 9. Persiapan Pulau Impian ────────────────────────────────────────

    public static function preparationDreamIslandRules(): array
    {
        return [
            'profession_questions' => 'nullable|array',
            'swot_analysis' => 'nullable|array',
            'improvement_plan' => 'nullable|string',
        ];
    }

    public static function savePreparationDreamIsland(User $user, array $data): RmdPreparationDreamIsland
    {
        return RmdPreparationDreamIsland::updateOrCreate(['user_id' => $user->id], $data);
    }

    // ── File pertemuan (dipakai modul 5-9) ──────────────────────────────

    public static function meetingFileRules(): array
    {
        return [
            'file' => 'required|file|max:10240',
            'meeting_type' => 'required|string',
        ];
    }

    public static function meetingFilesFor(User $user, string $meetingType)
    {
        return RmdMeetingFile::where('user_id', $user->id)
            ->where('meeting_type', $meetingType)
            ->get();
    }

    public static function uploadMeetingFile(User $user, UploadedFile $file, string $meetingType): RmdMeetingFile
    {
        $path = $file->store('rmd-files/' . $user->id, 'public');

        return RmdMeetingFile::create([
            'user_id' => $user->id,
            'meeting_type' => $meetingType,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }

    /**
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public static function assertOwnsMeetingFile(User $user, RmdMeetingFile $file): void
    {
        if ($file->user_id !== $user->id && !$user->isAdmin()) {
            abort(403);
        }
    }

    public static function deleteMeetingFile(User $user, RmdMeetingFile $file): void
    {
        self::assertOwnsMeetingFile($user, $file);
        Storage::disk('public')->delete($file->file_path);
        $file->delete();
    }
}
