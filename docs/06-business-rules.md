# Business Rules

## Tujuan

Dokumen ini merupakan aturan bisnis resmi K Gaming XCafe Booking System.

Seluruh fitur, validasi, perhitungan harga, dan logika sistem wajib mengikuti aturan yang tertulis pada dokumen ini.

Jika terjadi perbedaan antara implementasi dan dokumen ini, maka dokumen ini menjadi acuan utama.

---

# Rule 1 - Booking Tanpa Akun

Pelanggan tidak perlu:

* Login
* Registrasi
* Email
* Password

Booking dapat dilakukan langsung melalui website.

---

# Rule 2 - Maksimal Booking

Pelanggan dapat melakukan booking maksimal:

7 Hari Ke Depan

---

## Contoh

Hari ini:

5 Juni

Maka pelanggan dapat memilih:

* 5 Juni
* 6 Juni
* 7 Juni
* 8 Juni
* 9 Juni
* 10 Juni
* 11 Juni
* 12 Juni

---

# Rule 3 - Jam Operasional

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

# Rule 4 - Slot Booking

Sistem menggunakan interval:

30 Menit

---

## Contoh

* 10:00
* 10:30
* 11:00
* 11:30
* 12:00

---

# Rule 5 - Slot Masa Lalu

Jam yang sudah lewat wajib disembunyikan.

---

## Contoh

Waktu sekarang:

15:20

Maka:

❌ 10:00

❌ 10:30

❌ 11:00

❌ 14:00

❌ 15:00

---

## Yang Boleh Dipilih

✅ 15:30

✅ 16:00

✅ 16:30

---

# Rule 6 - Device

Device aktif:

## Reguler

* Reguler 1
* Reguler 2
* Reguler 3
* Reguler 4

Harga:

Rp10.000/Jam

---

## VIP 1

* VIP 1A
* VIP 1B

Harga:

Rp30.000/Jam

---

## VIP 2

* VIP 2

Harga:

Rp35.000/Jam

---

# Rule 7 - Tidak Boleh Double Booking

Satu device tidak boleh memiliki dua booking yang bertabrakan.

---

## Contoh

Sudah ada booking:

VIP 2

20:00 - 23:00

---

Maka booking berikutnya:

❌ 21:00 - 22:00

❌ 22:00 - 23:00

❌ 22:30 - 23:30

---

Dilarang.

---

# Rule 8 - Validasi Jam Tutup

Durasi bermain tidak boleh melewati jam tutup operasional.

---

## Contoh

Hari Kamis

Jam Mulai:

23:00

---

Pilihan:

✅ 1 Jam

✅ 2 Jam

---

❌ 3 Jam

Karena selesai pukul:

02:00

Melewati jam tutup.

---

# Rule 9 - Promo Weekday

Promo hanya berlaku:

* Senin
* Selasa
* Rabu
* Kamis

---

# Rule 10 - Harga Promo

## Reguler

2 Jam

Rp18.000

3 Jam

Rp25.000

---

## VIP 1

2 Jam

Rp55.000

3 Jam

Rp80.000

---

## VIP 2

2 Jam

Rp65.000

3 Jam

Rp90.000

---

# Rule 11 - Diskon 4 Jam+

Jika durasi:

4 Jam atau Lebih

Diskon:

20%

---

## Rumus

Harga Normal × Durasi × 80%

---

## Contoh

VIP 2

4 Jam

35.000 × 4

=

140.000

Diskon 20%

=

112.000

---

# Rule 12 - Promo Wajib Lunas

Jika pelanggan menggunakan promo:

Pembayaran wajib lunas.

---

## Tidak Tersedia

❌ DP

---

## Tersedia

✅ Lunas

---

# Rule 13 - Harga Normal

Harga normal dapat digunakan setiap hari.

---

## Hari Berlaku

* Senin
* Selasa
* Rabu
* Kamis
* Jumat
* Sabtu
* Minggu

---

# Rule 14 - Harga Normal Bisa DP

Jika menggunakan harga normal:

Pelanggan dapat memilih:

* DP
* Lunas

---

# Rule 15 - Minimal DP

Minimal DP harus setara:

1 Jam Bermain

---

## Reguler

Rp10.000

---

## VIP 1

Rp30.000

---

