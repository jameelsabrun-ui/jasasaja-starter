import { timingSafeEqual } from 'node:crypto';

/** Perbandingan rahasia yang tahan serangan timing. Selalu pakai ini, bukan `===`. */
export function safeEqual(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}
