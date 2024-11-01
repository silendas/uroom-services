# My Express App

![U-ROOM](https://via.placeholder.com/800x200.png?text=U-ROOM)

## Deskripsi

My Express App adalah aplikasi sederhana yang dibangun menggunakan Express.js. Aplikasi ini mendukung migrasi database dan seeding untuk lingkungan pengembangan dan produksi. Dokumentasi API dapat diakses melalui endpoint `/api-docs`.

## Persyaratan

- Node.js
- MySQL

## Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/silendas/uroom-services.git
   cd uroom-services
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

## Menjalankan Aplikasi

### Development

1. Jalankan migrasi dan seeder untuk development:
   ```bash
   npm run migrate:dev
   npm run seed:dev
   ```

2. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

### Production

1. Ubah konfigurasi pada file `.env` sesuai dengan lingkungan produksi Anda.

2. Jalankan migrasi dan seeder untuk production:
   ```bash
   npm run migrate:prod
   npm run seed:prod
   ```

3. Jalankan aplikasi:
   ```bash
   npm run prod
   ```

## Dokumentasi API

Untuk mengunjungi dokumentasi API, buka browser Anda dan akses endpoint /api-docs

> **Catatan:** Pastikan Anda telah mengatur database dan variabel lingkungan yang diperlukan sebelum menjalankan aplikasi.


