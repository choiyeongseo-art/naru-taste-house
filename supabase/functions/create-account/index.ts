import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const origins = new Set(['https://choiyeongseo-art.github.io', 'http://127.0.0.1:5173', 'http://localhost:5173']);
const publicKey = 'sb_publishable__dWi72tYl_xTcupO3ddLuQ__DSTFc2f';

Deno.serve(async request => {
  const origin = request.headers.get('origin') || '';
  const headers = {
    'Access-Control-Allow-Origin': origins.has(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store', 'Vary': 'Origin',
  };
  const reply = (body: object, status = 200) => Response.json(body, { status, headers });
  if (!origins.has(origin)) return reply({ error: '허용되지 않은 요청이에요.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply({ error: 'POST 요청이 필요해요.' }, 405);
  if (request.headers.get('apikey') !== publicKey) return reply({ error: '앱 연결을 확인해 주세요.' }, 401);
  try {
    const text = await request.text();
    if (text.length > 4096) return reply({ error: '입력 내용이 너무 길어요.' }, 413);
    let input;
    try { input = JSON.parse(text); } catch { return reply({ error: '입력 내용을 확인해 주세요.' }, 400); }
    const username = typeof input?.username === 'string' ? input.username.trim().toLowerCase() : '';
    const nickname = typeof input?.nickname === 'string' ? input.nickname.trim() : '';
    const password = typeof input?.password === 'string' ? input.password : '';
    if (!/^[a-z][a-z0-9_]{3,23}$/.test(username)) return reply({ error: '아이디는 영문 소문자로 시작하는 4~24자의 영문·숫자·밑줄로 만들어 주세요.' }, 400);
    if (!nickname || nickname.length > 20) return reply({ error: '별명은 1~20자로 입력해 주세요.' }, 400);
    if (password.length < 10 || password.length > 128) return reply({ error: '비밀번호는 10~128자로 입력해 주세요.' }, 400);
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
    if (!ip) return reply({ error: '가입 요청 경로를 확인해 주세요.' }, 400);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret + ':' + ip));
    const bucket = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const limit = await admin.rpc('claim_naru_signup', { p_bucket: bucket });
    if (limit.error) return reply({ error: '가입 준비 중이에요. 잠시 후 다시 시도해 주세요.' }, 503);
    if (!limit.data) return reply({ error: '가입 요청이 많아요. 한 시간 후 다시 시도해 주세요.' }, 429);
    // This reserved internal address is an ID mapping, not an external email identity.
    // Only this namespace is provisioned; global email confirmation remains enabled.
    const { error } = await admin.auth.admin.createUser({
      email: username + '@accounts.naru.invalid', password, email_confirm: true,
      user_metadata: { username, nickname, full_name: nickname, account_type: 'naru' },
    });
    if (error) return reply({ error: error.code === 'email_exists' || error.code === 'user_already_exists' ? '이미 사용 중인 아이디예요.' : '계정을 만들지 못했어요. 다른 아이디로 다시 시도해 주세요.' }, 409);
    return reply({ ok: true }, 201);
  } catch { return reply({ error: '계정을 만들지 못했어요. 잠시 후 다시 시도해 주세요.' }, 503); }
});
