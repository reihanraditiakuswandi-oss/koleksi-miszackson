# KOLEKSI MISZACKSON — V2 dengan Admin

Paket ini berisi galeri publik dan halaman admin. Hosting GitHub Pages hanya menyajikan file frontend; autentikasi serta penyimpanan data dilakukan melalui Supabase. Admin login tidak aman jika hanya dibuat di JavaScript lokal, jadi paket ini menggunakan Supabase Auth + Row Level Security (RLS).

## File
- `index.html`, `style.css`, `app.js`: galeri publik
- `admin.html`, `admin.js`: login admin dan CRUD video
- `supabase-config.js`: URL project dan publishable/anon key
- `supabase-setup.sql`: tabel serta kebijakan keamanan database
- `videos.js`: data contoh untuk tampilan fallback

## Bagian A — Buat database Supabase
1. Buka https://supabase.com/ dan buat akun / login.
2. Buat project baru, catat nama project, tentukan password database yang kuat, dan pilih region yang sesuai.
3. Setelah project siap, buka **SQL Editor → New query**.
4. Buka file `supabase-setup.sql` di komputer, salin seluruh isinya ke SQL Editor, lalu klik **Run**.
5. Buka **Project Settings → API** (atau bagian API Keys di dashboard). Salin **Project URL** dan **publishable key** atau **anon public key**. Jangan gunakan `service_role` / `secret` key di browser.

## Bagian B — Konfigurasikan website
1. Buka `supabase-config.js`.
2. Ganti `PASTE_SUPABASE_PROJECT_URL_HERE` dengan Project URL.
3. Ganti `PASTE_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE` dengan publishable/anon public key.
4. Simpan file.

Contoh format URL: `https://abcdefghijk.supabase.co`. Jangan menyalin contoh ini sebagai URL project asli.

## Bagian C — Buat satu akun admin
1. Di Supabase buka **Authentication → Users → Add user**.
2. Buat user menggunakan email yang kamu kuasai dan password kuat. Matikan public sign-ups di Authentication settings bila tidak diperlukan.
3. Salin UUID / User ID dari user yang baru dibuat.
4. Buka **SQL Editor** dan jalankan perintah ini, ganti UUID placeholder dengan UUID admin asli:
   `insert into public.admin_users (user_id) values ('UUID-ADMIN-ASLI');`
5. Jangan pernah membagikan password admin, database password, atau secret/service-role key. Jika perlu menambah admin lain, buat user secara manual dan masukkan UUID-nya ke tabel admin_users.

## Bagian D — Upload versi terbaru ke GitHub
1. Buka repository `koleksi-miszackson`.
2. Klik **Add file → Upload files**.
3. Unggah file dari paket V2 ke root repository, termasuk `admin.html`, `admin.js`, `supabase-config.js`, dan `supabase-setup.sql`.
4. Jika GitHub bertanya apakah akan mengganti file yang sudah ada, pastikan kamu memang ingin memperbarui file-file V2.
5. Klik **Commit changes**.
6. Buka **Settings → Pages** dan tunggu deployment selesai.

## Bagian E — Gunakan admin
- Galeri publik: `https://USERNAME.github.io/koleksi-miszackson/`
- Admin: `https://USERNAME.github.io/koleksi-miszackson/admin.html`

Login dengan email dan password user Supabase yang UUID-nya terdaftar di `admin_users`. Tambah, edit, dan hapus video dari halaman admin. Untuk video, masukkan URL file video yang bisa diakses browser atau URL embed yang diizinkan oleh penyedia video. Untuk thumbnail, masukkan URL gambar publik HTTPS.

## Keamanan penting
- `supabase-config.js` berisi URL dan publishable/anon key. Key ini memang dapat dilihat publik; keamanan data ditegakkan melalui RLS.
- **Jangan pernah** memasukkan `service_role` key, secret API key, atau password database ke file frontend/GitHub.
- Jangan aktifkan pendaftaran umum jika website hanya memerlukan satu admin. Buat admin melalui dashboard Supabase.
- Kebijakan RLS pada SQL membatasi INSERT/UPDATE/DELETE hanya untuk UUID yang terdaftar di `admin_users`.
- Ini adalah pengelolaan metadata dan URL video, bukan upload file video ke server. Untuk upload file dari komputer, tambahkan Supabase Storage dengan policy bucket tersendiri.
- Gunakan konten yang kamu punya hak untuk publikasikan dan terapkan pembatasan usia bila dibutuhkan.
