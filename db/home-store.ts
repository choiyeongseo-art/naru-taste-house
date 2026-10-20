import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from './index';
import { homes } from './schema';

type StoredHome = { state: unknown; updatedAt: number };
type RuntimeSettings = {
  HOME_DATABASE_PROVIDER?: string;
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
};

function settings(): RuntimeSettings {
  return env as RuntimeSettings;
}

function supabaseRequest(path: string, init?: RequestInit) {
  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = settings();
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error('Supabase server settings are missing.');
  }
  const base = new URL(SUPABASE_URL);
  if (base.protocol !== 'https:' || !base.hostname.endsWith('.supabase.co')) {
    throw new Error('Invalid Supabase project URL.');
  }
  const headers = new Headers(init?.headers);
  headers.set('apikey', SUPABASE_SECRET_KEY);
  headers.set('Content-Type', 'application/json');
  // Legacy service_role JWTs use Bearer auth; new secret keys use apikey only.
  if (SUPABASE_SECRET_KEY.startsWith('eyJ')) {
    headers.set('Authorization', `Bearer ${SUPABASE_SECRET_KEY}`);
  }
  return fetch(new URL(`/rest/v1/${path}`, base), { ...init, headers, cache: 'no-store' });
}

export async function readHome(userId: string): Promise<StoredHome | null> {
  if (settings().HOME_DATABASE_PROVIDER === 'supabase') {
    const query = new URLSearchParams({ user_id: `eq.${userId}`, select: 'state,updated_at', limit: '1' });
    const response = await supabaseRequest(`taste_homes?${query}`);
    if (!response.ok) throw new Error(`Supabase read failed (${response.status}).`);
    const rows = await response.json() as { state: unknown; updated_at: number }[];
    return rows[0] ? { state: rows[0].state, updatedAt: Number(rows[0].updated_at) } : null;
  }
  const rows = await getDb().select().from(homes).where(eq(homes.userId, userId)).limit(1);
  return rows[0] ? { state: JSON.parse(rows[0].state), updatedAt: rows[0].updatedAt } : null;
}

export async function writeHome(userId: string, nickname: string, state: unknown, updatedAt: number) {
  if (settings().HOME_DATABASE_PROVIDER === 'supabase') {
    const response = await supabaseRequest('taste_homes?on_conflict=user_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ user_id: userId, nickname, state, updated_at: updatedAt }),
    });
    if (!response.ok) throw new Error(`Supabase save failed (${response.status}).`);
    return;
  }
  await getDb().insert(homes).values({ userId, nickname, state: JSON.stringify(state), updatedAt })
    .onConflictDoUpdate({ target: homes.userId, set: { nickname, state: JSON.stringify(state), updatedAt } });
}
