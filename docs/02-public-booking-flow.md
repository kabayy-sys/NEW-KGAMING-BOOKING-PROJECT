# Public Booking Flow

## Tujuan

Dokumen ini menjelaskan seluruh alur booking yang digunakan pelanggan pada website K Gaming XCafe.

Dokumen ini menjadi acuan utama untuk pengembangan halaman publik (non-staff).

---

# Prinsip Booking

Sistem booking harus:

* Mudah dipahami pelanggan baru.
* Mobile First.
* Tidak membutuhkan akun pelanggan.
* Tidak membutuhkan login pelanggan.
* Tidak membutuhkan registrasi pelanggan.
* Tidak membutuhkan email.
* Memiliki langkah sesedikit mungkin.
* Tetap terlihat modern dan premium.

---

# Booking Flow

## Langkah 1 - Pilih Device

Pelanggan melihat seluruh device yang tersedia.

### Device

#### Reguler

* Reguler 1
* Reguler 2
* Reguler 3
* Reguler 4

Harga Normal:

Rp10.000/jam

---

#### VIP 1

* VIP 1A
* VIP 1B

Harga Normal:

Rp30.000/jam

---

#### VIP 2

* VIP 2

Harga Normal:

Rp35.000/jam

---

## Status Device

### Available

Warna:

Hijau

Keterangan:

Device dapat dibooking.

---

### Waiting Payment

Warna:

Kuning

Keterangan:

Sedang menunggu pembayaran pelanggan lain.

Tidak dapat dibooking sementara.

---

### Booked

Warna:

Merah

Keterangan:

Sudah dibooking.

---

### In Use

Warna:

Ungu

Keterangan:

Sedang digunakan.

---

# Langkah 2 - Pilih Tanggal

Pelanggan memilih tanggal bermain.

Aturan:

* Hari ini dapat dipilih.
* Maksimal 7 hari ke depan.
* Tidak dapat memilih tanggal yang sudah lewat.

Contoh:

Hari ini 1 Juni

Maka pelanggan dapat memilih:

* 1 Juni
* 2 Juni
* 3 Juni
* 4 Juni
* 5 Juni
* 6 Juni
* 7 Juni
* 8 Juni

---

# Langkah 3 - Pilih Jam Bermain

## Interval Slot

Sistem menggunakan interval 30 menit.

Contoh:

* 10:00
* 10:30
* 11:00
* 11:30
* 12:00

dan seterusnya.

---

# Jam Operasional

## Minggu - Kamis

Buka:

10:00

Tutup:

01:00

Slot terakhir:

01:00

---

## Jumat - Sabtu

Buka:

10:00

Tutup:

03:00

Slot terakhir:

03:00

---

# Aturan Slot

Sistem wajib:

* Menyembunyikan jam yang sudah lewat.
* Menyembunyikan jam yang sudah penuh.
* Menyembunyikan jam yang bentrok dengan booking lain.
* Menampilkan hanya slot yang masih tersedia.

---

# Langkah 4 - Pilih Durasi

Pilihan durasi:

* 1 Jam
* 2 Jam
* 3 Jam
* 4 Jam
* 5 Jam
* dan seterusnya

Durasi menggunakan kelipatan 1 jam.

---

# Validasi Durasi

Durasi tidak boleh melewati jam tutup operasional.

Contoh:

Hari Kamis

Jam Mulai:

23:00

Pilihan Durasi:

✅ 1 Jam

✅ 2 Jam

❌ 3 Jam

Karena 23:00 + 3 Jam = 02:00

Melewati jam tutup.

---

# Langkah 5 - Pilih Paket

Bagian ini hanya muncul pada hari Senin sampai Kamis.

---

## Opsi 1 - Promo Weekday

Promo hanya berlaku:

* Senin
* Selasa
* Rabu
* Kamis

---

### Reguler

2 Jam:

Rp18.000

3 Jam:

Rp25.000

---

### VIP 1

2 Jam:

Rp55.000

3 Jam:

