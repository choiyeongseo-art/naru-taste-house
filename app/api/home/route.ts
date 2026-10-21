import { FurnitureItemSchema } from '../../../lib/furniture-schema';
import { getChatGPTUser } from '../../chatgpt-auth';
import { readHome, writeHome } from '../../../db/home-store';
import { z } from 'zod';
import { CharacterSchema } from '../../../lib/character-schema';
const State = z.object({
  nickname: z.string().trim().min(1).max(20), bio: z.string().max(100),
  mood: z.enum(['blue', 'pink', 'lavender', 'mint']),
  character: CharacterSchema,
  avatar: z.object({ hair: z.number().int().min(0).max(6), outfit: z.number().int().min(0).max(6), accessory: z.number().int().min(0).max(5), face: z.number().int().min(0).max(2).default(0) }),
  items: z.array(FurnitureItemSchema).max(30),
  result: z.number().int().min(0).max(3).nullable(),
  history: z.array(z.object({ type: z.number().int().min(0).max(3), date: z.string().max(40) })).max(30),
  saved: z.array(z.string().max(50)).max(100), visited: z.array(z.string().max(50)).max(100), rewards: z.array(z.string().max(50)).max(100), points: z.number().int().min(0).max(100000),
});
export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: '로그인이 필요해요.' }, { status: 401 });
  try {
    const home = await readHome(user.userId);
    return Response.json({ state: home?.state ?? null, updatedAt: home?.updatedAt ?? null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: '방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }, { status: 503 }); }
}
export async function PUT(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: '요청 경로를 확인해 주세요.' }, { status: 403 });
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: '로그인이 필요해요.' }, { status: 401 });
  try {
    const raw = await request.text();
    if (raw.length > 50000) return Response.json({error:'저장할 내용이 너무 커요.'},{status:413});
    const parsed = State.safeParse(JSON.parse(raw));
    if (!parsed.success) return Response.json({ error: '저장할 내용을 다시 확인해 주세요.' }, { status: 400 });
    const state = parsed.data, updatedAt = Date.now();
    await writeHome(user.userId, state.nickname, state, updatedAt);
    return Response.json({ ok: true, updatedAt });
  } catch { return Response.json({ error: '저장하지 못했어요. 변경 내용은 이 화면에 남아 있어요.' }, { status: 503 }); }
}
