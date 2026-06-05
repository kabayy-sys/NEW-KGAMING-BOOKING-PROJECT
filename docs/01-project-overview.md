# K Gaming XCafe Booking System

## Project Overview

### Deskripsi

K Gaming XCafe Booking System adalah aplikasi web berbasis Next.js yang digunakan untuk menampilkan ketersediaan device secara realtime, menerima booking pelanggan, mengelola pembayaran manual melalui transfer bank, dan membantu staff mengelola operasional booking dengan lebih terstruktur.

Sistem dirancang agar pelanggan dapat melakukan booking secara mandiri melalui website tanpa perlu bertanya terlebih dahulu kepada admin mengenai ketersediaan device.

Setelah proses booking selesai, pelanggan akan diarahkan ke WhatsApp Admin dengan format pesan otomatis yang telah terisi lengkap sesuai data booking.

---

# Tujuan Project

Tujuan utama sistem ini adalah:

* Menampilkan ketersediaan device secara realtime.
* Mengurangi pertanyaan berulang mengenai slot kosong.
* Mempermudah proses booking pelanggan.
* Mengurangi kesalahan pencatatan booking.
* Membantu staff mengelola jadwal booking.
* Menghindari double booking.
* Memberikan pengalaman booking yang modern dan mudah dipahami.
* Tetap menggunakan WhatsApp sebagai media komunikasi utama.

---

# Target Pengguna

## Pelanggan

Pelanggan dapat:

* Melihat device yang tersedia.
* Memilih tanggal booking.
* Memilih jam bermain.
* Memilih durasi bermain.
* Melihat harga secara otomatis.
* Memilih paket promo atau harga normal.
* Mengirim booking ke WhatsApp Admin.
* Mengirim bukti transfer.

Pelanggan tidak perlu:

* Membuat akun.
* Login.
* Registrasi.
* Verifikasi email.
* Mengingat password.

---

## Staff

Staff dapat:

* Login ke dashboard.
* Melihat booking masuk.
* Menyetujui booking.
* Menolak booking.
* Mengubah status device.
* Mengelola harga.
* Mengelola promo.
* Mengelola disclaimer.
* Mengelola jam operasional.

Sistem hanya menggunakan 1 akun staff.

---

# Teknologi

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI

---

## Backend

* Supabase Database
* Supabase Realtime
* Supabase Authentication

---

## Hosting

* Vercel

---

# Device Yang Tersedia

## Reguler

* Reguler 1
* Reguler 2
* Reguler 3
* Reguler 4

Harga:

Rp10.000 / jam

---

## VIP 1

* VIP 1A
* VIP 1B

Harga:

Rp30.000 / jam

---

## VIP 2

* VIP 2

Harga:

Rp35.000 / jam

---

# Jam Operasional

## Minggu - Kamis

Buka:
10:00 WIB

Tutup:
01:00 WIB

---

## Jumat - Sabtu

Buka:
10:00 WIB

Tutup:
03:00 WIB

---

# Sistem Booking

Booking menggunakan interval waktu 30 menit.

Contoh:

* 10:00
* 10:30
* 11:00
* 11:30

dan seterusnya.

---

# Durasi Bermain

Durasi menggunakan kelipatan 1 jam.

Contoh:

* 1 Jam
* 2 Jam
* 3 Jam
* 4 Jam
* 5 Jam

Durasi otomatis dibatasi agar tidak melewati jam tutup operasional.

---

# Maksimal Booking

Pelanggan dapat melakukan booking hingga 7 hari ke depan.

---

# Status Booking

## Available

Device tersedia dan dapat dibooking.

---

## Waiting Payment

Booking telah dibuat.

Pelanggan sedang melakukan pembayaran.

Status ini memiliki batas waktu 15 menit.

---

## Booked

Pembayaran telah diverifikasi staff.

Booking resmi dikonfirmasi.

---

## In Use

Pelanggan sedang bermain.

---

## Finished

Sesi bermain selesai.

---

## Expired

Booking dibatalkan otomatis karena tidak melakukan pembayaran dalam waktu 15 menit.

---

# Sistem Pembayaran

Pembayaran dilakukan secara manual melalui transfer bank.

Sistem tidak menggunakan payment gateway.

Sistem tidak melakukan verifikasi pembayaran otomatis.

Semua pembayaran diverifikasi langsung oleh staff.

---

# Informasi Pembayaran

Bank:

BCA

Nomor Rekening:

7155450363

Atas Nama:

Nanda A

---

# Informasi WhatsApp

Nomor Admin:

082152425391

Seluruh booking akan diarahkan ke nomor WhatsApp ini.

---

# Alur Booking

1. Pelanggan membuka website.
2. Pelanggan memilih device.
3. Pelanggan memilih tanggal.
4. Pelanggan memilih jam bermain.
5. Pelanggan memilih durasi.
6. Sistem menghitung harga.
7. Pelanggan memilih promo atau harga normal (jika tersedia).
8. Pelanggan membaca disclaimer.
9. Pelanggan menyetujui disclaimer.
10. Sistem membuat booking dengan status Waiting Payment.
11. WhatsApp Admin terbuka otomatis.
12. Pelanggan melakukan transfer.
13. Pelanggan mengirim bukti transfer.
14. Staff melakukan verifikasi.
15. Staff menyetujui booking.
16. Status berubah menjadi Booked.

---

# Filosofi Desain

Sistem harus:

* Mudah digunakan oleh semua kalangan.
* Mobile First.
* Cepat dipahami dalam kurang dari 10 detik.
* Tidak membutuhkan akun pelanggan.
* Tidak membutuhkan pelatihan khusus.
* Tetap terlihat modern dan premium.
* Meminimalkan jumlah klik yang diperlukan pelanggan.

Prinsip utama:

"Lihat Device → Booking → Bayar → Selesai"
