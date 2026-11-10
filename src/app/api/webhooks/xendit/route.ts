import { and, eq, inArray } from 'drizzle-orm';
import { db, schema } from '@/db';
import { env } from '@/lib/env';
import { safeEqual } from '@/lib/security';
import { statusesThatCanMoveTo } from '@/server/orders/status';
import { eventKey, mapXenditStatus, xenditInvoiceEvent } from '@/server/payments/xendit';

export async function POST(req: Request) {
  // 1. Autentikasi: token wajib cocok (timing-safe). Env kosong tidak mungkin lolos karena divalidasi saat boot.
  const token = req.headers.get('x-callback-token') ?? '';
  if (!safeEqual(token, env.XENDIT_CALLBACK_TOKEN)) {
    return new Response('unauthorized', { status: 401 });
  }

  // 2. Validasi bentuk payload
  const raw: unknown = await req.json().catch(() => null);
  const parsed = xenditInvoiceEvent.safeParse(raw);
  if (!parsed.success) return new Response('bad request', { status: 400 });
  const event = parsed.data;

  // 3. Idempotency: simpan payload mentah; jika sudah pernah diterima, balas 200 tanpa memproses ulang.
  const inserted = await db
    .insert(schema.paymentEvents)
    .values({ provider: 'xendit', eventKey: eventKey(event), payload: raw })
    .onConflictDoNothing()
    .returning({ id: schema.paymentEvents.id });
  if (inserted.length === 0) return new Response('duplicate', { status: 200 });

  // 4. Update atomik: hanya jika transisi sah DAN jumlah cocok dengan data di DB.
  const next = mapXenditStatus(event.status);
  if (next) {
    await db
      .update(schema.orders)
      .set({ status: next, paidAt: next === 'paid' ? new Date() : null })
      .where(
        and(
          eq(schema.orders.externalId, event.external_id),
          eq(schema.orders.amount, event.amount),
          inArray(schema.orders.status, statusesThatCanMoveTo(next)),
        ),
      );
  }

  // 5. Balas cepat
  return new Response('ok', { status: 200 });
}
