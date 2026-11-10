# Arsitektur

## Gambaran
Next.js (App Router) di Vercel → Neon Postgres (pooled, Singapura) · Upstash Redis (rate limit) · Xendit (pembayaran, webhook).

## Alur pembayaran
1. Server membuat order `pending` dengan jumlah dari DB, lalu invoice Xendit (`external_id` = `orders.external_id`).
2. Pelanggan membayar di Xendit.
3. Xendit memanggil `POST /api/webhooks/xendit` → token diverifikasi (timing-safe) → payload divalidasi (Zod) → disimpan di `payment_events` (unik per provider + event key) → UPDATE bersyarat `orders` (transisi sah + jumlah cocok).
4. Halaman sukses hanya membaca status dari DB. Redirect Xendit bukan sumber kebenaran.

## Status order
`pending → paid | expired | failed`. Status akhir tidak berubah lagi (`src/server/orders/status.ts`).

## Model data
Lihat `src/db/schema.ts`. Tambahkan diagram proyek di sini.
