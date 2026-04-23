# Dokumentasi Analisis Error: ReferenceError: flash is not defined

## 1. Deskripsi Error
*   **Jenis Error**: `ReferenceError` (JavaScript Runtime Error)
*   **Pesan Error**: `flash is not defined`
*   **Lokasi**: Halaman Login (`/login`)
*   **Dampak**: Halaman login gagal dirender sepenuhnya dan menampilkan layar "Something went wrong" (Crash). User tidak bisa melakukan login.

## 2. Analisis Root Cause
Error ini terjadi karena kode JavaScript mencoba mengakses variabel bernama `flash` secara langsung di dalam komponen React, padahal variabel tersebut belum dideklarasikan atau diimpor ke dalam scope komponen.

### Kode Bermasalah (Sebelum Perbaikan):
File: `resources/js/Pages/Auth/Login.jsx`

```jsx
export default function Login({ status, canResetPassword }) {
    // ...
    return (
        <GuestLayout>
            {/* ... */}
            {flash?.error && ( // <--- ERROR DISINI: variabel 'flash' tidak dikenal
                <div className="...">
                    {flash.error}
                </div>
            )}
            {/* ... */}
        </GuestLayout>
    );
}
```

### Faktor Kontribusi:
1.  **Inertia.js Shared Props**: Dalam aplikasi Inertia.js, data global seperti flash messages biasanya dikirim dari backend (Laravel) melalui middleware `HandleInertiaRequests.php` dan tersedia di frontend melalui props global.
2.  **Akses Props yang Salah**: Pengembang mencoba mengakses `flash` seolah-olah itu adalah variabel lokal atau prop yang didestrukturisasi langsung dari argumen komponen, namun lupa mendestrukturisasinya atau mengambilnya dari `usePage().props`.

## 3. Langkah Perbaikan
Untuk memperbaiki masalah ini, kita perlu mengambil objek `flash` dari shared props menggunakan hook `usePage` yang disediakan oleh Inertia.js.

### Kode Perbaikan (Sesudah Perbaikan):
File: `resources/js/Pages/Auth/Login.jsx`

```jsx
import { Head, useForm, usePage } from '@inertiajs/react'; // 1. Import usePage

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props; // 2. Ambil flash dari page props
    
    // ... kode lainnya tetap sama
```

## 4. Verifikasi
Setelah melakukan perubahan kode dan menjalankan `npm run build`, error `ReferenceError: flash is not defined` seharusnya sudah hilang. Halaman login akan dapat dirender dengan benar, dan jika ada pesan error dari backend (misalnya "Invalid credentials"), pesan tersebut akan tampil di dalam blok alert yang sebelumnya menyebabkan error.

## 5. Rekomendasi Preventif
1.  **Linter/Static Analysis**: Pastikan ESLint dikonfigurasi untuk mendeteksi variabel yang tidak terdefinisi (`no-undef`).
2.  **Destructuring Props**: Selalu periksa sumber data (props komponen vs global state/context) sebelum menggunakan variabel.
3.  **Testing**: Tambahkan smoke test atau component test yang merender halaman login untuk memastikan tidak ada runtime error saat rendering awal.
