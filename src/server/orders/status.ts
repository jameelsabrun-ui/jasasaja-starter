export type OrderStatus = 'pending' | 'paid' | 'expired' | 'failed';

/** Transisi status yang sah. Status akhir tidak boleh berubah lagi. */
const allowed: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'expired', 'failed'],
  paid: [],
  expired: [],
  failed: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return allowed[from].includes(to);
}

/** Daftar status asal yang boleh menuju `to` (dipakai di WHERE agar update atomik). */
export function statusesThatCanMoveTo(to: OrderStatus): OrderStatus[] {
  return (Object.keys(allowed) as OrderStatus[]).filter((from) => canTransition(from, to));
}
