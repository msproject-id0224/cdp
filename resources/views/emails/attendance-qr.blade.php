<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcode Absensi Mentor</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
        .header { background: #4f46e5; padding: 28px 32px; color: #fff; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p  { margin: 6px 0 0; font-size: 14px; opacity: .85; }
        .body { padding: 28px 32px; }
        .info-row { display: flex; margin-bottom: 12px; }
        .info-label { color: #6b7280; font-size: 13px; width: 130px; flex-shrink: 0; }
        .info-value { color: #111827; font-size: 13px; font-weight: 600; }
        .qr-box { text-align: center; margin: 24px 0; padding: 20px; background: #f3f4f6; border-radius: 10px; }
        .qr-box img { width: 220px; height: 220px; }
        .qr-box p   { margin: 12px 0 0; font-size: 12px; color: #6b7280; }
        .steps { background: #eff6ff; border-radius: 8px; padding: 16px 20px; margin-top: 20px; }
        .steps h3  { margin: 0 0 10px; font-size: 14px; color: #1e40af; }
        .steps ol  { margin: 0; padding-left: 20px; }
        .steps li  { font-size: 13px; color: #1e40af; margin-bottom: 6px; }
        .footer { border-top: 1px solid #e5e7eb; padding: 18px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Barcode Absensi Mentor</h1>
        <p>Child Development Program</p>
    </div>

    <div class="body">
        <p style="color:#374151; font-size:14px; margin-top:0">
            Halo <strong>{{ $mentorName }}</strong>, berikut adalah barcode absensi untuk kegiatan Anda hari ini.
        </p>

        <div class="info-row">
            <span class="info-label">Kegiatan</span>
            <span class="info-value">{{ $agenda }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Jadwal</span>
            <span class="info-value">{{ $scheduledAt }}</span>
        </div>

        <div class="qr-box">
            {{-- QR image attached as 'attendance-qr.png' --}}
            <img src="{{ $message->embed(null) }}" alt="QR Code" style="display:block; margin:0 auto;">
            <p>Simpan / screenshot gambar QR di atas, lalu upload melalui fitur absensi di aplikasi.</p>
        </div>

        <div class="steps">
            <h3>Cara Menggunakan (via PC/Desktop)</h3>
            <ol>
                <li>Buka aplikasi di browser Anda dan masuk ke menu <strong>Absensi</strong>.</li>
                <li>Klik tombol <strong>"Upload Barcode"</strong>.</li>
                <li>Pilih file <em>attendance-qr.png</em> yang terlampir di email ini.</li>
                <li>Sistem akan memverifikasi dan mencatat kehadiran Anda secara otomatis.</li>
                <li>Setelah tercatat, upload foto dokumentasi kegiatan mengajar Anda.</li>
            </ol>
        </div>
    </div>

    <div class="footer">
        Email ini dikirim otomatis oleh sistem &mdash; Child Development Program &copy; {{ date('Y') }}
    </div>
</div>
</body>
</html>
