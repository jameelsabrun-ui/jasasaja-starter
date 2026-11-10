import { NextResponse, type NextRequest } from 'next/server';
import { checkLimit, type LimitKind } from '@/lib/ratelimit';

// Webhook dikecualikan (diamankan lewat verifikasi token + idempotency).
export const config = { runtime: 'nodejs', matcher: ['/api/((?!webhooks/).*)'] };

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function kindFor(pathname: string): LimitKind {
  if (pathname.startsWith('/api/auth')) return 'auth';
  if (pathname.startsWith('/api/checkout')) return 'checkout';
  return 'api';
}

export async function middleware(req: NextRequest) {
  const kind = kindFor(req.nextUrl.pathname);
  const { ok, retryAfterSec } = await checkLimit(kind, clientIp(req));
  if (!ok) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi sebentar.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    );
  }
  return NextResponse.next();
}
