import { createClient } from '@supabase/supabase-js';
// This publishable key is intentionally public. Member rows are protected by RLS.
export const supabaseUrl='https://izdkmewsfuhbrrfkzopd.supabase.co';
export const publishableKey='sb_publishable__dWi72tYl_xTcupO3ddLuQ__DSTFc2f';
export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'pkce' },
});
