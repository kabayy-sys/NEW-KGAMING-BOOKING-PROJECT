# Staff Dashboard

## Tujuan

Dashboard Staff adalah pusat pengelolaan seluruh operasional booking K Gaming XCafe.

Dashboard digunakan untuk:

* Mengelola booking.
* Mengelola status device.
* Mengelola harga.
* Mengelola promo.
* Mengelola disclaimer.
* Mengelola jam operasional.
* Memantau aktivitas harian.

Dashboard hanya dapat diakses oleh staff yang memiliki akun login.

---

# Role System

## Single Account System

Versi awal sistem hanya menggunakan:

1 Akun Staff

Tidak ada:

* Multi Role
* Owner
* Manager
* Cashier
* Supervisor

Seluruh akses menggunakan satu akun.

---

# Authentication

## Login Page

Field:

Username

Password

Button:

Login

---

# Tidak Tersedia

* Register
* Sign Up
* Forgot Password
* Email Verification
* OTP
* Social Login

---

# Dashboard Structure

Dashboard menggunakan Sidebar Layout.

---

# Sidebar Menu

## Dashboard

Overview operasional.

---

## Bookings

Daftar seluruh booking.

---

## Devices

Status seluruh device.

---

## Pricing

Harga normal dan promo.

---

## Business Hours

Jam operasional.

---

## Disclaimer

Aturan booking.

---

## Settings

Pengaturan umum.

---

# Dashboard Home

Halaman pertama setelah login.

---

# Summary Cards

## Waiting Payment

Menampilkan jumlah booking yang sedang menunggu pembayaran.

Contoh:

4 Booking

---

## Booked

Menampilkan jumlah booking yang sudah dikonfirmasi.

Contoh:

8 Booking

---

## In Use

Menampilkan jumlah device yang sedang digunakan.

Contoh:

3 Device

---

## Today's Revenue

Pendapatan hari ini.

Contoh:

Rp1.250.000

---

# Quick Actions

Tampilkan di bagian atas dashboard.

---

## Booking Baru

Melihat booking yang membutuhkan tindakan.

---

## Waiting Payment

Melihat pelanggan yang belum diverifikasi.

---

## Device Status

Melihat status device saat ini.

---

# Booking Management

Menu utama operasional.

---

# Booking Table

Kolom:

* Booking Code
* Nama Pelanggan
* Device
* Tanggal
* Jam Mulai
* Jam Selesai
* Durasi
* Paket
* Pembayaran
* Total
* Status
* Action

---

# Booking Detail

Saat staff membuka detail booking.

Tampilkan:

## Informasi Pelanggan

Nama Pelanggan

Nomor WhatsApp

---

## Informasi Booking

Device

Tanggal

Jam Mulai

Jam Selesai

Durasi

---

## Informasi Pembayaran

Paket

Metode Pembayaran

DP atau Lunas

Nominal Pembayaran

Total Booking

---

## Status Saat Ini

Waiting Payment

Booked

In Use

Finished

Expired

---

# Booking Actions

## Approve Booking

Mengubah status:

Waiting Payment

menjadi

Booked

---

## Reject Booking

Mengubah status:

Waiting Payment

menjadi

Expired

---

## Mark As In Use

Mengubah status:

Booked

menjadi

In Use

---

## Mark As Finished

Mengubah status:

In Use

menjadi

Finished

---

# Waiting Payment System

## Durasi

15 Menit

---

## Timer

Dashboard harus menampilkan sisa waktu.

Contoh:

12 Menit Tersisa

---

# Expired Booking

Jika timer habis:

Waiting Payment

berubah menjadi:

Expired

secara otomatis.

---

# Booking Filters

Staff dapat memfilter:

## Status

* Waiting Payment
* Booked
* In Use
* Finished
* Expired

---

## Device

* Reguler 1
* Reguler 2
* Reguler 3
* Reguler 4
* VIP 1A
* VIP 1B
* VIP 2

---

## Tanggal

Filter berdasarkan tanggal booking.

---

# Device Management

Menu untuk melihat seluruh device.

---

# Device List

## Reguler 1

Status

---

## Reguler 2

Status

---

## Reguler 3

Status

---

## Reguler 4

Status

---

## VIP 1A

Status

---

## VIP 1B

Status

---

## VIP 2

Status

---

# Device Status

## Available

Tersedia.

---

## Waiting Payment

Sedang ditahan booking sementara.

---

## Booked

Sudah dibooking.

---

## In Use

Sedang digunakan.

---

# Device Actions

Staff dapat mengubah status secara manual jika diperlukan.

---

# Pricing Management

Staff dapat mengubah harga tanpa deploy ulang aplikasi.

---

# Harga Normal

## Reguler

Rp10.000/Jam

---

## VIP 1

Rp30.000/Jam

---

## VIP 2

Rp35.000/Jam

---

# Promo Weekday

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

# Diskon 4 Jam+

20%

---

# Pricing Actions

Staff dapat:

* Mengubah harga normal.
* Mengubah harga promo.
* Mengubah diskon.

Perubahan langsung aktif.

---

# Business Hours Management

Staff dapat mengatur jam operasional.

---

# Minggu - Kamis

Buka

10:00

Tutup

01:00

---

# Jumat - Sabtu

Buka

10:00

Tutup

03:00

---

# Business Hours Actions

Staff dapat:

* Mengubah jam buka.
* Mengubah jam tutup.
* Menyimpan perubahan.

---

# Disclaimer Management

Staff dapat mengubah isi disclaimer.

---

# Contoh Disclaimer

Booking aktif setelah pembayaran diverifikasi.

Pembayaran wajib dilakukan dalam 15 menit.

Booking akan dibatalkan otomatis jika tidak dibayar.

Keterlambatan tidak menambah durasi bermain.

---

# WhatsApp Settings

Nomor tujuan booking.

Default:

082152425391

---

# Bank Account Settings

Bank:

BCA

Nomor Rekening:

7155450363

Atas Nama:

Nanda A

---

# Revenue Statistics

Dashboard menampilkan:

## Hari Ini

Pendapatan hari ini.

---

## Minggu Ini

Pendapatan minggu ini.

---

## Bulan Ini

Pendapatan bulan ini.

---

# Most Booked Device

Menampilkan device yang paling sering dibooking.

---

# Booking Trend

Menampilkan grafik booking sederhana.

---

# Search System

Staff dapat mencari:

* Nama pelanggan
* Nomor WhatsApp
* Kode booking

---

# Notification System

Tampilkan notifikasi untuk:

## Booking Baru

Waiting Payment baru masuk.

---

## Booking Expired

Booking otomatis dibatalkan.

---

## Device Akan Digunakan

Booking mendekati jam mulai.

---

# Mobile Dashboard

Dashboard wajib dapat digunakan melalui:

* HP Android
* iPhone
* Tablet

Karena staff kemungkinan besar akan mengakses dashboard dari perangkat mobile.

---

# Tujuan Akhir

Staff dapat mengelola seluruh operasional booking K Gaming XCafe dari satu dashboard sederhana tanpa perlu membuka banyak aplikasi atau melakukan pencatatan manual.
