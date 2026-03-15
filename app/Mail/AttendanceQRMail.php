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
    public string $checkoutQrPayload;

    public function __construct(AttendanceSession $session)
    {
        $this->session     = $session;
        $meeting           = $session->meeting;
        $this->mentorName  = $meeting->mentor?->name ?? 'Mentor';
        $this->agenda      = $meeting->agenda ?? '-';
        $this->scheduledAt = $meeting->scheduled_at
            ? $meeting->scheduled_at->format('l, d F Y H:i')
            : '-';
        $this->qrPayload = base64_encode(json_encode([
            'token'      => $session->token,
            'meeting_id' => $meeting->id,
            'type'       => 'mulai',
        ]));
        $this->checkoutQrPayload = base64_encode(json_encode([
            'checkout_token' => $session->checkout_token,
            'meeting_id'     => $meeting->id,
            'type'           => 'selesai',
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
        $mulaiQr   = QrCode::format('png')->size(300)->errorCorrection('H')->generate($this->qrPayload);
        $selesaiQr = QrCode::format('png')->size(300)->errorCorrection('H')->generate($this->checkoutQrPayload);

        return [
            Attachment::fromData(fn () => $mulaiQr, 'qr-mulai.png')
                ->withMime('image/png'),
            Attachment::fromData(fn () => $selesaiQr, 'qr-selesai.png')
                ->withMime('image/png'),
        ];
    }
}
