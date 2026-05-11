<?php

namespace App\Http\Controllers;

use App\Models\RmdProfile;
use App\Models\RmdBibleReflection;
use App\Models\RmdTrueSuccess;
use App\Models\RmdTheOnlyOne;
use App\Services\RmdProgressService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use App\Models\PpaSetting;
use App\Models\User;

class RmdController extends Controller
{
    /**
     * Menampilkan Dashboard Rekapitulasi RMD untuk Admin
     */
    public function dashboard(Request $request)
    {
        // Validasi Role: Hanya Admin
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        // Query Participants (Role: participant) by age group
        $count12_14  = User::where('role', 'participant')->whereRaw("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 12 AND 14")->count();
        $count15_18  = User::where('role', 'participant')->whereRaw("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 15 AND 18")->count();
        $count19_plus = User::where('role', 'participant')->whereRaw("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) >= 19")->count();

        // Count Mentors (semua age group 12-14 s/d 19+)
        $mentorCount = User::where('role', 'mentor')->count();

        // Placeholder Group RMD
        $groups12_14  = 8;
        $groups15_18  = 11;
        $groups19_plus = 0;
        $totalGroups  = $groups12_14 + $groups15_18 + $groups19_plus;

        // Placeholder Attendance
        $attendance = ['12_14' => null, '15_18' => null, '19_plus' => null];

        // Daftar Partisipan > 12 Tahun
        $participantsQuery = User::where('role', 'participant')
            ->whereRaw("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) > 12");

        if ($request->search) {
            $participantsQuery->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('id_number', 'like', "%{$request->search}%");
            });
        }

        $participants = $participantsQuery->paginate(10)->withQueryString();

        // PPA Settings dari DB
        $setting = PpaSetting::getSetting();

        $picLabel = null;
        if ($setting->pic) {
            $name = trim($setting->pic->first_name . ' ' . $setting->pic->last_name);
            $pos  = $setting->pic->specialization ?? $setting->pic->experience ?? null;
            $picLabel = $pos ? "{$name} ({$pos})" : $name;
        }

        // Daftar Admin & Mentor untuk dropdown PIC
        $staffList = User::where('role', 'admin')
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name', 'specialization', 'experience'])
            ->map(function ($u) {
                $name = trim($u->first_name . ' ' . $u->last_name);
                $pos  = $u->specialization ?? $u->experience ?? null;
                return [
                    'id'    => $u->id,
                    'label' => $pos ? "{$name} ({$pos})" : $name,
                ];
            });

        return Inertia::render('Rmd/Dashboard', [
            'stats' => [
                'count_12_14'   => $count12_14,
                'count_15_18'   => $count15_18,
                'count_19_plus' => $count19_plus,
                'total_teens'   => $count12_14 + $count15_18 + $count19_plus,
                'mentor_count'  => $mentorCount,
                'groups_12_14'  => $groups12_14,
                'groups_15_18'  => $groups15_18,
                'groups_19_plus' => $groups19_plus,
                'total_groups'  => $totalGroups,
                'attendance'    => $attendance,
            ],
            'participants' => $participants,
            'filters'      => $request->only(['search']),
            'ppaInfo' => [
                'fiscal_year' => $setting->fiscal_year,
                'church_name' => $setting->church_name,
                'ppa_id'      => $setting->ppa_id,
                'cluster'     => $setting->cluster,
                'rmd_period'  => $setting->rmd_period,
                'pic_user_id' => $setting->pic_user_id,
                'pic_name'    => $picLabel,
            ],
            'staffList' => $staffList,
        ]);
    }

    /**
     * Simpan / update INFORMASI PPA
     */
    public function savePpaInfo(Request $request)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $validated = $request->validate([
            'fiscal_year' => 'nullable|string|max:20',
            'church_name' => 'nullable|string|max:100',
            'ppa_id'      => 'nullable|string|max:20',
            'cluster'     => 'nullable|string|max:100',
            'rmd_period'  => 'nullable|string|max:50',
            'pic_user_id' => 'nullable|exists:users,id',
        ]);

        $setting = PpaSetting::firstOrNew([]);
        $setting->fill($validated);
        $setting->save();

        return back()->with('success', 'Informasi PPA berhasil disimpan.');
    }

    public function index()
    {
        $user = Auth::user();

        // Smart redirect: participants who have already started go to their first incomplete module
        if ($user->isParticipant()) {
            // Map each module name (from RmdProgressService) to its route name
            $moduleRoutes = [
                'Profil RMD'             => 'rmd.profile',
                'Refleksi Alkitab'       => 'rmd.what-the-bible-says',
                'Sukses Sejati'          => 'rmd.true-success',
                'The Only One'           => 'rmd.the-only-one',
                'Kecerdasan Majemuk'     => 'rmd.the-only-one-meeting-2',
                'Sosial Emosional'       => 'rmd.the-only-one-meeting-3',
                'Eksplorasi Karir'       => 'rmd.career-exploration',
                'Eksplorasi Karir P2'    => 'rmd.career-exploration-p2',
                'Persiapan Pulau Impian' => 'rmd.preparation-dream-island',
            ];

            $hasStarted         = false;
            $firstIncomplete    = null;

            foreach (RmdProgressService::getModules() as $moduleName => $modelClass) {
                $progress = RmdProgressService::calculateProgress($user, $moduleName, $modelClass);

                if ($progress['percentage'] > 0) {
                    $hasStarted = true;
                }

                if ($firstIncomplete === null && $progress['percentage'] < 100) {
                    $firstIncomplete = $moduleRoutes[$moduleName] ?? null;
                }
            }

            if ($hasStarted) {
                // Still have incomplete modules → jump straight there
                if ($firstIncomplete) {
                    return redirect()->route($firstIncomplete)
                        ->with('info', 'Melanjutkan dari bagian yang belum selesai.');
                }

                // Everything 100 % → chapters / completion page
                return redirect()->route('rmd.chapters');
            }
        }

        return Inertia::render('Rmd/Index');
    }

    public function intro()
    {
        return Inertia::render('Rmd/Intro');
    }

    public function profile()
    {
        $user = Auth::user();
        $user->load('rmdProfile');

        // Calculate graduation plan date if not set (Birth date + 21 years)
        $graduationPlanDate = null;
        if ($user->date_of_birth) {
            $graduationPlanDate = Carbon::parse($user->date_of_birth)->addYears(21)->format('Y-m-d');
        }

        // Progress for all modules so the profile page can show a checklist
        $rmdModules  = RmdProgressService::getModules();
        $rmdProgress = collect($rmdModules)->map(function ($modelClass, $moduleName) use ($user) {
            return array_merge(
                ['name' => $moduleName],
                RmdProgressService::calculateProgress($user, $moduleName, $modelClass)
            );
        })->values();

        $isFirstFill = !$user->rmdProfile || !$user->rmdProfile->first_filled_at;

        return Inertia::render('Rmd/Profile', [
            'rmdProfile'         => $user->rmdProfile,
            'graduationPlanDate' => $graduationPlanDate,
            'rmdProgress'        => $rmdProgress,
            'isFirstFill'        => $isFirstFill,
        ]);
    }

    public function storeProfile(Request $request)
    {
        $existingForValidation = RmdProfile::where('user_id', Auth::id())->first();
        $isFirstFillValidation = !$existingForValidation || !$existingForValidation->first_filled_at;

        $request->validate([
            'first_name'                         => 'required|string|max:255',
            'last_name'                          => 'nullable|string|max:255',
            'phone_number'                       => 'nullable|string|max:20',
            'address'                            => 'nullable|string|max:500',
            'date_of_birth'                      => 'nullable|date',
            'gender'                             => 'nullable|in:Male,Female',
            'profile_photo'                      => 'nullable|image|max:2048',
            'first_filled_at'                    => $isFirstFillValidation ? 'required|date' : 'nullable|date',
            'first_filled_age'                   => 'required|integer|min:1',
            'first_filled_education'             => 'required|string|max:255',
            'first_filled_education_institution' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        DB::transaction(function () use ($request, $user) {
            // Update User
            $user->fill($request->only([
                'first_name', 
                'last_name', 
                'phone_number', 
                'address', 
                'date_of_birth', 
                'gender'
            ]));

            if ($request->hasFile('profile_photo')) {
                if ($user->profile_photo_path) {
                    Storage::disk('public')->delete($user->profile_photo_path);
                }
                $path = $request->file('profile_photo')->store('profile-photos', 'public');
                $user->profile_photo_path = $path;
            }

            $user->save();

            // Calculate graduation plan date based on DOB
            $graduationPlanDate = null;
            if ($user->date_of_birth) {
                $graduationPlanDate = Carbon::parse($user->date_of_birth)->addYears(21)->format('Y-m-d');
            }

            // Update RmdProfile — only first_filled_at is locked once set
            $existingProfile = RmdProfile::where('user_id', $user->id)->first();
            $isFirstFill     = !$existingProfile || !$existingProfile->first_filled_at;

            $profileData = [
                'graduation_plan_date'               => $graduationPlanDate,
                'first_filled_age'                   => $request->first_filled_age,
                'first_filled_education'             => $request->first_filled_education,
                'first_filled_education_institution' => $request->first_filled_education_institution,
            ];

            // first_filled_at is only written on the very first save — never overwritten
            if ($isFirstFill) {
                $profileData['first_filled_at'] = $request->first_filled_at;
            }

            RmdProfile::updateOrCreate(['user_id' => $user->id], $profileData);
        });

        return $this->redirectToFirstIncomplete('Profil berhasil diperbarui.');
    }

    public function chapters()
    {
        return Inertia::render('Rmd/Chapters');
    }

    public function godsPurpose()
    {
        return Inertia::render('Rmd/GodsPurpose');
    }

    public function whatTheBibleSays()
    {
        $reflection = RmdBibleReflection::where('user_id', Auth::id())->first();

        return Inertia::render('Rmd/WhatTheBibleSays', [
            'reflection' => $reflection
        ]);
    }

    public function storeWhatTheBibleSays(Request $request)
    {
        $data = $request->validate([
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
            'chapter_learning_image' => 'nullable|image|max:5120', // Max 5MB
        ]);

        $reflection = RmdBibleReflection::firstOrNew(['user_id' => Auth::id()]);
        
        $reflection->fill(collect($data)->except(['chapter_learning_image'])->toArray());

        if ($request->hasFile('chapter_learning_image')) {
            if ($reflection->chapter_learning_image_path) {
                Storage::disk('public')->delete($reflection->chapter_learning_image_path);
            }
            $path = $request->file('chapter_learning_image')->store('rmd-reflections', 'public');
            $reflection->chapter_learning_image_path = $path;
        }

        $reflection->save();

        return $this->redirectToFirstIncomplete();
    }

    public function trueSuccess()
    {
        $trueSuccess = RmdTrueSuccess::where('user_id', Auth::id())->first();

        return Inertia::render('Rmd/TrueSuccess', [
            'trueSuccess' => $trueSuccess
        ]);
    }

    public function storeTrueSuccess(Request $request)
    {
        $data = $request->validate([
            'successful_life_definition' => 'nullable|string',
            'general_success_measure' => 'nullable|string',
            'luke_2_52_growth' => 'nullable|string',
            'philippians_2_5_10_actions' => 'nullable|string',
            'jesus_success_vs_society' => 'nullable|string',
            'god_opinion_on_jesus' => 'nullable|string',
            'new_learning_text' => 'nullable|string',
            'new_learning_image' => 'nullable|image|max:5120', // Max 5MB
        ]);

        $trueSuccess = RmdTrueSuccess::firstOrNew(['user_id' => Auth::id()]);
        
        $trueSuccess->fill(collect($data)->except(['new_learning_image'])->toArray());

        if ($request->hasFile('new_learning_image')) {
            if ($trueSuccess->new_learning_image_path) {
                Storage::disk('public')->delete($trueSuccess->new_learning_image_path);
            }
            $path = $request->file('new_learning_image')->store('rmd-true-success', 'public');
            $trueSuccess->new_learning_image_path = $path;
        }

        $trueSuccess->save();

        return $this->redirectToFirstIncomplete();
    }

    public function theOnlyOne()
    {
        $theOnlyOne = RmdTheOnlyOne::where('user_id', Auth::id())->first();

        return Inertia::render('Rmd/TheOnlyOne', [
            'theOnlyOne' => $theOnlyOne
        ]);
    }

    public function storeTheOnlyOne(Request $request)
    {
        $data = $request->validate([
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
        ]);

        $theOnlyOne = RmdTheOnlyOne::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return $this->redirectToFirstIncomplete();
    }

    public function theOnlyOneMeeting2()
    {
        $multipleIntelligence = \App\Models\RmdMultipleIntelligence::where('user_id', Auth::id())->first();
        $files = \App\Models\RmdMeetingFile::where('user_id', Auth::id())
            ->where('meeting_type', 'the-only-one-meeting-2')
            ->get();

        return Inertia::render('Rmd/TheOnlyOneMeeting2', [
            'multipleIntelligence' => $multipleIntelligence,
            'files' => $files
        ]);
    }

    public function theOnlyOneMeeting3()
    {
        $socioEmotional = \App\Models\RmdSocioEmotional::where('user_id', Auth::id())->first();
        $files = \App\Models\RmdMeetingFile::where('user_id', Auth::id())
            ->where('meeting_type', 'the-only-one-meeting-3')
            ->get();

        return Inertia::render('Rmd/TheOnlyOneMeeting3', [
            'socioEmotional' => $socioEmotional,
            'files' => $files
        ]);
    }

    public function careerExploration()
    {
        $careerExploration = \App\Models\RmdCareerExploration::where('user_id', Auth::id())->first();
        $files = \App\Models\RmdMeetingFile::where('user_id', Auth::id())
            ->where('meeting_type', 'career-exploration')
            ->get();

        return Inertia::render('Rmd/MenentukanCitaCita', [
            'careerExploration' => $careerExploration,
            'files' => $files
        ]);
    }

    public function careerExplorationP2()
    {
        $careerExplorationP2 = \App\Models\RmdCareerExplorationP2::where('user_id', Auth::id())->first();
        $files = \App\Models\RmdMeetingFile::where('user_id', Auth::id())
            ->where('meeting_type', 'career-exploration-p2')
            ->get();

        return Inertia::render('Rmd/MenentukanCitaCitaP2', [
            'careerExplorationP2' => $careerExplorationP2,
            'files' => $files
        ]);
    }

    public function storeCareerExplorationP2(Request $request)
    {
        $data = $request->validate([
            'final_career_choice' => 'nullable|string',
            'final_career_reason' => 'nullable|string',
            'swot_definition' => 'nullable|string',
            'swot_analysis_data' => 'nullable|array',
            'chapter4_check1' => 'nullable|boolean',
            'chapter4_check2' => 'nullable|boolean',
            'chapter4_check3' => 'nullable|boolean',
            'mentoring_notes' => 'nullable|string',
        ]);

        \App\Models\RmdCareerExplorationP2::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return $this->redirectToFirstIncomplete();
    }

    public function preparationDreamIsland()
    {
        $preparationDreamIsland = \App\Models\RmdPreparationDreamIsland::where('user_id', Auth::id())->first();
        $files = \App\Models\RmdMeetingFile::where('user_id', Auth::id())
            ->where('meeting_type', 'preparation-dream-island')
            ->get();

        return Inertia::render('Rmd/PersiapanPulauImpian', [
            'preparationDreamIsland' => $preparationDreamIsland,
            'files' => $files
        ]);
    }

    public function storePreparationDreamIsland(Request $request)
    {
        $data = $request->validate([
            'profession_questions' => 'nullable|array',
            'swot_analysis' => 'nullable|array',
            'improvement_plan' => 'nullable|string',
        ]);

        \App\Models\RmdPreparationDreamIsland::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return $this->redirectToFirstIncomplete();
    }

    public function storeCareerExploration(Request $request)
    {
        $data = $request->validate([
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
        ]);

        \App\Models\RmdCareerExploration::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return $this->redirectToFirstIncomplete();
    }

    public function storeTheOnlyOneMeeting3(Request $request)
    {
        $data = $request->validate([
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
        ]);

        \App\Models\RmdSocioEmotional::updateOrCreate(
            ['user_id' => Auth::id()],
            $data
        );

        return $this->redirectToFirstIncomplete();
    }

    public function storeTheOnlyOneMeeting2(Request $request)
    {
        $request->validate([
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
        ]);

        \App\Models\RmdMultipleIntelligence::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'linguistic_checklist' => $request->linguistic_checklist ?? [],
                'logical_mathematical_checklist' => $request->logical_mathematical_checklist ?? [],
                'visual_spatial_checklist' => $request->visual_spatial_checklist ?? [],
                'kinesthetic_checklist' => $request->kinesthetic_checklist ?? [],
                'musical_checklist' => $request->musical_checklist ?? [],
                'interpersonal_checklist' => $request->interpersonal_checklist ?? [],
                'intrapersonal_checklist' => $request->intrapersonal_checklist ?? [],
                'naturalist_checklist' => $request->naturalist_checklist ?? [],
                'existential_checklist' => $request->existential_checklist ?? [],
                'reflection_suitability' => $request->reflection_suitability,
                'reflection_development' => $request->reflection_development,
                'reflection_new_learning' => $request->reflection_new_learning,
                'reflection_plan' => $request->reflection_plan,
            ]
        );

        return $this->redirectToFirstIncomplete();
    }

    public function uploadMeetingFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB
            'meeting_type' => 'required|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('rmd-files/' . Auth::id(), 'public');

        \App\Models\RmdMeetingFile::create([
            'user_id' => Auth::id(),
            'meeting_type' => $request->meeting_type,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return back()->with('success', 'File berhasil diunggah.');
    }

    private function redirectToFirstIncomplete(string $message = 'Jawaban berhasil disimpan.')
    {
        return back()->with('success', $message);
    }

    public function downloadMeetingFile(\App\Models\RmdMeetingFile $file)
    {
        if ($file->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        return Storage::disk('public')->download($file->file_path, $file->file_name);
    }

    public function deleteMeetingFile(\App\Models\RmdMeetingFile $file)
    {
        if ($file->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return back()->with('success', 'File berhasil dihapus.');
    }
}
