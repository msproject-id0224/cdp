<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChatController;
use App\Http\Controllers\Api\V1\GiftController;
use App\Http\Controllers\Api\V1\LetterController;
use App\Http\Controllers\Api\V1\NoteController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RmdModuleController;
use App\Http\Controllers\Api\V1\RmdProgressController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes -- /api/v1
|--------------------------------------------------------------------------
|
| Stateless (guard `auth:sanctum`), terpisah total dari routes/web.php.
| Ini fondasi untuk klien mobile (Flutter) -- lihat FLUTTER_MIGRATION_PROMPTS.md
| Bagian B, Fase 0 & Fase 1.
*/

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/otp/request', [AuthController::class, 'requestOtp'])->name('api.v1.auth.otp.request');
        Route::post('/otp/verify', [AuthController::class, 'verifyOtp'])->name('api.v1.auth.otp.verify');
        Route::post('/otp/resend', [AuthController::class, 'resendOtp'])->name('api.v1.auth.otp.resend');

        Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [ProfileController::class, 'show'])->name('api.v1.me');

        Route::get('/notes', [NoteController::class, 'index'])->name('api.v1.notes');
        Route::get('/letters', [LetterController::class, 'index'])->name('api.v1.letters');
        Route::get('/gifts', [GiftController::class, 'index'])->name('api.v1.gifts');

        Route::get('/notifications/unread', [NotificationController::class, 'unread'])->name('api.v1.notifications.unread');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead'])->name('api.v1.notifications.read');

        Route::prefix('chat')->name('api.v1.chat.')->group(function () {
            Route::get('/global', [ChatController::class, 'global'])->name('global');
            Route::get('/search', [ChatController::class, 'search'])->name('search');
            Route::get('/unread-count', [ChatController::class, 'unreadCount'])->name('unread-count');
            Route::post('/typing', [ChatController::class, 'typing'])->name('typing');
            Route::patch('/{message}/flag', [ChatController::class, 'flag'])->name('flag');
            Route::patch('/{user}/read', [ChatController::class, 'markRead'])->name('read');
            Route::get('/{user}', [ChatController::class, 'history'])->name('history');
            Route::post('/', [ChatController::class, 'store'])->name('store');
        });

        Route::prefix('rmd')->name('api.v1.rmd.')->group(function () {
            Route::get('/progress', [RmdProgressController::class, 'index'])->name('progress');

            Route::get('/profile', [RmdModuleController::class, 'profile'])->name('profile.show');
            Route::post('/profile', [RmdModuleController::class, 'storeProfile'])->name('profile.store');

            Route::get('/what-the-bible-says', [RmdModuleController::class, 'bibleReflection'])->name('bible-reflection.show');
            Route::post('/what-the-bible-says', [RmdModuleController::class, 'storeBibleReflection'])->name('bible-reflection.store');

            Route::get('/true-success', [RmdModuleController::class, 'trueSuccess'])->name('true-success.show');
            Route::post('/true-success', [RmdModuleController::class, 'storeTrueSuccess'])->name('true-success.store');

            Route::get('/the-only-one', [RmdModuleController::class, 'theOnlyOne'])->name('the-only-one.show');
            Route::post('/the-only-one', [RmdModuleController::class, 'storeTheOnlyOne'])->name('the-only-one.store');

            Route::get('/the-only-one-meeting-2', [RmdModuleController::class, 'multipleIntelligence'])->name('multiple-intelligence.show');
            Route::post('/the-only-one-meeting-2', [RmdModuleController::class, 'storeMultipleIntelligence'])->name('multiple-intelligence.store');

            Route::get('/the-only-one-meeting-3', [RmdModuleController::class, 'socioEmotional'])->name('socio-emotional.show');
            Route::post('/the-only-one-meeting-3', [RmdModuleController::class, 'storeSocioEmotional'])->name('socio-emotional.store');

            Route::get('/career-exploration', [RmdModuleController::class, 'careerExploration'])->name('career-exploration.show');
            Route::post('/career-exploration', [RmdModuleController::class, 'storeCareerExploration'])->name('career-exploration.store');

            Route::get('/career-exploration-p2', [RmdModuleController::class, 'careerExplorationP2'])->name('career-exploration-p2.show');
            Route::post('/career-exploration-p2', [RmdModuleController::class, 'storeCareerExplorationP2'])->name('career-exploration-p2.store');

            Route::get('/preparation-dream-island', [RmdModuleController::class, 'preparationDreamIsland'])->name('preparation-dream-island.show');
            Route::post('/preparation-dream-island', [RmdModuleController::class, 'storePreparationDreamIsland'])->name('preparation-dream-island.store');

            Route::post('/meeting-files', [RmdModuleController::class, 'uploadMeetingFile'])->name('meeting-files.store');
            Route::get('/meeting-files/{file}/download', [RmdModuleController::class, 'downloadMeetingFile'])->name('meeting-files.download');
            Route::delete('/meeting-files/{file}', [RmdModuleController::class, 'deleteMeetingFile'])->name('meeting-files.destroy');
        });
    });
});
