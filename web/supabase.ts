import { createClient } from '@supabase/supabase-js';
// This publishable key is intentionally public. Member rows are protected by RLS.
const url='https://izdkmewsfuhbrrfkzopd.supabase.co';
const publishableKey='sb_publishable__dWi72tYl_xTcupO3ddLuQ__DSTFc2f';
export async function googleLoginEnabled(){const response=await fetch(url+'/auth/v1/settings',{headers:{apikey:publishableKey}});if(!response.ok)throw Error('auth settings');const settings=await response.json() as {external?:{google?:boolean}};return settings.external?.google===true;}
export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
});
