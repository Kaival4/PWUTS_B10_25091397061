# Dapur Admin

UTS Pemrograman Web, D4 Manajemen Informatika, Universitas Negeri Surabaya.

- Nama: Achmad Mohammad Rivaldi
- NIM: 25091397061
- Kelompok: B10 (2025B), proposal website resep makanan
- Dosen: Ari Kurniawan, S.Kom., M.T.

## Pembagian pekerjaan (item 2.d)

Kelompok memakai pembagian per modul: modul **pengguna** dikerjakan anggota lain, modul **admin** saya kerjakan (sesuai konfirmasi Pak Ari bahwa pembagian per modul/fitur diperbolehkan).

| Item | Bagian saya (modul admin) |
|------|---------------------------|
| 2.a | Layout utama `index.html`: login admin simulasi (satu kartu di tengah), sidebar, topbar, dashboard (kartu statistik, komposisi status, resep terbaru) |
| 2.b | Moderasi resep: cari, filter status, setujui, tolak dengan alasan, hapus, detail resep |
| 2.c | Form kelola kategori resep dengan validasi jQuery, plus daftar kategori (ubah dan hapus) |

Wireframe dasar mengikuti proposal kelompok. Konten, fitur, dan tampilan (palet biru tua-teal, font Public Sans, sidebar, komponen kotak) dibuat sendiri dan berbeda dari modul pengguna.

## Struktur file

```
index.html              layout utama (2.a): login, sidebar, dashboard
pages/moderasi.html     konten moderasi (2.b), dimuat dengan Ajax
pages/kategori.html     form kategori (2.c), dimuat dengan Ajax
css/admin.css           semua gaya dan media query (tanpa framework CSS)
js/config.js            konfigurasi, aturan validasi, state bersama
js/utils.js             escape HTML, format tanggal, modal, toast
js/store.js             data awal dari JSON + penyimpanan localStorage
js/auth.js              validasi dan login simulasi
js/dashboard.js         kartu statistik dan resep terbaru
js/moderasi.js          fitur 2.b
js/kategori.js          fitur 2.c
js/main.js              navigasi hash dan pemuatan halaman Ajax
data/resep-masuk.json   data contoh resep dan kategori
images/                 logo (SVG)
```

Teknologi: HTML, CSS, JavaScript, jQuery 3.7.1 (CDN). Tanpa Bootstrap, tanpa backend dan database.

## Fitur

- **Login admin (simulasi):** validasi jQuery (wajib diisi, minimal 4 karakter untuk username dan 6 untuk kata sandi). Akun demo: `admin` / `admin123`. Sesi disimpan di sessionStorage dan hilang saat tab ditutup.
- **Responsive:** sidebar berubah menjadi menu geser dengan tombol Menu di layar sempit (media query 900px), tabel berubah menjadi daftar kartu di HP.
- **Ajax:** menu sidebar memuat `pages/moderasi.html` dan `pages/kategori.html` ke area konten dengan `$.load()` tanpa memuat ulang sidebar. Data awal dibaca dengan `$.getJSON()`. URL memakai hash (`#dashboard`, `#moderasi`, `#kategori`).
- **Moderasi (2.b):** cari judul atau pengunggah, filter status, tombol Setujui, Tolak (alasan wajib minimal 10 karakter), Hapus (dengan konfirmasi), dan Detail (bahan dan langkah). Setiap perubahan status langsung memperbarui kartu dashboard, bar komposisi, dan lencana "Menunggu" di sidebar. Ini fitur simulasinya.
- **Kategori (2.c):** validasi nama (wajib, 3-30 karakter, hanya huruf, tidak boleh duplikat tanpa membedakan huruf besar kecil), deskripsi (10-120 karakter), dan warna label (wajib pilih). Kategori yang masih dipakai resep tidak bisa dihapus.

## Penyimpanan lokal

Perubahan admin disimpan di localStorage (kunci `dapuradmin_state`), jadi hanya ada di browser yang dipakai. Tombol "Kembalikan data demo" di Dashboard menghapusnya dan memuat ulang data dari JSON.

## Cara menjalankan

Ajax tidak bisa jalan jika `index.html` dibuka langsung (`file://`). Pakai salah satu:

1. Ekstensi **Live Server** di VS Code (klik kanan `index.html`, Open with Live Server), atau
2. Dari folder ini jalankan `python -m http.server 8000`, lalu buka `http://localhost:8000`, atau
3. GitHub Pages (semua fitur tetap berjalan karena tidak butuh PHP).
