import { describe, expect, it } from 'vitest';
import { eventKey, mapXenditStatus, xenditInvoiceEvent } from '@/server/payments/xendit';

describe('xendit', () => {
  it('memetakan status', () => {
    expect(mapXenditStatus('PAID')).toBe('paid');
    expect(mapXenditStatus('settled')).toBe('paid');
    expect(mapXenditStatus('EXPIRED')).toBe('expired');
    expect(mapXenditStatus('PENDING')).toBeNull();
  });
  it('kunci idempotency stabil', () => {
    const e = xenditInvoiceEvent.parse({ id: 'inv1', external_id: 'ord1', status: 'paid', amount: 1000 });
    expect(eventKey(e)).toBe('inv1:PAID');
  });
  it('menolak payload tanpa jumlah', () => {
    expect(xenditInvoiceEvent.safeParse({ id: 'x', external_id: 'y', status: 'PAID' }).success).toBe(false);
  });
});
