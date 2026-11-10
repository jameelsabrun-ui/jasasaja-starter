import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const orderStatus = pgEnum('order_status', ['pending', 'paid', 'expired', 'failed']);

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // ID unik di sisi kita, dikirim ke Xendit sebagai external_id
    externalId: text('external_id').notNull(),
    // Jumlah dalam rupiah (bilangan bulat). Sumber kebenaran harga: DB, bukan klien.
    amount: integer('amount').notNull(),
    status: orderStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
  },
  (t) => [uniqueIndex('orders_external_id_uq').on(t.externalId), index('orders_status_idx').on(t.status)],
);

// Payload mentah semua webhook disimpan untuk audit dan idempotency.
export const paymentEvents = pgTable(
  'payment_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    provider: text('provider').notNull(),
    // Kunci idempotency, mis. `${invoiceId}:${status}`
    eventKey: text('event_key').notNull(),
    payload: jsonb('payload').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('payment_events_provider_key_uq').on(t.provider, t.eventKey)],
);
