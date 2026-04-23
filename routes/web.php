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
use App\Http\Controllers\Admin\MentorPerformanceController;
use App\Http\Controllers\AdminScheduleController;
use App\Http\Controllers\AdminAttendanceController;
use App\Http\Controllers\AttendanceController;

use App\Http\Controllers\HealthScreeningController;
use App\Http\Controllers\GiftController;
use App\Http\Controllers\MentorDocumentController;

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
Route::post('/verify-otp/resend', [OtpController::class, 'resend'])->name('otp.resend');

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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
    Route::get('/rmd/the-only-one-meeting-3', [RmdController::class, 'theOnlyOneMeeting3'])->name('rmd.the-only-one-meeting-3');
    Route::post('/rmd/the-only-one-meeting-3', [RmdController::class, 'storeTheOnlyOneMeeting3'])->name('rmd.the-only-one-meeting-3.store');
    Route::get('/rmd/career-exploration', [RmdController::class, 'careerExploration'])->name('rmd.career-exploration');
    Route::post('/rmd/career-exploration', [RmdController::class, 'storeCareerExploration'])->name('rmd.career-exploration.store');
    Route::get('/rmd/career-exploration-p2', [RmdController::class, 'careerExplorationP2'])->name('rmd.career-exploration-p2');
    Route::post('/rmd/career-exploration-p2', [RmdController::class, 'storeCareerExplorationP2'])->name('rmd.career-exploration-p2.store');
    Route::get('/rmd/preparation-dream-island', [RmdController::class, 'preparationDreamIsland'])->name('rmd.preparation-dream-island');
    Route::post('/rmd/preparation-dream-island', [RmdController::class, 'storePreparationDreamIsland'])->name('rmd.preparation-dream-island.store');
    Route::post('/rmd/meeting-files', [RmdController::class, 'uploadMeetingFile'])->name('rmd.files.upload');
    Route::get('/rmd/chapters', [RmdController::class, 'chapters'])->name('rmd.chapters');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware('role:admin,mentor')->group(function () {
        // Admin & Mentor Shared Routes
        Route::get('/api/admin/schedules', [MentorScheduleController::class, 'index'])->name('api.admin.schedules.index');
        
        // RMD Dashboard (Summary) - Admin only
        Route::middleware('role:admin')->group(function () {
            Route::get('/rmd/dashboard', [RmdController::class, 'dashboard'])->name('rmd.dashboard');
            Route::post('/rmd/dashboard/ppa-info', [RmdController::class, 'savePpaInfo'])->name('rmd.dashboard.ppa-info');
        });

        // Health Screening Routes
        Route::resource('health-screenings', HealthScreeningController::class);
        Route::get('/api/health-screenings/participants', [HealthScreeningController::class, 'participants'])->name('api.health-screenings.participants');
        Route::get('/health-screenings/{health_screening}/export-pdf', [HealthScreeningController::class, 'exportPdf'])->name('health-screenings.export-pdf');
    });

    // Notification Routes
    Route::post('/notifications/{id}/read', function ($id) {
        $notification = auth()->user()->notifications()->find($id);
        if ($notification) {
            $notification->markAsRead();
        }
        return back();
    })->name('notifications.read');
}); // End of auth, verified group