## VIP 2

Rp35.000

---

# Rule 16 - Waiting Payment

Saat pelanggan menekan tombol:

Lanjut ke WhatsApp

Sistem wajib membuat booking baru.

---

Status:

WAITING_PAYMENT

---

# Rule 17 - Timer Waiting Payment

Booking memiliki batas waktu:

15 Menit

---

## Contoh

Booking dibuat:

20:00

---

Expired:

20:15

---

# Rule 18 - Auto Expired

Jika tidak diverifikasi hingga timer habis:

Status berubah otomatis menjadi:

EXPIRED

---

# Rule 19 - Slot Kembali Tersedia

Saat booking menjadi:

EXPIRED

Maka slot harus:

Tersedia kembali

Secara otomatis.

---

# Rule 20 - Staff Approval

Booking hanya dianggap sah jika staff melakukan approve.

---

Perubahan status:

WAITING_PAYMENT

↓

BOOKED

---

# Rule 21 - Alur Status Booking

Urutan status:

WAITING_PAYMENT

↓

BOOKED

↓

IN_USE

↓

FINISHED

---

Atau:

WAITING_PAYMENT

↓

EXPIRED

---

# Rule 22 - WhatsApp Booking

Setelah booking dibuat:

WhatsApp harus terbuka otomatis.

---

Nomor Tujuan:

082152425391

---

# Rule 23 - Informasi Transfer

Sistem wajib menampilkan:

Bank:

BCA

Nomor Rekening:

7155450363

Atas Nama:

Nanda A

---

# Rule 24 - Informasi Ringkasan

Sebelum WhatsApp dibuka pelanggan wajib melihat:

* Device
* Tanggal
* Jam Mulai
* Jam Selesai
* Durasi
* Paket
* Metode Pembayaran
* Total Harga

---

# Rule 25 - Disclaimer Wajib

Pelanggan wajib menyetujui disclaimer.

---

## Contoh

☑ Booking aktif setelah pembayaran diverifikasi.

☑ Pembayaran wajib dilakukan dalam 15 menit.

☑ Booking akan dibatalkan otomatis jika tidak dibayar.

☑ Keterlambatan tidak menambah durasi bermain.

---

# Rule 26 - Tombol WhatsApp

Tombol WhatsApp tidak boleh aktif sebelum:

Disclaimer dicentang.

---

# Rule 27 - Staff Login

Dashboard hanya dapat diakses oleh staff.

---

# Rule 28 - Staff Dapat Mengubah

Staff dapat mengubah:

* Harga
* Promo
* Jam Operasional
* Disclaimer
* Informasi WhatsApp
* Informasi Rekening

Tanpa deploy ulang aplikasi.

---

# Rule 29 - Realtime Update

Perubahan status booking harus langsung terlihat.

---

Contoh

Staff approve booking.

---

Maka:

Status device pada halaman publik harus berubah saat itu juga.

---

Tanpa refresh manual.

---

# Rule 30 - Mobile First

Seluruh sistem harus dioptimalkan untuk:

* Android
* iPhone
* Tablet

Karena mayoritas pelanggan menggunakan perangkat mobile.

---

# Rule 31 - Kode Booking

Setiap booking wajib memiliki kode unik.

---

Format:

KG-YYYYMMDD-XXX

---

Contoh:

KG-20260605-001

KG-20260605-002

KG-20260605-003

---

# Rule 32 - Validasi Data Pelanggan

Nama pelanggan wajib diisi.

Nomor WhatsApp wajib diisi.

---

Booking tidak boleh dibuat jika data kosong.

---

# Rule 33 - Tujuan Utama Sistem

Sistem harus memungkinkan pelanggan:

1. Melihat ketersediaan device.
2. Memilih jadwal.
3. Mengetahui harga secara transparan.
4. Mengirim booking ke WhatsApp.
5. Melakukan pembayaran.
6. Mendapatkan konfirmasi staff.

Dengan proses yang sederhana, cepat, dan mudah dipahami.

---

# Final Principle

Filosofi utama K Gaming XCafe Booking System:

"Lihat Slot → Pilih Jadwal → Bayar → Main"

Tanpa registrasi, tanpa proses rumit, dan tanpa perlu bertanya kepada admin mengenai ketersediaan device.
