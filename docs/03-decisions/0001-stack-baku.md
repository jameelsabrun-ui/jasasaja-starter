# ADR 0001: Stack baku JASASAJA
- **Tanggal:** 2026-11
- **Konteks:** Proyek sebelumnya memakai stack berbeda-beda sehingga fondasi tidak bisa dipakai ulang dan banyak proyek berhenti sebelum live.
- **Keputusan:** Next.js (App Router), TypeScript strict, Tailwind, Drizzle + Neon, Zod, Upstash, Xendit, Vitest, pnpm.
- **Konsekuensi:** Penyimpangan (mis. Astro untuk situs statis, Laravel untuk klien PHP) wajib punya ADR sendiri.
