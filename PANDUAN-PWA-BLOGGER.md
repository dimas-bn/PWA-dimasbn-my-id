# Panduan Membuat PWA untuk dimasbn.my.id (Blogger)

Blogger tidak punya fitur PWA bawaan, jadi kita "menyelundupkan" file `manifest.json` dan `sw.js` lewat hosting gratis, lalu menautkannya ke tema Blogger.

## File yang sudah disiapkan
1. `manifest.json` — info nama, warna, dan ikon PWA (icon di-host di Vercel: `pwa-dimasbn.vercel.app`)
2. `blogger-pwa-snippet.html` — kode yang ditempel ke tema Blogger
3. Folder `favicon-dimasbn/` — semua ukuran ikon yang dipakai manifest

> **Catatan:** `sw.js` (service worker) sengaja **di-skip**. Alasannya, service worker hanya bisa diregistrasi dari origin yang sama dengan halaman yang memanggilnya — sementara `sw.js` di-host di Vercel (origin berbeda dari `dimasbn.my.id`), jadi registrasinya akan gagal kalau tetap dipaksakan. Dengan skip ini, fitur **offline caching tidak aktif**, tapi fitur **"Add to Home Screen" / Install App tetap berfungsi normal** karena itu hanya bergantung pada `manifest.json`, bukan service worker.

## Langkah 1 — Hosting file manifest.json dan sw.js

Blogger tidak mengizinkan upload file `.json` atau `.js` sembarangan, jadi file ini perlu dihosting di tempat lain lalu diakses lewat domain **dimasbn.my.id** (atau subdomain/path yang mengarah ke sana). Dua opsi termudah:

**Opsi A — GitHub Pages (gratis, direkomendasikan)**
1. Buat repository baru di GitHub, misal `dimasbn-pwa`
2. Upload `manifest.json`, `sw.js`, dan semua file favicon ke repo tersebut
3. Aktifkan GitHub Pages di Settings → Pages → pilih branch `main`
4. File akan bisa diakses lewat URL seperti `https://username.github.io/dimasbn-pwa/manifest.json`
5. Ganti semua URL di `manifest.json`, `sw.js`, dan snippet HTML dari `https://dimasbn.my.id/...` menjadi URL GitHub Pages tersebut

**Opsi B — Custom domain root**
Jika suatu saat pindah dari Blogger ke hosting sendiri (misalnya lewat jasa WordPress yang sudah dijalankan), file bisa langsung ditaruh di root domain sehingga URL `https://dimasbn.my.id/manifest.json` berfungsi langsung tanpa perlu ganti alamat.

## Langkah 2 — Edit Tema Blogger
1. Login ke Blogger → pilih blog → **Tema** → **Edit HTML**
2. Cari tag `</head>` — tempel bagian pertama dari `blogger-pwa-snippet.html` (link manifest + meta tags) tepat sebelum tag itu
3. Cari tag `</body>` — tempel bagian kedua (script logika tombol install) tepat sebelum tag itu
4. Simpan tema

## Langkah 3 — Uji Coba
1. Buka **dimasbn.my.id** lewat Chrome di HP Android
2. Tunggu beberapa detik, biasanya muncul prompt **"Add to Home Screen"** di bagian bawah/atas browser
3. Kalau prompt tidak muncul otomatis, buka menu titik tiga Chrome → **Add to Home screen** / **Install app**
4. Cek juga lewat Chrome DevTools di desktop: F12 → tab **Application** → **Manifest** untuk memastikan tidak ada error

## Langkah 4 (opsional) — Tombol Install Custom
Snippet sudah menyertakan kode untuk tombol install custom. Tinggal tambahkan elemen ini di manapun di tema/postingan:
```html
<button id="install-pwa-btn" style="display:none;">📲 Install Aplikasi</button>
```
Tombol ini otomatis muncul hanya saat browser mendeteksi situs bisa di-install.

## Catatan tambahan
- PWA paling terasa manfaatnya di Chrome/Edge Android. Di iOS Safari, dukungannya lebih terbatas (tidak ada prompt otomatis, user harus manual: Share → Add to Home Screen)
- Setelah manifest & ikon aktif, favicon browser tab juga otomatis lebih konsisten di semua perangkat
