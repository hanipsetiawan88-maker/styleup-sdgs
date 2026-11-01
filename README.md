# StyleUp SDGs - MVP React Vite + Tailwind

Prototype aplikasi platform keberlanjutan **StyleUp SDGs Indonesia** yang dimigrasikan ke arsitektur modern **React + Vite + Tailwind CSS** berdasarkan desain Figma dan project stitch.

## 🚀 Cara Menjalankan Proyek

1. Masuk ke direktori proyek:
   ```bash
   cd "C:\Users\MUHAMMAD HANIF S\.gemini\antigravity\scratch\styleup-sdgs"
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser pada alamat yang tertera (biasanya `http://localhost:5173/`).

4. Untuk build production:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌟 Fitur Utama & Halaman

### 1. **Beranda (`#beranda`)**
- Header & Sticky Navbar dengan status audit ISO dan status verifikasi Bappenas RI.
- Hero personal greeting *"Halo, Najlaa 👋"* dengan 4 Bento KPI Metric Pods (+14.2% YoY, Rp 14,8 M teralokasi, 38 Provinsi, 18.520+ Relawan).
- Filter interaktif Sasaran SDGs (SDG 4, 6, 7, 13, 14, 15) dengan live filter kartu proyek.
- Cuplikan geospasial Nusantara radar Sentinel-2.
- Toggle tampilan Grid dan Daftar proyek dengan kartu interaktif.

### 2. **Kanal Pembayaran & Donasi Hijau (`#pembayaran`) ⭐ (Fitur Baru & Unggulan)**
- **Stepper 4 Langkah Transparan**:
  1. *Pilih Proyek Penerima Manfaat* (dropdown interaktif dengan preview foto, lokasi, persentase).
  2. *Nominal Donasi* (Preset cepat Rp 50k, 100k, 250k, 500k, 1jt, 2.5jt serta input nominal bebas).
  3. *Simulasi Dampak Nyata Real-time*:
     - Paket bibit mangrove / bibit karang
     - Estimasi kg CO₂e tereduksi
     - Poin ESG yang didapat
     - Luas hektar area yang direstorasi
  4. *Identitas Donatur & Insentif Pajak* (pilihan Donatur Anonim vs Terverifikasi, checkbox bukti potong pajak PMK 04).
  5. *Multi-Kanal Pembayaran*:
     - **QRIS Instan**: Dilengkapi kode QR SVG resolusi tinggi & **Countdown Timer Real-time (14:51)**.
     - **Virtual Account**: BCA, Mandiri, BRI, BNI dengan nomor VA simulasi.
     - **E-Wallet**: GoPay, OVO, DANA, ShopeePay.
     - **Kartu Kredit/Debit**: Visa / Mastercard.
  6. *Ringkasan Donasi Sticky*: Total penyaluran 100% tanpa biaya admin.
  7. *Modal Sukses & Animasi Confetti*: E-sertifikat ISO 14064 otomatis terbit beserta hash kriptografi unik.

### 3. **Eksplorasi Proyek (`#eksplorasi`)**
- Pencarian kata kunci real-time (lokasi, judul, isu iklim).
- Filter target SDG dan filter proyek mendesak.
- Pengurutan berdasarkan tanggal, persentase dana, atau urgensi hari.
- Tampilan Grid dan Tampilan List responsif.

### 4. **Pemetaan SDGs Radar Satelit (`#pemetaan`)**
- Visualisasi GIS 38 Provinsi Indonesia dengan pin hotspot interaktif (Kalimantan Timur, NTT, Wakatobi, dll).
- Informasi koordinat satelit GNSS, live status Sentinel-2, dan zero-duplication funding audit.

### 5. **Pusat Sertifikasi & Kredensial Resmi (`#sertifikasi`)**
- Portofolio sertifikat resmi standar ISO 14064-1 & GRI Standards.
- *Claim Engine*: Masukkan kode registrasi escrow untuk verifikasi & sinkronisasi otomatis sertifikat baru.
- Tombol unduh PDF dan arsip ZIP bundle.

### 6. **Pusat Notifikasi (`#notifikasi`)**
- Filter notifikasi belum dibaca, sudah dibaca, dan tandai semua telah dibaca.
- Badge real-time di header navigasi.

### 7. **Profil Kontributor (`#profil`)**
- Portofolio Najlaa Khairunnisa Arwanto.
- Bento KPI Scorecard: Total Donasi, Jam Relawan GPS, Proyek, dan Indeks ESG Score 840.
- Tab Lencana Kehormatan (6 badges) dan riwayat kontribusi.

### 8. **Detail Proyek (`#detail-proyek`)**
- Laporan komprehensif restorasi dengan breakdown fase milestone, audit trail Mandiri Kustodian, dan formulir pendaftaran relawan lapangan.

### 9. **Autentikasi (`#masuk` & `#daftar`)**
- Halaman login dan register dengan pengecekan password strength, SSO instansi Bappenas/Google/Apple, dan validasi form.
