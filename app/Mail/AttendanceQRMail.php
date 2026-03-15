<?php

namespace App\Mail;

use App\Models\AttendanceSession;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Attachment;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AttendanceQRMail extends Mailable
{
    use Queueable, SerializesModels;

    public AttendanceSession $session;
    public string $mentorName;
    public string $agenda;
    public string $scheduledAt;
    public string $qrPayload;

    public function __construct(AttendanceSession $session)
    {
        $this->session     = $session;
        $meeting           = $session->meeting;
        $this->mentorName  = $meeting->mentor?->name ?? 'Mentor';
        $this->agenda      = $meeting->agenda ?? '-';
        $this->scheduledAt = $meeting->scheduled_at
            ? $meeting->scheduled_at->format('l, d F Y H:i')
            : '-';
        $this->qrPayload   = base64_encode(json_encode([
            'token'      => $session->token,
            'meeting_id' => $meeting->id,
        ]));
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Barcode Absensi Mentor - ' . $this->agenda,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.attendance-qr',
        );
    }

    public function attachments(): array
    {
        // Generate QR PNG and attach it so mentor can upload/use it
        $qrPng = QrCode::format('png')->size(300)->errorCorrection('H')->generate($this->qrPayload);

        return [
            Attachment::fromData(fn () => $qrPng, 'attendance-qr.png')
                ->withMime('image/png'),
        ];
    }
}
