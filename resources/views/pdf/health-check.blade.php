<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 15mm 15mm 15mm 15mm; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; width: 100%; line-height: 1.2; }

  .page { width: 100%; page-break-after: always; position: relative; min-height: 260mm; }
  .page:last-child { page-break-after: auto; }

  /* ── Header (table-based, no flex) ───────────────────────────── */
  .header-tbl { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  .header-tbl td { vertical-align: top; padding: 0; }
  .id-block { border-left: 3px solid #000; padding-left: 6px; }
  .id-block .lbl { font-weight: bold; font-size: 7.5pt; }
  .id-box { border: 1px solid #000; display: inline-block; padding: 1px 5px;
            font-size: 8pt; min-width: 80px; height: 15px; }
  .form-code { font-size: 11pt; font-weight: bold; letter-spacing: 1px; text-align: right; }
  .page-num  { font-size: 7.5pt; text-align: right; }

  /* ── Title ───────────────────────────────────────────────────── */
  .form-title    { font-size: 17pt; font-weight: bold; margin: 6px 0 0; }
  .form-subtitle { font-size: 11pt; color: #555; margin-bottom: 8px; }

  /* ── Generic field ───────────────────────────────────────────── */
  .field-row   { margin-bottom: 5px; }
  .lbl-id      { font-weight: bold; font-size: 7.5pt; color: #333; }
  .lbl-en      { font-style: italic; font-size: 7pt; color: #666; }
  .field-val   { border-bottom: 1px solid #666; min-height: 15px; padding: 1px 2px;
                 font-size: 9pt; width: 100%; display: block; }

  /* ── 2-col grid (table-layout:fixed keeps columns honest) ────── */
  .grid2 { width: 100%; border-collapse: collapse; display: table; table-layout: fixed; }
  .col   { display: table-cell; vertical-align: top; padding-right: 8px; }
  .col.half  { width: 50%; }
  .col.third { width: 33.33%; }
  .col.last  { padding-right: 0; }

  /* ── Section header ──────────────────────────────────────────── */
  .sec { background: #d0d0d0; text-align: center; padding: 3px 4px;
         font-weight: bold; font-size: 9pt; margin: 8px 0 5px; }
  .sec-en { font-style: italic; font-size: 8pt; font-weight: normal; }

  /* ── Radio grid for malnutrition ─────────────────────────────── */
  .radio-tbl { width: 100%; border-collapse: collapse; margin-top: 3px; }
  .radio-tbl td { width: 25%; vertical-align: middle; padding: 1px 2px; }
  .r-circle  { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid #000;
               display: inline-block; vertical-align: middle; }
  .r-filled  { background: #000; }

  /* ── Immunization table ──────────────────────────────────────── */
  .imm-tbl { width: 100%; border-collapse: collapse; margin-top: 3px; table-layout: fixed; font-size: 8pt; }
  .imm-tbl th { background: #eee; padding: 3px 3px; border: 1px solid #bbb;
                text-align: left; font-size: 7.5pt; }
  .imm-tbl td { padding: 2px 3px; border: 1px solid #bbb; vertical-align: middle; }

  /* ── Checkbox box ────────────────────────────────────────────── */
  .cb  { width: 10px; height: 10px; border: 1px solid #000; display: inline-block;
         text-align: center; line-height: 10px; font-size: 7pt; vertical-align: middle; }
  .cb.on { background: #000; color: #fff; }

  /* ── Checkbox list (2- or 3-col) ────────────────────────────── */
  .cb-tbl { width: 100%; border-collapse: collapse; }
  .cb-tbl td { vertical-align: top; padding: 2px 3px; font-size: 8.5pt; }

  /* ── Text area box ───────────────────────────────────────────── */
  .txt { border: 1px solid #999; min-height: 45px; padding: 3px 4px;
         font-size: 8.5pt; width: 100%; margin-top: 2px; word-wrap: break-word; }

  /* ── Physical / signature tables ────────────────────────────── */
  .exam-tbl { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .exam-tbl td { border: 1px solid #bbb; padding: 3px 4px; font-size: 8pt; vertical-align: top; }
  .exam-tbl .lc { font-weight: bold; width: 38%; }

  .sig-tbl { width: 100%; border-collapse: collapse; margin-top: 15px; table-layout: fixed; }
  .sig-tbl td { padding: 6px 4px; border-bottom: 1px solid #999; font-size: 9.5pt; vertical-align: top; }
  .sig-tbl .lc { font-weight: bold; width: 35%; font-size: 8.5pt; color: #333; border-bottom: none; padding-top: 8px; }
  .sig-tbl .val { border-bottom: 1px solid #000; min-height: 20px; }
  .sig-space { height: 60px; border-bottom: 1px solid #000 !important; }
</style>
</head>
<body>

@php
  $user    = $record->user;
  $name    = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
  $dob     = $user->date_of_birth  ? $user->date_of_birth->format('d/m/Y')  : '-';
  $gender  = $user->gender  ?? '-';
  $idNum   = $user->id_number ?? '-';
  $checked = $record->checked_at  ? $record->checked_at->format('d/m/Y')  : '-';

  $imm = $record->immunizations      ?? [];
  $pa  = $record->physical_appearance ?? [];
  $pe  = $record->physical_examination ?? [];
  $bs  = $record->body_systems        ?? [];
  $lab = $record->lab_tests           ?? [];

  $malLabel = [
    'tidak'        => 'Tidak / No',
    'ringan'       => 'Ringan / Mild',
    'sedang'       => 'Sedang / Moderate',
    'sangat_buruk' => 'Sangat Buruk / Severe',
  ][$record->malnutrition_status ?? 'tidak'] ?? '-';

  $vaccines = [
    ['code'=>'BCG', 'name'=>'BCG - Bacillus Calmette-Guerin'],
    ['code'=>'DPT', 'name'=>'DPT - Difteri, Pertusis, Tetanus'],
    ['code'=>'DT',  'name'=>'DT - Difteri, Tetanus'],
    ['code'=>'FLU', 'name'=>'FLU - Influenza'],
    ['code'=>'HEA', 'name'=>'HEA - Hepatitis A'],
    ['code'=>'HEB', 'name'=>'HEB - Hepatitis B'],
    ['code'=>'HIB', 'name'=>'HIB - H. Influenza Tipe B'],
    ['code'=>'HPV', 'name'=>'HPV - Human Papilloma Virus'],
    ['code'=>'JAP', 'name'=>'JAP - Japanese Encephalitis'],
    ['code'=>'MEA', 'name'=>'MEA - Campak / Measles'],
    ['code'=>'MEN', 'name'=>'MEN - Radang Selaput Otak'],
    ['code'=>'MMR', 'name'=>'MMR - Campak, Gondok, Rubella'],
    ['code'=>'PCV', 'name'=>'PCV - Pneumococcal Conjugate'],
    ['code'=>'POL', 'name'=>'POL - Polio'],
    ['code'=>'ROT', 'name'=>'ROT - Rotavirus'],
    ['code'=>'TT',  'name'=>'TT - Tetanus Toxoid'],
    ['code'=>'TYP', 'name'=>'TYP - Tipes / Typhoid'],
    ['code'=>'VAR', 'name'=>'VAR - Cacar Air / Varicella'],
    ['code'=>'YEL', 'name'=>'YEL - Demam Kuning / Yellow Fever'],
  ];
  $half     = (int) ceil(count($vaccines) / 2);
  $leftVax  = array_slice($vaccines, 0, $half);
  $rightVax = array_slice($vaccines, $half);

  $physItems = [
    ['key'=>'edema',        'label'=>'Busung/pembengkakan / Edema'],
    ['key'=>'lethargic',    'label'=>'Lesu / Lethargic'],
    ['key'=>'skin_problem', 'label'=>'Masalah Kulit / Skin Problem'],
    ['key'=>'jaundice',     'label'=>'Penyakit kuning / Jaundice'],
    ['key'=>'pallor',       'label'=>'Muka pucat / Pallor'],
  ];

  $peFields = [
    'head'                 => '028 Kepala / Head',
    'chest'                => '029 Dada / Chest',
    'abdomen'              => '030 Perut / Abdomen',
    'genitourinary'        => '031 Saluran kemih & genital / Genitourinary',
    'extremity'            => '032 Ekstremitas / Extremity',
    'superior_extremities' => '033 Extremitas Superior',
    'inferior_extremities' => '034 Ektremitas Inferior',
    'mental_health'        => '035 Status Kesehatan Mental',
    'signs_of_abuse'       => '036 Tanda Kekerasan & Penelantaran',
  ];

  $bsFields = [
    'auditory'       => 'Pendengaran / Auditory',
    'lymphatic'      => 'Sistem Limfatik / Lymphatic',
    'respiratory'    => 'Sistem Pernapasan / Respiratory',
    'circulatory'    => 'Peredaran Darah / Circulatory',
    'musculoskeletal'=> 'Otot & Tulang / Musculoskeletal',
    'skin'           => 'Kulit / Skin',
    'digestive'      => 'Sistem Pencernaan / Digestive',
    'nervous'        => 'Sistem Saraf / Nervous',
    'urinary'        => 'Saluran Kencing / Urinary',
    'endocrine'      => 'Sistem Endokrin / Endocrine',
    'reproductive'   => 'Sistem Reproduksi / Reproductive',
    'vision'         => 'Penglihatan / Vision',
  ];

  $labFields = [
    'full_blood_count' => 'Darah Lengkap / Full Blood Count',
    'sputum_test'      => 'Tes Lendir / Sputum Test',
    'urinalysis'       => 'Saluran Kencing / Urinalysis',
    'lab_other'        => 'Lainnya / Other',
    'hiv_test'         => 'Tes HIV / HIV Test',
    'stool_analysis'   => 'Analisa Stool / Stool Analysis',
    'xray'             => 'X-Ray',
  ];

  function chk($v) { return $v ? '&#10003;' : '&nbsp;'; }
  function on($v)  { return $v ? 'on' : ''; }
@endphp

{{-- ══════════ PAGE 1 ══════════ --}}
<div class="page">

  <table class="header-tbl">
    <tr>
      <td style="width:60%;">
        <div class="id-block">
          <div class="lbl">ID Penerima Manfaat &nbsp;<span class="lbl-en">001 Local Beneficiary ID</span></div>
          <div style="margin-top:3px;"><span class="id-box">{{ $idNum }}</span></div>
        </div>
      </td>
      <td style="width:40%;text-align:right;">
        <div class="form-code">BL-006-04</div>
        <div class="page-num">Page 1 / 4</div>
      </td>
    </tr>
  </table>

  <div class="form-title">Formulir Pemeriksaan Kesehatan</div>
  <div class="form-subtitle">Health Screening Form</div>

  <div class="field-row">
    <span class="lbl-id">Nama Depan</span> <span class="lbl-en">002 First Name</span>
    <span class="field-val">{{ $user->first_name ?? '' }}</span>
  </div>
  <div class="field-row">
    <span class="lbl-id">Nama Belakang</span> <span class="lbl-en">003 Last Name</span>
    <span class="field-val">{{ $user->last_name ?? '' }}</span>
  </div>

  <table class="grid2" style="margin-bottom:5px;">
    <tr>
      <td class="col half">
        <span class="lbl-id">Tanggal Lahir</span> <span class="lbl-en">004 Birthdate</span>
        <span class="field-val">{{ $dob }}</span>
      </td>
      <td class="col half last">
        <span class="lbl-id">Tanggal Pemeriksaan</span> <span class="lbl-en">005 Date of Screening</span>
        <span class="field-val">{{ $checked }}</span>
      </td>
    </tr>
    <tr>
      <td class="col half" colspan="2" style="padding-right:0;padding-top:4px;">
        <span class="lbl-id">Jenis Kelamin</span> <span class="lbl-en">006 Gender</span>
        <span class="field-val" style="max-width:120px;">{{ $gender }}</span>
      </td>
    </tr>
  </table>

  <div class="sec">Tanda Vital &nbsp;<span class="sec-en">Vital Sign</span></div>

  <table class="grid2">
    <tr>
      <td class="col half">
        <div class="field-row">
          <span class="lbl-id">Berat (kg)</span> <span class="lbl-en">007 Weight</span>
          <span class="field-val">{{ $record->weight ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Tinggi (cm)</span> <span class="lbl-en">008 Height</span>
          <span class="field-val">{{ $record->height ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">BMI/IMT (5+ tahun)</span> <span class="lbl-en">009 BMI</span>
          <span class="field-val">{{ $record->bmi ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Lingkar Kepala (cm)</span> <span class="lbl-en">010 Head Circumference</span>
          <span class="field-val">{{ $record->head_circumference ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Status Malnutrisi</span> <span class="lbl-en">011 Malnutrition Status</span>
          <table class="radio-tbl">
            <tr>
              <td><span class="r-circle {{ $record->malnutrition_status==='tidak' ? 'r-filled' : '' }}"></span> Tidak / No</td>
              <td><span class="r-circle {{ $record->malnutrition_status==='ringan' ? 'r-filled' : '' }}"></span> Ringan / Mild</td>
            </tr>
            <tr>
              <td><span class="r-circle {{ $record->malnutrition_status==='sedang' ? 'r-filled' : '' }}"></span> Sedang / Moderate</td>
              <td><span class="r-circle {{ $record->malnutrition_status==='sangat_buruk' ? 'r-filled' : '' }}"></span> Sangat Buruk / Severe</td>
            </tr>
          </table>
        </div>
      </td>
      <td class="col half last">
        <div class="field-row">
          <span class="lbl-id">Suhu</span> <span class="lbl-en">012 Temperature</span>
          <span class="field-val">{{ $record->temperature ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Denyut</span> <span class="lbl-en">013 Pulse</span>
          <span class="field-val">{{ $record->pulse ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Pernapasan</span> <span class="lbl-en">014 Respiration</span>
          <span class="field-val">{{ $record->respiration ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Tekanan Darah (12+ th)</span> <span class="lbl-en">015 Blood Pressure</span>
          <span class="field-val">{{ $record->blood_pressure ?? '' }}</span>
        </div>
        <div class="field-row">
          <span class="lbl-id">Tanggapan</span> <span class="lbl-en">016 Comments</span>
          <div class="txt" style="min-height:38px;">{{ $record->comments ?? '' }}</div>
        </div>
      </td>
    </tr>
  </table>

  <div class="sec">Imunisasi yang Diberikan &nbsp;<span class="sec-en">Immunizations Given</span></div>
  <p style="font-size:7.5pt;margin-bottom:3px;">017 Tandai semua vaksinasi yang diberikan hari ini. Nomor dosis atau B untuk booster.<br>
  <em>Please indicate all vaccinations given today. Dose number or B for booster.</em></p>

  {{-- 8 columns: cb|code|name|dose || cb|code|name|dose --}}
  <table class="imm-tbl">
    <colgroup>
      <col style="width:4%">
      <col style="width:7%">
      <col style="width:34%">
      <col style="width:9%">
      <col style="width:4%">
      <col style="width:7%">
      <col style="width:25%">
      <col style="width:10%">
    </colgroup>
    <thead>
      <tr>
        <th></th><th>Kode</th><th>Nama</th><th>Dosis</th>
        <th></th><th>Kode</th><th>Nama</th><th>Dosis</th>
      </tr>
    </thead>
    <tbody>
      @for ($i = 0; $i < count($leftVax); $i++)
        @php $lv = $leftVax[$i]; $rv = $rightVax[$i] ?? null; @endphp
        <tr>
          <td><span class="cb {{ on($imm[$lv['code']]['checked'] ?? false) }}">{!! chk($imm[$lv['code']]['checked'] ?? false) !!}</span></td>
          <td><strong>{{ $lv['code'] }}</strong></td>
          <td>{{ $lv['name'] }}</td>
          <td>{{ $imm[$lv['code']]['dose'] ?? '' }}</td>
          @if($rv)
          <td><span class="cb {{ on($imm[$rv['code']]['checked'] ?? false) }}">{!! chk($imm[$rv['code']]['checked'] ?? false) !!}</span></td>
          <td><strong>{{ $rv['code'] }}</strong></td>
          <td>{{ $rv['name'] }}</td>
          <td>{{ $imm[$rv['code']]['dose'] ?? '' }}</td>
          @else
          <td colspan="4"></td>
          @endif
        </tr>
      @endfor
    </tbody>
  </table>
</div>

{{-- ══════════ PAGE 2 ══════════ --}}
<div class="page">

  <table class="header-tbl">
    <tr>
      <td style="width:60%;">
        <div class="id-block">
          <div class="lbl">ID Penerima Manfaat &nbsp;<span class="lbl-en">018 Local Beneficiary ID</span></div>
          <div style="margin-top:3px;"><span class="id-box">{{ $idNum }}</span></div>
        </div>
      </td>
      <td style="width:40%;text-align:right;">
        <div class="form-code">BL-006-04</div>
        <div class="page-num">Page 2 / 4</div>
      </td>
    </tr>
  </table>

  <div class="field-row" style="margin-top:8px;">
    <span class="cb {{ on($record->childhood_immunizations_completed) }}">{!! chk($record->childhood_immunizations_completed) !!}</span>
    &nbsp;<strong>Sudah menerima imunisasi lengkap</strong>
    &nbsp;<em class="lbl-en">019 Childhood Immunizations Completed</em>
  </div>

  <div class="field-row" style="margin-top:6px;">
    <span class="lbl-id">Imunisasi Lainnya</span>
    <span class="lbl-en">(Tulis nama imunisasi lainnya &amp; kapan diterima / Write other immunizations received)</span>
    <div class="txt">{{ $record->other_immunizations ?? '' }}</div>
  </div>

  <div class="sec">Vitamin dan Pengobatan Obat Cacing &nbsp;<span class="sec-en">Vitamin and Deworming Received</span></div>

  <table class="grid2" style="margin-bottom:6px;">
    <tr>
      <td class="col half">
        <span class="cb {{ on($record->vitamin_a_received) }}">{!! chk($record->vitamin_a_received) !!}</span>
        &nbsp;<strong>Vitamin A</strong> &nbsp;<em class="lbl-en">019 – Dosis Terakhir / Last Dose</em>
        <span class="field-val" style="margin-top:3px;">{{ $record->vitamin_a_date ? $record->vitamin_a_date->format('d/m/Y') : '' }}</span>
      </td>
      <td class="col half last">
        <span class="cb {{ on($record->deworming_received) }}">{!! chk($record->deworming_received) !!}</span>
        &nbsp;<strong>Cacingan</strong> &nbsp;<em class="lbl-en">020 – Dosis Terakhir / Last Dose</em>
        <span class="field-val" style="margin-top:3px;">{{ $record->deworming_date ? $record->deworming_date->format('d/m/Y') : '' }}</span>
      </td>
    </tr>
  </table>

  <div class="sec">Riwayat Kesehatan / Riwayat Operasi &nbsp;<span class="sec-en">Past Medical / Surgical History</span></div>
  <p style="font-size:7.5pt;margin-bottom:3px;">021 Kondisi cacat sejak lahir/turunan, penyakit berat/kronis, operasi, kecelakaan, masuk RS, infeksi kulit, penyakit keluarga yang mempengaruhi anak.<br>
  <em>Including: Hereditary/Congenital, Disabilities, Serious/Chronic Diseases, Accidents, Surgery, Hospitalization.</em></p>
  <div class="txt">{{ $record->medical_history ?? '' }}</div>

  <div class="sec">Tampilan Fisik &nbsp;<span class="sec-en">Physical Appearance</span></div>
  @php $paChunks = array_chunk($physItems, 3); @endphp
  <table class="cb-tbl" style="margin-bottom:5px;">
    @foreach($paChunks as $row)
    <tr>
      @foreach($row as $item)
      <td style="width:33%;">
        <span class="cb {{ on($pa[$item['key']] ?? false) }}">{!! chk($pa[$item['key']] ?? false) !!}</span>
        &nbsp;{{ $item['label'] }}
      </td>
      @endforeach
      @for($p = count($row); $p < 3; $p++)<td></td>@endfor
    </tr>
    @endforeach
    <tr>
      <td colspan="3">
        <span class="cb {{ on($pa['other'] ?? false) }}">{!! chk($pa['other'] ?? false) !!}</span>
        &nbsp;Lainnya / Other:&nbsp;{{ $pa['other_text'] ?? '' }}
      </td>
    </tr>
  </table>

  <div class="sec">Pemeriksaan Fisik &nbsp;<span class="sec-en">Physical Examination</span></div>
  <table class="exam-tbl">
    @foreach($peFields as $key => $label)
    <tr>
      <td class="lc">{{ $label }}</td>
      <td>{{ $pe[$key] ?? '' }}</td>
    </tr>
    @endforeach
  </table>
</div>

{{-- ══════════ PAGE 3 ══════════ --}}
<div class="page">

  <table class="header-tbl">
    <tr>
      <td style="width:60%;">
        <div class="id-block">
          <div class="lbl">ID Penerima Manfaat &nbsp;<span class="lbl-en">037 Local Beneficiary ID</span></div>
          <div style="margin-top:3px;"><span class="id-box">{{ $idNum }}</span></div>
        </div>
      </td>
      <td style="width:40%;text-align:right;">
        <div class="form-code">BL-006-04</div>
        <div class="page-num">Page 3 / 4</div>
      </td>
    </tr>
  </table>

  <div class="sec" style="margin-top:8px;">Gangguan Sistem Tubuh &nbsp;<span class="sec-en">Body Systems Disturbance</span></div>
  @php $bsChunks = array_chunk(array_keys($bsFields), 3); @endphp
  <table class="cb-tbl" style="margin-bottom:5px;">
    @foreach($bsChunks as $row)
    <tr>
      @foreach($row as $key)
      <td style="width:33%;">
        <span class="cb {{ on($bs[$key] ?? false) }}">{!! chk($bs[$key] ?? false) !!}</span>
        &nbsp;{{ $bsFields[$key] }}
      </td>
      @endforeach
      @for($p = count($row); $p < 3; $p++)<td></td>@endfor
    </tr>
    @endforeach
  </table>
  <span class="lbl-id">Penjelasan</span> <span class="lbl-en">Explanation</span>
  <div class="txt">{{ $record->body_systems_explanation ?? '' }}</div>

  <div class="sec">Pengembangan &nbsp;<span class="sec-en">Developmental</span></div>
  <p style="font-size:7.5pt;margin-bottom:3px;"><em>(anak di bawah usia 5 tahun / Children under 5 years of Age)</em></p>
  <table class="exam-tbl">
    <tr><td class="lc">050 Motorik Kasar / Gross Motor</td><td>{{ $record->gross_motor ?? '' }}</td></tr>
    <tr><td class="lc">051 Motorik Halus / Fine Motor</td><td>{{ $record->fine_motor ?? '' }}</td></tr>
    <tr><td class="lc">052 Bahasa / Language</td><td>{{ $record->language_dev ?? '' }}</td></tr>
    <tr><td class="lc">053 Pribadi-Sosial / Personal-Social</td><td>{{ $record->personal_social ?? '' }}</td></tr>
  </table>

  <div class="sec">Tes Laboratorium &nbsp;<span class="sec-en">Laboratory Test</span></div>
  @php $labChunks = array_chunk(array_keys($labFields), 2); @endphp
  <table class="cb-tbl" style="margin-bottom:5px;">
    @foreach($labChunks as $row)
    <tr>
      @foreach($row as $key)
      <td style="width:50%;">
        <span class="cb {{ on($lab[$key] ?? false) }}">{!! chk($lab[$key] ?? false) !!}</span>
        &nbsp;{{ $labFields[$key] }}
      </td>
      @endforeach
      @if(count($row) < 2)<td></td>@endif
    </tr>
    @endforeach
  </table>
  <span class="lbl-id">Temuan</span> <span class="lbl-en">061 Findings</span>
  <div class="txt">{{ $record->lab_findings ?? '' }}</div>
</div>

{{-- ══════════ PAGE 4 ══════════ --}}
<div class="page">

  <table class="header-tbl">
    <tr>
      <td style="width:60%;">
        <div class="id-block">
          <div class="lbl">ID Penerima Manfaat &nbsp;<span class="lbl-en">062 Local Beneficiary ID</span></div>
          <div style="margin-top:3px;"><span class="id-box">{{ $idNum }}</span></div>
        </div>
      </td>
      <td style="width:40%;text-align:right;">
        <div class="form-code">BL-006-04</div>
        <div class="page-num">Page 4 / 4</div>
      </td>
    </tr>
  </table>

  <div class="sec" style="margin-top:8px;">Interpretasi dan Rekomendasi &nbsp;<span class="sec-en">Interpretation and Recommendation</span></div>

  <div class="field-row" style="margin-top:6px;">
    <span class="lbl-id">Temuan Penting</span> <span class="lbl-en">063 Major Findings</span>
    <div class="txt">{{ $record->major_findings ?? '' }}</div>
  </div>

  <div class="field-row" style="margin-top:6px;">
    <span class="lbl-id">Diagnosis dan Nomor ICD jika Diketahui</span>
    <span class="lbl-en">064 Diagnosis and ICD Number if Known</span>
    <div class="txt">{{ $record->diagnosis ?? '' }}</div>
  </div>

  <div class="field-row" style="margin-top:6px;">
    <span class="lbl-id">Terapi dan Rekomendasi</span> <span class="lbl-en">065 Therapy and Recommendation</span>
    <div class="txt">{{ $record->therapy ?? '' }}</div>
  </div>

  <div class="sec" style="margin-top:20px; text-transform: uppercase; letter-spacing: 1px;">Pengesahan Pemeriksa &nbsp;<span class="sec-en">Credential of Examiner</span></div>
  <table class="sig-tbl" style="margin-top: 10px;">
    <tr>
      <td class="lc" style="border-bottom: 1px solid #999;">Nama &nbsp;<em class="lbl-en">066 Name</em></td>
      <td style="border-bottom: 1px solid #999;">{{ $record->examiner_name ?? '' }}</td>
    </tr>
    <tr>
      <td class="lc" style="border-bottom: 1px solid #999;">Jabatan &nbsp;<em class="lbl-en">067 Qualification</em></td>
      <td style="border-bottom: 1px solid #999;">{{ $record->examiner_qualification ?? '' }}</td>
    </tr>
    <tr>
      <td class="lc" style="border-bottom: 1px solid #999;">Tanggal &nbsp;<em class="lbl-en">068 Date</em></td>
      <td style="border-bottom: 1px solid #999;">{{ $record->examiner_date ? $record->examiner_date->format('d/m/Y') : '' }}</td>
    </tr>
    <tr>
      <td class="lc">Tandatangan &nbsp;<em class="lbl-en">069 Signature</em></td>
      <td class="sig-space" style="vertical-align: bottom; font-style: italic; color: #555;">
        @if($record->examiner_signature)
            {{ $record->examiner_signature }}
        @else
            &nbsp;
        @endif
      </td>
    </tr>
  </table>

</div>

</body>
</html>
