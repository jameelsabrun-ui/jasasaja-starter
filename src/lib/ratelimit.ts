import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

const redis = new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });

/**
 * closed = jika Redis bermasalah, TOLAK (untuk login, checkout: jalur sensitif).
 * open   = jika Redis bermasalah, IZINKAN (untuk konten/API publik biasa).
 */
type Policy = 'open' | 'closed';

const defs = {
  auth: { policy: 'closed' as Policy, limit: 5, window: '1 m' as const },
  checkout: { policy: 'closed' as Policy, limit: 10, window: '1 m' as const },
  api: { policy: 'open' as Policy, limit: 60, window: '1 m' as const },
};

export type LimitKind = keyof typeof defs;

const limiters = Object.fromEntries(
  Object.entries(defs).map(([kind, d]) => [
    kind,
    new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(d.limit, d.window), prefix: `rl:${kind}` }),
  ]),
) as Record<LimitKind, Ratelimit>;

export async function checkLimit(kind: LimitKind, key: string): Promise<{ ok: boolean; retryAfterSec: number }> {
  try {
    const res = await limiters[kind].limit(key);
    return { ok: res.success, retryAfterSec: Math.max(1, Math.ceil((res.reset - Date.now()) / 1000)) };
  } catch {
    return { ok: defs[kind].policy === 'open', retryAfterSec: 30 };
  }
}
