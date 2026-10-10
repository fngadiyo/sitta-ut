# SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar

Prototipe antarmuka **front-end** untuk pemesanan dan distribusi bahan ajar Universitas Terbuka,
dibangun sebagai Tugas Praktik 1 mata kuliah **Pemrograman Berbasis Web (STSI4209)**.

Aplikasi ini murni HTML, CSS, dan JavaScript DOM - tanpa back-end, tanpa build step, tanpa
dependensi eksternal. Seluruh data berasal dari variabel dummy di `js/data.js`.

## Halaman

| Halaman | Berkas | Isi |
| --- | --- | --- |
| Halaman awal | `index.html` | Perkenalan aplikasi dan pintu masuk ke halaman login |
| Login | `login.html` | Form email & password, modal Lupa Password dan Daftar Akun |
| Dashboard | `dashboard.html` | Greeting sesuai waktu, ringkasan, dan seluruh menu laporan |
| Informasi Bahan Ajar | `stok.html` | Tabel stok dinamis, pencarian, dan penambahan baris stok |
| Tracking Pengiriman | `tracking.html` | Pencarian status kirim berdasarkan Nomor Delivery Order |

## Struktur Menu (sesuai soal)

- Dashboard
- Informasi Bahan Ajar
- Tracking Pengiriman
- **Laporan** *(dropdown saat hover)*
  - Monitoring Progress DO Bahan Ajar
  - Rekap Bahan Ajar
- Histori Transaksi Bahan Ajar

## Struktur Berkas

```
.
├── index.html
├── login.html
├── dashboard.html
├── stok.html
├── tracking.html
├── css/
│   └── style.css            # seluruh tampilan, memakai design token ala MyUT
├── img/                     # logo UT dan cover bahan ajar
└── js/
    ├── data.js              # data dummy: pengguna, bahan ajar, tracking, transaksi
    ├── auth.js              # sesi login (localStorage) dan pengalihan halaman
    ├── ui.js                # komponen bersama: loading bar, spinner, skeleton
    ├── sidebar-preload.js   # menerapkan state sidebar sebelum paint pertama
    ├── sidebar.js           # menu collapsible dan penyimpanan state-nya
    ├── profile.js           # dropdown profil dan tombol keluar
    ├── login.js             # validasi form login, modal, dan akun demo
    ├── dashboard.js         # greeting, statistik, tabel laporan, filter
    ├── stok.js              # render tabel stok dan form tambah stok
    └── tracking.js          # pencarian dan detail Delivery Order
```

Setiap berkas JavaScript menangani satu fungsionalitas saja, sehingga tiap halaman hanya
memuat skrip yang dibutuhkannya.

## Fitur

- **Login dengan validasi.** Kredensial salah memunculkan `alert` dengan pesan
  `email/password yang anda masukkan salah`; kolom kosong divalidasi terpisah.
- **Modal box** untuk Lupa Password dan Daftar Akun, dapat ditutup dengan tombol,
  klik latar, maupun tombol `Esc`, dengan penahanan fokus di dalam modal.
- **Greeting dinamis** berdasarkan jam lokal (pagi / siang / sore / malam).
- **Sidebar collapsible.** State tersimpan di `localStorage`, dan diterapkan oleh
  `sidebar-preload.js` sebelum paint pertama agar tidak ada kedipan saat pindah halaman.
- **Tabel stok dinamis** dari `dataBahanAjar`, dilengkapi pencarian dan
  penambahan baris baru lewat manipulasi DOM.
- **Penanda stok rendah** untuk jumlah di bawah 200 (`BATAS_STOK_RENDAH` di `js/stok.js`).
- **Tracking Delivery Order** dengan progress bar, detail ekspedisi, dan riwayat perjalanan.
- **Filter status** pada Monitoring Progress DO serta pencarian pada Histori Transaksi.
- **Dropdown profil** di kanan atas berisi info pengguna dan tombol keluar.

## Menjalankan

Cukup buka `index.html` di peramban. Tidak ada proses build dan tidak ada dependensi,
karena seluruh skrip dimuat sebagai `<script src>` biasa.

## Akun Demo

Data dummy yang tersedia pada halaman login (`js/data.js`):

| Email | Password | Peran |
| --- | --- | --- |
| `admin@ut.ac.id` | `admin123` | Administrator |
| `rina@ut.ac.id` | `rina123` | UPBJJ-UT |
| `agus@ut.ac.id` | `agus123` | UPBJJ-UT |
| `siti@ut.ac.id` | `siti123` | Puslaba |
| `doni@ut.ac.id` | `doni123` | Fakultas |

Nomor Delivery Order untuk uji tracking: `2023001234` (dalam perjalanan) dan
`2023005678` (selesai).

## Catatan

Karena tugas ini tidak memakai back-end, perubahan data (misalnya menambah stok baru)
hanya bertahan di memori dan akan hilang saat halaman dimuat ulang. Tampilan mengacu pada
bahasa desain MyUT - memakai token warna dan pola komponennya - agar terasa familiar,
namun tetap disesuaikan untuk versi web.
