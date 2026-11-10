import { describe, expect, it } from 'vitest';
import { canTransition, statusesThatCanMoveTo } from '@/server/orders/status';

describe('status order', () => {
  it('pending boleh menuju paid/expired/failed', () => {
    for (const to of ['paid', 'expired', 'failed'] as const) expect(canTransition('pending', to)).toBe(true);
  });
  it('status akhir tidak boleh berubah (mencegah bayar ganda / event terlambat)', () => {
    for (const from of ['paid', 'expired', 'failed'] as const) {
      for (const to of ['pending', 'paid', 'expired', 'failed'] as const) expect(canTransition(from, to)).toBe(false);
    }
  });
  it('hanya pending yang bisa menuju paid', () => expect(statusesThatCanMoveTo('paid')).toEqual(['pending']));
});
