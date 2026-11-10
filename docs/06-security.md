# Checklist keamanan (gerbang G6; salin ke issue/PR untuk tiap proyek)

- [ ] HTTPS aktif; header keamanan terverifikasi (`curl -I`)
- [ ] Env tervalidasi; tidak ada fallback rahasia; kunci test dan live terpisah
- [ ] Auth memakai library mapan; sesi HttpOnly/Secure/SameSite; otorisasi dicek di server
- [ ] Semua input divalidasi Zod di server; tidak ada SQL mentah
- [ ] Rate limit: auth, registrasi, reset password, form kontak, checkout (fail-closed), API publik
- [ ] Webhook: token timing-safe, idempotency, payload mentah tersimpan, jumlah dicocokkan dengan DB
- [ ] Upload: batasi tipe/ukuran, simpan di storage objek
- [ ] CSP diperketat (nonce) bila memakai skrip pihak ketiga
- [ ] `images.remotePatterns` eksplisit; lint/typecheck aktif di build
- [ ] gitleaks bersih (riwayat dan pesan commit); Dependabot aktif
- [ ] Backup DB terjadwal dan **sudah diuji restore**
- [ ] Review keamanan oleh AI di sesi baru (prompt di buku pedoman, Bagian 20), temuan kritis = 0
