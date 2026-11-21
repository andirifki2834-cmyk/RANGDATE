# RNG DAT — Ruang Data Desa
**Satu Desa, Satu Data, Pelayanan Lebih Baik.** Sistem Informasi & Administrasi Kependudukan Desa (PWA).

## Akun Awal (dibuat otomatis di server saat login pertama, BUKAN di frontend)
- Admin Utama: `Rifkiandi` / password awal dari env `ADMIN_INITIAL_PASSWORD` (default instalasi `nondo1234`) — **wajib diganti saat login pertama**, tersimpan sebagai hash bcrypt.
- Demo Operator: `operator` / `operator123`
- Pengguna baru yang mendaftar berstatus `PENDING` sampai disetujui Admin Utama (menu Pengguna & Persetujuan).

## Instalasi
1. `npm install`
2. Salin `.env`: `DATABASE_URL=postgresql://...` dan `JWT_SECRET=<acak-32-karakter>`
3. `npx drizzle-kit push`
4. `npm run build && npm start` (produksi wajib di balik HTTPS/reverse-proxy TLS)

## Teknologi
Next.js (App Router) + PostgreSQL + Drizzle ORM, autentikasi JWT httpOnly (8 jam), bcrypt, rate-limit login (kunci 15 menit / 5 gagal), audit log, masking NIK per peran, PWA (manifest + service worker + ikon, installable di Android/Desktop).

## Catatan Keamanan (jujur)
Aplikasi ini **belum boleh diklaim siap menyimpan data asli** sebelum: HTTPS produksi aktif, audit keamanan/pen-test, backup PostgreSQL terenkripsi terjadwal + uji restore, dan penetapan petugas perlindungan data sesuai UU PDP No. 27/2022.