// Admin Only Routes
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
    
    // Admin Attendance Routes
    Route::get('/admin/attendance/sessions', [AdminAttendanceController::class, 'sessions'])->name('admin.attendance.sessions');
    Route::post('/api/admin/attendance/sessions/{session}/deactivate', [AdminAttendanceController::class, 'deactivateSession'])->name('api.admin.attendance.deactivate');
    Route::post('/api/admin/attendance/sessions/{session}/resend-email', [AdminAttendanceController::class, 'resendEmail'])->name('api.admin.attendance.resend-email');
    Route::get('/admin/attendance/qr-display', [AdminAttendanceController::class, 'qrDisplay'])->name('admin.attendance.qr-display');
    Route::get('/api/admin/attendance/active-sessions', [AdminAttendanceController::class, 'getActiveSessions'])->name('api.admin.attendance.active-sessions');
    Route::get('/admin/attendance/monitor', [AdminAttendanceController::class, 'monitor'])->name('admin.attendance.monitor');

    Route::patch('/participants/{participant}', [ParticipantController::class, 'update'])->name('participants.update');
    Route::patch('/participants/{participant}/toggle-status', [ParticipantController::class, 'toggleStatus'])->name('participants.toggle-status');
    Route::patch('/participants/{participant}/assign-mentor', [ParticipantController::class, 'assignMentor'])->name('participants.assign-mentor');
    Route::delete('/participants/{participant}', [ParticipantController::class, 'destroy'])->name('participants.destroy');
    
    Route::get('/schedule', [ScheduleController::class, 'index'])->name('schedule.index');
    Route::post('/schedule', [ScheduleController::class, 'store'])->name('schedule.store');
    Route::patch('/schedule/{schedule}', [ScheduleController::class, 'update'])->name('schedule.update');
    Route::delete('/schedule/{schedule}', [ScheduleController::class, 'destroy'])->name('schedule.destroy');
    Route::get('/rmd-report/export/excel', [RmdReportController::class, 'exportExcel'])->name('rmd-report.export.excel');

    // Mentor Performance Assessment
    Route::get('/admin/mentor-performance', [MentorPerformanceController::class, 'index'])->name('admin.mentor-performance.index');
    Route::get('/rmd-report/export/pdf', [RmdReportController::class, 'exportPdf'])->name('rmd-report.export.pdf');
    Route::get('/rmd-report/export/analytics', [RmdReportController::class, 'exportAnalytics'])->name('rmd-report.export.analytics');

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
    Route::post('/api/admins', [App\Http\Controllers\AdminController::class, 'store'])->name('api.admins.store');
    Route::patch('/api/admins/{user}', [App\Http\Controllers\AdminController::class, 'update'])->name('api.admins.update');
    Route::delete('/api/admins/{user}', [App\Http\Controllers\AdminController::class, 'destroy'])->name('api.admins.destroy');
    Route::patch('/api/admins/{user}/toggle-status', [App\Http\Controllers\AdminController::class, 'toggleStatus'])->name('api.admins.toggle-status');

    // Admin Schedule Approval Routes
    Route::get('/admin/schedule-approval', [AdminScheduleController::class, 'index'])->name('admin.schedule-approval.index');
    Route::get('/api/admin/schedules/pending', [AdminScheduleController::class, 'getPendingSchedules'])->name('api.admin.schedules.pending');
    Route::get('/api/admin/schedules/all', [AdminScheduleController::class, 'getAllMeetings'])->name('api.admin.schedules.all');
    Route::get('/api/admin/schedules/{meeting}/details', [AdminScheduleController::class, 'getMeetingDetails'])->name('api.admin.schedules.details');
    Route::post('/api/admin/general-meeting-dates/toggle', [AdminScheduleController::class, 'toggleGeneralMeetingDate'])->name('api.admin.general-meeting-dates.toggle');
    Route::post('/api/admin/schedules/{meeting}/approve', [AdminScheduleController::class, 'approve'])->name('api.admin.schedules.approve');
    Route::post('/api/admin/schedules/{meeting}/reject', [AdminScheduleController::class, 'reject'])->name('api.admin.schedules.reject');
    Route::post('/api/admin/schedules/{meeting}/request-modification', [AdminScheduleController::class, 'requestModification'])->name('api.admin.schedules.request-modification');
    Route::post('/api/admin/schedules/bulk-approve', [AdminScheduleController::class, 'bulkApprove'])->name('api.admin.schedules.bulk-approve');
    Route::post('/api/admin/schedules/bulk-reject', [AdminScheduleController::class, 'bulkReject'])->name('api.admin.schedules.bulk-reject');
    Route::get('/api/admin/notifications/schedule-approvals', [AdminScheduleController::class, 'getScheduleApprovalNotifications'])->name('api.admin.notifications.schedule-approvals');
    Route::patch('/api/admin/notifications/{notificationId}/read', [AdminScheduleController::class, 'markNotificationRead'])->name('api.admin.notifications.read');
    Route::get('/api/admin/schedules/deletion-requests', [AdminScheduleController::class, 'getDeletionRequests'])->name('api.admin.schedules.deletion-requests');
    Route::post('/api/admin/schedules/{meeting}/approve-deletion', [AdminScheduleController::class, 'approveDeletion'])->name('api.admin.schedules.approve-deletion');
    Route::post('/api/admin/schedules/{meeting}/reject-deletion', [AdminScheduleController::class, 'rejectDeletion'])->name('api.admin.schedules.reject-deletion');

    // API Polling Notifications
    Route::get('/api/notifications/unread', function () {
        return response()->json([
            'unread_notifications' => auth()->user()->unreadNotifications()->limit(10)->get(),
            'unread_count' => auth()->user()->unreadNotifications()->count(),
        ]);
    })->name('api.notifications.unread');

    // Gift Routes (Admin)
    Route::post('/gifts/{gift}/verify', [GiftController::class, 'verify'])->name('gifts.verify');
    Route::post('/gifts/{gift}/log-view', [GiftController::class, 'logView'])->name('gifts.log-view');
    Route::resource('gifts', GiftController::class)->except(['index', 'show']);
});

