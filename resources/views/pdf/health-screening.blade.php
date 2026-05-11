<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Health Screening Report</title>
    <style>
        body { font-family: sans-serif; font-size: 10pt; color: #333; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #444; padding-bottom: 10px; position: relative; }
        .header h1 { margin: 0; font-size: 16pt; text-transform: uppercase; }
        .header p { margin: 2px 0; font-size: 9pt; color: #666; }
        .qr-container { 
            position: absolute; 
            top: 0; 
            right: 0; 
            text-align: center;
        }
        .qr-container img { width: 80px; height: 80px; }
        .qr-text { font-size: 8pt; font-weight: bold; margin-top: 2px; }
        .section { margin-bottom: 20px; }
        .section-title { background: #eee; padding: 5px 10px; font-weight: bold; border-left: 4px solid #444; margin-bottom: 10px; font-size: 11pt; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
        th { background: #f9f9f9; font-weight: bold; width: 30%; }
        
        .grid { display: table; width: 100%; margin-bottom: 10px; }
        .col { display: table-cell; width: 50%; vertical-align: top; padding-right: 10px; }
        
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 8pt; font-weight: bold; color: white; }
        .bg-green { background-color: #28a745; }
        .bg-yellow { background-color: #ffc107; color: #333; }
        .bg-orange { background-color: #fd7e14; }
        .bg-red { background-color: #dc3545; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 9pt; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
    </style>
</head>
<body>

    <div class="header">
        @if(isset($qrCodeImg))
            <div class="qr-container">
                <img src="{{ $qrCodeImg }}" alt="QR Code">
                <div class="qr-text">{{ $qrCodeText ?? '' }}</div>
            </div>
        @endif
        <h1>Formulir Pemeriksaan Kesehatan</h1>
        <p>Child Development Program — Health Screening Report</p>
        <p>Ref: BL-006-04 | Date: {{ $screening->checked_at->format('d F Y') }}</p>
    </div>

    <!-- Identitas -->
    <div class="section">
        <div class="section-title">I. Identitas Peserta</div>
        <table>
            <tr>
                <th>Nama Peserta</th>
                <td>{{ $screening->user->name }}</td>
                <th>ID Peserta</th>
                <td>{{ $screening->user->id_number ?? '-' }}</td>
            </tr>
            <tr>
                <th>Tanggal Pemeriksaan</th>
                <td>{{ $screening->checked_at->format('d F Y') }}</td>
                <th>Pemeriksa</th>
                <td>{{ $screening->examiner_name ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <!-- Vital Signs -->
    <div class="section">
        <div class="section-title">II. Tanda Vital (Vital Signs)</div>
        <table>
            <tr>
                <th style="width: 25%">Berat Badan</th>
                <td style="width: 25%">{{ $screening->weight ? $screening->weight . ' kg' : '-' }}</td>
                <th style="width: 25%">Tinggi Badan</th>
                <td style="width: 25%">{{ $screening->height ? $screening->height . ' cm' : '-' }}</td>
            </tr>
            <tr>
                <th>BMI (Body Mass Index)</th>
                <td>
                    {{ $screening->bmi ? $screening->bmi : '-' }} 
                    @if($screening->bmi)
                        <span style="font-size: 8pt; color: #666;">
                            ({{ $screening->bmi < 18.5 ? 'Kurus' : ($screening->bmi < 25 ? 'Normal' : ($screening->bmi < 30 ? 'Gemuk' : 'Obesitas')) }})
                        </span>
                    @endif
                </td>
                <th>Lingkar Kepala</th>
                <td>{{ $screening->head_circumference ? $screening->head_circumference . ' cm' : '-' }}</td>
            </tr>
            <tr>
                <th>Suhu Tubuh</th>
                <td>{{ $screening->temperature ? $screening->temperature . ' °C' : '-' }}</td>
                <th>Tekanan Darah</th>
                <td>{{ $screening->blood_pressure ? $screening->blood_pressure . ' mmHg' : '-' }}</td>
            </tr>
            <tr>
                <th>Nadi</th>
                <td>{{ $screening->pulse ? $screening->pulse . ' bpm' : '-' }}</td>
                <th>Pernapasan</th>
                <td>{{ $screening->respiration ? $screening->respiration . ' x/menit' : '-' }}</td>
            </tr>
            <tr>
                <th>Status Malnutrisi</th>
                <td colspan="3">
                    @php
                        $status = $screening->malnutrition_status;
                        $color = $status === 'normal' ? '#28a745' : ($status === 'mild' ? '#ffc107' : ($status === 'moderate' ? '#fd7e14' : '#dc3545'));
                        $label = $status === 'normal' ? 'Normal' : ($status === 'mild' ? 'Ringan' : ($status === 'moderate' ? 'Sedang' : 'Sangat Buruk'));
                    @endphp
                    <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold; color: white; background-color: {{ $color }};">{{ $label }}</span>
                </td>
            </tr>
            @if($screening->comments)
            <tr>
                <th>Tanggapan</th>
                <td colspan="3">{{ $screening->comments }}</td>
            </tr>
            @endif
        </table>
    </div>

    <!-- Imunisasi -->
    <div class="section">
        <div class="section-title">III. Imunisasi, Vitamin & Obat Cacing</div>
        
        <table style="margin-bottom: 15px;">
            <tr>
                <th style="width: 25%">Status Imunisasi</th>
                <td style="width: 75%">
                    @php
                        $immStatus = $screening->immunization_status;
                        $immLabel = $immStatus === 'complete' ? 'Lengkap' : ($immStatus === 'fully_complete' ? 'Sangat Lengkap' : 'Belum Lengkap');
                        $immColor = $immStatus === 'complete' ? '#28a745' : ($immStatus === 'fully_complete' ? '#6f42c1' : '#ffc107'); // Purple for fully complete
                        if(!$immStatus) { $immLabel = '-'; $immColor = 'transparent'; }
                    @endphp
                    @if($immStatus)
                        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold; color: white; background-color: {{ $immColor }};">{{ $immLabel }}</span>
                    @else
                        -
                    @endif
                </td>
            </tr>
            @if($screening->immunization_other)
            <tr>
                <th>Imunisasi Lainnya</th>
                <td>{{ $screening->immunization_other }}</td>
            </tr>
            @endif
            <tr>
                <th>Vitamin A</th>
                <td>
                    @if($screening->vitamin_a_dose === 'blue')
                        Biru (Bayi)
                    @elseif($screening->vitamin_a_dose === 'red')
                        Merah (Balita)
                    @elseif($screening->vitamin_a_dose === 'given')
                        Sudah Diberikan
                    @elseif($screening->vitamin_a_dose === 'none')
                        Belum
                    @else
                        -
                    @endif
                    
                    @if($screening->vitamin_a_date)
                        <span style="color: #666; font-size: 8pt;"> (Tgl: {{ $screening->vitamin_a_date->format('d/m/Y') }})</span>
                    @endif
                </td>
            </tr>
            <tr>
                <th>Obat Cacing</th>
                <td>
                    @if($screening->deworming_dose === 'yes')
                        Sudah Diberikan
                    @elseif($screening->deworming_dose === 'no')
                        Belum
                    @else
                        -
                    @endif

                    @if($screening->deworming_date)
                        <span style="color: #666; font-size: 8pt;"> (Tgl: {{ $screening->deworming_date->format('d/m/Y') }})</span>
                    @endif
                </td>
            </tr>
        </table>

        @if($screening->immunizations->count() > 0)
            <h4 style="margin: 5px 0; font-size: 10pt;">Daftar Imunisasi (Diberikan/Riwayat)</h4>
            <table style="font-size: 9pt;">
                <thead>
                    <tr>
                        <th style="width: 15%">Kode</th>
                        <th style="width: 25%">Tanggal</th>
                        <th style="width: 20%">Dosis</th>
                        <th style="width: 40%">Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($screening->immunizations as $imm)
                        <tr>
                            <td><strong>{{ $imm->vaccine_code }}</strong></td>
                            <td>{{ $imm->received_at ? $imm->received_at->format('d/m/Y') : '-' }}</td>
                            <td>{{ $imm->dose ?? '-' }}</td>
                            <td>
                                @if($imm->is_given_today)
                                    <span style="color: green;">✓ Diberikan Hari Ini</span>
                                @else
                                    <span style="color: #666;">Riwayat</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>
    
    <!-- Riwayat Kesehatan -->
    <div class="section">
        <div class="section-title">IV. Riwayat Kesehatan / Operasi</div>
        <p style="border: 1px solid #ddd; padding: 10px; min-height: 40px; background-color: #fafafa;">
            {{ $screening->medical_history ?? '-' }}
        </p>
    </div>

    <!-- Temuan Klinis -->
    <div class="section">
        <div class="section-title">V. Pemeriksaan Fisik & Sistem Tubuh</div>
        
        @php
            $abnormalFindings = $screening->findings->where('status', 'abnormal');
        @endphp

        @if($abnormalFindings->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%">Area Pemeriksaan</th>
                        <th style="width: 70%">Deskripsi Kelainan</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($abnormalFindings as $f)
                        <tr>
                            <td>
                                <strong>{{ ucfirst(str_replace('_', ' ', $f->category)) }}</strong><br>
                                <span style="font-size: 8pt; color: #666;">{{ ucfirst($f->item_key) }}</span>
                            </td>
                            <td style="color: #d32f2f;">{{ $f->description }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p><strong>Tidak ditemukan kelainan fisik (Semua dalam batas normal).</strong></p>
        @endif
    </div>

    <!-- Kesimpulan -->
    <div class="section">
        <div class="section-title">VI. Kesimpulan & Rekomendasi</div>
        <table>
            <tr>
                <th style="width: 25%">Temuan Penting</th>
                <td style="width: 75%">{{ $screening->major_findings ?? '-' }}</td>
            </tr>
            <tr>
                <th>Diagnosis</th>
                <td>{{ $screening->diagnosis ?? '-' }}</td>
            </tr>
            <tr>
                <th>Terapi / Rekomendasi</th>
                <td>{{ $screening->therapy ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <!-- Tanda Tangan -->
    <div class="section" style="margin-top: 40px;">
        <div class="grid">
            <div class="col"></div>
            <div class="col" style="text-align: center;">
                <p>Tenaga Medis/Kesehatan,</p>
                @if(isset($footerQrImg))
                    <div style="margin: 10px auto;">
                        <img src="{{ $footerQrImg }}" alt="Digital Signature" style="width: 100px; height: 100px;">
                    </div>
                @else
                    <br><br><br>
                @endif
                <p style="font-weight: bold; text-decoration: underline;">{{ $screening->examiner_name }}</p>
                <p>{{ $screening->examiner_qualification }}</p>
                <p style="font-size: 8pt;">{{ $screening->examiner_signed_at ? $screening->examiner_signed_at->format('d F Y') : '-' }}</p>
            </div>
        </div>
    </div>

    <div class="footer">
        Dicetak pada {{ now()->format('d/m/Y H:i') }} oleh Sistem Informasi Child Development Program.
    </div>

</body>
</html>
