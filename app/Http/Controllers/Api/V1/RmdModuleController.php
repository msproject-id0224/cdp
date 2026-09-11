<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\RmdCareerExploration;
use App\Models\RmdCareerExplorationP2;
use App\Models\RmdMeetingFile;
use App\Models\RmdMultipleIntelligence;
use App\Models\RmdPreparationDreamIsland;
use App\Models\RmdSocioEmotional;
use App\Models\RmdTheOnlyOne;
use App\Models\RmdBibleReflection;
use App\Models\RmdTrueSuccess;
use App\Services\RmdModuleService;
use App\Services\RmdProgressService;
use Illuminate\Http\Request;

/**
 * Versi terstruktur dari RmdController buat 9 modul RMD -- GET kembalikan
 * data tersimpan (bukan Inertia::render), POST kembalikan
 * {message, module, progress} (bukan redirect back()). Validasi & persist
 * SELALU lewat RmdModuleService, method yang SAMA dipakai RmdController
 * versi web -- lihat catatan di RmdModuleService (aturan #2).
 *
 * JANGAN ubah urutan atau field modul di sini tanpa konfirmasi eksplisit
 * (lihat batasan Fase 2 di FLUTTER_MIGRATION_PROMPTS.md).
 */
class RmdModuleController extends Controller
{
    // ── 1. Profil RMD ───────────────────────────────────────────────────

    public function profile(Request $request)
    {
        $user = $request->user();
        $user->load('rmdProfile');

        return response()->json([
            'profile' => $user->rmdProfile,
            'user' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone_number' => $user->phone_number,
                'address' => $user->address,
                'date_of_birth' => $user->date_of_birth?->format('Y-m-d'),
                'gender' => $user->gender,
            ],
            'graduation_plan_date' => RmdModuleService::graduationPlanDateFor($user),
            'is_first_fill' => RmdModuleService::isProfileFirstFill($user),
        ]);
    }

    public function storeProfile(Request $request)
    {
        $user = $request->user();
        $isFirstFill = RmdModuleService::isProfileFirstFill($user);

        $data = $request->validate(RmdModuleService::profileRules($isFirstFill));
        RmdModuleService::saveProfile($user, $data, $request->file('profile_photo'));

        return $this->savedResponse($user);
    }

    // ── 2. Refleksi Alkitab ─────────────────────────────────────────────

    public function bibleReflection(Request $request)
    {
        return response()->json([
            'reflection' => RmdBibleReflection::where('user_id', $request->user()->id)->first(),
        ]);
    }

    public function storeBibleReflection(Request $request)
    {
        $data = $request->validate(RmdModuleService::bibleReflectionRules());
        RmdModuleService::saveBibleReflection($request->user(), $data, $request->file('chapter_learning_image'));

        return $this->savedResponse($request->user());
    }

    // ── 3. Sukses Sejati ────────────────────────────────────────────────

    public function trueSuccess(Request $request)
    {
        return response()->json([
            'true_success' => RmdTrueSuccess::where('user_id', $request->user()->id)->first(),
        ]);
    }

    public function storeTrueSuccess(Request $request)
    {
        $data = $request->validate(RmdModuleService::trueSuccessRules());
        RmdModuleService::saveTrueSuccess($request->user(), $data, $request->file('new_learning_image'));

        return $this->savedResponse($request->user());
    }

    // ── 4. The Only One ─────────────────────────────────────────────────

    public function theOnlyOne(Request $request)
    {
        return response()->json([
            'the_only_one' => RmdTheOnlyOne::where('user_id', $request->user()->id)->first(),
        ]);
    }

    public function storeTheOnlyOne(Request $request)
    {
        $data = $request->validate(RmdModuleService::theOnlyOneRules());
        RmdModuleService::saveTheOnlyOne($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── 5. Kecerdasan Majemuk ────────────────────────────────────────────

    public function multipleIntelligence(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'multiple_intelligence' => RmdMultipleIntelligence::where('user_id', $user->id)->first(),
            'files' => RmdModuleService::meetingFilesFor($user, 'the-only-one-meeting-2'),
        ]);
    }

    public function storeMultipleIntelligence(Request $request)
    {
        $data = $request->validate(RmdModuleService::multipleIntelligenceRules());
        RmdModuleService::saveMultipleIntelligence($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── 6. Sosial Emosional ──────────────────────────────────────────────

    public function socioEmotional(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'socio_emotional' => RmdSocioEmotional::where('user_id', $user->id)->first(),
            'files' => RmdModuleService::meetingFilesFor($user, 'the-only-one-meeting-3'),
        ]);
    }

    public function storeSocioEmotional(Request $request)
    {
        $data = $request->validate(RmdModuleService::socioEmotionalRules());
        RmdModuleService::saveSocioEmotional($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── 7. Eksplorasi Karir ──────────────────────────────────────────────

    public function careerExploration(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'career_exploration' => RmdCareerExploration::where('user_id', $user->id)->first(),
            'files' => RmdModuleService::meetingFilesFor($user, 'career-exploration'),
        ]);
    }

    public function storeCareerExploration(Request $request)
    {
        $data = $request->validate(RmdModuleService::careerExplorationRules());
        RmdModuleService::saveCareerExploration($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── 8. Eksplorasi Karir P2 ───────────────────────────────────────────

    public function careerExplorationP2(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'career_exploration_p2' => RmdCareerExplorationP2::where('user_id', $user->id)->first(),
            'files' => RmdModuleService::meetingFilesFor($user, 'career-exploration-p2'),
        ]);
    }

    public function storeCareerExplorationP2(Request $request)
    {
        $data = $request->validate(RmdModuleService::careerExplorationP2Rules());
        RmdModuleService::saveCareerExplorationP2($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── 9. Persiapan Pulau Impian ────────────────────────────────────────

    public function preparationDreamIsland(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'preparation_dream_island' => RmdPreparationDreamIsland::where('user_id', $user->id)->first(),
            'files' => RmdModuleService::meetingFilesFor($user, 'preparation-dream-island'),
        ]);
    }

    public function storePreparationDreamIsland(Request $request)
    {
        $data = $request->validate(RmdModuleService::preparationDreamIslandRules());
        RmdModuleService::savePreparationDreamIsland($request->user(), $data);

        return $this->savedResponse($request->user());
    }

    // ── File pertemuan (modul 5-9) ───────────────────────────────────────

    public function uploadMeetingFile(Request $request)
    {
        $data = $request->validate(RmdModuleService::meetingFileRules());
        $file = RmdModuleService::uploadMeetingFile($request->user(), $request->file('file'), $data['meeting_type']);

        return response()->json(['message' => 'File berhasil diunggah.', 'file' => $file], 201);
    }

    public function deleteMeetingFile(Request $request, RmdMeetingFile $file)
    {
        RmdModuleService::deleteMeetingFile($request->user(), $file);

        return response()->json(['message' => 'File berhasil dihapus.']);
    }

    public function downloadMeetingFile(Request $request, RmdMeetingFile $file)
    {
        RmdModuleService::assertOwnsMeetingFile($request->user(), $file);

        return \Illuminate\Support\Facades\Storage::disk('public')->download($file->file_path, $file->file_name);
    }

    /**
     * Respons seragam untuk semua endpoint POST -- progres terbaru
     * langsung disertakan supaya Flutter tidak perlu request kedua ke
     * /rmd/progress setelah submit.
     */
    private function savedResponse($user)
    {
        return response()->json([
            'message' => 'Jawaban berhasil disimpan.',
            'progress' => RmdProgressService::buildProgressPayload($user),
        ]);
    }
}