Rp80.000

---

### VIP 2

2 Jam:

Rp65.000

3 Jam:

Rp90.000

---

### Main 4 Jam atau Lebih

Diskon:

20%

Rumus:

Harga Normal × Durasi × 80%

Contoh:

VIP 2

4 Jam

35.000 × 4 = 140.000

Diskon 20%

Total:

112.000

---

### Ketentuan Promo

Wajib Lunas.

Tidak dapat menggunakan DP.

---

## Opsi 2 - Harga Normal

Menggunakan harga per jam standar.

Pelanggan dapat memilih:

* DP
* Lunas

---

# Hari Jumat - Minggu

Promo weekday tidak tersedia.

Sistem langsung menggunakan harga normal.

Pelanggan dapat memilih:

* DP
* Lunas

---

# Langkah 6 - Metode Pembayaran

## Jika Promo Weekday

Pilihan:

Lunas

Tidak ada opsi DP.

---

## Jika Harga Normal

Pilihan:

* DP
* Lunas

---

# Aturan DP

Minimal DP harus setara 1 jam bermain.

---

### Reguler

Minimal DP:

Rp10.000

---

### VIP 1

Minimal DP:

Rp30.000

---

### VIP 2

Minimal DP:

Rp35.000

---

# Langkah 7 - Ringkasan Booking

Halaman ringkasan wajib menampilkan:

### Device

Contoh:

VIP 2

---

### Tanggal

Contoh:

Sabtu, 12 Juni 2026

---

### Jam Mulai

Contoh:

20:00

---

### Jam Selesai

Contoh:

23:00

---

### Durasi

Contoh:

3 Jam

---

### Paket

Contoh:

Promo Weekday

atau

Harga Normal

---

### Metode Pembayaran

Contoh:

DP

atau

Lunas

---

### Total Pembayaran

Contoh:

Rp90.000

---

### Minimal DP

Ditampilkan jika pelanggan memilih DP.

---

# Langkah 8 - Disclaimer

Pelanggan wajib membaca disclaimer.

Contoh:

☑ Booking dianggap aktif setelah pembayaran diverifikasi staff.

☑ Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.

☑ Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.

☑ Keterlambatan pelanggan tidak menambah durasi bermain.

☑ Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.

---

# Langkah 9 - Konfirmasi

Pelanggan wajib mencentang:

☑ Saya menyetujui seluruh ketentuan booking.

Tombol lanjut hanya aktif setelah checklist dicentang.

---

# Langkah 10 - Pembuatan Booking

Saat tombol lanjut ditekan:

Sistem langsung membuat data booking.

Status:

Waiting Payment

Timestamp dibuat.

Timer 15 menit dimulai.

---

# Langkah 11 - Redirect WhatsApp

WhatsApp otomatis terbuka.

Nomor tujuan:

082152425391

---

# Format Pesan WhatsApp

Halo Admin K Gaming XCafe

Saya ingin melakukan booking.

Nama:
[Nama Pelanggan]

Device:
[Nama Device]

Tanggal:
[Tanggal]

Jam Mulai:
[Jam Mulai]

Jam Selesai:
[Jam Selesai]

Durasi:
[Durasi]

Paket:
[Paket]

Metode Pembayaran:
[DP/Lunas]

Total:
[Total]

Saya sudah membaca dan menyetujui seluruh ketentuan booking.

---

# Informasi Transfer

Halaman booking wajib menampilkan:

Bank:

BCA

Nomor Rekening:

7155450363

Atas Nama:

Nanda A

---

# Waiting Payment

Durasi:

15 Menit

---

## Jika Staff Menyetujui

Status berubah:

Waiting Payment → Booked

---

## Jika Waktu Habis

Status berubah:

Waiting Payment → Expired

Slot kembali:

Available

---

# Tujuan Akhir

Pelanggan dapat menyelesaikan proses booking dengan cepat tanpa perlu membuat akun dan tanpa perlu bertanya kepada admin mengenai ketersediaan device.
