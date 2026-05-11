# Panduan Import Data Peserta (Mapping Guide)

Dokumen ini menjelaskan struktur file `list_partisipant_ready.xlsx` (dan `.csv`) yang telah disesuaikan agar kompatibel dengan database aplikasi.

## Struktur Tabel Baru
File hasil perbaikan memiliki kolom-kolom berikut yang sesuai dengan tabel `users` di database:

| Kolom Excel Baru | Nama Kolom Database | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **first_name** | `first_name` | Varchar | Diambil dari 'Akun Seseorang: Nama Depan' |
| **last_name** | `last_name` | Varchar | Diambil dari 'Akun Seseorang: Nama Belakang' |
| **nickname** | `nickname` | Varchar | Diambil dari 'Akun Seseorang: Nama Panggilan' |
| **id_number** | `id_number` | Varchar | Diambil dari 'Nomor Lokal Pen.Manfaat' (Format teks, 0 di depan dijaga) |
| **email** | `email` | Varchar | **Dibuat Otomatis**: `participant_[ID]@program.local` (Wajib Unik) |
| **role** | `role` | Enum | **Default**: 'participant' |
| **date_of_birth** | `date_of_birth` | Date | Diambil dari 'Tanggal Lahir' (Format: YYYY-MM-DD) |
| **gender** | `gender` | Varchar | Diambil dari 'Jenis Kelamin' |
| **education** | `education` | Varchar | Diambil dari 'Pendidikan' |
| **age_group** | `age_group` | Varchar | Diambil dari 'Kelompok Usia' |
| **is_active** | `is_active` | Boolean | **Default**: 1 (Aktif) |
| **password** | `password` | Varchar | **Default**: 'password123' (Harap minta user ganti saat login pertama) |

## Perubahan yang Dilakukan
1.  **Format Tanggal**: Mengubah format serial Excel (contoh: `38259`) menjadi format standar database (`2004-09-29`).
2.  **Generasi Email**: Karena email wajib ada dan unik, sistem membuat email sementara berdasarkan ID Number.
3.  **Penambahan Kolom Wajib**: Menambahkan kolom `role`, `is_active`, dan `password` yang tidak ada di file asli namun dibutuhkan sistem.
4.  **Pembersihan Header**: Mengubah nama header yang panjang/kompleks menjadi nama kolom database (snake_case) untuk memudahkan mapping otomatis.

## Cara Import Manual
1.  Buka **phpMyAdmin** atau tool database client Anda.
2.  Pilih tabel `users`.
3.  Pilih menu **Import**.
4.  Upload file `list_partisipant_ready.csv`.
5.  Pastikan format **CSV** dipilih.
6.  Centang opsi "The first line of the file contains the table column names" (Baris pertama adalah nama kolom).
7.  Klik **Go/Import**.

> **Catatan**: Jika menggunakan file `.xlsx` untuk import melalui aplikasi (jika fitur import tersedia), pastikan logic import aplikasi memetakan kolom sesuai nama header baru di atas.
