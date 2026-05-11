# Setup Database & Dokumentasi Teknis
# Child Development Program

Dokumen ini menjelaskan struktur database, konfigurasi koneksi, dan keamanan untuk aplikasi Child Development Program.

## 1. Koneksi Database
Aplikasi menggunakan MySQL sebagai database utama. Konfigurasi terdapat pada file `.env`.

### Parameter Koneksi
| Parameter | Value (Default Local) | Keterangan |
|-----------|-----------------------|------------|
| DB_CONNECTION | mysql | Driver Database |
| DB_HOST | 127.0.0.1 | Host Server Database |
| DB_PORT | 3307 | Port MySQL (Default XAMPP mungkin 3306) |
| DB_DATABASE | child_development_program | Nama Database |
| DB_USERNAME | root | Username Database |
| DB_PASSWORD | secret | Password Database |

**URL Akses phpMyAdmin:**
[http://localhost/phpmyadmin/index.php?route=/database/structure&db=child_development_program](http://localhost/phpmyadmin/index.php?route=/database/structure&db=child_development_program)

## 2. Struktur Tabel Utama

### `users`
Tabel inti untuk menyimpan data pengguna (Admin, Mentor, Partisipan).
- `id`: Primary Key
- `email`: Unique, normalized (lowercase, trim)
- `role`: Enum ('admin', 'mentor', 'participant')
- `is_active`: Boolean (Status akun)
- `mentor_id`: Foreign Key ke `users.id` (Relasi Partisipan -> Mentor)
- `first_name`, `last_name`: Identitas
- Data demografis: `date_of_birth`, `gender`, `address`, `phone_number`

### `rmd_*` Tables (Program Data)
Tabel-tabel untuk modul RMD (Rekam Jejak Anak? / Program Module).
- `rmd_profiles`: Profil spesifik program RMD.
- `rmd_multiple_intelligences`: Data kecerdasan majemuk (Linguistic, Logical, Musical, dll).
- `rmd_bible_reflections`: Data refleksi spiritual.
- `rmd_the_only_ones`: Data modul "Satu-Satunya".
- `rmd_true_successes`: Data modul "Keberhasilan Sejati".

### `participant_*` Tables (Aktivitas)
- `participant_notes`: Catatan mentor untuk partisipan.
- `participant_tasks`: Tugas yang diberikan kepada partisipan.
- `participant_meetings`: Jadwal pertemuan/mentoring.

### `audit_logs`
Mencatat jejak audit untuk keamanan dan debugging.
- `action`: Jenis aksi (CREATE, UPDATE, DELETE, LOGIN)
- `user_id`: Pelaku aksi
- `target_type`, `target_id`: Objek yang diubah
- `details`: JSON payload perubahan data

## 3. Keamanan Database

### Prepared Statements
Aplikasi menggunakan Laravel Eloquent ORM yang secara default menggunakan PDO Prepared Statements untuk semua query `SELECT`, `INSERT`, `UPDATE`, dan `DELETE`. Ini mencegah serangan SQL Injection.

Contoh implementasi aman (Code Reference):
```php
// Aman (Prepared Statement via Eloquent)
User::where('email', $email)->first();

// Tidak Aman (Raw SQL - TIDAK DIGUNAKAN)
DB::statement("SELECT * FROM users WHERE email = '$email'");
```

### Transaksi Database
Operasi manipulasi data yang kompleks dibungkus dalam Database Transactions untuk menjamin integritas data (ACID).
```php
DB::beginTransaction();
try {
    // Operasi 1
    // Operasi 2
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack();
    // Log Error
}
```

### Error Handling
Koneksi database dilindungi dengan `try-catch` blocks. Kegagalan koneksi akan dicatat di `storage/logs/laravel.log` tanpa mengekspos kredensial sensitif ke pengguna akhir.

## 4. Manajemen Role & Login

### Roles
- **Admin**: Akses penuh (CRUD User, Assign Mentor, View Audit Log).
- **Mentor**: Read-only partisipan yang ditugaskan, Create Notes/Tasks.
- **Participant**: Akses profil sendiri dan modul program.

### Alur Login
1. User memasukkan email.
2. Sistem memvalidasi email dan status `is_active`.
3. OTP (One Time Password) dikirim ke email (via Mailpit di local).
4. User memverifikasi OTP.
5. Login berhasil -> Redirect ke Dashboard sesuai Role.

## 5. Cara Setup
1. Pastikan MySQL berjalan (XAMPP/Docker).
2. Buat database `child_development_program` di phpMyAdmin.
3. Copy `.env.example` ke `.env` dan sesuaikan kredensial DB.
4. Jalankan migrasi: `php artisan migrate`.
5. (Opsional) Jalankan seeder: `php artisan db:seed`.
