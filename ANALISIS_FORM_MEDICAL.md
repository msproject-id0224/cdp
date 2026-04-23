# Analisis & Rekomendasi Digitalisasi "Form Medical" (BL-006-04)

Berdasarkan analisis terhadap kebutuhan sistem dan konteks formulir "Health Screening Form (BL-006-04)", berikut adalah **Rekomendasi Teknis & Bisnis Proses Terbaik** untuk membangun kembali fitur ini agar lebih stabil, akurat, dan mudah digunakan (user-friendly).

## 1. Tantangan Utama (Pain Points) pada Sistem Lama
*   **Risiko Kehilangan Data**: Penggunaan *Modal* (jendela pop-up) sangat berisiko. Jika user tidak sengaja mengklik area luar atau menekan tombol `Esc`, seluruh data yang sudah diisi (4 halaman) bisa hilang seketika.
*   **Struktur Data Tidak Fleksibel**: Penyimpanan data Imunisasi dan Pemeriksaan Fisik dalam format JSON (`json_encode`) membuat data sulit diolah untuk laporan statistik (contoh: sulit mencari "Anak mana yang belum imunisasi Campak?").
*   **Validasi Lemah**: Kesalahan input tipe data (String vs Integer) menyebabkan kegagalan penyimpanan diam-diam (*silent failure*).
*   **Konektivitas**: Tidak ada mekanisme penyimpanan sementara (*draft*) jika koneksi internet terputus di tengah pengisian.

---

## 2. Saran Perbaikan Bisnis Proses (Proposed Workflow)

### A. Perubahan Alur Input (UI/UX)
**Saran Utama: Ganti Modal dengan Halaman Khusus (Full Page Form)**
Alih-alih menggunakan Modal, gunakan halaman terdedikasi `/health-checks/create` atau `/health-checks/{id}/edit`.
*   **Keuntungan**: 
    *   Lebih fokus (distraction-free).
    *   Tidak hilang jika klik sembarangan.
    *   URL bisa dibagikan/disimpan.

### B. Fitur "Smart Form"
1.  **Auto-Save / Draft**: Sistem otomatis menyimpan progres ke `localStorage` browser setiap 5 detik. Jika browser tertutup, data bisa dipulihkan saat dibuka kembali.
2.  **Kalkulasi Otomatis**:
    *   **BMI**: Dihitung otomatis dari BB & TB.
    *   **Status Gizi (Z-Score)**: Jika memungkinkan, implementasikan standar WHO untuk penentuan status gizi otomatis, bukan manual pilih.
3.  **Pre-fill Data**: Saat membuat pemeriksaan baru, sistem otomatis mengambil data riwayat imunisasi dari pemeriksaan sebelumnya (karena riwayat imunisasi bersifat akumulatif).

### C. Mekanisme Tanda Tangan Digital
Mengganti input teks nama pemeriksa dengan **Canvas Tanda Tangan Digital**.
*   User dapat mencoret tanda tangan langsung di layar (HP/Tablet/Mouse).
*   Meningkatkan keabsahan dokumen digital.

---

## 3. Rekomendasi Struktur Database (Schema Optimization)

Untuk mendukung pelaporan yang lebih baik, disarankan melakukan **Normalisasi Database**. Jangan tumpuk semua di satu tabel `health_checks`.

### Tabel 1: `health_checks` (Data Utama)
*   `id`, `user_id`, `examiner_id`, `checked_at`
*   `vital_signs` (JSON: weight, height, bmi, temp, pulse, bp)
*   `conclusions` (Text: diagnosis, therapy, notes)
*   `status` (Enum: 'draft', 'final')

### Tabel 2: `health_check_immunizations` (Data Imunisasi)
*   `id`, `health_check_id`, `vaccine_code` (e.g., BCG, DPT1), `received_at`, `notes`
*   *Keuntungan*: Memudahkan query SQL untuk laporan cakupan imunisasi.

### Tabel 3: `health_check_findings` (Temuan Fisik)
*   `id`, `health_check_id`, `body_part` (e.g., 'head', 'chest'), `status` ('normal', 'abnormal'), `description`

---

## 4. Rencana Implementasi (Roadmap)

Jika Anda setuju, kita akan membangun ulang dengan tahapan berikut:

1.  **Fase 1: Backend & Database (Robustness)**
    *   Membuat migration baru dengan struktur ternormalisasi.
    *   Membuat API Endpoint dengan validasi ketat (Request Validation).
2.  **Fase 2: Frontend Form (Usability)**
    *   Membuat halaman form *multi-step* (bukan modal).
    *   Implementasi *Auto-save* ke LocalStorage.
3.  **Fase 3: Fitur Lanjutan (Advanced)**
    *   Integrasi Tanda Tangan Digital.
    *   Cetak PDF dengan layout resmi form medis.

Apakah Anda setuju untuk menerapkan pendekatan **Halaman Khusus (Full Page)** dan **Normalisasi Database** ini untuk menggantikan sistem lama?