Route::middleware(['auth', 'verified', 'role:admin,mentor'])->group(function () {
    // Shared Gift Routes
    Route::get('/gifts', [GiftController::class, 'index'])->name('gifts.index');
    Route::post('/gifts/{gift}/proof', [GiftController::class, 'uploadProof'])->name('gifts.upload-proof');

    Route::get('/participants', [ParticipantController::class, 'index'])->name('participants.index');
    Route::get('/participants/update-log', [ParticipantController::class, 'updateLog'])->name('participants.update-log');
    Route::get('/participants/{participant}', [ParticipantController::class, 'show'])->name('participants.show');
    Route::get('/participants/{participant}/rmd-summary', [ParticipantController::class, 'rmdSummary'])->name('participants.rmd-summary');
    Route::patch('/participants/{participant}/status', [ParticipantController::class, 'updateStatus'])->name('participants.status.update');
    Route::post('/participants/{participant}/notes', [ParticipantController::class, 'storeNote'])->name('participants.notes.store');
    Route::post('/participants/{participant}/tasks', [ParticipantController::class, 'storeTask'])->name('participants.tasks.store');
    Route::patch('/participants/{participant}/tasks/{task}', [ParticipantController::class, 'updateTaskStatus'])->name('participants.tasks.update');
    Route::post('/participants/{participant}/meetings', [ParticipantController::class, 'storeMeeting'])->name('participants.meetings.store');
    Route::get('/communication', [CommunicationController::class, 'index'])->name('communication.index');
    Route::post('/mentor/profile-photo/request', [ProfilePhotoController::class, 'userRequestUpload'])->name('mentor.profile-photo.request');
    Route::get('/rmd-report', [RmdReportController::class, 'index'])->name('rmd-report.index');
    Route::get('/rmd-report/participant/{user}', [RmdReportController::class, 'getParticipantDetails'])->name('rmd-report.participant.details');
});

Route::middleware(['auth', 'verified', 'role:participant'])->group(function () {
    Route::get('/participant/communication', [CommunicationController::class, 'participantIndex'])->name('participant.communication.index');
    Route::post('/participant/profile-photo/request', [ProfilePhotoController::class, 'userRequestUpload'])->name('participant.profile-photo.request');
    Route::get('/participant/notes', [ParticipantController::class, 'myNotes'])->name('participant.notes');
    Route::get('/participant/schedule', [ParticipantController::class, 'mySchedule'])->name('participant.schedule');
});

Route::middleware('auth')->group(function () {
    // Mentor Document Routes (mentor upload + admin inspect)
    Route::get('/api/mentor-documents', [MentorDocumentController::class, 'index'])->name('api.mentor-documents.index');
    Route::post('/api/mentor-documents/upload', [MentorDocumentController::class, 'upload'])->name('api.mentor-documents.upload');
    Route::get('/api/mentor-documents/{document}/download', [MentorDocumentController::class, 'download'])->name('api.mentor-documents.download');
    Route::get('/api/admin/mentor-documents', [MentorDocumentController::class, 'adminIndex'])->name('api.admin.mentor-documents.index');

    // Mentor Schedule Routes
    Route::get('/mentor-schedule', [MentorScheduleController::class, 'index'])->name('mentor.schedule');
    Route::get('/api/mentor-schedules', [MentorScheduleController::class, 'getSchedules'])->name('api.mentor-schedules');
    Route::get('/api/general-meeting-dates', [AdminScheduleController::class, 'getGeneralMeetingDates'])->name('api.general-meeting-dates');
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
    Route::post('/api/log-error', [ChatMessageController::class, 'logError'])
        ->middleware('throttle:10,1')
        ->name('api.log-error');

    Route::get('/rmd/meeting-files/{file}/download', [RmdController::class, 'downloadMeetingFile'])->name('rmd.files.download');
    Route::delete('/rmd/meeting-files/{file}', [RmdController::class, 'deleteMeetingFile'])->name('rmd.files.delete');

    // Mentor Attendance Routes
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/scan', [AttendanceController::class, 'scan'])->name('attendance.scan');
    Route::post('/attendance/{attendance}/documentation', [AttendanceController::class, 'uploadDocumentation'])->name('attendance.documentation');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
