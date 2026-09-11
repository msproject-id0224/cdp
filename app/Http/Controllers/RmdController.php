<?php

namespace App\Http\Controllers;

use App\Models\RmdBibleReflection;
use App\Models\RmdTrueSuccess;
use App\Models\RmdTheOnlyOne;
use App\Services\RmdModuleService;
use App\Services\RmdProgressService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            $moduleRoutes = RmdProgressService::getModuleRoutes();

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
        $user = Auth::user();
        $isFirstFill = RmdModuleService::isProfileFirstFill($user);

        $data = $request->validate(RmdModuleService::profileRules($isFirstFill));

        RmdModuleService::saveProfile($user, $data, $request->file('profile_photo'));

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
        $data = $request->validate(RmdModuleService::bibleReflectionRules());

        RmdModuleService::saveBibleReflection(Auth::user(), $data, $request->file('chapter_learning_image'));

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
        $data = $request->validate(RmdModuleService::trueSuccessRules());

        RmdModuleService::saveTrueSuccess(Auth::user(), $data, $request->file('new_learning_image'));

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
        $data = $request->validate(RmdModuleService::theOnlyOneRules());

        RmdModuleService::saveTheOnlyOne(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function theOnlyOneMeeting2()
    {
        $multipleIntelligence = \App\Models\RmdMultipleIntelligence::where('user_id', Auth::id())->first();
        $files = RmdModuleService::meetingFilesFor(Auth::user(), 'the-only-one-meeting-2');

        return Inertia::render('Rmd/TheOnlyOneMeeting2', [
            'multipleIntelligence' => $multipleIntelligence,
            'files' => $files
        ]);
    }

    public function theOnlyOneMeeting3()
    {
        $socioEmotional = \App\Models\RmdSocioEmotional::where('user_id', Auth::id())->first();
        $files = RmdModuleService::meetingFilesFor(Auth::user(), 'the-only-one-meeting-3');

        return Inertia::render('Rmd/TheOnlyOneMeeting3', [
            'socioEmotional' => $socioEmotional,
            'files' => $files
        ]);
    }

    public function careerExploration()
    {
        $careerExploration = \App\Models\RmdCareerExploration::where('user_id', Auth::id())->first();
        $files = RmdModuleService::meetingFilesFor(Auth::user(), 'career-exploration');

        return Inertia::render('Rmd/MenentukanCitaCita', [
            'careerExploration' => $careerExploration,
            'files' => $files
        ]);
    }

    public function careerExplorationP2()
    {
        $careerExplorationP2 = \App\Models\RmdCareerExplorationP2::where('user_id', Auth::id())->first();
        $files = RmdModuleService::meetingFilesFor(Auth::user(), 'career-exploration-p2');

        return Inertia::render('Rmd/MenentukanCitaCitaP2', [
            'careerExplorationP2' => $careerExplorationP2,
            'files' => $files
        ]);
    }

    public function storeCareerExplorationP2(Request $request)
    {
        $data = $request->validate(RmdModuleService::careerExplorationP2Rules());

        RmdModuleService::saveCareerExplorationP2(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function preparationDreamIsland()
    {
        $preparationDreamIsland = \App\Models\RmdPreparationDreamIsland::where('user_id', Auth::id())->first();
        $files = RmdModuleService::meetingFilesFor(Auth::user(), 'preparation-dream-island');

        return Inertia::render('Rmd/PersiapanPulauImpian', [
            'preparationDreamIsland' => $preparationDreamIsland,
            'files' => $files
        ]);
    }

    public function storePreparationDreamIsland(Request $request)
    {
        $data = $request->validate(RmdModuleService::preparationDreamIslandRules());

        RmdModuleService::savePreparationDreamIsland(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function storeCareerExploration(Request $request)
    {
        $data = $request->validate(RmdModuleService::careerExplorationRules());

        RmdModuleService::saveCareerExploration(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function storeTheOnlyOneMeeting3(Request $request)
    {
        $data = $request->validate(RmdModuleService::socioEmotionalRules());

        RmdModuleService::saveSocioEmotional(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function storeTheOnlyOneMeeting2(Request $request)
    {
        $data = $request->validate(RmdModuleService::multipleIntelligenceRules());

        RmdModuleService::saveMultipleIntelligence(Auth::user(), $data);

        return $this->redirectToFirstIncomplete();
    }

    public function uploadMeetingFile(Request $request)
    {
        $data = $request->validate(RmdModuleService::meetingFileRules());

        RmdModuleService::uploadMeetingFile(Auth::user(), $request->file('file'), $data['meeting_type']);

        return back()->with('success', 'File berhasil diunggah.');
    }

    private function redirectToFirstIncomplete(string $message = 'Jawaban berhasil disimpan.')
    {
        return back()->with('success', $message);
    }

    public function downloadMeetingFile(\App\Models\RmdMeetingFile $file)
    {
        RmdModuleService::assertOwnsMeetingFile(Auth::user(), $file);

        return Storage::disk('public')->download($file->file_path, $file->file_name);
    }

    public function deleteMeetingFile(\App\Models\RmdMeetingFile $file)
    {
        RmdModuleService::deleteMeetingFile(Auth::user(), $file);

        return back()->with('success', 'File berhasil dihapus.');
    }
}
