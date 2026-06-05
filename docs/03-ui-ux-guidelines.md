# UI & UX Guidelines

## Tujuan

Dokumen ini menjadi panduan desain dan pengalaman pengguna untuk seluruh sistem K Gaming XCafe Booking System.

Fokus utama:

* Mudah dipahami pelanggan baru.
* Mobile First.
* Premium tetapi tidak rumit.
* Cepat digunakan.
* Nyaman digunakan di HP.
* Mudah dipelajari oleh staff.

---

# Filosofi Desain

Prinsip utama:

> Booking harus dapat diselesaikan dalam waktu kurang dari 1 menit.

Pelanggan tidak boleh dipaksa berpikir terlalu banyak.

Setiap langkah harus jelas.

---

# Target Pengguna

## Pelanggan

Mayoritas pengguna:

* Pelajar SMP
* Pelajar SMA
* Mahasiswa
* Pekerja
* Orang tua

Karena itu desain harus:

* Besar
* Jelas
* Mudah ditekan
* Tidak terlalu banyak teks

---

## Staff

Staff membutuhkan:

* Informasi cepat
* Tombol approve cepat
* Dashboard sederhana
* Status yang mudah dikenali

---

# Design Style

## Tema

Modern Gaming Lounge

Kesan yang ingin dibangun:

* Premium
* Bersih
* Profesional
* Cepat
* Modern

Bukan:

* Futuristik berlebihan
* Cyberpunk berlebihan
* Terlalu banyak animasi

---

# Color Palette

## Background

Dark Theme

Primary Background:

```css
#0F1117
```

Secondary Background:

```css
#171923
```

Card Background:

```css
#1F2330
```

---

## Accent Color

Gaming Gold

```css
#F5B700
```

Digunakan untuk:

* Tombol utama
* Harga promo
* Highlight

---

## Text

Primary:

```css
#FFFFFF
```

Secondary:

```css
#A1A1AA
```

---

# Status Colors

## Available

Hijau

```css
#22C55E
```

Label:

Available

---

## Waiting Payment

Kuning

```css
#EAB308
```

Label:

Waiting Payment

---

## Booked

Merah

```css
#EF4444
```

Label:

Booked

---

## In Use

Ungu

```css
#8B5CF6
```

Label:

In Use

---

## Finished

Abu Abu

```css
#6B7280
```

Label:

Finished

---

# Mobile First

Seluruh desain wajib dibuat untuk HP terlebih dahulu.

Lebar target:

* 360px
* 390px
* 412px

Setelah mobile selesai baru menyesuaikan tablet dan desktop.

---

# Struktur Halaman

## Home

Tujuan:

Memberikan informasi cepat.

Isi:

* Logo K Gaming XCafe
* Judul
* Deskripsi singkat
* Device yang tersedia
* Tombol Booking

---

# Hero Section

Menampilkan:

K Gaming XCafe

Booking PS Online Lebih Mudah

Lihat ketersediaan device secara realtime dan lakukan booking hanya dalam beberapa langkah.

Button:

Booking Sekarang

---

# Device Section

Menggunakan Card Layout.

Bukan tabel.

---

## Device Card

Contoh:

🎮 VIP 2

PS5 + Nintendo Switch

🟢 Available

Rp35.000/Jam

[ Booking ]

---

# Card Rules

Card harus menampilkan:

* Nama Device
* Kategori
* Status
* Harga
* Tombol Booking

Tidak perlu:

* Deskripsi panjang
* Informasi teknis berlebihan

---

# Booking Flow Layout

Booking menggunakan Step Layout.

---

## Step 1

Pilih Device

---

## Step 2

Pilih Tanggal

---

## Step 3

Pilih Jam

---

## Step 4

Pilih Durasi

---

## Step 5

Pilih Paket

---

## Step 6

Ringkasan

---

## Step 7

Disclaimer

---

# Progress Indicator

Tampilkan progress di atas.

Contoh:

1 Device

2 Tanggal

3 Jam

4 Durasi

5 Paket

6 Ringkasan

7 Konfirmasi

---

# Pemilihan Jam

Gunakan Grid.

Contoh:

10:00

10:30

11:00

11:30

12:00

12:30

---

## Slot Tidak Tersedia

Warna:

Merah

Tidak bisa diklik.

---

## Slot Tersedia

Warna:

Normal

Bisa diklik.

---

## Slot Dipilih

Accent Gold

---

# Durasi

Gunakan tombol pilihan.

Contoh:

[1 Jam]

[2 Jam]

[3 Jam]

[4 Jam]

---

# Promo Section

Jika hari Senin-Kamis.

Tampilkan:

🎉 Promo Weekday

Lalu tampilkan dua pilihan:

---

## Promo

Lebih Murah

Wajib Lunas

---

## Harga Normal

Lebih Fleksibel

DP atau Lunas

---

# Ringkasan Booking

Gunakan Card Besar.

Menampilkan:

* Device
* Tanggal
* Jam Mulai
* Jam Selesai
* Durasi
* Paket
* Metode Pembayaran
* Total

---

# Total Harga

Harus menjadi elemen terbesar.

Contoh:

Total Pembayaran

Rp90.000

---

# Disclaimer

Gunakan Checklist.

Jangan paragraf panjang.

Contoh:

☑ Booking aktif setelah pembayaran diverifikasi.

☑ Pembayaran wajib dilakukan dalam 15 menit.

☑ Booking akan dibatalkan otomatis jika tidak dibayar.

☑ Keterlambatan tidak menambah durasi bermain.

---

# Tombol WhatsApp

Tombol terbesar dalam halaman.

Label:

Lanjut ke WhatsApp

Posisi:

Bagian bawah halaman.

Sticky pada mobile jika memungkinkan.

---

# Dashboard Staff

Tampilan berbeda dari halaman pelanggan.

Lebih fokus ke data.

---

# Login Staff

Sederhana.

Field:

* Username
* Password

Button:

Login

Tidak ada:

* Register
* Lupa Password
* OTP
* Email

---

# Dashboard Overview

Menampilkan:

Waiting Payment

Booked

In Use

Hari Ini

Pendapatan Hari Ini

---

# Quick Actions

Approve Booking

Reject Booking

Update Status Device

---

# Booking Card Staff

Menampilkan:

Nama Pelanggan

Device

Tanggal

Jam

Durasi

Nominal Pembayaran

Status

Button Approve

Button Reject

---

# Responsive Rules

## Mobile

1 Kolom

---

## Tablet

2 Kolom

---

## Desktop

3 sampai 4 Kolom

---

# Animasi

Gunakan animasi ringan.

Contoh:

* Fade
* Slide
* Hover

Hindari:

* Animasi berlebihan
* Loading yang tidak perlu

---

# Komponen Shadcn UI

Direkomendasikan:

* Card
* Button
* Badge
* Dialog
* Drawer
* Sheet
* Tabs
* Select
* Calendar
* Alert
* Checkbox
* Toast

---

# UX Rules

Selalu tampilkan:

* Harga
* Status
* Total pembayaran

Jangan pernah menyembunyikan informasi penting.

Pelanggan harus mengetahui:

* Berapa yang harus dibayar
* Kapan bermain
* Device yang dipilih
* Status booking

tanpa perlu bertanya kepada admin.

---

# Tujuan Akhir

Pengguna baru yang pertama kali membuka website harus dapat memahami cara booking dalam waktu kurang dari 10 detik dan menyelesaikan booking dalam waktu kurang dari 1 menit.
