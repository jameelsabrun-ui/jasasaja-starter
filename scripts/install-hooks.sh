#!/bin/sh
# Mengaktifkan hook git di .githooks/ (pre-commit: gitleaks pada file yang di-stage).
set -e
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
echo "Hook aktif. Pasang gitleaks bila belum: https://github.com/gitleaks/gitleaks#installing"
