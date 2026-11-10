import { z } from 'zod';

/**
 * Skema environment. TIDAK ADA nilai bawaan untuk rahasia.
 * Jika ada variabel kosong atau terlalu pendek, aplikasi gagal start (bukan diam-diam lolos).
 */
export const envSchema = z.object({
  DATABASE_URL: z.url(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(10),
  XENDIT_CALLBACK_TOKEN: z.string().min(16),
  AUTH_SECRET: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((i) => i.path.join('.')))].join(', ');
    throw new Error(`Konfigurasi environment tidak valid atau kosong: ${names}`);
  }
  return result.data;
}
