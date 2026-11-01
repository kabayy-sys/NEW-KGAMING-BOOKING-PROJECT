# 07 - Flexible Happy Hour Promo System (PRD & Implementation Guide)

## 1. Overview
Sistem promo fleksibel dirancang untuk memungkinkan owner KGaming mengubah jadwal, jam operasional happy hour, hari berlaku, serta tarif diskon per jam secara dinamis melalui Dashboard Admin tanpa perlu melakukan modifikasi kode sumber (hardcoding).

---

## 2. Database Schema Changes (SQL Migration)
Tambahkan kolom baru pada tabel `pricing_rules` untuk mendukung konfigurasi Happy Hour dinamis.

```sql
-- Migration: Add Happy Hour columns to pricing_rules
ALTER TABLE pricing_rules
  ADD COLUMN IF NOT EXISTS happy_hour_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS happy_hour_start TIME DEFAULT '10:00',
  ADD COLUMN IF NOT EXISTS happy_hour_end TIME DEFAULT '16:00',
  ADD COLUMN IF NOT EXISTS happy_hour_price NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS promo_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5]; -- 1=Monday, 5=Friday
```

---

## 3. Pricing Calculation Logic (Hybrid / Slot-Based)
Untuk booking yang melintasi batas jam happy hour (misal mulai jam 14:00 sampai 17:00), sistem melakukan kalkulasi per-slot (1 jam per slot):
1. **Cek Hari:** Apakah hari booking termasuk dalam `promo_days` (Senin–Jumat)?
2. **Cek Status Happy Hour:** Apakah `happy_hour_enabled` bernilai `true`?
3. **Iterasi Jam Slot:**
   - Jika slot waktu bermain berada di antara `happy_hour_start` dan `happy_hour_end`, gunakan `happy_hour_price`.
   - Jika slot waktu bermain berada di luar rentang tersebut atau di akhir pekan (Sabtu–Minggu), gunakan `hourly_price` (harga normal).

---

## 4. UI / UX Design Specifications
### A. Admin Dashboard (`/dashboard/pricing`)
* **Happy Hour Toggle:** Switch untuk mengaktifkan/menonaktifkan promo bulanan.
* **Time Range Picker:** Input `Start Time` (default 10:00) dan `End Time` (default 16:00).
* **Day Selector:** Checkbox hari aktif (`Sen`, `Sel`, `Rab`, `Kam`, `Jum`).
* **Price Input:** Input nominal `Harga Happy Hour per Jam` untuk tiap kategori (Reguler, VIP 1, VIP 2).

### B. Customer Booking Flow (`/booking`)
* Pelanggan memilih jam dan durasi seperti biasa.
* Jika jam masuk dalam rentang happy hour, total harga otomatis dikalkulasikan dengan tarif diskon dan badge kecil bertuliskan **"Happy Hour Promo Applied"** muncul di ringkasan pemesanan.

---

## 5. Implementation Roadmap
1. Jalankan SQL migration di database Supabase.
2. Update TypeScript type definitions untuk `PricingRule`.
3. Tambahkan form kontrol Happy Hour di `/dashboard/pricing`.
4. Sesuaikan fungsi kalkulasi harga di `use-booking-flow.ts`.
5. Testing E2E skenario lintas jam promo & normal.
