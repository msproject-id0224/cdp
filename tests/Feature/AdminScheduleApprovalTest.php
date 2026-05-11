<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\ParticipantMeeting;
use App\Models\User;
use App\Notifications\ScheduleDecisionNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminScheduleApprovalTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $mentor;
    protected $participant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->mentor = User::factory()->create(['role' => 'mentor']);
        $this->participant = User::factory()->create(['role' => 'participant']);
    }

    public function test_admin_can_view_schedule_approval_page()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.schedule-approval.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/ScheduleApproval'));
    }

    public function test_non_admin_cannot_view_schedule_approval_page()
    {
        $response = $this->actingAs($this->mentor)->get(route('admin.schedule-approval.index'));
        $response->assertStatus(403);

        $response = $this->actingAs($this->participant)->get(route('admin.schedule-approval.index'));
        $response->assertStatus(403);
    }

    public function test_admin_can_fetch_pending_schedules()
    {
        ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Pending Meeting',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Approved Meeting',
            'scheduled_at' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHour(),
            'status' => 'scheduled',
        ]);

        $response = $this->actingAs($this->admin)->getJson(route('api.admin.schedules.pending'));

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['agenda' => 'Pending Meeting']);
        $response->assertJsonMissing(['agenda' => 'Approved Meeting']);
    }

    public function test_admin_can_approve_schedule()
    {
        Notification::fake();

        $meeting = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'To Approve',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson(route('api.admin.schedules.approve', $meeting->id));

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('participant_meetings', [
            'id' => $meeting->id,
            'status' => 'scheduled',
            'approved_by' => $this->admin->id,
        ]);

        Notification::assertSentTo($this->mentor, ScheduleDecisionNotification::class, function ($notification) {
            return $notification->decision === 'approved';
        });

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'APPROVE_SCHEDULE',
            'target_id' => $meeting->id,
        ]);
    }

    public function test_admin_can_reject_schedule()
    {
        Notification::fake();

        $meeting = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'To Reject',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson(route('api.admin.schedules.reject', $meeting->id), [
            'reason' => 'Conflict with holiday',
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('participant_meetings', [
            'id' => $meeting->id,
            'status' => 'rejected',
            'rejection_reason' => 'Conflict with holiday',
            'approved_by' => $this->admin->id,
        ]);

        Notification::assertSentTo($this->mentor, ScheduleDecisionNotification::class, function ($notification) {
            return $notification->decision === 'rejected' && $notification->reason === 'Conflict with holiday';
        });

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'REJECT_SCHEDULE',
            'target_id' => $meeting->id,
        ]);
    }

    public function test_admin_can_request_modification()
    {
        Notification::fake();

        $meeting = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'To Modify',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson(route('api.admin.schedules.request-modification', $meeting->id), [
            'reason' => 'Please change time',
        ]);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('participant_meetings', [
            'id' => $meeting->id,
            'status' => 'modification_requested',
            'rejection_reason' => 'Please change time',
            'approved_by' => $this->admin->id,
        ]);

        Notification::assertSentTo($this->mentor, ScheduleDecisionNotification::class, function ($notification) {
            return $notification->decision === 'modification_requested' && $notification->reason === 'Please change time';
        });

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'REQUEST_MODIFICATION',
            'target_id' => $meeting->id,
        ]);
    }

    public function test_admin_can_bulk_approve_schedules()
    {
        Notification::fake();

        $meeting1 = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Bulk 1',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        $meeting2 = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Bulk 2',
            'scheduled_at' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson(route('api.admin.schedules.bulk-approve'), [
            'ids' => [$meeting1->id, $meeting2->id],
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('participant_meetings', ['id' => $meeting1->id, 'status' => 'scheduled']);
        $this->assertDatabaseHas('participant_meetings', ['id' => $meeting2->id, 'status' => 'scheduled']);
        
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'APPROVE_SCHEDULE',
            'target_id' => $meeting1->id,
        ]);
    }

    public function test_admin_can_bulk_reject_schedules()
    {
        Notification::fake();

        $meeting1 = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Bulk Reject 1',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        $meeting2 = ParticipantMeeting::create([
            'mentor_id' => $this->mentor->id,
            'agenda' => 'Bulk Reject 2',
            'scheduled_at' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->postJson(route('api.admin.schedules.bulk-reject'), [
            'ids' => [$meeting1->id, $meeting2->id],
            'reason' => 'Bulk Rejection Reason'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('participant_meetings', ['id' => $meeting1->id, 'status' => 'rejected', 'rejection_reason' => 'Bulk Rejection Reason']);
        $this->assertDatabaseHas('participant_meetings', ['id' => $meeting2->id, 'status' => 'rejected', 'rejection_reason' => 'Bulk Rejection Reason']);
        
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'REJECT_SCHEDULE',
            'target_id' => $meeting1->id,
        ]);
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'REJECT_SCHEDULE',
            'target_id' => $meeting2->id,
        ]);
    }

    public function test_admin_can_sort_schedules_by_mentor_name()
    {
        $mentorA = User::factory()->create(['role' => 'mentor', 'first_name' => 'Alice', 'last_name' => 'Doe']);
        $mentorB = User::factory()->create(['role' => 'mentor', 'first_name' => 'Bob', 'last_name' => 'Doe']);

        ParticipantMeeting::create([
            'mentor_id' => $mentorB->id,
            'agenda' => 'Meeting B',
            'scheduled_at' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        ParticipantMeeting::create([
            'mentor_id' => $mentorA->id,
            'agenda' => 'Meeting A',
            'scheduled_at' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHour(),
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->getJson(route('api.admin.schedules.pending', [
            'sort_by' => 'mentor.name',
            'sort_order' => 'asc'
        ]));

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('Meeting A', $data[0]['agenda']);
        $this->assertEquals('Meeting B', $data[1]['agenda']);
    }
}
