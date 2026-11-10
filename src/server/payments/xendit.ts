import { z } from 'zod';
import type { OrderStatus } from '@/server/orders/status';

/** Bentuk minimal callback invoice Xendit yang kita butuhkan. */
export const xenditInvoiceEvent = z.object({
  id: z.string().min(1),
  external_id: z.string().min(1),
  status: z.string().min(1),
  amount: z.number().int().nonnegative(),
});

export type XenditInvoiceEvent = z.infer<typeof xenditInvoiceEvent>;

/** Petakan status Xendit ke status order kita. Status tak dikenal => null (diabaikan, tetap dicatat). */
export function mapXenditStatus(status: string): OrderStatus | null {
  switch (status.toUpperCase()) {
    case 'PAID':
    case 'SETTLED':
      return 'paid';
    case 'EXPIRED':
      return 'expired';
    case 'FAILED':
      return 'failed';
    default:
      return null;
  }
}

export function eventKey(e: XenditInvoiceEvent): string {
  return `${e.id}:${e.status.toUpperCase()}`;
}
