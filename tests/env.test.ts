import { describe, expect, it } from 'vitest';
import { parseEnv } from '@/lib/env.schema';

const valid = {
  DATABASE_URL: 'postgresql://u:p@host/db?sslmode=require',
  UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'tokenpanjangcukup',
  XENDIT_CALLBACK_TOKEN: 'callback-token-panjang',
  AUTH_SECRET: 'a'.repeat(32),
};

describe('parseEnv', () => {
  it('menerima konfigurasi lengkap', () => {
    expect(parseEnv(valid).AUTH_SECRET).toHaveLength(32);
  });

  it('GAGAL jika rahasia webhook kosong (tidak ada fallback)', () => {
    expect(() => parseEnv({ ...valid, XENDIT_CALLBACK_TOKEN: '' })).toThrow(/XENDIT_CALLBACK_TOKEN/);
  });

  it('GAGAL jika variabel tidak ada', () => {
    const { AUTH_SECRET: _omit, ...rest } = valid;
    void _omit;
    expect(() => parseEnv(rest)).toThrow(/AUTH_SECRET/);
  });

  it('GAGAL jika AUTH_SECRET terlalu pendek', () => {
    expect(() => parseEnv({ ...valid, AUTH_SECRET: 'pendek' })).toThrow(/AUTH_SECRET/);
  });
});
