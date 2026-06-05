# Database Schema

## Tujuan

Dokumen ini menjelaskan struktur database Supabase yang digunakan oleh K Gaming XCafe Booking System.

Tujuan desain database:

* Sederhana.
* Mudah dipelihara.
* Mudah dikembangkan.
* Menghindari duplikasi data.
* Mendukung realtime update.
* Mendukung perubahan harga tanpa deploy ulang.

---

# Database Overview

Tabel Utama:

```text
staff_users

devices

bookings

pricing_rules

business_hours

disclaimers

settings
```

---

# Relationship Diagram

```text
devices
    |
    |
bookings
    |
    |
pricing_rules

business_hours

staff_users

settings

disclaimers
```

---

# Table: staff_users

Digunakan untuk login staff.

Versi awal hanya menggunakan 1 akun.

---

## Columns

### id

Type:

uuid

Primary Key

---

### username

Type:

text

Unique

Required

---

### password_hash

Type:

text

Required

---

### created_at

Type:

timestamp

Default:

now()

---

### updated_at

Type:

timestamp

Default:

now()

---

# Example

```json
{
  "username": "staff",
  "password_hash": "encrypted_password"
}
```

---

# Table: devices

Menyimpan seluruh device yang tersedia.

---

## Columns

### id

uuid

Primary Key

---

### name

text

Required

---

### category

text

Required

Values:

```text
REGULAR
VIP1
VIP2
```

---

### hourly_price

numeric

Required

---

### active

boolean

Default:

true

---

### created_at

timestamp

---

### updated_at

timestamp

---

# Default Data

```json
[
  {
    "name": "Reguler 1",
    "category": "REGULAR",
    "hourly_price": 10000
  },
  {
    "name": "Reguler 2",
    "category": "REGULAR",
    "hourly_price": 10000
  },
  {
    "name": "Reguler 3",
    "category": "REGULAR",
    "hourly_price": 10000
  },
  {
    "name": "Reguler 4",
    "category": "REGULAR",
    "hourly_price": 10000
  },
  {
    "name": "VIP 1A",
    "category": "VIP1",
    "hourly_price": 30000
  },
  {
    "name": "VIP 1B",
    "category": "VIP1",
    "hourly_price": 30000
  },
  {
    "name": "VIP 2",
    "category": "VIP2",
    "hourly_price": 35000
  }
]
```

---

# Table: bookings

Tabel paling penting dalam sistem.

Menyimpan seluruh data booking pelanggan.

---

## Columns

### id

uuid

Primary Key

---

### booking_code

text

Unique

Format:

```text
KG-20260605-001
```

---

### customer_name

text

Required

---

### customer_phone

text

Required

---

### device_id

uuid

Foreign Key

devices.id

---

### booking_date

date

Required

---

### start_time

time

Required

---

### end_time

time

Required

---

### duration_hours

integer

Required

---

### package_type

text

Values:

```text
PROMO
NORMAL
```

---

### payment_type

text

Values:

```text
DP
FULL
```

---

### payment_amount

numeric

Nominal yang dibayar pelanggan.

---

### total_price

numeric

Harga total booking.

---

### status

text

Values:

```text
WAITING_PAYMENT

BOOKED

IN_USE

FINISHED

EXPIRED
```

---

### expires_at

timestamp

Digunakan untuk timer 15 menit.

---

### notes

text

Optional

---

### created_at

timestamp

---

### updated_at

timestamp

---

# Example Booking

```json
{
  "booking_code": "KG-20260605-001",
  "customer_name": "Raken",
  "customer_phone": "08123456789",
  "device_id": "...",
  "booking_date": "2026-06-12",
  "start_time": "20:00",
  "end_time": "23:00",
  "duration_hours": 3,
  "package_type": "PROMO",
  "payment_type": "FULL",
  "payment_amount": 90000,
  "total_price": 90000,
  "status": "WAITING_PAYMENT"
}
```

---

# Table: pricing_rules

Menyimpan seluruh harga.

