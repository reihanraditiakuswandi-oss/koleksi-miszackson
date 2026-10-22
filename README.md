# KOLEKSI MISZACKSON

Template website galeri video dengan tema gelap, responsif untuk komputer dan ponsel.

## Isi paket
- `index.html` — struktur halaman
- `style.css` — desain dan responsivitas
- `videos.js` — data contoh yang bisa diedit
- `app.js` — pencarian, filter kategori, pengurutan, dan pemutar video

## Cara melihat website di komputer
1. Ekstrak ZIP ini.
2. Buka folder hasil ekstrak.
3. Klik dua kali `index.html` untuk membuka website di browser.

## Cara mengubah judul dan video
1. Buka `videos.js` dengan Notepad atau Visual Studio Code.
2. Ganti `title` dengan judul video kamu.
3. Ganti `category` dengan kategori yang kamu inginkan.
4. Isi `videoUrl` dengan URL file MP4/WebM milikmu atau URL embed dari penyedia video.
5. Simpan file, lalu muat ulang `index.html`.

Contoh satu entri:
```js
{
  id: 13,
  title: "Video Baru",
  category: "Terbaru",
  date: "2026-10-22",
  label: "VIDEO BARU",
  tone1: "#394e69",
  tone2: "#151a2b",
  videoUrl: "https://domain-kamu.example/video.mp4"
}
```

Untuk menambah thumbnail gambar sendiri, template ini perlu dikembangkan agar data video dapat memakai URL gambar. Saat ini sampul dibuat dari desain warna otomatis, sehingga website tetap tampil walau belum ada gambar thumbnail.

## Cara memasang secara online
### GitHub Pages (website statis)
1. Buat repository baru di GitHub.
2. Unggah semua file di folder ini (jangan unggah ZIP-nya saja).
3. Buka **Settings → Pages**.
4. Pilih sumber deployment sesuai petunjuk GitHub Pages dan branch utama.
5. Simpan, tunggu deployment, lalu buka alamat yang diberikan GitHub.

### Vercel
1. Unggah folder ini ke repository GitHub.
2. Masuk ke Vercel dan impor repository tersebut.
3. Untuk template statis ini, tidak perlu build command; output dapat diarahkan ke root folder.
4. Deploy dan buka domain yang diberikan.

## Catatan penting
- Paket ini adalah template frontend statis. Belum termasuk database, upload file ke server, akun admin, atau autentikasi.
- Untuk membuat admin upload video yang bisa diakses dari perangkat lain, diperlukan backend/database dan layanan penyimpanan.
- Jangan menaruh kata sandi, token, atau kunci rahasia dalam file JavaScript publik.
- Gunakan hanya video yang kamu miliki atau punya izin untuk ditayangkan. Pastikan persetujuan dan pembatasan usia diterapkan bila kontennya memerlukan.
