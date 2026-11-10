# Runbook

## Deploy
`main` otomatis ter-deploy. Pastikan CI hijau sebelum merge.

## Rollback
Vercel → Deployments → pilih deployment sehat sebelumnya → Promote to Production.

## Backup dan restore database
- Neon: gunakan branch/point-in-time restore. **Uji restore minimal sekali sebelum go-live** dan catat tanggalnya di sini.

## Rotasi kunci (jika ada kebocoran)
1. Cabut/rotasi kunci di penyedia (GitHub, Xendit, Upstash, Neon).
2. Perbarui env di Vercel, deploy ulang.
3. Periksa log akses dan catat insiden di `05-changelog.md`.

## Kontak darurat
- Penyedia: Xendit (dashboard support), Neon, Vercel
- Domain/DNS: …  Masa berlaku domain: …
