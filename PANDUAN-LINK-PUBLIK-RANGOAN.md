# Cara Mendapat Link Publik Permanen — RNG DAT Desa Rangoan

Wilayah: **Desa Rangoan, Kecamatan Matangnga, Kabupaten Polewali Mandar, Provinsi Sulawesi Barat**

## Kenapa link sebelumnya tidak bisa dibuka?

Link yang berakhiran `*.e2b.app` adalah **link sandbox sementara / privat**.
Itu hanya untuk proses pembuatan aplikasi, bukan hosting asli.
Ciri-cirinya:
- Berubah-ubah setiap rebuild
- Mati setelah beberapa jam
- Meminta token / menampilkan halaman dokumentasi E2B seperti yang Bapak alami

Itu BUKAN salah HP Bapak. Memang link itu tidak dirancang untuk dipakai warga.

Untuk link permanen seperti `https://rngdat-rangoan.vercel.app` yang bisa
dibuka semua orang kapan saja, aplikasi harus di-hosting. Caranya gratis,
sekitar 10 menit. Pilih salah satu di bawah.

---

## Cara 1 — Paling Mudah & Gratis: Vercel + Neon (Disarankan)

Hasil akhir: `https://rng-dat-rangoan.vercel.app` — bisa dibuka HP/laptop siapapun.

### A. Siapkan database gratis (2 menit)
1. Buka https://neon.tech → Daftar → New Project → nama `rngdat-rangoan`
2. Region pilih **Singapore**
3. Setelah jadi, klik **Connection String**, salin yang bentuknya:
   `postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/rngdat_db?sslmode=require`

### B. Upload kode ke GitHub (3 menit)
1. Di laptop, zip folder proyek ini, atau jalankan:
   ```
   git init
   git add .
   git commit -m "RNG DAT Rangoan"
   ```
2. Buat repo baru di https://github.com/new bernama `rngdat-rangoan`
3. Push sesuai perintah yang ditampilkan GitHub.

### C. Deploy ke Vercel (3 menit)
1. Buka https://vercel.com → Sign up dengan GitHub → **Add New Project**
2. Pilih repo `rngdat-rangoan` → **Import**
3. Di bagian **Environment Variables**, isi:
   - `DATABASE_URL` = connection string Neon tadi
   - `JWT_SECRET` = isi 32+ karakter acak, contoh: `rangoan-matangnga-polman-sulbar-2026-aman-32`
   - `ADMIN_INITIAL_PASSWORD` = `nondo1234`
4. Klik **Deploy**. Tunggu 2-3 menit.
5. Selesai. Vercel memberi link publik, contoh:
   `https://rngdat-rangoan.vercel.app`
   Itulah link yang dibagikan ke perangkat desa. Tidak akan menampilkan halaman E2B lagi.

### D. Buat tabel database sekali saja
Setelah deploy, jalankan sekali dari laptop:
```
DATABASE_URL="postgresql://....neon.tech/..." npx drizzle-kit push
```
Atau buka Vercel → Storage → jalankan push via lokal. Setelah itu login:
- Username: `Rifkiandi` / Password: `nondo1234` → langsung ganti password.

---

## Cara 2 — Railway (Database sudah termasuk, Rp0 untuk coba)

1. Buka https://railway.app → New Project → **Deploy from GitHub** → pilih repo ini
2. Klik **+ New → Database → PostgreSQL**
3. Di service aplikasi, isi Variables sama seperti di atas (`JWT_SECRET`, `ADMIN_INITIAL_PASSWORD`, `DATABASE_URL` otomatis dari Railway)
4. Klik Deploy → Railway memberi domain publik `https://xxx.up.railway.app`

Cocok jika tidak mau memisahkan Neon + Vercel.

---

## Cara 3 — Laptop Kantor Desa + Cloudflare Tunnel (Tanpa sewa server)

Cocok untuk uji coba di Balai Desa Rangoan memakai WiFi yang sama:

Di laptop kantor (sudah install Node.js 22):
```
npm install
copy .env.example .env
# edit .env isi DATABASE_URL lokal
npx drizzle-kit push
npm run build
npm start
```

HP lain satu WiFi bisa buka via `http://IP-LAPTOP:3000`.

Agar bisa diakses dari internet (bukan hanya WiFi balai desa):
```
cloudflared tunnel --url http://localhost:3000
```
Cloudflare memberi link `https://xxx.trycloudflare.com` yang bisa dibuka siapapun selama laptop menyala.

---

## Cara 4 — VPS Desa (Untuk jangka panjang, data milik desa 100%)

Jika desa punya VPS (contoh Niagahoster/IDCloudHost/Contabo Ubuntu):

```
git clone <repo-rngdat-rangoan> && cd rngdat-rangoan
cp .env.example .env
nano .env   # isi password asli
docker compose up -d --build
docker compose exec app npx drizzle-kit push
```

Aplikasi jalan di port 3000. Pasang Nginx + HTTPS (certbot) agar menjadi
`https://data.rangoan.desa.id` bila sudah punya domain desa.

---

## Checklist sebelum dipakai data asli

- [ ] `JWT_SECRET` sudah diganti (jangan pakai bawaan)
- [ ] Password `Rifkiandi` sudah diganti saat login pertama
- [ ] Link sudah `https://` (gembok), bukan `http://`
- [ ] `npx drizzle-kit push` sudah jalan, login berhasil
- [ ] Akun `operator` dan `kadus_rangoan` passwordnya diganti
- [ ] Backup mingguan database dijadwalkan (Neon/Railway ada tombol backup otomatis)

---

## Login bawaan

| Peran | Username | Password awal |
|---|---|---|
| Admin Utama | Rifkiandi | nondo1234 (wajib ganti) |
| Operator Desa | operator | operator123 |
| Kepala Dusun | kadus_rangoan | operator123 |

Semua data contoh 98 warga 5 dusun Rangoan sudah ikut, tinggal hapus/ganti
dengan data asli melalui menu Data Penduduk → Arsip/Hapus.

Jika Bapak kirim kembali setelah deploy (contoh link vercel/railway Bapak),
saya bantu cek apakah sudah bisa dibuka publik tanpa login token.
