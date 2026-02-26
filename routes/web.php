<?php

use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\CommunicationController;
use App\Http\Controllers\RmdReportController;
use App\Http\Controllers\OnlineUserController;
use App\Http\Controllers\ScheduleMessageController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\RmdController;
use App\Http\Controllers\MentorScheduleController;
use App\Http\Controllers\AdminScheduleController;

Route::post('/language/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'id'])) {
        session()->put('locale', $locale);
        session()->save();
    }
    
    return back();
})->name('language.switch');

Route::get('/', function () {
    return Inertia::render('GetStarted');
})->name('get-started');

Route::get('/verify-otp', [OtpController::class, 'show'])->name('otp.view');
Route::post('/verify-otp', [OtpController::class, 'verify'])->name('otp.verify');

use App\Models\Schedule;
use App\Models\ProfilePhotoRequest;

Route::get('/dashboard', function () {
    $schedules = Schedule::where('date', '>=', now()->toDateString())
        ->orderBy('date', 'asc')
        ->orderBy('start_time', 'asc')
        ->take(10)
        ->get();

    $photoRequests = [];
    $user = Auth::user();
    if ($user && $user->role === \App\Models\User::ROLE_ADMIN) {
        $photoRequests = ProfilePhotoRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    return Inertia::render('Dashboard', [
        'schedules' => $schedules,
        'photoRequests' => $photoRequests,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'rmd.access'])->group(function () {
    Route::get('/rmd', [RmdController::class, 'index'])->name('rmd.index');
    Route::get('/rmd/intro', [RmdController::class, 'intro'])->name('rmd.intro');
    Route::get('/rmd/profile', [RmdController::class, 'profile'])->name('rmd.profile');
    Route::post('/rmd/profile', [RmdController::class, 'storeProfile'])->name('rmd.profile.store');
    Route::get('/rmd/gods-purpose', [RmdController::class, 'godsPurpose'])->name('rmd.gods-purpose');
    Route::get('/rmd/what-the-bible-says', [RmdController::class, 'whatTheBibleSays'])->name('rmd.what-the-bible-says');
    Route::post('/rmd/what-the-bible-says', [RmdController::class, 'storeWhatTheBibleSays'])->name('rmd.what-the-bible-says.store');
    Route::get('/rmd/true-success', [RmdController::class, 'trueSuccess'])->name('rmd.true-success');
    Route::post('/rmd/true-success', [RmdController::class, 'storeTrueSuccess'])->name('rmd.true-success.store');
    Route::get('/rmd/the-only-one', [RmdController::class, 'theOnlyOne'])->name('rmd.the-only-one');
    Route::post('/rmd/the-only-one', [RmdController::class, 'storeTheOnlyOne'])->name('rmd.the-only-one.store');
    Route::get('/rmd/the-only-one-meeting-2', [RmdController::class, 'theOnlyOneMeeting2'])->name('rmd.the-only-one-meeting-2');
    Route::post('/rmd/the-only-one-meeting-2', [RmdController::class, 'storeTheOnlyOneMeeting2'])->name('rmd.the-only-one-meeting-2.store');
    Route::get('/rmd/chapters', [RmdController::class, 'chapters'])->name('rmd.chapters');
});

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/mentors', [MentorController::class, 'index'])->name('mentors.index');
    Route::get('/mentors/create', [MentorController::class, 'create'])->name('mentors.create');
    Route::post('/mentors', [MentorController::class, 'store'])->name('mentors.store');
    Route::get('/mentors/{mentor}/edit', [MentorController::class, 'edit'])->name('mentors.edit');
    Route::patch('/mentors/{mentor}', [MentorController::class, 'update'])->name('mentors.update');
    Route::patch('/mentors/{mentor}/toggle-status', [MentorController::class, 'toggleStatus'])->name('mentors.toggle-status');
    Route::get('/participants/create', [ParticipantController::class, 'create'])->name('participants.create');
    Route::post('/participants', [ParticipantController::class, 'store'])->name('participants.store');
    Route::get('/participants/{participant}/edit', [ParticipantController::class, 'edit'])->name('participants.edit');
    Route::patch('/participants/{participant}', [ParticipantController::class, 'update'])->name('participants.update');
    Route::patch('/participants/{participant}/toggle-status', [ParticipantController::class, 'toggleStatus'])->name('participants.toggle-status');
    Route::patch('/participants/{participant}/assign-mentor', [ParticipantController::class, 'assignMentor'])->name('participants.assign-mentor');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy');
    
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    Route::post('/schedule', [ScheduleController::class, 'store'])->name('schedule.store');
    Route::patch('/schedule/{schedule}', [ScheduleController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{schedule}', [ScheduleController::class, 'destroy'])->name('schedule.destroy');
    Route::get('/rmd-report', [RmdReportController::class, 'index'])->name('rmd-report.index');
    Route::get('/rmd-report/export/excel', [RmdReportController::class, 'exportExcel'])->name('rmd-report.export.excel');
    Route::get('/rmd-report/export/pdf', [RmdReportController::class, 'exportPdf'])->name('rmd-report.export.pdf');
    Route::get('/rmd-report/export/analytics', [RmdReportController::class, 'exportAnalytics'])->name('rmd-report.export.analytics');
    Route::get('/rmd-report/participant/{user}', [RmdReportController::class, 'getParticipantDetails'])->name('rmd-report.participant.details');

    // Profile Photo Admin Routes
    Route::get('/admin/profile-photos', [ProfilePhotoController::class, 'index'])->name('admin.profile-photos.index');
    Route::post('/admin/profile-photos/upload/{user}', [ProfilePhotoController::class, 'adminUpload'])->name('admin.profile-photos.upload');
    Route::post('/admin/profile-photos/approve/{photoRequest}', [ProfilePhotoController::class, 'approve'])->name('admin.profile-photos.approve');
    Route::post('/admin/profile-photos/reject/{photoRequest}', [ProfilePhotoController::class, 'reject'])->name('admin.profile-photos.reject');
    Route::post('/admin/profile-photos/request-reupload/{photoRequest}', [ProfilePhotoController::class, 'requestReupload'])->name('admin.profile-photos.request-reupload');
    Route::post('/admin/profile-photos/bulk-approve', [ProfilePhotoController::class, 'bulkApprove'])->name('admin.profile-photos.bulk-approve');
    Route::post('/admin/profile-photos/bulk-reject', [ProfilePhotoController::class, 'bulkReject'])->name('admin.profile-photos.bulk-reject');
    Route::get('/admin/profile-photos/export', [ProfilePhotoController::class, 'export'])->name('admin.profile-photos.export');
    Route::post('/admin/profile-photos/bulk-upload', [ProfilePhotoController::class, 'bulkUpload'])->name('admin.profile-photos.bulk-upload-csv');
    Route::get('/api/admin/profile-photos/pending', [ProfilePhotoController::class, 'pending'])->name('api.admin.profile-photos.pending');

    // Admin Schedule Messages API
    Route::get('/api/admin/schedule-messages/unread', [ScheduleMessageController::class, 'getUnreadMessages'])->name('api.admin.schedule-messages.unread');
    Route::patch('/api/admin/schedule-messages/{message}/read', [ScheduleMessageController::class, 'markAsRead'])->name('api.admin.schedule-messages.read');
    Route::patch('/api/admin/schedule-messages/{message}/archive', [ScheduleMessageController::class, 'archive'])->name('api.admin.schedule-messages.archive');

    // Admin Management Routes
    Route::get('/api/admins', [App\Http\Controllers\AdminController::class, 'index'])->name('api.admins.index');
    Route::patch('/api/admins/{user}', [App\Http\Controllers\AdminController::class, 'update'])->name('api.admins.update');
    Route::delete('/api/admins/{user}', [App\Http\Controllers\AdminController::class, 'destroy'])->name('api.admins.destroy');
    Route::patch('/api/admins/{user}/toggle-status', [App\Http\Controllers\AdminController::class, 'toggleStatus'])->name('api.admins.toggle-status');

    // Admin Schedule Approval Routes
    Route::get('/admin/schedule-approval', [AdminScheduleController::class, 'index'])->name('admin.schedule-approval.index');
    Route::get('/api/admin/schedules/pending', [AdminScheduleController::class, 'getPendingSchedules'])->name('api.admin.schedules.pending');
    Route::post('/api/admin/schedules/{meeting}/approve', [AdminScheduleController::class, 'approve'])->name('api.admin.schedules.approve');
    Route::post('/api/admin/schedules/{meeting}/reject', [AdminScheduleController::class, 'reject'])->name('api.admin.schedules.reject');
    Route::post('/api/admin/schedules/{meeting}/request-modification', [AdminScheduleController::class, 'requestModification'])->name('api.admin.schedules.request-modification');
    Route::post('/api/admin/schedules/bulk-approve', [AdminScheduleController::class, 'bulkApprove'])->name('api.admin.schedules.bulk-approve');
    Route::post('/api/admin/schedules/bulk-reject', [AdminScheduleController::class, 'bulkReject'])->name('api.admin.schedules.bulk-reject');
});

Route::middleware(['auth', 'verified', 'role:admin,mentor'])->group(function () {
    Route::get('/participants', [ParticipantController::class, 'index'])->name('participants.index');
    Route::get('/participants/{participant}', [ParticipantController::class, 'show'])->name('participants.show');
    Route::patch('/participants/{participant}/status', [ParticipantController::class, 'updateStatus'])->name('participants.status.update');
    Route::post('/participants/{participant}/notes', [ParticipantController::class, 'storeNote'])->name('participants.notes.store');
    Route::post('/participants/{participant}/tasks', [ParticipantController::class, 'storeTask'])->name('participants.tasks.store');
    Route::patch('/participants/{participant}/tasks/{task}', [ParticipantController::class, 'updateTaskStatus'])->name('participants.tasks.update');
    Route::post('/participants/{participant}/meetings', [ParticipantController::class, 'storeMeeting'])->name('participants.meetings.store');
    Route::get('/communication', [CommunicationController::class, 'index'])->name('communication.index');
    Route::post('/mentor/profile-photo/request', [ProfilePhotoController::class, 'userRequestUpload'])->name('mentor.profile-photo.request');
});

Route::middleware(['auth', 'verified', 'role:participant'])->group(function () {
    Route::get('/participant/communication', [CommunicationController::class, 'participantIndex'])->name('participant.communication.index');
    Route::post('/participant/profile-photo/request', [ProfilePhotoController::class, 'userRequestUpload'])->name('participant.profile-photo.request');
    Route::get('/participant/notes', [ParticipantController::class, 'myNotes'])->name('participant.notes');
    Route::get('/participant/schedule', [ParticipantController::class, 'mySchedule'])->name('participant.schedule');
});

Route::middleware('auth')->group(function () {
    // Mentor Schedule Routes
    Route::get('/mentor-schedule', [MentorScheduleController::class, 'index'])->name('mentor.schedule');
    Route::get('/api/mentor-schedules', [MentorScheduleController::class, 'getSchedules'])->name('api.mentor-schedules');
    Route::post('/api/mentor-availability', [MentorScheduleController::class, 'storeAvailability'])->name('api.mentor-availability.store');
    Route::delete('/api/mentor-availability/{availability}', [MentorScheduleController::class, 'deleteAvailability'])->name('api.mentor-availability.destroy');
    Route::post('/api/mentor-meetings', [MentorScheduleController::class, 'storeMeeting'])->name('api.mentor-meetings.store');
    Route::patch('/api/mentor-meetings/{meeting}', [MentorScheduleController::class, 'updateMeeting'])->name('api.mentor-meetings.update');
    Route::delete('/api/mentor-meetings/{meeting}', [MentorScheduleController::class, 'destroyMeeting'])->name('api.mentor-meetings.destroy');
    Route::get('/api/mentor-schedules/export', [MentorScheduleController::class, 'exportSchedule'])->name('api.mentor-schedules.export');

    Route::get('/api/schedules', [ScheduleController::class, 'getSchedules'])->name('api.schedules');
    Route::patch('/api/schedules/{schedule}/priority', [ScheduleController::class, 'updatePriority'])->name('api.schedules.update-priority');
    Route::post('/api/schedule-messages', [ScheduleMessageController::class, 'store'])->name('api.schedule-messages.store');
    Route::get('/api/schedules/{schedule}/messages', [ScheduleMessageController::class, 'getMessagesBySchedule'])->name('api.schedules.messages');
    Route::get('/api/online-users', [OnlineUserController::class, 'index'])->name('api.online-users');
    Route::get('/api/users/search', [CommunicationController::class, 'searchUsers'])->name('api.users.search');
    
    // General Chat Routes
    Route::get('/api/chat/global', [ChatMessageController::class, 'indexGlobal'])->name('api.chat.global');
    Route::get('/api/chat/{user}', [ChatMessageController::class, 'index'])->name('api.chat.index');
    Route::post('/api/chat', [ChatMessageController::class, 'store'])
        ->middleware('throttle:60,1')
        ->name('api.chat.store');
    Route::post('/api/chat/typing', [ChatMessageController::class, 'typing'])->name('api.chat.typing');
    Route::patch('/api/chat/{message}/flag', [ChatMessageController::class, 'flagMessage'])->name('api.chat.flag');
    Route::patch('/api/chat/{user}/read', [ChatMessageController::class, 'markAsRead'])->name('api.chat.read');
    Route::get('/api/chat-unread', [ChatMessageController::class, 'getUnreadCount'])->name('api.chat.unread-count');
    Route::post('/api/log-error', [ChatMessageController::class, 'logError'])->name('api.log-error');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