Tidak hardcoded.

---

## Columns

### id

uuid

Primary Key

---

### category

text

Values:

```text
REGULAR
VIP1
VIP2
```

---

### hourly_price

numeric

---

### promo_2h_price

numeric

---

### promo_3h_price

numeric

---

### discount_4h_percent

numeric

Default:

20

---

### created_at

timestamp

---

### updated_at

timestamp

---

# Default Data

## REGULAR

```json
{
  "hourly_price": 10000,
  "promo_2h_price": 18000,
  "promo_3h_price": 25000,
  "discount_4h_percent": 20
}
```

---

## VIP1

```json
{
  "hourly_price": 30000,
  "promo_2h_price": 55000,
  "promo_3h_price": 80000,
  "discount_4h_percent": 20
}
```

---

## VIP2

```json
{
  "hourly_price": 35000,
  "promo_2h_price": 65000,
  "promo_3h_price": 90000,
  "discount_4h_percent": 20
}
```

---

# Table: business_hours

Mengatur jam operasional.

---

## Columns

### id

uuid

Primary Key

---

### day_name

text

Example:

```text
MONDAY
TUESDAY
WEDNESDAY
THURSDAY
FRIDAY
SATURDAY
SUNDAY
```

---

### open_time

time

---

### close_time

time

---

### active

boolean

---

# Default Data

Sunday

```json
{
  "open_time": "10:00",
  "close_time": "01:00"
}
```

---

Friday

```json
{
  "open_time": "10:00",
  "close_time": "03:00"
}
```

---

# Table: disclaimers

Menyimpan disclaimer booking.

---

## Columns

### id

uuid

Primary Key

---

### content

text

---

### active

boolean

---

### sort_order

integer

---

# Example Data

```json
[
  {
    "content": "Booking aktif setelah pembayaran diverifikasi."
  },
  {
    "content": "Pembayaran wajib dilakukan dalam 15 menit."
  },
  {
    "content": "Booking akan dibatalkan otomatis jika tidak dibayar."
  }
]
```

---

# Table: settings

Konfigurasi umum sistem.

---

## Columns

### id

uuid

Primary Key

---

### whatsapp_number

text

---

### bank_name

text

---

### bank_account_number

text

---

### bank_account_holder

text

---

### booking_expiration_minutes

integer

Default:

15

---

### max_booking_days

integer

Default:

7

---

### created_at

timestamp

---

### updated_at

timestamp

---

# Default Settings

```json
{
  "whatsapp_number": "082152425391",
  "bank_name": "BCA",
  "bank_account_number": "7155450363",
  "bank_account_holder": "Nanda A",
  "booking_expiration_minutes": 15,
  "max_booking_days": 7
}
```

---

# Realtime Requirements

Supabase Realtime wajib aktif untuk:

## bookings

Digunakan untuk:

* Update status booking realtime.
* Waiting Payment realtime.
* Device availability realtime.

---

## devices

Digunakan untuk:

* Update status device realtime.

---

# Index Recommendations

## bookings

Buat index:

```sql
booking_date
```

```sql
status
```

```sql
device_id
```

```sql
booking_code
```

---

## devices

Buat index:

```sql
category
```

---

# Security Rules

Staff Login:

Authenticated Only

---

Public Website:

Read Only

Untuk:

* Device
* Harga
* Jam Operasional
* Disclaimer

---

Staff Dashboard:

Full Access

Untuk:

* Booking
* Harga
* Jam Operasional
* Device
* Settings

---

# Future Ready

Schema harus mendukung:

* Multiple Staff
* Payment Gateway
* WhatsApp API
* Promo Musiman
* Membership
* Voucher
* Loyalty Point

tanpa perubahan besar pada struktur database.

---

# Kesimpulan

Database dirancang untuk:

* Ringan.
* Cepat.
* Mudah dikembangkan.
* Cocok untuk Next.js + Supabase + Vercel.
* Mendukung seluruh kebutuhan operasional K Gaming XCafe Booking System versi saat ini.
