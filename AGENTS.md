# AGENTS.md: aturan untuk AI dan untuk diri sendiri

Baca file ini dan `docs/01-prd.md` sebelum menulis kode. Tulis rencana (file yang diubah, skema DB, test) dan tunggu persetujuan sebelum implementasi.

## Stack baku (jangan menyimpang tanpa ADR di docs/03-decisions/)
Next.js (App Router) · TypeScript strict · Tailwind · Drizzle + Neon (Postgres) · Zod · Upstash ratelimit · Xendit · Vitest · pnpm.

## Aturan keras
1. **Rahasia/konfigurasi hanya lewat `src/lib/env.ts`.** Dilarang `process.env` langsung (ESLint menolak). Dilarang nilai bawaan untuk rahasia (`|| 'abc'`).
2. **Webhook**: verifikasi token/signature dengan `safeEqual` (timing-safe), validasi payload dengan Zod, simpan payload mentah di `payment_events` (idempotency), update status lewat UPDATE bersyarat (transisi sah + jumlah cocok).
3. **Uang**: jumlah selalu dihitung dari DB, tidak pernah dari klien. Setiap logika uang wajib punya test.
4. **Zod di setiap batas masuk** (API, form, server action). Otorisasi dicek di server, bukan hanya menyembunyikan tombol UI.
5. **Rate limit**: jalur sensitif (login, checkout) `closed`, konten publik `open` (lihat `src/lib/ratelimit.ts`).
6. Dilarang `dangerouslySetInnerHTML`, SQL mentah, dan `images.remotePatterns` dengan `**`.
7. Tidak ada dependensi baru tanpa persetujuan. Tidak menonaktifkan lint/typecheck di build.
8. Jangan pernah menulis token/kunci di kode, pesan commit, atau chat.
9. Selesai berarti `pnpm verify` hijau (lint + typecheck + test) dan docs ikut diperbarui.

## Perintah
`pnpm dev` · `pnpm verify` · `pnpm build` · `pnpm db:generate` · `pnpm db:migrate`
