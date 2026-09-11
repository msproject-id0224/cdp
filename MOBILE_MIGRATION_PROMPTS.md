# Prompt Kerja: Migrasi Partisipan ke Android (React Native)

Kumpulan prompt siap-pakai untuk dikerjakan bersama AI assistant (Copilot
Chat, Claude Code, Cursor, dll) di VS Code. Mengikuti roadmap 5 fase yang
sudah disepakati untuk memindahkan pengalaman partisipan Mitra dari web
Inertia ke aplikasi Android native.

**Cara pakai:** buka sesi chat baru dengan AI assistant → paste bagian
[Blok Konteks Proyek](#blok-konteks-proyek-paste-di-awal-setiap-sesi-semua-fase)
dulu → lanjutkan dengan blok fase yang sedang dikerjakan. Untuk fase 1-4,
mulai sesi baru saat fase sebelumnya sudah selesai, supaya konteks tidak
penuh dengan detail fase lama yang sudah tidak relevan.

---

## Blok Konteks Proyek (paste di awal setiap sesi, semua fase)

```
Kamu membantu saya mengerjakan migrasi pengalaman partisipan aplikasi Mitra
Project dari web ke aplikasi Android (React Native), mengikuti roadmap 5 fase
yang sudah disepakati. Ini proyek nyata, bukan proof-of-concept — backend
Laravel yang ada TIDAK BOLEH rusak untuk role admin/mentor.

## Konteks teknis proyek
- Laravel 12 + Inertia.js v2 + React 18 (SPA server-driven), bukan proyek
  API-first. Ini penting: banyak yang terlihat seperti "API" sebenarnya masih
  terikat session.
- Auth partisipan pakai OTP (email atau WhatsApp via Twilio Verify) di
  app/Http/Controllers/Auth/OtpController.php. Method verify()/resend() sudah
  punya percabangan $isApi yang return JSON, tapi masih di middleware `web`
  (session + CSRF) — bukan stateless.
- laravel/sanctum sudah terpasang tapi belum dipakai untuk personal access
  token. Guard aktif satu-satunya sekarang: `web` (session).
- routes/web.php punya banyak route berprefix /api/* (mis. /api/chat,
  /api/schedules, /api/admin/schedules) — ini AJAX endpoint untuk SPA yang
  sama, TETAP di middleware `web`, jangan dianggap API stateless yang sudah
  ada.
- Role dibedakan lewat app/Http/Middleware/RoleMiddleware.php (admin, mentor,
  participant). Model User (app/Models/User.php) punya isParticipant(),
  meetsAgeRequirement() (age-gate, minimum umur di
  User::MINIMUM_PARTICIPANT_AGE) — logic ini tidak boleh ditulis ulang dengan
  aturan berbeda, harus direplikasi/dipakai ulang persis.
- Program RMD (multi-tahap: profile, gods-purpose, what-the-bible-says,
  true-success, the-only-one + 2 meeting lanjutan, career-exploration x2,
  multiple-intelligence, socio-emotional, preparation-dream-island) dijaga
  middleware app/Http/Middleware/RmdAccessControl.php (alias `rmd.access`)
  yang saat ini me-redirect Inertia jika belum eligible.
- Realtime chat & notifikasi jadwal pakai Laravel Reverb (protokol Pusher),
  dikonfigurasi di resources/js/bootstrap.js. Push notification (FCM) BELUM
  ada sama sekali di project ini.
- Presensi partisipan pakai scan QR via html5-qrcode (API kamera browser) di
  app/Http/Controllers/AttendanceController.php.

## Aturan kerja yang berlaku di SEMUA fase
1. JANGAN ubah perilaku web untuk admin/mentor. routes/web.php existing dan
   guard `web` harus tetap jalan seperti sekarang.
2. Aturan bisnis (age-gate, eligibility RMD, rate limiting OTP, dst) HARUS
   satu sumber kebenaran — ekstrak ke Service/Action class di app/Services/
   yang dipanggil baik oleh controller web maupun controller API. Jangan
   duplikasi logic dengan menulis ulang dari nol di sisi API.
3. Response API pakai Laravel API Resource (JsonResource), jangan pernah
   return Eloquent model mentah — cek dulu field apa yang benar-benar perlu
   diekspos ke mobile.
4. Jangan tambah dependency baru tanpa alasan kuat. Jangan buat abstraksi
   atau helper generik yang belum dibutuhkan fitur yang sedang dikerjakan.
5. Ikuti gaya kode yang sudah ada di project (logging, format response error,
   penamaan) — baca dulu file controller terkait sebelum menulis kode baru,
   jangan asumsi struktur.
6. Sebelum coding: tulis rencana singkat (file yang akan dibuat/diubah) dan
   tunggu saya konfirmasi arahnya sebelum lanjut menulis kode.
7. Kerjakan bertahap per potongan kecil, jalankan test (phpunit di backend)
   setelah tiap bagian selesai — jangan tumpuk banyak perubahan sebelum
   divalidasi.
```

---

## Fase 0 — Fondasi API & Auth

```
FASE INI: Fondasi API & Auth (belum ada kode React Native, murni Laravel).

Tujuan:
1. Buat route group /api/v1 yang benar-benar stateless (middleware
   `auth:sanctum`), terpisah total dari routes/web.php.
2. Tambahkan issuance Sanctum token di alur OTP:
   - POST /api/v1/auth/otp/request
   - POST /api/v1/auth/otp/verify → jika valid, buat Sanctum token dengan
     ability `role:participant`, kembalikan token + JsonResource user.
   - POST /api/v1/auth/otp/resend
   - POST /api/v1/auth/logout → revoke token yang sedang dipakai.
   Reuse logic existing dari OtpController (rate limiting, age-gate, audit
   log LOGIN_SUCCESS/LOGIN_BLOCKED_UNDERAGE).
3. Pilih SATU controller partisipan scope kecil sebagai pilot refactor
   (rekomendasi: AttendanceController atau GiftController). Ekstrak logic
   bisnisnya ke Service class, buat controller web lama memanggil service
   itu, dan buat controller API baru di /api/v1 yang memanggil service YANG
   SAMA, return JsonResource.
4. Buat JsonResource untuk User (varian partisipan) dan entity pilot di
   langkah 3.

Exit criteria:
- Login & dapat Sanctum token via /api/v1/auth/otp/verify berhasil
  end-to-end (didemokan lewat curl/Postman).
- Age-gate & audit log di jalur API identik hasilnya dengan jalur web untuk
  kasus yang sama.
- Fitur pilot bisa diakses lewat /api/v1 dengan service layer yang sama
  persis dipakai controller web-nya.
```

---

## Fase 1 — RN Skeleton: Auth, Dashboard, Profile

```
FASE INI: Inisialisasi aplikasi React Native (Expo) dan alur paling
fondasional. Prasyarat: Fase 0 (endpoint /api/v1/auth/*) sudah selesai.

Tujuan:
1. Inisialisasi project Expo (TypeScript template), struktur folder rapi
   (screens, navigation, api client, secure storage helper).
2. Buat API client (axios/fetch) dengan base URL configurable per environment
   (dev/staging/prod), auto-attach header Authorization Bearer dari token
   yang tersimpan di expo-secure-store, dan auto-logout saat menerima 401.
3. Alur auth: input email/nomor → request OTP → input kode OTP → verify →
   simpan token → arahkan ke dashboard. Konsumsi endpoint dari Fase 0, jangan
   bikin ulang logic validasi di sisi client yang seharusnya di backend.
4. Dashboard screen: tampilkan ringkasan progress partisipan. Kalau endpoint
   GET /api/v1/dashboard belum ada dari Fase 0, bangun dengan pola service
   layer yang sama seperti DashboardController@index — jangan duplikasi
   logic query di controller API yang baru.
5. Profile screen: lihat & edit profil dasar, request upload foto profil
   (expo-image-picker + expo-image-manipulator untuk crop), kirim ke endpoint
   padanan participant.profile-photo.request.

Batasan tambahan fase ini:
- Pakai Expo managed workflow / dev client, TypeScript. Jangan install
  native module yang butuh bare workflow tanpa alasan kuat.

Exit criteria:
- Partisipan uji internal bisa login & melihat dashboard nyata di device
  Android fisik (bukan hanya emulator).
```

---

## Fase 2 — Fitur Inti: Presensi QR, Gift, Program RMD

```
FASE INI: Fitur inti partisipan. Prasyarat: Fase 1 (skeleton app + auth)
sudah jalan.

Tujuan (kerjakan berurutan sesuai tingkat risiko, dari yang paling
self-contained):
1. Presensi QR: screen scan pakai expo-camera (barcode scanning built-in),
   panggil endpoint attendance dari Fase 0 (atau bangun dengan pola service
   layer yang sama kalau belum ada). Ini bukti-konsep native module pertama.
2. Gift: list gift, klaim, upload bukti (expo-image-picker + endpoint gifts
   dari GiftController, ekstrak ke service dulu kalau belum).
3. Program RMD: bangun endpoint API per tahap (GET status + POST submit),
   dengan mereplikasi logic RmdAccessControl jadi RESPONS TERSTRUKTUR
   (misalnya {"eligible": false, "reason": "..."}), BUKAN redirect seperti di
   web. Bangun UI RN berbentuk stepper mengikuti urutan tahap yang sama
   persis seperti di routes/web.php: profile → gods-purpose →
   what-the-bible-says → true-success → the-only-one → meeting-2 →
   meeting-3 → career-exploration → career-exploration-p2 →
   preparation-dream-island → chapters. Termasuk upload meeting file.

Batasan tambahan fase ini:
- JANGAN ubah urutan atau aturan eligibility RMD yang sudah ada tanpa
  konfirmasi eksplisit dari saya — ini konten program yang sensitif secara
  bisnis, bukan sekadar detail teknis.

Exit criteria:
- Scan QR presensi tercatat identik dengan hasil di web.
- Partisipan uji internal menyelesaikan 1 siklus RMD penuh dari mobile.
```

---

## Fase 3 — Realtime: Chat & Push Notification

```
FASE INI: Chat real-time dan push notification. Ini fase paling berisiko
teknis — prasyarat: Fase 2 (fitur inti) sudah stabil.

Tujuan:
1. Cari/pilih WebSocket client React Native yang kompatibel protokol Pusher
   untuk konek ke Reverb (cek dulu channel yang didefinisikan di
   routes/channels.php agar subscribe ke channel yang sama seperti web).
2. Chat screen: global + 1:1, typing indicator, read receipt — konsumsi
   endpoint ChatMessageController (indexGlobal, index, store, typing,
   markAsRead, getUnreadCount). Kalau endpoint ini masih di middleware `web`,
   pindahkan/duplikasi ke /api/v1 dengan pola service layer yang sama seperti
   Fase 0, jangan tulis ulang business logic-nya.
3. Setup FCM: endpoint baru POST /api/v1/devices untuk registrasi device
   token, dan service backend untuk kirim push saat event chat baru/jadwal/
   approval/gift terjadi (evaluasi paket seperti kreait/laravel-firebase atau
   Notification channel custom).
4. Reconnect strategy: pantau AppState React Native, reconnect socket saat
   app kembali ke foreground setelah background.

Batasan tambahan fase ini:
- Reverb untuk web TIDAK boleh dimatikan atau diubah perilakunya. Push
  adalah tambahan untuk kondisi app di-background/killed, bukan pengganti
  socket real-time saat app terbuka.
- Uji koneksi di jaringan seluler asli (4G/data mobile), bukan hanya wifi.

Exit criteria:
- Pesan chat terkirim & diterima stabil di jaringan seluler nyata.
- Push notification sampai saat app di-background atau di-kill.
```

---

## Fase 4 — Hardening & Rollout

```
FASE INI: Stabilisasi dan persiapan rilis. TIDAK ADA fitur baru di fase ini
— fokus stabilitas dan proses rilis. Prasyarat: Fase 0-3 selesai.

Tujuan:
1. Setup konfigurasi EAS Build (app.json/eas.json), signing key Android,
   strategi versionCode/versionName.
2. Regresi test menyeluruh semua fitur Fase 1-3 di beberapa device fisik
   Android, termasuk device kelas bawah/spek rendah (asumsikan basis
   partisipan tidak semua pakai flagship).
3. Setup closed testing track di Google Play Console, undang tester
   internal (partisipan asli, bukan hanya tim internal).
4. Triage dan tutup semua bug P0/P1 dari hasil closed testing sebelum
   rollout bertahap.

Exit criteria:
- Tidak ada bug P0/P1 terbuka.
- Siap rollout bertahap (staged rollout) menuju general availability.
```
