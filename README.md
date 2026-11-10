# JASASAJA Starter

Fondasi proyek web JASASAJA: Next.js + TypeScript + Drizzle/Neon + Upstash + Xendit, dengan keamanan dasar, CI, dan dokumentasi sejak hari pertama.

## Sudah termasuk (v0.1)
- Env tervalidasi (`src/lib/env.ts`): aplikasi gagal start jika rahasia kosong, tanpa fallback
- Header keamanan (CSP, HSTS, dsb.) di `next.config.ts`
- Rate limit Upstash bertingkat (`auth`/`checkout` fail-closed, `api` fail-open) via middleware
- Webhook Xendit aman: token timing-safe, validasi Zod, idempotency, UPDATE atomik bersyarat
- Skema DB `orders` dan `payment_events` (Drizzle)
- Aturan ESLint: larang `process.env` langsung dan `dangerouslySetInnerHTML`
- Test Vitest (14 test), CI GitHub Actions, gitleaks (pre-commit + CI), Dependabot
- `AGENTS.md` dan template `docs/`

## Belum termasuk (tambahkan per proyek, lihat docs/03-decisions/)
Auth (pilih Auth.js atau Better Auth, ADR 0002), pembuatan invoice Xendit + checkout, RajaOngkir, Sentry, email, upload file, panel admin.

## Mulai
```bash
# 1. Prasyarat: Node >= 20.9, pnpm, git, GitHub CLI (gh auth login)
pnpm install
cp .env.example .env.local     # isi semua nilai; jangan commit
pnpm setup:hooks               # aktifkan pre-commit gitleaks (butuh gitleaks terpasang)
pnpm db:migrate               # migrasi awal sudah disertakan (drizzle/)
pnpm dev
```

## Memulai proyek baru dari starter
1. Buat repo baru dari template ini (GitHub: *Use this template*), atau salin folder dan `git init`.
2. Ganti `name` di `package.json`, isi `docs/01-prd.md` (PRD 1 halaman + scope lock + tanggal live).
3. Buat database Neon (region Singapura), isi `.env.local` dan env production.
4. **Deploy kosong ke production hari ini** (gerbang G3), lalu bangun slice pertama.
5. Untuk proyek komersial, pastikan paket hosting mengizinkan penggunaan komersial.

## Struktur
```
src/app/            halaman dan route (api/health, api/webhooks/xendit)
src/lib/            env, ratelimit, security
src/db/             skema dan koneksi Drizzle
src/server/         logika bisnis di luar UI (orders, payments)
tests/              unit test
docs/               PRD, arsitektur, ADR, runbook, changelog, keamanan
```

## Catatan
- CSP bawaan memakai `'unsafe-inline'` untuk skrip/gaya agar Next.js berjalan tanpa konfigurasi nonce. Perketat dengan nonce jika memakai skrip pihak ketiga (docs/06-security.md).
- Webhook Xendit memakai header `x-callback-token`. Pastikan token test dan live berbeda dan disimpan sebagai env terpisah.
- Variabel env di CI untuk langkah build berisi nilai dummy; jangan pernah memakainya di production.
