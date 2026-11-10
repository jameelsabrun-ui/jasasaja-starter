import { describe, expect, it } from 'vitest';
import { safeEqual } from '@/lib/security';

describe('safeEqual', () => {
  it('true untuk string sama', () => expect(safeEqual('abc123', 'abc123')).toBe(true));
  it('false untuk string beda', () => expect(safeEqual('abc123', 'abc124')).toBe(false));
  it('false untuk panjang beda (tanpa melempar error)', () => expect(safeEqual('abc', 'abcd')).toBe(false));
  it('string kosong tidak pernah cocok dengan rahasia asli', () => expect(safeEqual('', 'rahasia-asli')).toBe(false));
});
